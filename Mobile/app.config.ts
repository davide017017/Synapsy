// Mobile/app.config.ts
import "dotenv/config";

export default {
    expo: {
        name: "Synapsy",
        slug: "synapsy",
        version: "1.0.0",
        orientation: "portrait",
        platforms: ["ios", "android", "web"],

        userInterfaceStyle: "light",
        icon: "./assets/icon.png",
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },

        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.synapsy.app", // opzionale: personalizza
        },

        android: {
            package: "com.synapsy.app", // opzionale: personalizza
            adaptiveIcon: {
                // Deve essere QUADRATA (es. 1024x1024). Sostituisci il file se non lo è.
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#FFFFFF",
            },
        },

        updates: {
            // valore “classico” (puoi omettere se non ti serve)
            fallbackToCacheTimeout: 0,
        },

        assetBundlePatterns: ["**/*"],

        extra: {
            APP_ENV: process.env.APP_ENV ?? "development",
            API_BASE_URL: process.env.API_BASE_URL ?? "http://192.168.0.111:8484/api",
            TOKEN_HEADER: process.env.TOKEN_HEADER ?? "Authorization",
            // utile per leggere ENV lato app:
            eas: { projectId: process.env.EAS_PROJECT_ID },
        },
    },
};
