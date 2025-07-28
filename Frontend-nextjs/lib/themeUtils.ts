// themeUtils.ts
export const themeMeta = {
    light: { label: "Chiaro", color: "#faf6ee" },
    dark: { label: "Scuro", color: "#222934" },
    emerald: { label: "Smeraldo", color: "#4bffb1" },
    solarized: { label: "Solarizzato", color: "#ffd671" },
};

export const availableThemes = Object.keys(themeMeta) as (keyof typeof themeMeta)[];
