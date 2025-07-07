// utils/iconMap.ts
import * as FiIcons from "react-icons/fi"; // Feather
import * as FaIcons from "react-icons/fa"; // FontAwesome
import * as MdIcons from "react-icons/md"; // Material

// Tipizza come Record<string, any>
const fiIcons = FiIcons as Record<string, React.ComponentType<any>>;
const faIcons = FaIcons as Record<string, React.ComponentType<any>>;
const mdIcons = MdIcons as Record<string, React.ComponentType<any>>;

// Funzione di mapping
export function getIconComponent(iconName?: string): React.ComponentType<any> {
    if (!iconName) return fiIcons.FiTag;
    if (iconName.startsWith("Fi") && fiIcons[iconName]) return fiIcons[iconName];
    if (iconName.startsWith("Fa") && faIcons[iconName]) return faIcons[iconName];
    if (iconName.startsWith("Md") && mdIcons[iconName]) return mdIcons[iconName];
    return fiIcons.FiTag; // Fallback
}
