import { signIn } from "next-auth/react";

export async function handleTokenLogin(token: string): Promise<boolean> {
  const res = await signIn("token-login", { redirect: false, token });
  return !res?.error;
}
