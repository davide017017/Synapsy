import "@/styles/globals.css";
import GlobalContextProvider from "@/context/GlobalContextProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="it">
            <body className="text-white bg-black min-h-screen">
                <GlobalContextProvider>{children}</GlobalContextProvider>
            </body>
        </html>
    );
}
