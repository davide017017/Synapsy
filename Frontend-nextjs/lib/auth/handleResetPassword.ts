const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ResetPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export async function handleResetPassword(payload: ResetPayload): Promise<{success:boolean; message:string}> {
  if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL not defined');
  const res = await fetch(`${API_URL}/v1/reset-password`, {
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

