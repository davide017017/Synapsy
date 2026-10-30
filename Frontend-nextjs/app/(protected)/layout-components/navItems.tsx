// ────────────────────────────────
// Voci di navigazione condivise (sidebar desktop + menu mobile)
// ────────────────────────────────
import { Home, BarChart, CalendarCheck, Folder, User, ListOrdered } from "lucide-react";

export const navItems = [
    { href: "/", label: "Home", Icon: Home },
    { href: "/panoramica", label: "Panoramica", Icon: BarChart },
    { href: "/transazioni", label: "Transazioni", Icon: ListOrdered },
    { href: "/ricorrenti", label: "Ricorrenti", Icon: CalendarCheck },
    { href: "/categorie", label: "Categorie", Icon: Folder },
    { href: "/profilo", label: "Profilo", Icon: User },
];
