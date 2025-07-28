/* app/(auth)/layout.tsx */
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
                    __html: "document.documentElement.className='dark';document.documentElement.setAttribute('data-theme','dark');",
                }}
            />
            {children}
        </>
    );
}
