"use client";

// ======================================================
// ProfilePage.tsx — Avatar a sinistra, dati a destra
// ======================================================

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileRow from "./components/ProfileRow";
import ThemeSelectorRow from "./components/ThemeSelectorRow";
import AvatarPickerModal from "./components/AvatarPickerModal";
import { DEFAULT_USER, UserType } from "@/types/models/user";
import { useUser } from "@/context/contexts/UserContext";
import { useThemeContext } from "@/context/contexts/ThemeContext";
import PendingEmailNotice from "@/app/components/PendingEmailNotice";
import { UserRound } from "lucide-react";
import LegalLinks from "@/app/components/legal/LegalLinks";
import DeleteAccountSection from "./components/DeleteAccountSection";
import getAvatarUrl from "@/utils/getAvatarUrl";

// ======================================================
// Componente principale
// ======================================================
export default function ProfilePage() {
    const { user, update } = useUser();
    const { setTheme } = useThemeContext();

    const [form, setForm] = useState<UserType>(DEFAULT_USER);
    const [editing, setEditing] = useState<{ [K in keyof UserType]?: boolean }>({});
    const [backup, setBackup] = useState<Partial<UserType>>({});
    const [showPicker, setShowPicker] = useState(false);

    const isDemo = user?.email === "demo@synapsy.app";

    useEffect(() => {
        if (user) setForm(user);
    }, [user]);

    const handleEdit = (field: keyof UserType) => {
        setBackup((b) => ({ ...b, [field]: form[field] }));
        setEditing({ ...editing, [field]: true });
    };
    const handleChange = (field: keyof UserType, value: string) => setForm({ ...form, [field]: value });
    const handleSave = async (field: keyof UserType) => {
        if (field === "theme") setTheme(form.theme, false);
        await update({ [field]: form[field] } as Partial<UserType>);
        setEditing({ ...editing, [field]: false });
        setBackup((b) => {
            const { [field]: _omit, ...rest } = b;
            return rest;
        });
    };
    const handleCancel = (field: keyof UserType) => {
        setForm((f) => ({ ...f, [field]: backup[field] as any }));
        setEditing({ ...editing, [field]: false });
        setBackup((b) => {
            const { [field]: _omit, ...rest } = b;
            return rest;
        });
    };
    const handleAvatarChange = async (val: string) => {
        await update({ avatar: val });
        setShowPicker(false);
    };

    const avatarUrl = getAvatarUrl(form.avatar);

    return (
        <div className="max-w-3xl mx-auto">
            {isDemo && (
                <div className="mb-4 p-3 text-sm text-center rounded-xl bg-yellow-100 text-yellow-800">
                    Questo è un account demo. I dati non possono essere modificati.
                </div>
            )}
            <PendingEmailNotice />
            {/* ───────────────────────────── */}
            {/*   DUE COLONNE SU MD+         */}
            {/* ───────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-start md:gap-8">
                {/* -------- Colonna avatar -------- */}
                <div className="flex justify-center md:justify-start md:min-w-[160px] md:pt-4">
                    <motion.div whileHover={isDemo ? {} : { scale: 1.07 }} className="relative group">
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-50 h-72 rounded-full object-cover border-2 shadow transition group-hover:ring-2"
                            style={{
                                borderColor: "hsl(var(--c-primary, 205 66% 49%))",
                                boxShadow: "0 2px 12px 0 hsl(var(--c-primary-shadow, 205 66% 49% / 0.09))",
                                cursor: isDemo ? "not-allowed" : "pointer",
                            }}
                            onClick={isDemo ? undefined : () => setShowPicker(true)}
                            title="Cambia avatar"
                        />
                        {/* Badge matita (edit) */}
                        {!isDemo && (
                            <button
                                type="button"
                                className="absolute bottom-0 right-0 shadow px-1.5 py-0.5 rounded-full text-xs font-semibold opacity-85 hover:opacity-100 transition border"
                                style={{
                                    background: "hsl(var(--c-bg, 44 81% 94%))",
                                    borderColor: "hsl(var(--c-primary-border, 205 66% 49% / 0.16))",
                                    color: "hsl(var(--c-primary, 205 66% 49%))",
                                }}
                                onClick={() => setShowPicker(true)}
                                tabIndex={-1}
                                title="Cambia avatar"
                            >
                                ✎
                            </button>
                        )}
                    </motion.div>
                </div>

                {/* -------- Colonna dati profilo -------- */}
                <div className="flex-1 flex flex-col gap-4">
                    {/* Intestazione */}
                    <div className="flex flex-col items-center md:items-start gap-1 mb-2 mt-4 md:mt-0">
                        <UserRound size={40} className="text-primary drop-shadow" />
                        <h1 className="text-2xl font-bold text-primary">Profilo</h1>
                        <p className="text-sm text-muted-foreground">Modifica le informazioni del tuo account.</p>
                    </div>

                    {/* Dati profilo */}
                    <div
                        className="rounded-xl shadow-sm"
                        style={{
                            background: "hsl(var(--c-bg-elevate, 44 36% 88%) / 0.8)",
                            border: "1px solid hsl(var(--c-primary-border, 205 66% 49% / 0.16))",
                            boxShadow: "0 2px 12px 0 hsl(var(--c-primary-shadow, 205 66% 49% / 0.09))",
                            overflow: "visible",
                        }}
                    >
                        <ProfileRow
                            label="Nome"
                            value={form.name}
                            editing={editing.name}
                            onEdit={() => handleEdit("name")}
                            onChange={(v) => handleChange("name", v)}
                            onSave={() => handleSave("name")}
                            onCancel={() => handleCancel("name")}
                            disabled={isDemo}
                        />
                        <ProfileRow
                            label="Cognome"
                            value={form.surname ?? ""}
                            editing={editing.surname}
                            onEdit={() => handleEdit("surname")}
                            onChange={(v) => handleChange("surname", v)}
                            onSave={() => handleSave("surname")}
                            onCancel={() => handleCancel("surname")}
                            disabled={isDemo}
                        />
                        <ProfileRow
                            label="Username"
                            value={form.username}
                            editing={editing.username}
                            onEdit={() => handleEdit("username")}
                            onChange={(v) => handleChange("username", v)}
                            onSave={() => handleSave("username")}
                            onCancel={() => handleCancel("username")}
                            disabled={isDemo}
                        />
                        <ProfileRow
                            label="Email"
                            value={form.email}
                            editing={editing.email}
                            onEdit={() => handleEdit("email")}
                            onChange={(v) => handleChange("email", v)}
                            onSave={() => handleSave("email")}
                            onCancel={() => handleCancel("email")}
                            disabled={isDemo || !!user?.pending_email}
                        />
                        <ThemeSelectorRow
                            value={form.theme}
                            editing={editing.theme}
                            onEdit={() => handleEdit("theme")}
                            onSave={(val) => {
                                setTheme(val as any);
                                setForm((f) => ({ ...f, theme: val as any }));
                                setEditing((e) => ({ ...e, theme: false }));
                            }}
                            onCancel={() => setEditing((e) => ({ ...e, theme: false }))}
                            disabled={isDemo}
                        />
                    </div>
                </div>
            </div>
            {/* ───────────────────────────── */}
            {/* Modale scelta avatar          */}
            {/* ───────────────────────────── */}
            <AnimatePresence>
                {showPicker && !isDemo && (
                    <AvatarPickerModal
                        selected={form.avatar}
                        onSelect={handleAvatarChange}
                        onClose={() => setShowPicker(false)}
                    />
                )}
            </AnimatePresence>
            <DeleteAccountSection />
            <LegalLinks className="p-4 border-t border-white/10 text-center" />
        </div>
    );
}
