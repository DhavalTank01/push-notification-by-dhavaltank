/**
 * Test suite for useNotificationPermission hook
 * Tests permission states, browser detection, and denied flow guidance
 */

const { renderHook } = require('@testing-library/react');
const { useNotificationPermission } = require('../src/useNotificationPermission');

beforeEach(() => {
  // Reset localStorage before each test
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  // Reset Notification mock state
  global.Notification = global.Notification || {
    permission: 'default',
    requestPermission: () => Promise.resolve('default'),
  };
});

describe('useNotificationPermission', () => {
  const originalUserAgent = navigator.userAgent;

  afterEach(() => {
    navigator.userAgent = originalUserAgent;
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  test('initial state has permission default and isSupported false', () => {
    const { result } = renderHook(() => useNotificationPermission());
    expect(result.current.permission).toBe('default');
    expect(result.current.isSupported).toBe(false);
  });

  test('isSupported becomes true when Notification API available', () => {
    const { result, unmount } = renderHook(() =>
      useNotificationPermission()
    );
    // After effect runs, isSupported should be true since we mock Notification
    expect(result.current.isSupported).toBe(true);
    unmount();
  });

  test('requestPermission calls Notification.requestPermission', async () => {
    const { result } = renderHook(() => useNotificationPermission());

    // Mock requestPermission to return 'granted'
    const originalRequest = global.Notification.requestPermission;
    global.Notification.requestPermission = jest.fn().mockResolvedValue('granted');

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(global.Notification.requestPermission).toHaveBeenCalled();
    expect(result.current.permission).toBe('granted');

    // Restore
    global.Notification.requestPermission = originalRequest;
  });

  test('permission denied updates state and shows browser-specific steps', () => {
    const { result } = renderHook(() => useNotificationPermission());

    // Simulate localStorage denial
    const deniedKey = 'dhaval-notification-permission';
    localStorage.setItem(deniedKey, 'denied');

    // Trigger the effect that checks localStorage
    // (happens on mount, so we just check state after render)
    expect(result.current.permission).toBe('denied');

    // Check that permissionSteps contains browser-specific guidance
    expect(result.current.permissionSteps).toBeDefined();
    expect(result.current.permissionSteps?.title).toBe('Permission Denied');
    expect(result.current.permissionSteps?.message).toContain('denied');
    // browserSpecific should have content
    expect(result.current.permissionSteps?.browserSpecific).toBeDefined();

    // isPermissionPermanentlyDenied should be true
    expect(result.current.isPermissionPermanentlyDenied).toBe(true);
  });

  test('browserInfo contains expected properties', () => {
    const { result } = renderHook(() => useNotificationPermission());

    // browserInfo should be returned
    expect(result.current.browserInfo).toBeDefined();
    expect(result.current.browserInfo.browser).toBeDefined();
    expect(result.current.browserInfo.os).toBeDefined();
    expect(result.current.browserInfo.isChrome).toBeDefined();
    expect(result.current.browserInfo.isSafari).toBeDefined();
    expect(result.current.browserInfo.isiOS).toBeDefined();
    expect(result.current.browserInfo.isAndroid).toBeDefined();
  });
});
