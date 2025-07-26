"use client";

import { useUser } from "@/context/contexts/UserContext";

export default function PendingEmailNotice() {
    const { user } = useUser();
    if (!user?.pending_email) return null;

    return (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded p-2 mb-4 shadow">
            In attesa di conferma per la nuova email: {user.pending_email}
        </div>
    );
}
