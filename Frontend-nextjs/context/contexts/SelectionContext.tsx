import React, { createContext, useContext, useState } from "react";

type SelectionContextType = {
    isSelectionMode: boolean;
    setIsSelectionMode: (v: boolean) => void;
    selectedIds: number[];
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    return (
        <SelectionContext.Provider value={{ isSelectionMode, setIsSelectionMode, selectedIds, setSelectedIds }}>
            {children}
        </SelectionContext.Provider>
    );
}

export function useSelection() {
    const ctx = useContext(SelectionContext);
    if (!ctx) throw new Error("useSelection must be used within a SelectionProvider");
    return ctx;
}
