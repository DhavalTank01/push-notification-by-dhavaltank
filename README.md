# push-notification-by-dhavaltank

A lightweight, TypeScript-first JavaScript library for implementing desktop push notifications in React and Next.js applications.

## 📦 Installation

```bash
npm install push-notification-by-dhavaltank
# or
yarn add push-notification-by-dhavaltank
# or
pnpm add push-notification-by-dhavaltank
```

## 🚀 Quick Start

### Basic Usage (React)

```tsx
import { useNotificationPermission, useShowNotification } from 'push-notification-by-dhavaltank';

function NotificationDemo() {
  const { permission, requestPermission } = useNotificationPermission();
  const { showNotification } = useShowNotification();

  const handleRequest = async () => {
    const perm = await requestPermission();
    if (perm === 'granted') {
      showNotification('Hello!', {
        body: 'This is a push notification from push-notification-by-dhavaltank',
        icon: '/favicon.ico',
      });
    }
  };

  if (permission === 'default') {
    return (
      <div>
        <h2>Push Notifications Demo</h2>
        <button onClick={handleRequest}>Request Permission & Show Notification</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Push Notifications Demo</h2>
      <p>Permission: {permission}</p>
      <button onClick={handleRequest}>Show Notification</button>
    </div>
  );
}
```

### With Next.js (App Router)

```tsx
import { useNotificationPermission, useShowNotification } from 'push-notification-by-dhavaltank';

export default function Page() {
  const { permission, requestPermission } = useNotificationPermission();
  const { showNotification } = useShowNotification();

  return (
    <main>
      <h1>Next.js Push Notifications</h1>
      <button onClick={() => requestPermission()}>
        Request Permission
      </button>
      {permission === 'granted' && (
        <button onClick={() => showNotification('Next.js Notification', {
          body: 'Working with Next.js app router!',
          icon: '/favicon.ico',
        })}>Show Notification</button>
      )}
    </main>
  );
}
```

### Service Worker Integration (Next.js Pages Router)

```tsx
import { registerServiceWorker, usePushSupport } from 'push-notification-by-dhavaltank';

export default function WithSW() {
  const { isSupported, isPushEnabled, registration } = usePushSupport();

  useEffect(() => {
    if (isSupported && registration) {
      // Subscribe to push notifications using your VAPID key
      // subscribeToPush(registration);
    }
  }, [isSupported, registration]);

  return (
    <div>
      <h2>Service Worker Support</h2>
      <p>Service Workers: {isSupported ? 'Supported' : 'Not Supported'}</p>
      {isPushEnabled && <p>Push Notifications: Enabled</p>}
    </div>
  );
}
```

## 🎯 Features

| Feature | Status |
|---------|--------|
| TypeScript Types | ✅ Included |
| React Hooks | `useNotificationPermission`, `useShowNotification` |
| Service Worker Support | ✅ Registration + Push API |
| Next.js Compatible | ✅ App Router & Pages Router |
| Browser Support | Modern browsers (ES2022) |
| Small Bundle Size | ~1KB gzipped |
| Easy Customization | Full options support |

## 📋 API Reference

### `useNotificationPermission()`

Returns permission state and a function to request permission.

```tsx
const { permission, requestPermission, isSupported } = useNotificationPermission();
```

**Returns:**
- `permission`: `'default' \| 'granted' \| 'denied'`
- `requestPermission`: `() => Promise<NotificationPermission>`
- `isSupported`: `boolean` - whether Notification API is available

### `useShowNotification()`

Show desktop notifications with customizable options.

```tsx
const { showNotification, closeLastNotification, closeAllNotifications } = useShowNotification();
const notification = showNotification('Title', { body, icon, tag, timeout });
```

**Options:**
- `title` (required): Notification title
- `body`: Notification body text
- `icon`: URL to notification icon
- `tag`: Tag for grouping/updating notifications
- `image`: URL for notification image
- `dir`: Direction (`'auto' | 'ltr' | 'rtl'`)
- `vibrate`: Vibration pattern array
- `timeout`: Auto-close time in milliseconds
- `onClick`: Custom click handler `(event) => void`
- `requireInteraction`: Keeps notification active until user clicks/dismisses

### `registerServiceWorker()`

Registers the Service Worker at `/sw.js`.

```ts
const result = await registerServiceWorker();
// { registration: ServiceWorkerRegistration, success: true }
```

### `usePushSupport()`

Hook to check push notification support.

```ts
const { isSupported, isPushEnabled, registration } = usePushSupport();
```

## 🛠️ Development & Building

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch for changes during development
npm run dev

# Publish to npm
npm run publish
```

## 📁 Package Structure

```
push-notification-by-dhavaltank/
├── src/
│   ├── index.ts          # Main exports
│   ├── useNotificationPermission.ts
│   ├── useShowNotification.ts
│   └── serviceWorker.ts
├── rollup.config.js      # Build configuration
├── tsconfig.json         # TypeScript config
├── package.json          # Package metadata
└── README.md             # This file
```

## 🌐 Browser Support

- Chrome, Edge, Firefox, Safari (modern versions)
- Not supported in: Internet Explorer, Node.js, Server-Side Rendering
- Service Workers require HTTPS (localhost is OK for development)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Author

**Dhaval Tank** - [GitHub](https://github.com/dhavaltank) - [npm](https://www.npmjs.com/~dhavaltank)

---

**Built with ❤️ for the React & Next.js community**