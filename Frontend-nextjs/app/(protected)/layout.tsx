/* app/(protected)/layout.tsx */
import ProtectedLayoutClient from "./ProtectedLayoutClient";
import { SidebarProvider } from "@/context/SidebarContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { TransactionsProvider } from "@/context/TransactionsContext";
import { RicorrenzeProvider } from "@/context/RicorrenzeContext";

/* metadata solo per la zona autenticata  */
export const metadata = {
    title: "Synapsy • Dashboard",
    description: "Area riservata: riepilogo, categorie, ricorrenti…",
};

export default function ProtectedServerLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <CategoriesProvider>
                <TransactionsProvider>
                    <RicorrenzeProvider>
                        <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
                    </RicorrenzeProvider>
                </TransactionsProvider>
            </CategoriesProvider>
        </SidebarProvider>
    );
}

