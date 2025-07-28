import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useThemeContext } from "@/context/contexts/ThemeContext";
import { availableThemes } from "@/lib/themeUtils";

interface ThemeSelectorRowProps {
    value: string;
    editing: boolean | undefined;
    onEdit: () => void;
    onSave: (val: string) => void;
}

export default function ThemeSelectorRow({ value, editing, onEdit, onSave }: ThemeSelectorRowProps) {
    const { setTheme } = useThemeContext();
    const [selected, setSelected] = useState(value);

    useEffect(() => {
        setSelected(value);
    }, [value]);

    const handleHover = (t: string) => setTheme(t, false);
    const handleLeave = () => setTheme(selected, false);

    if (!editing) {
        return (
            <div
                className="flex items-center px-3 py-3 gap-4 group"
                style={{ borderBottom: "1px solid hsl(var(--c-primary-border, 205 66% 49% / 0.08))" }}
            >
                <div className="w-28 font-medium text-sm" style={{ color: "hsl(var(--c-text-secondary, 197 13% 45%))" }}>
                    Tema
                </div>
                <div className="flex-1 capitalize" style={{ color: "hsl(var(--c-text, 193 14% 40%))" }}>{value}</div>
                <div>
                    <button
                        className="opacity-70 group-hover:opacity-100 px-2 py-1 rounded font-semibold text-xs transition"
                        style={{ background: "hsl(var(--c-secondary, 220 15% 48%))", color: "hsl(var(--c-bg, 44 81% 94%))" }}
                        onClick={onEdit}
                    >
                        Modifica
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex items-center px-3 py-3 gap-4"
            style={{ borderBottom: "1px solid hsl(var(--c-primary-border, 205 66% 49% / 0.08))" }}
        >
            <div className="w-28 font-medium text-sm" style={{ color: "hsl(var(--c-text-secondary, 197 13% 45%))" }}>
                Tema
            </div>
            <div className="flex-1 flex flex-wrap gap-2">
                {availableThemes.map((t) => (
                    <motion.button
                        key={t}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        className={`px-2 py-1 rounded border text-sm capitalize transition shadow-sm ${
                            selected === t ? "ring-2 ring-primary border-primary" : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                        onMouseEnter={() => handleHover(t)}
                        onMouseLeave={handleLeave}
                        onClick={() => setSelected(t)}
                    >
                        {t}
                    </motion.button>
                ))}
            </div>
            <div>
                <button
                    className="ml-2 px-2 py-1 rounded font-semibold shadow text-xs transition"
                    style={{ background: "hsl(var(--c-primary, 205 66% 49%))", color: "hsl(var(--c-bg, 44 81% 94%))" }}
                    onClick={() => onSave(selected)}
                >
                    Salva
                </button>
            </div>
        </div>
    );
}
