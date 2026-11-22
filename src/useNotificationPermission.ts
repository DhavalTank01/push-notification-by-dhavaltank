import { useState, useEffect, useCallback } from 'react';

/**
 * Browser and OS detection for notification compatibility
 */
const getBrowserInfo = (): {
  browser: string;
  os: string;
  isChrome: boolean;
  isEdge: boolean;
  isSafari: boolean;
  isFirefox: boolean;
  isiOS: boolean;
  isAndroid: boolean;
} => {
  const ua = navigator.userAgent;

  // Detect Chrome/Edge (Chromium-based)
  // Type assertion needed because TypeScript doesn't know about chrome property on Window
  const chrome = (window as any).chrome;
  const isChrome = !!chrome && !/opera|opera mini/i.test(ua);
  const isEdge = !isChrome && /edge/i.test(ua);
  const isSafari = /^((?!chrome|android\s).)*safari/i.test(ua) && !/android/i.test(ua);
  const isFirefox = /firefox/i.test(ua);

  // Detect OS
  const isiOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isAndroid = /android/i.test(ua);
  const isMac = /macintosh/i.test(ua);
  const isWin = /windows|win32/i.test(ua);

  // Determine OS name
  let os: string;
  if (isiOS) os = 'iOS';
  else if (isAndroid) os = 'Android';
  else if (isMac) os = 'macOS';
  else if (isWin) os = 'Windows';
  else os = 'Other';

  return {
    browser: isChrome ? 'Chrome' : isEdge ? 'Edge' : isSafari ? 'Safari' : isFirefox ? 'Firefox' : 'Other',
    os: os,
    isChrome,
    isEdge,
    isSafari,
    isFirefox,
    isiOS,
    isAndroid,
  };
};

/**
 * Get browser-specific message for enabling notifications
 */
const getBrowserSpecificMessage = (info: ReturnType<typeof getBrowserInfo>) => {
  // iOS Safari specific message
  if (info.isiOS) {
    return 'iOS Safari does not support web push notifications. Use the Share feature or add to Home Screen for updates.';
  }

  // Safari desktop specific
  if (info.isSafari) {
    return 'Safari: Click the 📎 (link) icon or lock icon Ⓛ in the address bar and select "Allow".';
  }

  // Chrome/Edge specific
  if (info.isChrome || info.isEdge) {
    return 'Chrome/Edge: Click the lock icon Ⓛ in the address bar and change "Block" to "Allow".';
  }

  // Firefox specific
  if (info.isFirefox) {
    return 'Firefox: Click the shield icon 🛡️ and change "Block" to "Allow".';
  }

  // Default fallback
  return 'Click the lock icon Ⓛ in the address bar and change "Block" to "Allow".';
};

/**
 * Hook to manage Notification permission state
 * Works in browser environments only
 *
 * @returns Object containing permission state and functions
 * @returns permissionSteps - Contains browser-specific guidance when permission is denied
 * @returns browserInfo - Detected browser and OS for platform-specific guidance
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

  // Get browser info once on mount
  const browserInfo = getBrowserInfo();

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

  // Set up permission steps based on initial permission state + browser/OS
  useEffect(() => {
    if (!isSupported) {
      setPermissionSteps({
        title: 'Notifications Not Supported',
        message: 'The Notification API is not supported in your browser.',
        settingsLink: 'go to browser settings',
        browserSpecific: getBrowserSpecificMessage(browserInfo),
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
        browserSpecific: getBrowserSpecificMessage(browserInfo),
      });
      return;
    }

    // If currently denied, show steps
    if (permission === 'denied') {
      setPermissionSteps({
        title: 'Permission Denied',
        message: 'You have denied notification permission.',
        settingsLink: 'go to browser settings',
        browserSpecific: getBrowserSpecificMessage(browserInfo),
      });
    }
  }, [isSupported, permission, browserInfo]);

  /**
   * Open browser/settings to allow notifications
   * Note: This opens settings - results vary by browser/OS
   */
  const openNotificationSettings = useCallback(() => {
    if (!isSupported) {
      console.warn('Cannot open settings: Notification API not supported');
      return false;
    }

    // Try different methods to open settings based on browser
    try {
      // Chrome/Edge: Open settings page directly
      if (browserInfo.isChrome || browserInfo.isEdge) {
        window.open('chrome://settings/content/notifications', '_blank');
      }
      // Safari desktop
      else if (browserInfo.isSafari) {
        window.open('https://support.apple.com/en-us/HT201265', '_blank');
      }
      // Firefox
      else if (browserInfo.isFirefox) {
        window.open('https://support.mozilla.org/kb/allow-site-to-show-notifications', '_blank');
      }
      // Fallback to general Chrome settings
      else {
        window.open('chrome://settings/content/notifications', '_blank');
      }

      // Fallback after short delay
      setTimeout(() => {
        window.location.href = 'https://support.google.com/chrome/answer/99143?co=GENIE.Platform%3DDesktop&hl=en';
      }, 100);

      return true;
    } catch (err) {
      console.error('Failed to open settings:', err);
      return false;
    }
  }, [isSupported, browserInfo]);

  return {
    permission,
    isSupported,
    requestPermission,
    /** 
     * Steps text for showing to user in your UI 
     * Use this to build your own alert/dialog - contains browser-specific guidance
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
    /** Detected browser and OS info - useful for debugging or custom UI */
    browserInfo,
  };
}

/**
 * Hook to check current permission status quickly
 */
export function useNotificationStatus() {
  const { permission, isSupported, permissionSteps, browserInfo } = useNotificationPermission();

  return {
    permission,
    isSupported,
    permissionSteps,
    isPermissionPermanentlyDenied: permission === 'denied',
    /** Browser/OS info - useful for debugging */
    browserInfo,
  };
}