// ============================
// LoadingSpinnerCard.tsx
// Card dashboard con spinner di caricamento
// ============================
import { ReactNode } from "react";
import DashboardCard from "../DashboardCard";

type Props = {
    icon: ReactNode;
    title: string;
    message?: string;
    value?: ReactNode;
};

export default function LoadingSpinnerCard({ icon, title, message = "Caricamento dati...", value = "..." }: Props) {
    return (
        <DashboardCard icon={icon} title={title} value={value}>
            <div className="flex items-center gap-2 justify-center py-2">
                <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                    />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-xs text-gray-400">{message}</span>
            </div>
        </DashboardCard>
    );
}
