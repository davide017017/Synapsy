export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export async function handleChangePassword(
    payload: ChangePasswordPayload,
): Promise<{ success: boolean; message: string }> {
    const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        return { success: false, message: data?.error || "Errore aggiornamento password" };
    }
    return { success: true, message: "Password aggiornata con successo" };
}
