/* app/(protected)/layout.tsx */
import ProtectedLayoutClient from "./ProtectedLayoutClient";

/* metadata solo per la zona autenticata  */
export const metadata = {
    title: "Synapsy • Dashboard",
    description: "Area riservata: riepilogo, categorie, ricorrenti…",
};

export default function ProtectedServerLayout({ children }: { children: React.ReactNode }) {
    return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>;
}
