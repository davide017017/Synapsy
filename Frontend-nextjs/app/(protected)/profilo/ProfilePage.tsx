"use client";

// ======================================================
// ProfilePage.tsx — Avatar gallery scelta rapida (no upload)
// ======================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// -------------------------
// Avatar disponibili (aggiungi le tue immagini)
// -------------------------
const AVATAR_CHOICES = [
    "/images/avatars/avatar-1.svg",
    "/images/avatars/avatar-2.svg",
    "/images/avatars/avatar-3.svg",
    "/images/avatars/avatar-4.svg",
    "/images/avatars/avatar-5.svg",
    "/images/avatars/avatar-6.svg",

    // ...aggiungi altri se ne metti altri!
];

// -------------------------
// Mock dati utente (da sostituire con fetch API)
// -------------------------
const MOCK_USER = {
    name: "Mario",
    surname: "Rossi",
    username: "mario.rossi",
    email: "mario.rossi@email.com",
    theme: "solarized",
    avatar: AVATAR_CHOICES[0], // default primo avatar
};

type UserType = typeof MOCK_USER;

// ======================================================
// Componente principale
// ======================================================
export default function ProfilePage() {
    // -----------------------------------
    // Stato dati utente e UI
    // -----------------------------------
    const [user, setUser] = useState<UserType>(MOCK_USER);
    const [editing, setEditing] = useState<{ [K in keyof UserType]?: boolean }>({});
    const [showPicker, setShowPicker] = useState(false);

    // Gestione cambio campi
    const handleEdit = (field: keyof UserType) => setEditing({ ...editing, [field]: true });
    const handleChange = (field: keyof UserType, value: string) => setUser({ ...user, [field]: value });
    const handleSave = (field: keyof UserType) => setEditing({ ...editing, [field]: false });

    // Gestione scelta avatar
    const handleAvatarChange = (val: string) => {
        setUser({ ...user, avatar: val });
        setShowPicker(false);
        // Qui: PATCH /api/user { avatar: val } se vuoi salvare lato backend
    };

    // -----------------------------------
    // Render pagina
    // -----------------------------------
    return (
        <div className="max-w-lg mx-auto space-y-6">
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
                        src={user.avatar}
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
                    label="Cognome"
                    value={user.surname ?? ""}
                    editing={editing.surname}
                    onEdit={() => handleEdit("surname")}
                    onChange={(v) => handleChange("surname", v)}
                    onSave={() => handleSave("surname")}
                />
                <ProfileRow
                    label="Username"
                    value={user.username}
                    editing={editing.username}
                    onEdit={() => handleEdit("username")}
                    onChange={(v) => handleChange("username", v)}
                    onSave={() => handleSave("username")}
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
            {/* Modale scelta avatar */}
            {/* ========================================= */}
            <AnimatePresence>
                {showPicker && (
                    <AvatarPickerModal
                        avatarList={AVATAR_CHOICES}
                        selected={user.avatar}
                        onSelect={handleAvatarChange}
                        onClose={() => setShowPicker(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ======================================================
// ProfileRow — Riga editabile profilo utente
// ======================================================
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

// ======================================================
// AvatarPickerModal — Modale scelta avatar
// ======================================================
function AvatarPickerModal({
    avatarList,
    selected,
    onSelect,
    onClose,
}: {
    avatarList: string[];
    selected: string;
    onSelect: (val: string) => void;
    onClose: () => void;
}) {
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
                <div className="mb-2 text-base font-bold">Scegli il tuo avatar</div>
                <div className="grid grid-cols-3 gap-4 my-3">
                    {avatarList.map((src) => (
                        <button
                            key={src}
                            type="button"
                            className={`rounded-full border-2 transition-all duration-100 ${
                                selected === src
                                    ? "border-primary ring-2 ring-primary scale-110"
                                    : "border-transparent opacity-80 hover:opacity-100"
                            }`}
                            onClick={() => onSelect(src)}
                        >
                            <img src={src} alt="" className="w-16 h-16 rounded-full object-cover" />
                        </button>
                    ))}
                </div>
                <button
                    className="px-3 py-1 mt-2 rounded font-semibold text-xs transition"
                    style={{
                        background: "hsl(var(--c-secondary, 220 15% 48%))",
                        color: "hsl(var(--c-bg, 44 81% 94%))",
                    }}
                    onClick={onClose}
                >
                    Annulla
                </button>
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
