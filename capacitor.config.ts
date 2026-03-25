import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quickfit35.app',
  appName: 'QuickFit 35',
  webDir: 'dist',

  // Server config — for live reload during development
  // COMMENT THIS OUT before building for production
  // server: {
  //   url: 'http://YOUR_LOCAL_IP:3000',
  //   cleartext: true
  // },

  // iOS-specific config
  ios: {
    // Allows the WebView to play audio without user gesture (for timer beeps)
    allowsLinkPreview: false,
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'quickfit35',
  },

  // Android-specific config
  android: {
    allowMixedContent: true,
  },

  // Plugins config
  plugins: {
    // Status bar — matches the dark theme
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f172a',
    },
    // Splash screen
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f172a',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    // Keyboard — pushes content up instead of overlaying
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
