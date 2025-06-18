/* app/layout.tsx */
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import GlobalContextProvider from "@/context/GlobalContextProvider";

export const metadata = {
    title: "Synapsy",
    description: "Gestione finanze personale",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="it" suppressHydrationWarning>
            <body>
                {/* next-themes (dark / light) */}
                <ThemeProvider
                    attribute="data-theme"
                    defaultTheme="system"
                    enableSystem
                    themes={["light", "dark", "emerald", "solarized"]}
                >
                    {/* tutti gli altri context globali, incluso SessionProvider */}
                    <GlobalContextProvider>{children}</GlobalContextProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
