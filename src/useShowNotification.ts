import { useState, useEffect, useCallback } from 'react';

export type NotificationAction = {
  action: string;
  title?: string;
  body: string;
};

export type NotificationClickHandler = (event: FocusEvent & { notification: Notification }) => void;

export type NotificationShowOptions = {
  /** Notification title */
  title?: string;
  /** Notification body/message */
  body?: string;
  /** Notification icon URL */
  icon?: string;
  /** Notification tag for grouping/updating */
  tag?: string;
  /** Notification image URL */
  image?: string;
  /** Notification timestamp */
  timestamp?: number;
  /** Direction of notification flow ('auto', 'ltr', 'rtl') */
  dir?: 'auto' | 'ltr' | 'rtl';
  /** Whether to show a vibration pattern */
  vibrate?: number[];
  /** Whether the notification should auto-close after a timeout */
  timeout?: number;
  /** Custom click handler */
  onClick?: NotificationClickHandler;
  /** Whether the notification requires attention */
  requireInteraction?: boolean;
};

/**
 * Hook to show desktop notifications
 * Must be called after useNotificationPermission grants permission
 */
export function useShowNotification() {
  const [lastNotification, setLastNotification] = useState<Notification | null>(null);

  const showNotification = useCallback(
    (title: string, options: NotificationShowOptions = { body: '', title: '' }): Notification | null => {
      if (!('Notification' in window)) {
        console.warn('Notification API is not supported');
        return null;
      }

      const {
        title: _title,
        body = '',
        icon,
        tag,
        image,
        dir = 'auto',
        vibrate,
        timeout,
        onClick,
        requireInteraction = false,
        ...rest
      } = options;

      // Check permission state
      const existingPermission = Notification.permission;
      if (existingPermission === 'denied') {
        console.warn('Notification permission was denied by user');
        return null;
      }

      if (existingPermission === 'default') {
        console.warn('Notification permission not yet granted');
        return null;
      }

      try {
        const notification = new Notification(title, {
          body,
          icon,
          tag,
          image,
          dir,
          vibrate,
          timestamp: timeout ? Date.now() + timeout : undefined,
          requireInteraction,
          ...rest,
        } as NotificationOptions & { image?: string });

        // Set click handler if provided
        if (onClick) {
          ;(notification as any).onclick = onClick;
        } else {
          // Default click handler focuses the window
          ;(notification as any).onclick = (event: any) => {
            event.preventDefault();
            ;(notification as any).focus();
          };
        }

        // Auto-close if timeout specified
        if (timeout) {
          setTimeout(() => {
            notification.close();
          }, timeout);
        }

        setLastNotification(notification);
        return notification;
      } catch (err) {
        const error = {
          name: 'NotificationShowError',
          message: err instanceof Error ? err.message : String(err),
        };
        console.error(error);
        return null;
      }
    },
    []
  );

  const closeLastNotification = useCallback(() => {
    if (lastNotification) {
      lastNotification.close();
      setLastNotification(null);
    }
  }, [lastNotification]);

  const closeAllNotifications = useCallback(() => {
    const notes = document.querySelectorAll('.dhaval-notification');
    notes.forEach((note) => note.remove());
    setLastNotification(null);
  }, []);

  return {
    showNotification,
    closeLastNotification,
    closeAllNotifications,
    lastNotification,
  };
}