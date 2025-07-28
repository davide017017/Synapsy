/* app/(auth)/layout.tsx */
import { ThemeProvider } from "next-themes";

export const metadata = {
    title: "Synapsy • Auth",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <ThemeProvider forcedTheme="dark">{children}</ThemeProvider>;
}
