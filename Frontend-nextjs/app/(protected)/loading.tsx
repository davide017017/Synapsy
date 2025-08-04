"use client";

import Skeleton from "@/app/components/ui/Skeleton";

export default function ProtectedLoading() {
    return (
        <div className="flex h-screen">
            {/* ───── Sidebar skeleton ───── */}
            <aside className="hidden md:block w-56 bg-[rgb(24,24,24)] p-4 space-y-4">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-4" style={{ animationDelay: `${i * 80}ms` }} />
                ))}
            </aside>

            {/* ───── Main area skeleton ───── */}
            <div className="flex-1 flex flex-col">
                {/* Header fake */}
                <header className="h-12 bg-[rgb(24,24,24)] flex items-center px-4 gap-3">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                </header>

                {/* Contenuto centrale */}
                <main className="flex-1 bg-[rgb(24,24,24)] flex flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 border-4 border-[rgb(64,64,64)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-primary">Sto caricando la dashboard…</span>
                </main>
            </div>
        </div>
    );
}

