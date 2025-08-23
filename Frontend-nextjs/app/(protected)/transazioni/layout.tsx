import { SelectionProvider } from "@/context/SelectionContext";

export default function TransazioniLayout({ children }: { children: React.ReactNode }) {
    return <SelectionProvider>{children}</SelectionProvider>;
}
