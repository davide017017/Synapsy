// ================================
// TransactionDetailForm.tsx
// ================================
import AmountField from "./field/AmountField";
import DateField from "./field/DateField";
import DescriptionField from "./field/DescriptionField";
import CategoryField from "./field/CategoryField";
import NotesField from "./field/NotesField";
import { Transaction } from "@/types/types/transaction";

// Tipi
type Category = { id: number; name: string; type: "entrata" | "spesa" };

type Props = {
    formData: Transaction;
    setFormData: (fd: Transaction) => void;
    categories: Category[];
    selectedType: "entrata" | "spesa";
    showErrors: boolean;
    transaction: Transaction;
};

export default function TransactionDetailForm({
    formData,
    setFormData,
    categories,
    selectedType,
    showErrors,
    transaction,
}: Props) {
    // Filtra categorie per tipo selezionato
    const filteredCategories = categories.filter((c) => c.type === selectedType);

    return (
        <form className="space-y-4 w-full flex flex-col items-center" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center">
                <AmountField
                    value={formData.amount}
                    onChange={(v) => setFormData({ ...formData, amount: v })}
                    isModified={formData.amount !== transaction.amount}
                    showError={showErrors && (!formData.amount || formData.amount <= 0)}
                />
                <DateField
                    value={formData.date}
                    onChange={(v) => setFormData({ ...formData, date: v })}
                    isModified={formData.date !== transaction.date}
                />
            </div>
            <div className="w-full flex flex-col items-center">
                <DescriptionField
                    value={formData.description}
                    onChange={(v) => setFormData({ ...formData, description: v })}
                    isModified={formData.description !== transaction.description}
                    showError={showErrors && !formData.description?.trim()}
                />
            </div>
            <div className="w-full flex flex-col items-center">
                <CategoryField
                    value={formData.category_id}
                    categories={filteredCategories}
                    onChange={(id, cat) => setFormData({ ...formData, category_id: id, category: cat })}
                    isModified={formData.category_id !== transaction.category_id}
                    showError={showErrors && !formData.category_id}
                />
            </div>
            <div className="w-full flex flex-col items-center">
                <NotesField
                    value={formData.notes ?? undefined}
                    onChange={(v) => setFormData({ ...formData, notes: v })}
                    isModified={formData.notes !== transaction.notes}
                />
            </div>
        </form>
    );
}
