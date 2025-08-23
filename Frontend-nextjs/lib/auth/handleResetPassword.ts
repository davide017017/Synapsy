import { url } from "@/lib/api/endpoints";

export interface ResetPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export async function handleResetPassword(payload: ResetPayload): Promise<{success:boolean; message:string}> {
  const res = await fetch(url("resetPassword"), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, message: data.message || 'Errore' };
  }
  return { success: true, message: data.message || 'Password aggiornata' };
}

