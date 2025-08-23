/* app/(auth)/loading.tsx */
export default function AuthLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black/80 rounded gap-2">
            <span className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-white">{"Sto caricando l'area login…"}</span>
        </div>
    );
}
