/**
 * Setup file for Jest tests
 * Mocks the Notification API and browser globals
 */

// Mock Notification API
global.Notification = global.Notification || {
  permission: 'default',
  requestPermission: () => Promise.resolve('default'),
  askPermission: () => Promise.resolve('default'),
};

// Mock navigator.userAgent for browser detection tests
Object.defineProperty(navigator, 'userAgent', {
  value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  configurable: true,
});

// Mock matchMedia for responsive testing
global.matchMedia = global.matchMedia || function (query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn,
    dispatchEvent: jest.fn(),
  };
};

// Suppress console.warn during tests (optional)
const originalWarn = console.warn;
console.warn = (...args) => {
  // Only suppress specific known warnings in tests
  if (
    !args.some(
      (a) =>
        a.includes('Notification') ||
        a.includes('already')
    )
  ) {
    originalWarn.apply(console, args);
  }
};