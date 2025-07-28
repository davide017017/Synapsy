"use client";

// ======================================================
// ProfilePage.tsx — Avatar gallery scelta rapida (no upload)
// ======================================================

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileRow from "./components/ProfileRow";
import ThemeSelectorRow from "./components/ThemeSelectorRow";
import AvatarPickerModal from "./components/AvatarPickerModal";
import { AVATAR_CHOICES } from "./components/constants";
import { DEFAULT_USER, UserType } from "@/types/models/user";
import { useUser } from "@/context/contexts/UserContext";
import { useThemeContext } from "@/context/contexts/ThemeContext";
import PendingEmailNotice from "@/app/components/PendingEmailNotice";

// ======================================================
// Componente principale
// ======================================================
export default function ProfilePage() {
    const { user, update } = useUser();
    const { setTheme } = useThemeContext();

    // -----------------------------------
    // Stato UI e form locale
    // -----------------------------------
    const [form, setForm] = useState<UserType>(DEFAULT_USER);
    const [editing, setEditing] = useState<{ [K in keyof UserType]?: boolean }>({});
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        if (user) setForm(user);
    }, [user]);

    // Gestione cambio campi
    const handleEdit = (field: keyof UserType) => setEditing({ ...editing, [field]: true });
    const handleChange = (field: keyof UserType, value: string) => setForm({ ...form, [field]: value });
    const handleSave = async (field: keyof UserType) => {
        if (field === "theme") {
            setTheme(form.theme, false);
        }
        await update({ [field]: form[field] } as Partial<UserType>);
        setEditing({ ...editing, [field]: false });
    };

    // Gestione scelta avatar
    const handleAvatarChange = async (val: string) => {
        await update({ avatar: val });
        setShowPicker(false);
    };

    // -----------------------------------
    // Render pagina
    // -----------------------------------
    return (
        <div className="max-w-lg mx-auto space-y-6">
            <PendingEmailNotice />
            {/* ========================================= */}
            {/* Avatar + Intestazione */}
            {/* ========================================= */}
            <div
                className="flex items-center gap-4 pb-2 border-b"
                style={{ borderColor: "hsl(var(--c-primary-border, 205 66% 49% / 0.16))" }}
            >
                {/* ---- Avatar attuale (click per cambiare) ---- */}
                <motion.div whileHover={{ scale: 1.07 }} className="relative group">
                    <img
                        src={form.avatar}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full object-cover border-2 cursor-pointer shadow transition group-hover:ring-2"
                        style={{
                            borderColor: "hsl(var(--c-primary, 205 66% 49%))",
                            boxShadow: "0 2px 12px 0 hsl(var(--c-primary-shadow, 205 66% 49% / 0.09))",
                        }}
                        onClick={() => setShowPicker(true)}
                        title="Cambia avatar"
                    />
                    {/* Badge matita (edit) */}
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
                </motion.div>
                {/* ---- Titolo ---- */}
                <div>
                    <h1 className="text-xl font-bold" style={{ color: "hsl(var(--c-primary, 205 66% 49%))" }}>
                        👤 Profilo
                    </h1>
                    <p className="text-xs" style={{ color: "hsl(var(--c-text-secondary, 197 13% 45%))" }}>
                        Modifica le informazioni del tuo account.
                    </p>
                </div>
            </div>

            {/* ========================================= */}
            {/* Dati profilo */}
            {/* ========================================= */}
            <div
                className="rounded-xl shadow-sm "
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
                />
                <ProfileRow
                    label="Cognome"
                    value={form.surname ?? ""}
                    editing={editing.surname}
                    onEdit={() => handleEdit("surname")}
                    onChange={(v) => handleChange("surname", v)}
                    onSave={() => handleSave("surname")}
                />
                <ProfileRow
                    label="Username"
                    value={form.username}
                    editing={editing.username}
                    onEdit={() => handleEdit("username")}
                    onChange={(v) => handleChange("username", v)}
                    onSave={() => handleSave("username")}
                />
                <ProfileRow
                    label="Email"
                    value={form.email}
                    editing={editing.email}
                    onEdit={() => handleEdit("email")}
                    onChange={(v) => handleChange("email", v)}
                    onSave={() => handleSave("email")}
                    disabled={!!user?.pending_email}
                />
                <ThemeSelectorRow
                    value={form.theme}
                    editing={editing.theme}
                    onEdit={() => handleEdit("theme")}
                    onSave={(val) => {
                        // Applica subito il tema selezionato e persiste in background
                        setTheme(val as any);
                        // Aggiorna stato locale senza attendere risposta
                        setForm((f) => ({ ...f, theme: val as any }));
                        setEditing((e) => ({ ...e, theme: false }));
                    }}
                />
            </div>

            {/* ========================================= */}
            {/* Modale scelta avatar */}
            {/* ========================================= */}
            <AnimatePresence>
                {showPicker && (
                    <AvatarPickerModal
                        avatarList={AVATAR_CHOICES}
                        selected={form.avatar}
                        onSelect={handleAvatarChange}
                        onClose={() => setShowPicker(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
