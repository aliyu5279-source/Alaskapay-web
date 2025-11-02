
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { deepLinkHandler } from './lib/deepLinkHandler'
import { crashReporting } from './lib/crashReporting'
import { ErrorBoundary } from './components/ErrorBoundary'

// Initialize crash reporting (with error handling to prevent app crash)
crashReporting.initialize().catch((err) => {
  console.warn('Crash reporting initialization failed:', err);
});


// Initialize deep linking for mobile apps
if (typeof window !== 'undefined') {
  deepLinkHandler.initialize();
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  crashReporting.logError(event.error, {
    screen: window.location.pathname,
    action: 'global_error',
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  crashReporting.logError(new Error(event.reason), {
    screen: window.location.pathname,
    action: 'unhandled_rejection',
  });
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}

