"use client";

// =============================
// ProfilePage.tsx — Compatta, avatar animato, colori da tema CSS
// =============================

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- Placeholder dati utente ----
const MOCK_USER = {
    name: "Mario Rossi",
    email: "mario.rossi@email.com",
    theme: "dark",
};

export default function ProfilePage() {
    // -----------------------------
    // Stato profilo/avatar
    // -----------------------------
    const [user, setUser] = useState(MOCK_USER);
    const [editing, setEditing] = useState<{ [K in keyof typeof MOCK_USER]?: boolean }>({});
    const [avatar, setAvatar] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // -----------------------------
    // Edit campi
    // -----------------------------
    const handleEdit = (field: keyof typeof MOCK_USER) => setEditing({ ...editing, [field]: true });
    const handleChange = (field: keyof typeof MOCK_USER, value: string) => setUser({ ...user, [field]: value });
    const handleSave = (field: keyof typeof MOCK_USER) => setEditing({ ...editing, [field]: false });

    // -----------------------------
    // Avatar
    // -----------------------------
    const handleAvatarClick = () => (avatar ? setShowPreview(true) : fileInputRef.current?.click());
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => setAvatar(evt.target?.result as string);
            reader.readAsDataURL(file);
        }
    };
    const handleRemoveAvatar = () => {
        setAvatar(null);
        setShowPreview(false);
    };

    // -----------------------------
    // Render
    // -----------------------------
    return (
        <div className="max-w-lg mx-auto space-y-6">
            {/* ========================================= */}
            {/* Avatar + Intestazione */}
            {/* ========================================= */}
            <div
                className="flex items-center gap-4 pb-2 border-b"
                style={{ borderColor: "hsl(var(--c-primary-border, 205 66% 49% / 0.16))" }}
            >
                <motion.div whileHover={{ scale: 1.07 }} className="relative group">
                    {/* Avatar */}
                    {avatar ? (
                        <img
                            src={avatar}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full object-cover border-2 cursor-pointer shadow transition group-hover:ring-2"
                            style={{
                                borderColor: "hsl(var(--c-primary, 205 66% 49%))",
                                boxShadow: "0 2px 12px 0 hsl(var(--c-primary-shadow, 205 66% 49% / 0.09))",
                            }}
                            onClick={handleAvatarClick}
                        />
                    ) : (
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold cursor-pointer select-none transition group-hover:ring-2"
                            style={{
                                background: "hsl(var(--c-primary, 205 66% 49%) / 0.6)",
                                color: "hsl(var(--c-text-invert, 44 81% 94%))",
                                boxShadow: "0 2px 12px 0 hsl(var(--c-primary-shadow, 205 66% 49% / 0.09))",
                            }}
                            onClick={handleAvatarClick}
                        >
                            {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                        </div>
                    )}
                    {/* Bottone cambio avatar */}
                    <button
                        type="button"
                        className="absolute bottom-0 right-0 shadow px-1.5 py-0.5 rounded-full text-xs font-semibold opacity-85 hover:opacity-100 transition border"
                        style={{
                            background: "hsl(var(--c-bg, 44 81% 94%))",
                            borderColor: "hsl(var(--c-primary-border, 205 66% 49% / 0.16))",
                            color: "hsl(var(--c-primary, 205 66% 49%))",
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        tabIndex={-1}
                        title="Cambia avatar"
                    >
                        ✎
                    </button>
                    {/* Bottone rimuovi avatar */}
                    {avatar && (
                        <button
                            type="button"
                            className="absolute -top-1 -left-1 px-1 rounded-full text-xs font-bold shadow hover:opacity-90 transition"
                            style={{
                                background: "hsl(var(--c-danger, 2 64% 52%))",
                                color: "hsl(var(--c-bg, 44 81% 94%))",
                            }}
                            onClick={handleRemoveAvatar}
                            title="Rimuovi avatar"
                        >
                            ×
                        </button>
                    )}
                    {/* Input file nascosto */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                        tabIndex={-1}
                    />
                </motion.div>
                {/* Titolo */}
                <div>
                    <h1 className="text-xl font-bold" style={{ color: "hsl(var(--c-primary, 205 66% 49%))" }}>
                        👤 Profilo
                    </h1>
                    <p className="text-xs" style={{ color: "hsl(var(--c-text-secondary, 197 13% 45%))" }}>
                        Modifica le info e il tema.
                    </p>
                </div>
            </div>

            {/* ========================================= */}
            {/* Dati profilo */}
            {/* ========================================= */}
            <div
                className="rounded-xl shadow-sm divide-y"
                style={{
                    background: "hsl(var(--c-bg-elevate, 44 36% 88%) / 0.8)",
                    border: "1px solid hsl(var(--c-primary-border, 205 66% 49% / 0.16))",
                    boxShadow: "0 2px 12px 0 hsl(var(--c-primary-shadow, 205 66% 49% / 0.09))",
                }}
            >
                <ProfileRow
                    label="Nome"
                    value={user.name}
                    editing={editing.name}
                    onEdit={() => handleEdit("name")}
                    onChange={(v) => handleChange("name", v)}
                    onSave={() => handleSave("name")}
                />
                <ProfileRow
                    label="Email"
                    value={user.email}
                    editing={editing.email}
                    onEdit={() => handleEdit("email")}
                    onChange={(v) => handleChange("email", v)}
                    onSave={() => handleSave("email")}
                />
                <ProfileRow
                    label="Tema"
                    value={user.theme}
                    editing={editing.theme}
                    onEdit={() => handleEdit("theme")}
                    onChange={(v) => handleChange("theme", v)}
                    onSave={() => handleSave("theme")}
                    type="select"
                    options={[
                        { value: "system", label: "Sistema" },
                        { value: "light", label: "Chiaro" },
                        { value: "dark", label: "Scuro" },
                        { value: "emerald", label: "Emerald" },
                        { value: "solarized", label: "Solarized" },
                    ]}
                />
            </div>

            {/* ========================================= */}
            {/* Modale preview avatar (animata) */}
            {/* ========================================= */}
            <AnimatePresence>
                {showPreview && avatar && (
                    <AvatarModal avatar={avatar} onClose={() => setShowPreview(false)} onRemove={handleRemoveAvatar} />
                )}
            </AnimatePresence>
        </div>
    );
}

// =========================================
// Riga editabile profilo — COMPATTA, colori da tema
// =========================================
type RowProps = {
    label: string;
    value: string;
    editing?: boolean;
    onEdit: () => void;
    onChange: (v: string) => void;
    onSave: () => void;
    type?: "text" | "select";
    options?: { value: string; label: string }[];
};

function ProfileRow({ label, value, editing, onEdit, onChange, onSave, type = "text", options }: RowProps) {
    return (
        <div
            className="flex items-center px-3 py-3 gap-4 group transition-all"
            style={{
                background: "transparent",
                borderBottom: "1px solid hsl(var(--c-primary-border, 205 66% 49% / 0.08))",
            }}
        >
            <div className="w-28 font-medium text-sm" style={{ color: "hsl(var(--c-text-secondary, 197 13% 45%))" }}>
                {label}
            </div>
            <div className="flex-1">
                {editing ? (
                    type === "select" ? (
                        <select
                            className="px-2 py-1 rounded border text-sm"
                            style={{
                                background: "hsl(var(--c-bg, 44 81% 94%))",
                                borderColor: "hsl(var(--c-primary-border, 205 66% 49% / 0.16))",
                                color: "hsl(var(--c-text, 193 14% 40%))",
                            }}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                        >
                            {options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            className="px-2 py-1 rounded border text-sm"
                            style={{
                                background: "hsl(var(--c-bg, 44 81% 94%))",
                                borderColor: "hsl(var(--c-primary-border, 205 66% 49% / 0.16))",
                                color: "hsl(var(--c-text, 193 14% 40%))",
                            }}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    )
                ) : (
                    <span style={{ color: "hsl(var(--c-text, 193 14% 40%))" }}>{value}</span>
                )}
            </div>
            <div>
                {editing ? (
                    <button
                        className="ml-2 px-2 py-1 rounded font-semibold shadow text-xs transition"
                        style={{
                            background: "hsl(var(--c-primary, 205 66% 49%))",
                            color: "hsl(var(--c-bg, 44 81% 94%))",
                        }}
                        onClick={onSave}
                    >
                        Salva
                    </button>
                ) : (
                    <button
                        className="opacity-70 group-hover:opacity-100 px-2 py-1 rounded font-semibold text-xs transition"
                        style={{
                            background: "hsl(var(--c-secondary, 220 15% 48%))",
                            color: "hsl(var(--c-bg, 44 81% 94%))",
                        }}
                        onClick={onEdit}
                    >
                        Modifica
                    </button>
                )}
            </div>
        </div>
    );
}

// =========================================
// Modale avatar animata (framer-motion, colori tema)
// =========================================
function AvatarModal({ avatar, onClose, onRemove }: { avatar: string; onClose: () => void; onRemove: () => void }) {
    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
                background: "hsl(var(--c-bg-glass, 44 36% 88% / 0.8))",
                backdropFilter: "blur(4px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="relative rounded-2xl p-5 flex flex-col items-center max-w-xs w-full"
                style={{
                    background: "hsl(var(--modal-bg, 44 36% 88%))",
                    border: "1.5px solid hsl(var(--modal-border, 205 66% 49% / 0.16))",
                    color: "hsl(var(--modal-text, 193 14% 40%))",
                    boxShadow: "0 6px 32px 0 hsl(var(--c-primary-shadow, 205 66% 49% / 0.09))",
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
                <img
                    src={avatar}
                    alt="Avatar grande"
                    className="w-36 h-36 rounded-full object-cover mb-4"
                    style={{
                        border: "3px solid hsl(var(--c-primary, 205 66% 49%))",
                        boxShadow: "0 2px 12px 0 hsl(var(--c-primary-shadow, 205 66% 49% / 0.09))",
                    }}
                />
                <div className="flex gap-2">
                    <button
                        className="px-3 py-1 rounded font-semibold text-xs transition"
                        style={{
                            background: "hsl(var(--c-secondary, 220 15% 48%))",
                            color: "hsl(var(--c-bg, 44 81% 94%))",
                        }}
                        onClick={onClose}
                    >
                        Chiudi
                    </button>
                    <button
                        className="px-3 py-1 rounded font-semibold text-xs transition"
                        style={{
                            background: "hsl(var(--c-danger, 2 64% 52%))",
                            color: "hsl(var(--c-bg, 44 81% 94%))",
                        }}
                        onClick={onRemove}
                    >
                        Rimuovi
                    </button>
                </div>
                <button
                    className="absolute top-2 right-2 font-bold text-xl"
                    style={{ color: "hsl(var(--modal-title, 205 66% 49%))" }}
                    onClick={onClose}
                    aria-label="Chiudi"
                    tabIndex={-1}
                >
                    ×
                </button>
            </motion.div>
        </motion.div>
    );
}
