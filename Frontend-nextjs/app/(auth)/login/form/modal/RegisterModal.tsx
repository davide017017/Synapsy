"use client";

import { useState } from "react";
import Dialog from "@/app/components/ui/Dialog";
import ModalLayout from "@/app/components/ui/ModalLayout";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import PasswordInput from "../form-components/PasswordInput";
import { handleRegister } from "@/lib/auth/handleRegister";
import { PASSWORD_RULES_TEXT, isPasswordValid } from "@/lib/auth/passwordRules";
import PrivacyModal from "@/app/components/legal/PrivacyModal";
import TermsModal from "@/app/components/legal/TermsModal";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function RegisterModal({ isOpen, onClose }: Props) {
    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        username: "",
        password: "",
        confirm: "",
        accepted: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const passwordValid = isPasswordValid(form.password);

    const handleChange = (field: string, value: any) => {
        setForm((f) => ({ ...f, [field]: value }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        if (!form.accepted) {
            setError("Devi accettare Privacy e Termini");
            return;
        }
        if (form.password !== form.confirm) {
            setError("Le password non coincidono");
            return;
        }
        if (!passwordValid) {
            setError("La password non rispetta i criteri");
            return;
        }
        setLoading(true);
        setMessage("Invio email in corso...");

        try {
            const { success, message } = await handleRegister({
                name: form.name,
                surname: form.surname,
                email: form.email,
                username: form.username,
                password: form.password,
                password_confirmation: form.confirm,
                has_accepted_terms: form.accepted,
            });
            if (success) {
                setMessage(message);
                // Optionally close modal after some time
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <ModalLayout
                title={<span className="text-primary text-lg font-bold">Registrazione</span>}
                onClose={onClose}
                footer={null}
            >
                <form onSubmit={submit} className="space-y-3" autoComplete="off">
                    <Input
                        placeholder="Nome"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                    />
                    <Input
                        placeholder="Cognome"
                        value={form.surname}
                        onChange={(e) => handleChange("surname", e.target.value)}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                    />
                    <Input
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => handleChange("username", e.target.value)}
                        required
                    />
                    <p className="text-xs" style={{color: passwordValid ? '#16a34a' : '#dc2626'}}>{PASSWORD_RULES_TEXT}</p>

                    <PasswordInput
                        value={form.password}
                        onChange={(v) => handleChange("password", v)}
                        placeholder="Password"
                        isValid={passwordValid}
                    />
                    <PasswordInput
                        value={form.confirm}
                        onChange={(v) => handleChange("confirm", v)}
                        placeholder="Conferma password"
                    />
                    <label className="flex items-center gap-2 text-xs">
                        <input
                            type="checkbox"
                            checked={form.accepted}
                            onChange={(e) => handleChange("accepted", e.target.checked)}
                            required
                        />
                        <span>
                            Accetto
                            <button
                                type="button"
                                onClick={() => setShowPrivacy(true)}
                                className="underline ml-1"
                            >
                                Privacy
                            </button>
                            e
                            <button
                                type="button"
                                onClick={() => setShowTerms(true)}
                                className="underline ml-1"
                            >
                                Termini
                            </button>
                        </span>
                    </label>
                    {error && <p className="text-danger text-sm">{error}</p>}
                    {message && !error && <p className="text-success text-sm">{message}</p>}
                    <Button type="submit" disabled={loading} className="w-full mt-2">
                        {loading ? "Registrazione..." : "Registrati"}
                    </Button>
                </form>
            </ModalLayout>
            <PrivacyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} />
            <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
        </Dialog>
    );
}
