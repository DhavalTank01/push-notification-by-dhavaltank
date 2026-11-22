/**
 * Test suite for registerServiceWorker and usePushSupport
 * Tests service worker registration logic (mocked)
 */

import { renderHook } from '@testing-library/react';
import { registerServiceWorker, usePushSupport } from '../src/serviceWorker';

beforeEach(() => {
  // Mock before each test
  // Since we're in Node.js environment, service workers won't actually register
  // But we test the logic and error handling
});

describe('registerServiceWorker', () => {
  test('returns appropriate result in Node.js environment', () => {
    // In Node.js, typeof window === 'undefined'
    const result = registerServiceWorker();

    // Should return error result for Node.js environment
    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.registration).toBeNull();
  });

  test('returns structure with correct types', () => {
    const result = registerServiceWorker();

    // Check the shape of the result
    expect(result).toMatchObject({
      registration: expect.any(Object) || null,
      success: expect.any(Boolean),
      error: expect.any(String),
    });
  });
});

describe('usePushSupport', () => {
  test('returns initial state', () => {
    const { result } = renderHook(() => usePushSupport());

    // In Node.js environment, isSupported should be false
    expect(result.current.isSupported).toBe(false);
    expect(result.current.isPushEnabled).toBe(false);
    expect(result.current.registration).toBeNull();
  });

  test('structure includes all expected properties', () => {
    const { result } = renderHook(() => usePushSupport());

    expect(result.current).toHaveProperty('isSupported');
    expect(result.current).toHaveProperty('isPushEnabled');
    expect(result.current).toHaveProperty('registration');
  });
});