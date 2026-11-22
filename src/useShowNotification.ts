import { useState, useEffect, useCallback } from 'react';

/**
 * Action types for notification click handling
 */
export type NotificationAction = {
  action: string;
  title?: string;
  body: string;
};

/**
 * Click handler type for notification
 * Receives the mouse event and the notification object
 */
export type NotificationClickHandler = (event: MouseEvent, notification: Notification) => void;

/**
 * Options for showing a notification
 */
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
  /** Notification direction ('auto', 'ltr', 'rtl') */
  dir?: 'auto' | 'ltr' | 'rtl';
  /** Whether to show a vibration pattern */
  vibrate?: number[];
  /** Whether the notification should auto-close after a timeout */
  timeout?: number;
  /** Custom click handler */
  onClick?: NotificationClickHandler;
  /** Whether the notification requires attention (stays until clicked) */
  requireInteraction?: boolean;
  /** Whether to focus the window on click */
  focusOnClick?: boolean;
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
        focusOnClick = true,
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
          requireInteraction,
          ...rest,
        } as NotificationOptions & { image?: string });

        // Set click handler if provided
        if (onClick) {
          notification.onclick = (event: Event) => {
            event.preventDefault();
            onClick(event as MouseEvent, notification);
          };
        } else {
          // Default click handler: focus the notification and handle closing
          notification.onclick = (event: Event) => {
            event.preventDefault();
            if (focusOnClick) {
              try {
                (notification as any).focus();
              } catch (e) {
                // focus() can throw in some environments
              }
            }
            // Close after click if not requireInteraction
            if (!requireInteraction) {
              notification.close();
            }
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
        console.error('Failed to show notification:', err);
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
    // Remove any notification elements from DOM
    if (typeof document !== 'undefined') {
      const activeNotifications = document.querySelectorAll('.dhaval-notification');
      activeNotifications.forEach((note) => note.remove());
    }
    setLastNotification(null);
  }, []);

  return {
    showNotification,
    closeLastNotification,
    closeAllNotifications,
    lastNotification,
  };
}
