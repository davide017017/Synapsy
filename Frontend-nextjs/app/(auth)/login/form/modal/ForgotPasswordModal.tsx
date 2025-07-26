"use client";

import { useState } from "react";
import Dialog from "@/app/components/ui/Dialog";
import ModalLayout from "@/app/components/ui/ModalLayout";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { handleForgotPassword } from "@/lib/auth/handleForgotPassword";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: Props) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        try {
            const { success, message } = await handleForgotPassword(email);
            if (success) {
                setMessage(message);
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
                title={<span className="text-primary text-lg font-bold">Recupero password</span>}
                onClose={onClose}
                footer={null}
            >
                <form onSubmit={submit} className="space-y-3" autoComplete="off">
                    <Input
                        type="email"
                        placeholder="La tua email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {error && <p className="text-danger text-sm">{error}</p>}
                    {message && !error && <p className="text-success text-sm">{message}</p>}
                    <Button type="submit" disabled={loading} className="w-full mt-2">
                        {loading ? "Invio..." : "Invia link di reset"}
                    </Button>
                </form>
            </ModalLayout>
        </Dialog>
    );
}
