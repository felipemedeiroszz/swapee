import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.swepee.app',
  appName: 'Swepee',
  webDir: 'dist',
  android: {
    backgroundColor: '#0F172A',
    allowMixedContent: false,
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      signingType: 'apksigner'
    }
  },
  ios: {
    backgroundColor: '#0F172A',
    scrollEnabled: true
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0F172A',
      showSpinner: false
    }
  }
};

export default config;
