import { RowProps } from "@/types/profilo/row";

export default function ProfileRow({ label, value, editing, onEdit, onChange, onSave, type = "text", options }: RowProps) {
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
