export { useNotificationPermission } from './useNotificationPermission';
export { useShowNotification } from './useShowNotification';
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
  /** Browser and OS information for debugging */
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