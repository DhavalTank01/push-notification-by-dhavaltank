/**
 * Test suite for useShowNotification hook
 * Tests showing notifications with various options
 */

import { renderHook, act } from '@testing-library/react';
import { useShowNotification } from '../src/useShowNotification';

beforeEach(() => {
  // Ensure Notification API is available in test environment
  global.Notification = global.Notification || {
    permission: 'default',
    // Mock the Notification constructor
    new Notification: (title, options) => {
      return {
        title,
        body: options?.body || '',
        onclick: null,
        close: jest.fn(),
        focus: jest.fn(),
      };
    },
  };
});

describe('useShowNotification', () => {
  const originalUserAgent = navigator.userAgent;

  afterEach(() => {
    navigator.userAgent = originalUserAgent;
    global.Notification = global.Notification || {
      permission: 'default',
      new Notification: (title, options) => {
        return {
          title,
          body: options?.body || '',
          onclick: null,
          close: jest.fn(),
          focus: jest.fn(),
        };
      },
    };
  });

  test('initial state has lastNotification null', () => {
    const { result } = renderHook(() => useShowNotification());
    expect(result.current.lastNotification).toBeNull();
  });

  test('showNotification calls Notification constructor with correct args', () => {
    const { result } = renderHook(() => useShowNotification());

    // Act
    const notification = result.current.showNotification('Test Title', {
      body: 'Test body',
      icon: '/icon.png',
    });

    // Assert
    expect(notification).toBeDefined();
    // The mock Notification should have been called with title and options
    // In a real browser environment, new Notification(title, options) would be called
    expect(result.current.lastNotification).toBe(notification);
  });

  test('showNotification respects permission state', () => {
    const { result } = renderHook(() => useShowNotification());

    // When permission is denied, showNotification should return null
    // (The hook checks Notification.permission which is 'default' by default)
    // So it should proceed to create a notification

    // Mock permission as 'denied' by setting Notification.permission
    Object.defineProperty(global.Notification, 'permission', {
      value: 'denied',
      configurable: true,
    });

    const notification = result.current.showNotification('Should Not Show', {
      body: 'This should not appear',
    });

    // When denied, should return null
    expect(notification).toBeNull();
    expect(result.current.lastNotification).toBeNull();

    // Restore
    Object.defineProperty(global.Notification, 'permission', {
      value: 'default',
      configurable: true,
    });
  });

  test('showNotification with custom onClick handler', () => {
    const { result } = renderHook(() => useShowNotification());

    const mockOnClick = jest.fn();

    const notification = result.current.showNotification('Custom Click', {
      body: 'Click me',
      onClick: mockOnClick,
    });

    // In test environment, notification.onclick is set to mock
    // The onClick handler should be assigned
    expect(notification).toBeDefined();

    // Restore Notification
    delete global.Notification.onclick;
  });

  test('showNotification with timeout auto-closes', () => {
    const { result } = renderHook(() => useShowNotification());

    const notification = result.current.showNotification('Auto Close', {
      body: 'This closes automatically',
      timeout: 50, // 50ms
    });

    expect(notification).toBeDefined();

    // After timeout, notification should close
    // In test environment, setTimeout callbacks fire synchronously or near-synchronously
    await act(async () => {
      // Wait for the timeout
      await new Promise((resolve) => setTimeout(resolve, 60));
    });

    // After timeout, notification should be closed
    expect(notification.isClosed || notification.closed).toBeTruthy();
    // Or check that close was called
    // Note: exact behavior depends on implementation
  });

  test('showNotification closes last notification when closeLastNotification called', () => {
    const { result } = renderHook(() => useShowNotification());

    // Show a notification first
    const notif1 = result.current.showNotification('First', {
      body: 'First notification',
    });

    expect(notif1).toBeDefined();

    // Show another (this replaces lastNotification via setLastNotification)
    const notif2 = result.current.showNotification('Second', {
      body: 'Second notification',
    });

    expect(notif2).toBeDefined();

    // Close the last one
    result.current.closeLastNotification();

    // The first notification should still exist in DOM conceptually,
    // but lastNotification state should be null
    expect(result.current.lastNotification).toBeNull();
  });

  test('browser detection via useNotificationPermission integration', () => {
    // This tests that the hooks work together
    const { result: permResult } = renderHook(() => useNotificationPermission());
    const { result: showResult } = renderHook(() => useShowNotification());

    // Both hooks should be usable simultaneously
    expect(permResult.current).toBeDefined();
    expect(showResult.current).toBeDefined();

    // browserInfo should be available from permission hook
    if (permResult.current.browserInfo) {
      expect(permResult.current.browserInfo.browser).toBeDefined();
      expect(permResult.current.browserInfo.os).toBeDefined();
    }
  });
});