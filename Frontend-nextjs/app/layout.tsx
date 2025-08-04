/* app/layout.tsx */
import "@/styles/globals.css";
import GlobalContextProvider from "@/context/GlobalContextProvider";
import { Toaster } from "sonner";

export const metadata = {
    title: "Synapsy",
    description: "Gestione finanze personale",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="it" className="dark" data-theme="dark" suppressHydrationWarning>
            <body>
                {/* Toaster e contesti globali */}
                {/* ==================================== */}
                {/*      TOASTER CENTRATO & STILOSO      */}
                {/* ==================================== */}
                <Toaster
                    position="top-center"
                    theme="light"
                    richColors
                    closeButton
                    expand
                    duration={6000} // millisecondi (es. 6 secondi)
                    visibleToasts={4}
                    className="font-semibold text-base tracking-wide"
                    toastOptions={{
                        style: {
                            borderRadius: "1.2rem",
                            boxShadow: "0 8px 32px 0 rgba(50,90,120,0.14)",
                            border: "1.5px solid hsl(var(--c-border,220,15%,70%))",
                            fontSize: "1rem",
                            letterSpacing: "0.01em",
                            maxWidth: "380px",
                            minWidth: "280px",
                            padding: "0.8rem 1rem",
                        },
                    }}
                />
                {/* Context globali (auth, sidebar ecc) */}
                <GlobalContextProvider>{children}</GlobalContextProvider>
            </body>
        </html>
    );
}

