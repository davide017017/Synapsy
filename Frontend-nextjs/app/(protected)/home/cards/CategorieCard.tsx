import { FolderOpen } from "lucide-react";
import DashboardCard from "./DashboardCard";
import LoadingSpinnerCard from "./loading/LoadingSpinnerCard";
import { useCategories } from "@/context/contexts/CategoriesContext";
import { useRenderTimer } from "../utils/useRenderTimer"; // Debug per vedere quanto tempo ci mette a rtenderizzare

export default function CategorieCard() {
    useRenderTimer("TransazioniCard"); // Debug per vedere quanto tempo ci mette a rtenderizzare
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
            <br />
            <span className="block mt-1 text-xs text-gray-500 dark:text-gray-400">Categorie disponibili</span>
        </DashboardCard>
    );
}

