"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import PasswordInput from "../login/form/form-components/PasswordInput";
import { handleResetPassword } from "@/lib/auth/handleResetPassword";
import { PASSWORD_RULES_TEXT, isPasswordValid } from "@/lib/auth/passwordRules";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setToken(params.get("token") || "");
      setEmail(params.get("email") || "");
    }
  }, []);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const valid = isPasswordValid(password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (password !== confirm) {
      setError("Le password non coincidono");
      return;
    }
    if (!valid) {
      setError("La password non rispetta i criteri");
      return;
    }
    setLoading(true);
    setMessage("Invio richiesta in corso...");
    try {
      const { success, message } = await handleResetPassword({
        email,
        token,
        password,
        password_confirmation: confirm,
      });
      if (success) {
        setMessage(message);
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="space-y-3 w-80">
        <p className="text-xs" style={{color: valid ? '#16a34a' : '#dc2626'}}>{PASSWORD_RULES_TEXT}</p>
        <PasswordInput value={password} onChange={setPassword} isValid={valid} placeholder="Nuova password" />
        <PasswordInput value={confirm} onChange={setConfirm} placeholder="Conferma password" />
        {error && <p className="text-danger text-sm">{error}</p>}
        {message && !error && <p className="text-success text-sm">{message}</p>}
        <Button type="submit" disabled={loading} className="w-full">{loading ? "Salvataggio..." : "Salva"}</Button>
      </form>
    </div>
  );
}

