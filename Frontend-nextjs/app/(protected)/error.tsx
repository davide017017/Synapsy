"use client";

// ==============================
// Error boundary area protetta
// ==============================
export default function ProtectedError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="p-4 space-y-2">
            <h2 className="text-lg font-bold">Si è verificato un errore</h2>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <button
                onClick={reset}
                className="px-3 py-1 rounded bg-primary text-white"
            >
                Riprova
            </button>
        </div>
    );
}
