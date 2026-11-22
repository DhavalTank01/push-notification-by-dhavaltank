import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage Notification permission state
 * Works in browser environments only
 *
 * @returns Object containing permission state and functions
 */
export function useNotificationPermission() {
  const [permission, setPermission] = useState<'default' | 'granted' | 'denied'>('default');
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permissionSteps, setPermissionSteps] = useState<
    | {
        title: string;
        message: string;
        settingsLink: string;
        browserSpecific?: string;
      }
    | null
  >(null);

  useEffect(() => {
    // Check if Notification API is supported
    setIsSupported('Notification' in window);
  }, []);

  const requestPermission = useCallback(async (): Promise<'default' | 'granted' | 'denied'> => {
    if (!isSupported) {
      console.error('Notification API is not supported');
      return 'default';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result as 'default' | 'granted' | 'denied');
      return result as 'default' | 'granted' | 'denied';
    } catch (err) {
      console.error('Permission request error:', err);
      return 'default';
    }
  }, [isSupported]);

  // Set up permission steps based on initial permission state
  useEffect(() => {
    if (!isSupported) {
      setPermissionSteps({
        title: 'Notifications Not Supported',
        message: 'The Notification API is not supported in your browser.',
        settingsLink: 'go to browser settings',
        browserSpecific: 'Try updating your browser or using Chrome/Firefox/Edge',
      });
      return;
    }

    // Check if user has previously denied permission
    const storedPermission = localStorage.getItem('dhaval-notification-permission');
    if (storedPermission === 'denied') {
      setPermission('denied');
      setPermissionSteps({
        title: 'Permission Denied',
        message: 'You have previously denied notification permission.',
        settingsLink: 'go to browser settings',
        browserSpecific: 'Click the lock icon Ⓛ in the address bar and change "Block" to "Allow".',
      });
      return;
    }

    // If currently denied, show steps
    if (permission === 'denied') {
      setPermissionSteps({
        title: 'Permission Denied',
        message: 'You have denied notification permission.',
        settingsLink: 'go to browser settings',
        browserSpecific: 'Click the lock icon Ⓛ in the address bar and change "Block" to "Allow".',
      });
    }
  }, [isSupported, permission]);

  /**
   * Open browser/settings to allow notifications
   * Note: This opens settings - results vary by browser/OS
   */
  const openNotificationSettings = useCallback(() => {
    if (!isSupported) {
      console.warn('Cannot open settings: Notification API not supported');
      return false;
    }

    // Try different methods to open settings
    try {
      // Method 1: Chrome/Edge settings page
      window.open('chrome://settings/content/notifications', '_blank');

      // Method 2: General Windows/macOS settings fallback
      setTimeout(() => {
        window.location.href = 'https://support.google.com/chrome/answer/99143?co=GENIE.Platform%3DDesktop&hl=en';
      }, 100);

      return true;
    } catch (err) {
      console.error('Failed to open settings:', err);
      return false;
    }
  }, [isSupported]);

  return {
    permission,
    isSupported,
    requestPermission,
    /** 
     * Steps text for showing to user in your UI 
     * Use this to build your own alert/dialog
    */
    permissionSteps,
    /** 
     * Open browser settings to change permission 
     * Returns true if successfully opened
    */
    openNotificationSettings,
    /** 
     * Whether permission is permanently denied (user clicked "Block" and checked "Remember decision")
     */
    isPermissionPermanentlyDenied: permission === 'denied',
  };
}

/**
 * Hook to check current permission status quickly
 */
export function useNotificationStatus() {
  const { permission, isSupported, permissionSteps } = useNotificationPermission();

  return {
    permission,
    isSupported,
    permissionSteps,
    isPermissionPermanentlyDenied: permission === 'denied',
  };
}