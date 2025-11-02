import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alaskapay.app',
  appName: 'Alaska Pay',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'alaskapay.com'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0EA5E9',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#14b8a6'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#111827'
    },
    NativeBiometric: {
      useFallback: true,
      fallbackTitle: 'Use PIN',
      fallbackMessage: 'Enter your PIN to authenticate'
    },
    App: {
      deepLinkingEnabled: true,
      deepLinkingScheme: 'alaskapay'
    }
  }
};

export default config;
