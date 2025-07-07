import { FolderOpen } from "lucide-react";
// ============================
// CategorieCard.tsx
// Card riepilogo categorie (totali, entrate, spese), cliccabile
// ============================

import DashboardCard from "./DashboardCard";
import LoadingSpinnerCard from "./loading/LoadingSpinnerCard";
import { useCategories } from "@/context/contexts/CategoriesContext";

export default function CategorieCard() {
    const { categories, loading, error } = useCategories();

    if (loading)
        return (
            <LoadingSpinnerCard icon={<FolderOpen size={20} />} title="Categorie" message="Caricamento categorie..." />
        );

    if (error)
        return (
            <DashboardCard icon={<FolderOpen size={20} />} title="Categorie" value="!" href="/categorie">
                <span className="text-xs text-red-400">{error}</span>
            </DashboardCard>
        );

    // Suddividi categorie per tipo
    const entrate = categories.filter((c) => c.type === "entrata").length;
    const spese = categories.filter((c) => c.type === "spesa").length;

    return (
        <DashboardCard icon={<FolderOpen size={20} />} title="Categorie" value={categories.length} href="/categorie">
            <span>
                <b>Entrate:</b> {entrate}
            </span>
            <br />
            <span>
                <b>Spese:</b> {spese}
            </span>
        </DashboardCard>
    );
}
