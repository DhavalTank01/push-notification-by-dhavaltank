import { useState, useEffect } from 'react';

/**
 * Service Worker Registration for Push Notifications
 * 
 * Note: Service Workers only work in browser environments,
 * not in Node.js or server-side rendering (e.g., Next.js API routes).
 * 
 * Usage:
 *   import { registerServiceWorker, usePushSupport } from 'push-notification-by-dhavaltank';
 *   
 *   // In a component or effect:
 *   const { permission, requestPermission } = useNotificationPermission();
 *   
 *   // Register service worker (client-side only)
 *   if (typeof window !== 'undefined') {
 *     const result = await registerServiceWorker();
 *   }
 */

export type ServiceWorkerRegistrationResult = {
  /** The ServiceWorkerRegistration object */
  registration: ServiceWorkerRegistration | null;
  /** Whether the registration was successful */
  success: boolean;
  /** Error message if registration failed */
  error?: string;
};

/**
 * Registers the service worker at /sw.js
 * Creates a basic push subscription if Service Worker is supported
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistrationResult> {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return {
      registration: null,
      success: false,
      error: 'Service Workers are not supported in Node.js environment',
    };
  }

  // Check if Service Worker is supported
  if (!('serviceWorker' in navigator)) {
    return {
      registration: null,
      success: false,
      error: 'Service Workers are not supported in this browser',
    };
  }

  try {
    // Register the service worker
    const swRegistration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    // Check if Push API is supported
    const isPushSupported = 'PushManager' in window;

    if (isPushSupported) {
      // Get subscription
      const subscription = await swRegistration.pushManager.getSubscription();

      if (!subscription) {
        // No active subscription, you would typically subscribe here
        // using VAPID public key and your backend
        console.info('No active push subscription found');
      }

      return {
        registration: swRegistration,
        success: true,
      };
    }

    return {
      registration: swRegistration,
      success: true,
      // Push not supported but SW registered successfully
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('Service Worker registration failed:', error);

    return {
      registration: null,
      success: false,
      error,
    };
  }
}

/**
 * Hook to check push notification support
 */
export function usePushSupport() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsSupported(false);
      return;
    }

    setIsSupported('serviceWorker' in navigator);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).then((reg) => {
        setRegistration(reg);

        if ('PushManager' in window) {
          setIsPushEnabled(true);

          // Check for existing subscription
          reg.pushManager.getSubscription().then((sub) => {
            // Subscription exists - already enabled
          }).catch((err) => {
            console.error('Error checking push subscription:', err);
          });
        }
      });
    }
  }, []);

  return {
    isSupported,
    isPushEnabled,
    registration,
  };
}