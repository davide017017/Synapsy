"use client";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">👤 Il tuo profilo</h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
                Modifica le informazioni dell’account e le preferenze.
            </p>

            {/* Placeholder: form dati utente, preferenze tema, ecc. */}
            <div className="h-40 flex items-center justify-center rounded bg-white/20 border border-dashed border-zinc-500">
                <span className="text-zinc-500">… componenti in arrivo …</span>
            </div>
        </div>
    );
}
