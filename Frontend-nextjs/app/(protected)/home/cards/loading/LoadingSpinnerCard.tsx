"use client";

// ╔══════════════════════════════════════╗
// ║  LoadingSpinnerCard con react-spinners  ║
// ╚══════════════════════════════════════╝

import { ReactNode } from "react";
import DashboardCard from "../DashboardCard";
import { ClipLoader } from "react-spinners";
import type { LoadingSpinnerCardProps } from "@/types";

export default function LoadingSpinnerCard({ icon, title, message = "Caricamento dati..." }: LoadingSpinnerCardProps) {
    return (
        <DashboardCard icon={<span className="opacity-60 animate-pulse">{icon}</span>} title={title}>
            <div className="flex flex-col items-center gap-2 py-4">
                {/* Spinner react-spinners */}
                <ClipLoader color="hsl(var(--c-primary))" size={32} speedMultiplier={0.9} />
                <span className="text-sm text-primary font-medium flex items-center gap-1">{message}</span>
            </div>
        </DashboardCard>
    );
}

