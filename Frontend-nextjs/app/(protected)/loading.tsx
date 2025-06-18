"use client";

export default function ProtectedLoading() {
    return (
        <div className="flex h-screen">
            {/* ───── Sidebar skeleton ───── */}
            <aside className="hidden md:block w-56 bg-[rgb(24,24,24)] p-4 space-y-4">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-4 bg-[rgb(48,48,48)] rounded animate-pulse"
                        style={{ animationDelay: `${i * 80}ms` }}
                    />
                ))}
            </aside>

            {/* ───── Main area skeleton ───── */}
            <div className="flex-1 flex flex-col">
                {/* Header fake */}
                <header className="h-12 bg-[rgb(24,24,24)] flex items-center px-4">
                    <div className="h-6 w-6 rounded-full bg-[rgb(48,48,48)] animate-pulse mr-4" />
                    <div className="h-4 w-32 bg-[rgb(48,48,48)] rounded animate-pulse" />
                </header>

                {/* Contenuto centrale */}
                <main className="flex-1 bg-[rgb(24,24,24)] flex items-center justify-center">
                    <div className="h-8 w-8 border-4 border-[rgb(64,64,64)] border-t-transparent rounded-full animate-spin" />
                </main>
            </div>
        </div>
    );
}
