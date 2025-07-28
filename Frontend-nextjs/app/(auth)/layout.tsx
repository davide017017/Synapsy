/* app/(auth)/layout.tsx */
import { ThemeProvider } from "next-themes";
import Script from "next/script";

export const metadata = {
    title: "Synapsy • Auth",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Script
                id="force-dark"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: "try{localStorage.setItem('theme','dark');}catch{}",
                }}
            />
            <ThemeProvider forcedTheme="dark">{children}</ThemeProvider>
        </>
    );
}
