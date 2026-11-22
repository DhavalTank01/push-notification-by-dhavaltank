export { useNotificationPermission } from './useNotificationPermission';
export { useShowNotification, type NotificationAction } from './useShowNotification';
export { registerServiceWorker } from './serviceWorker';

/**
 * Permission state for notifications
 */
export type NotifyPermission = 'default' | 'granted' | 'denied';

/**
 * Status result from checking notification support
 */
export type NotifyStatus = {
  permission: NotifyPermission;
  isSupported: boolean;
};

/**
 * Error information for notification operations
 */
export type NotifyError = {
  name: string;
  message: string;
};

/**
 * Steps for user to enable permissions
 */
export type PermissionSteps = {
  title: string;
  message: string;
  settingsLink: string;
  browserSpecific?: string;
};

/**
 * Result from useNotificationPermission hook
 */
export type UseNotificationPermissionResult = {
  permission: NotifyPermission;
  isSupported: boolean;
  requestPermission: () => Promise<NotifyPermission>;
  permissionSteps?: PermissionSteps | null;
  openNotificationSettings: () => boolean;
  isPermissionPermanentlyDenied: boolean;
  browserInfo: {
    browser: string;
    os: string;
    isChrome: boolean;
    isEdge: boolean;
    isSafari: boolean;
    isFirefox: boolean;
    isiOS: boolean;
    isAndroid: boolean;
  };
};

/**
 * Click handler for notification click events
 * Receives MouseEvent and the Notification object
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
  /** Whether to focus the window on click */
  focusOnClick?: boolean;
};

/**
 * Browser and OS info from getBrowserInfo()
 * Used for platform-specific notification guidance
 */
export type BrowserInfo = {
  browser: string;
  os: string;
  isChrome: boolean;
  isEdge: boolean;
  isSafari: boolean;
  isFirefox: boolean;
  isiOS: boolean;
  isAndroid: boolean;
};
