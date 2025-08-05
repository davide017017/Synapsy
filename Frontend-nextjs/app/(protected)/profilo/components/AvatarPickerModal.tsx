"use client";

import AvatarSelector from "./AvatarSelector";

type AvatarPickerModalProps = {
    selected: string;
    onSelect: (val: string) => void;
    onClose: () => void;
};

function ModalHeader({ onClose }: { onClose: () => void }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Seleziona un avatar</h2>
            <button onClick={onClose} className="text-sm underline">Chiudi</button>
        </div>
    );
}

function ModalFooter({ onClose }: { onClose: () => void }) {
    return (
        <div className="mt-4 text-right">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-1 rounded bg-primary text-white"
            >
                Chiudi
            </button>
        </div>
    );
}

export default function AvatarPickerModal({ selected, onSelect, onClose }: AvatarPickerModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 w-full max-w-md shadow-lg">
                <ModalHeader onClose={onClose} />
                <AvatarSelector selected={selected} onSelect={onSelect} />
                <ModalFooter onClose={onClose} />
            </div>
        </div>
    );
}
