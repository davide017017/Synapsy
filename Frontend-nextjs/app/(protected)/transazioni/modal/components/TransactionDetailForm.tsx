// ================================
// TransactionDetailForm.tsx
// ================================
import AmountField from "./field/AmountField";
import DateField from "./field/DateField";
import DescriptionField from "./field/DescriptionField";
import CategoryField from "./field/CategoryField";
import NotesField from "./field/NotesField";
import { Transaction } from "@/types/models/transaction";
import { Category } from "@/types/models/category";
import type { TransactionDetailFormProps } from "@/types/transazioni/modal";

export default function TransactionDetailForm({
    formData,
    setFormData,
    categories,
    selectedType,
    showErrors,
    transaction,
}: TransactionDetailFormProps) {
    // Filtra categorie per tipo selezionato
    const filteredCategories = categories.filter((c) => c.type === selectedType);

    return (
        <form className="space-y-4 w-full flex flex-col items-center" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center">
                <AmountField
                    value={formData.amount}
                    onChange={(v) => setFormData({ ...formData, amount: v })}
                    original={transaction.amount}
                    showError={showErrors && (!formData.amount || formData.amount <= 0)}
                />
                <DateField
                    value={formData.date}
                    onChange={(v) => setFormData({ ...formData, date: v })}
                    original={transaction.date}
                />
            </div>
            <div className="w-full flex flex-col items-center">
                <DescriptionField
                    value={formData.description}
                    onChange={(v) => setFormData({ ...formData, description: v })}
                    original={transaction.description}
                    showError={showErrors && !formData.description?.trim()}
                />
            </div>
            <div className="w-full flex flex-col items-center">
                <CategoryField
                    value={formData.category_id}
                    categories={filteredCategories}
                    onChange={(id, cat) => setFormData({ ...formData, category_id: id, category: cat })}
                    original={transaction.category_id}
                    showError={showErrors && !formData.category_id}
                />
            </div>
            <div className="w-full flex flex-col items-center">
                <NotesField
                    value={formData.notes ?? undefined}
                    onChange={(v) => setFormData({ ...formData, notes: v })}
                    original={transaction.notes ?? ""}
                />
            </div>
        </form>
    );
}

