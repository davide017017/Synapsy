// ======================================================================
// CategorieCard.tsx - Versione finale con conteggi
// ======================================================================
import { FiTag } from "react-icons/fi";
import DashboardCard from "./DashboardCard";
import LoadingSpinnerCard from "./loading/LoadingSpinnerCard";
import { useCategories } from "@/context/contexts/CategoriesContext";
import { useRenderTimer } from "../utils/useRenderTimer";
import { getIconComponent } from "@/utils/categoryOptions";
import { Category } from "@/types/models/category";

export default function CategorieCard() {
    useRenderTimer("CategorieCard");
    const { categories, loading, error } = useCategories();

    if (loading)
        return <LoadingSpinnerCard icon={<FiTag size={20} />} title="Categorie" message="Caricamento categorie..." />;

    if (error)
        return (
            <DashboardCard icon={<FiTag size={20} />} title="Categorie" value="!" href="/categorie">
                <span className="text-xs text-red-400">{error}</span>
            </DashboardCard>
        );

    const entrate = categories.filter((c) => c.type === "entrata");
    const spese = categories.filter((c) => c.type === "spesa");

    // Helper render icona + colore + tooltip
    function renderCategoryIcon(cat: Category) {
        const Icon = getIconComponent(cat.icon);
        return (
            <span
                key={cat.id}
                title={cat.name}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full shadow border border-white m-1 transition-transform hover:scale-110"
                style={{ background: cat.color }}
            >
                <Icon size={20} color="#fff" />
            </span>
        );
    }

    return (
        <DashboardCard icon={<FiTag size={20} />} title="Categorie" value={categories.length} href="/categorie">
            <div className="flex justify-between gap-4 mt-1">
                {/* Colonna Entrate */}
                <div className="flex-1 text-center">
                    <div className="text-xs font-semibold mb-1 flex items-center justify-center gap-1">
                        Entrate{" "}
                        <span className="inline-block rounded-full px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 ml-1">
                            {entrate.length}
                        </span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1">
                        {entrate.length === 0 ? (
                            <span className="text-zinc-400">-</span>
                        ) : (
                            entrate.map(renderCategoryIcon)
                        )}
                    </div>
                </div>
                {/* Colonna Spese */}
                <div className="flex-1 text-center">
                    <div className="text-xs font-semibold mb-1 flex items-center justify-center gap-1">
                        Spese{" "}
                        <span className="inline-block rounded-full px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 ml-1">
                            {spese.length}
                        </span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1">
                        {spese.length === 0 ? <span className="text-zinc-400">-</span> : spese.map(renderCategoryIcon)}
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
}
