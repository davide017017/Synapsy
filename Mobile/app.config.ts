// Mobile/app.config.ts

export default {
  expo: {
    name: 'Synapsy',
    slug: 'synapsy',
    version: '1.0.0',
    orientation: 'portrait',
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.synapsy.app', // cambia se vuoi
    },
    android: {
      package: 'com.synapsy.app',          // cambia se vuoi
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
    assetBundlePatterns: ['**/*'],
    extra: {
      APP_ENV: process.env.APP_ENV ?? 'development',
      API_BASE_URL: process.env.API_BASE_URL ?? 'http://192.168.0.111:8484/api',
      TOKEN_HEADER: process.env.TOKEN_HEADER ?? 'Authorization',
    },
  },
};
