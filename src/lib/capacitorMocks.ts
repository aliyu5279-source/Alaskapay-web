// Mock Capacitor modules for web builds
export const mockDevice = {
  Device: {
    getId: async () => ({ identifier: 'web-device-' + Math.random().toString(36).substr(2, 9) }),
    getInfo: async () => ({
      platform: 'web',
      model: 'Browser',
      operatingSystem: 'web',
      osVersion: '1.0',
      manufacturer: 'Browser',
      isVirtual: false,
      webViewVersion: '1.0'
    })
  }
};

export const mockHaptics = {
  Haptics: {
    impact: async () => {},
    notification: async () => {},
    vibrate: async () => {},
    selectionStart: async () => {},
    selectionChanged: async () => {},
    selectionEnd: async () => {}
  },
  ImpactStyle: {
    Light: 'LIGHT',
    Medium: 'MEDIUM',
    Heavy: 'HEAVY'
  }
};

export const mockNativeBiometric = {
  NativeBiometric: {
    isAvailable: async () => ({ isAvailable: false }),
    verifyIdentity: async () => {},
    setCredentials: async () => {},
    getCredentials: async () => ({ username: '', password: '' }),
    deleteCredentials: async () => {}
  }
};

export const mockApp = {
  App: {
    addListener: () => ({ remove: () => {} }),
    removeAllListeners: async () => {}
  }
};

export const mockBrowser = {
  Browser: {
    open: async (options: any) => {
      window.open(options.url, '_blank');
    },
    close: async () => {}
  }
};

export const mockBarcodeScanner = {
  BarcodeScanner: {
    isSupported: async () => ({ supported: false }),
    scan: async () => ({ hasContent: false })
  }
};
