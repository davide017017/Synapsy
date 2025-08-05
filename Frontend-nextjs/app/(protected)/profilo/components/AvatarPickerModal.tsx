import { motion } from "framer-motion";

interface AvatarPickerModalProps {
    avatarList: string[];
    selected: string;
    onSelect: (val: string) => void;
    onClose: () => void;
}

export default function AvatarPickerModal({ avatarList, selected, onSelect, onClose }: AvatarPickerModalProps) {
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
