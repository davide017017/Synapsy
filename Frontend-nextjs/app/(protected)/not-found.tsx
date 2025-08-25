// ==============================
// 404 area protetta
// ==============================
export default function ProtectedNotFound() {
    return (
        <div className="p-4 space-y-2">
            <h2 className="text-lg font-bold">Pagina non trovata</h2>
            <p className="text-sm text-muted-foreground">La risorsa richiesta non esiste.</p>
        </div>
    );
}
