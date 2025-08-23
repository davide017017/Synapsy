export async function api<T>(input: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string>),
  };
  const res = await fetch(input, { ...init, headers });
  if (!res.ok) {
    let msg = "Request error";
    if (res.status === 401) msg = "Unauthorized";
    else if (res.status === 404) msg = "Not found";
    else if (res.status === 422) msg = "Unprocessable entity";
    throw new Error(msg);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
