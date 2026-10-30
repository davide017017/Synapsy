// app/(protected)/home/homeStyles.ts
// ======================================================================
// Classi condivise dalle card compatte della Home mobile.
// ======================================================================

// Card a piena larghezza: stesso bordo/sfondo/ombra di DashboardCard,
// raggio 14px e padding 10px 12px.
export const HOME_CARD =
    "rounded-[14px] px-3 py-2.5 border border-gray-200 dark:border-zinc-700 bg-[hsl(var(--c-bg))] shadow-black shadow-lg";

// Font di titoli e numeri. --font-sans non è definito, quindi oggi il
// browser ripiega sul suo serif di default: qui lo rendiamo esplicito.
export const HOME_SERIF = "[font-family:'Times_New_Roman',Tinos,serif]";

// Titolo card: serif bold verde 15px.
export const HOME_TITLE = `${HOME_SERIF} text-[15px] font-bold text-primary`;
