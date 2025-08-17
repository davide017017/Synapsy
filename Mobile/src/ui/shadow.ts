import { Platform } from "react-native";

export const shadowSm = Platform.select({
    web: { boxShadow: "0 2px 8px rgba(0,0,0,0.15)" },
    default: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
});

export const shadowMd = Platform.select({
    web: { boxShadow: "0 8px 16px rgba(0,0,0,0.18)" },
    default: {
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
});

export const shadowLg = Platform.select({
    web: { boxShadow: "0 16px 28px rgba(0,0,0,0.25)" },
    default: {
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 12 },
        elevation: 6,
    },
});
