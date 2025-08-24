// app/layout.tsx
import "../styles/globals.css";
import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
    title: "Synapsy",
    description: "Gestione finanziaria personale",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="it">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
