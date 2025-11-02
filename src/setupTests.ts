import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Capacitor plugins
vi.mock('@capacitor/app', () => ({
  App: {
    addListener: vi.fn(),
    removeAllListeners: vi.fn(),
    getInfo: vi.fn().mockResolvedValue({
      name: 'Alaska Pay',
      id: 'com.alaskapay.app',
      version: '1.0.0',
    }),
  },
}));

vi.mock('@capacitor/browser', () => ({
  Browser: {
    open: vi.fn(),
    close: vi.fn(),
  },
}));

vi.mock('@capacitor-community/barcode-scanner', () => ({
  BarcodeScanner: {
    prepare: vi.fn(),
    startScan: vi.fn().mockResolvedValue({ hasContent: true, content: 'test-qr-code' }),
    stopScan: vi.fn(),
    checkPermission: vi.fn().mockResolvedValue({ granted: true }),
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
