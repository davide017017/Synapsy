import type { IconType } from "react-icons";
import {
    FiTag,
    FiHome,
    FiTrendingUp,
    FiGift,
    FiBookOpen,
    FiBriefcase,
    FiShoppingCart,
    FiCreditCard,
    FiCoffee,
    FiHeart,
    FiUser,
    FiTruck,
    FiCalendar,
    FiGlobe,
    FiStar,
    FiCamera,
    FiPhone,
    FiDroplet,
    FiBell,
    FiSun,
    FiMoon,
} from "react-icons/fi";
import {
    FaUtensils,
    FaCar,
    FaRegSmile,
    FaHeartbeat,
    FaPlane,
    FaPiggyBank,
    FaRegMoneyBillAlt,
    FaBus,
    FaBolt,
    FaTree,
    FaDumbbell,
    FaBicycle,
    FaLaptop,
    FaPaw,
    FaRegSun,
    FaBeer,
    FaMedkit,
    FaCameraRetro,
    FaWallet,
    FaShoppingBasket,
    FaGlasses,
    FaLeaf,
    FaBook,
    FaTshirt,
    FaDog,
    FaCat,
} from "react-icons/fa";
import {
    MdAttachMoney,
    MdHealthAndSafety,
    MdPets,
    MdWork,
    MdLocalBar,
    MdDirectionsCar,
    MdRestaurant,
    MdFlight,
    MdHome,
    MdSportsSoccer,
    MdSchool,
    MdChildCare,
    MdDirectionsBike,
    MdShoppingBag,
    MdLocalGroceryStore,
    MdSavings,
    MdChair,
    MdFastfood,
    MdLocalCafe,
    MdLocalHospital,
    MdSpa,
    MdBeachAccess,
    MdOutlineSportsHandball,
    MdOutlineTrain,
    MdOutlineFlightTakeoff,
    MdOutlineShoppingCart,
} from "react-icons/md";

// =======================
// PALETTE COLORI ESTESA (MAXI, con nome)
// =======================
export const CATEGORY_COLORS = [
    // ======================================================
    // Blu & Azzurri
    // ======================================================
    { value: "#1e3a8a", name: "Blu Navy" }, // tailwind blue-800
    { value: "#2563eb", name: "Blu Scuro" }, // tailwind blue-600
    { value: "#3b82f6", name: "Blu" }, // tailwind blue-500
    { value: "#60a5fa", name: "Blu Chiaro" }, // tailwind blue-400
    { value: "#38bdf8", name: "Azzurro" }, // tailwind sky-400
    { value: "#0ea5e9", name: "Light Blue" }, // tailwind sky-500
    { value: "#06b6d4", name: "Cyan" }, // tailwind cyan-500
    { value: "#0891b2", name: "Petrolio" }, // tailwind cyan-700
    { value: "#7dd3fc", name: "Azzurro Chiarissimo" }, // tailwind sky-200

    // ======================================================
    // Verdi / Turchesi
    // ======================================================
    { value: "#052e16", name: "Verde Foresta" }, // tailwind green-900
    { value: "#166534", name: "Verde Scuro" }, // tailwind green-800
    { value: "#16a34a", name: "Verde" }, // tailwind green-600
    { value: "#22c55e", name: "Verde Chiaro" }, // tailwind green-500
    { value: "#4ade80", name: "Menta" }, // tailwind green-300
    { value: "#2dd4bf", name: "Verde Acqua" }, // tailwind teal-400
    { value: "#84cc16", name: "Lime" }, // tailwind lime-500
    { value: "#a3e635", name: "Lime Pastello" }, // tailwind lime-300
    { value: "#d9f99d", name: "Verde Lime Chiarissimo" }, // tailwind lime-100

    // ======================================================
    // Gialli / Oro / Arancio
    // ======================================================
    { value: "#b45309", name: "Arancio Scuro" }, // tailwind orange-700
    { value: "#f59e42", name: "Arancio" }, // tailwind orange-400
    { value: "#f97316", name: "Arancio Vivo" }, // tailwind orange-500
    { value: "#fdba74", name: "Arancio Chiaro" }, // tailwind orange-300
    { value: "#eab308", name: "Giallo" }, // tailwind yellow-500
    { value: "#fde047", name: "Giallo Chiaro" }, // tailwind yellow-200
    { value: "#facc15", name: "Gold" }, // tailwind yellow-400
    { value: "#fbbf24", name: "Oro" }, // tailwind yellow-300
    { value: "#b95c00", name: "Rame" }, // new - copper

    // ======================================================
    // Rossi / Rosso Scuro / Rosa / Magenta
    // ======================================================
    { value: "#7f1d1d", name: "Rosso Profondo" }, // tailwind red-900
    { value: "#be123c", name: "Rosso" }, // tailwind rose-700
    { value: "#dc2626", name: "Rosso Vivo" }, // tailwind red-600
    { value: "#f43f5e", name: "Rosa" }, // tailwind rose-500
    { value: "#e11d48", name: "Magenta Scuro" }, // tailwind rose-700
    { value: "#d946ef", name: "Magenta" }, // tailwind fuchsia-500
    { value: "#f87171", name: "Rosa Chiaro" }, // tailwind red-400

    // ======================================================
    // Viola / Indaco / Fucsia / Lilla
    // ======================================================
    { value: "#581c87", name: "Viola Scuro" }, // tailwind purple-900
    { value: "#a21caf", name: "Viola" }, // tailwind purple-700
    { value: "#7c3aed", name: "Indaco" }, // tailwind indigo-600
    { value: "#c026d3", name: "Fucsia" }, // tailwind fuchsia-600
    { value: "#a78bfa", name: "Lilla" }, // tailwind purple-300
    { value: "#f5d0fe", name: "Lilla Pastello" }, // tailwind fuchsia-100

    // ======================================================
    // Marroni / Taupe / Oro
    // ======================================================
    { value: "#92400e", name: "Marrone" }, // tailwind amber-900
    { value: "#b45309", name: "Marrone Scuro" }, // tailwind amber-700
    { value: "#a16207", name: "Bronzo" }, // tailwind yellow-800
    { value: "#b6ad90", name: "Taupe" }, // custom
    { value: "#e5e7eb", name: "Grigio Chiaro Sabbia" }, // tailwind gray-200

    // ======================================================
    // Grigi / Bianco / Nero
    // ======================================================
    { value: "#111827", name: "Grigio Molto Scuro" }, // tailwind gray-900
    { value: "#1f2937", name: "Grigio Scuro" }, // tailwind gray-800
    { value: "#334155", name: "Grigio Blu" }, // tailwind slate-800
    { value: "#475569", name: "Grigio" }, // tailwind slate-700
    { value: "#64748b", name: "Grigio Medio" }, // tailwind slate-500
    { value: "#94a3b8", name: "Grigio Chiaro" }, // tailwind slate-300
    { value: "#cbd5e1", name: "Silver" }, // tailwind slate-100
    { value: "#fff", name: "Bianco (sconsigliato)" },
    { value: "#1c1917", name: "Quasi Nero (sconsigliato)" },
] as const;

// ===============================
// ICONS ESTESA (Feather, FontAwesome, Material...)
// ===============================
export const CATEGORY_ICONS = [
    // Feather (Fi)
    { value: "FiTag", name: "Tag" },
    { value: "FiHome", name: "Casa" },
    { value: "FiTrendingUp", name: "Trend" },
    { value: "FiGift", name: "Regalo" },
    { value: "FiBookOpen", name: "Libro" },
    { value: "FiBriefcase", name: "Lavoro" },
    { value: "FiShoppingCart", name: "Spesa" },
    { value: "FiCreditCard", name: "Carta" },
    { value: "FiCoffee", name: "Caffè" },
    { value: "FiHeart", name: "Cuore" },
    { value: "FiUser", name: "Persona" },
    { value: "FiTruck", name: "Camion" },
    { value: "FiCalendar", name: "Calendario" },
    { value: "FiGlobe", name: "Globo" },
    { value: "FiStar", name: "Stella" },
    { value: "FiCamera", name: "Fotocamera" },
    { value: "FiPhone", name: "Telefono" },
    { value: "FiDroplet", name: "Goccia" },
    { value: "FiBell", name: "Campana" },
    { value: "FiSun", name: "Sole" },
    { value: "FiMoon", name: "Luna" },

    // FontAwesome (Fa)
    { value: "FaUtensils", name: "Cibo" },
    { value: "FaCar", name: "Auto" },
    { value: "FaRegSmile", name: "Sorriso" },
    { value: "FaHeartbeat", name: "Salute" },
    { value: "FaPlane", name: "Aereo" },
    { value: "FaPiggyBank", name: "Salvadanaio" },
    { value: "FaRegMoneyBillAlt", name: "Banconota" },
    { value: "FaBus", name: "Bus" },
    { value: "FaBolt", name: "Energia" },
    { value: "FaTree", name: "Albero" },
    { value: "FaDumbbell", name: "Fitness" },
    { value: "FaBicycle", name: "Bici" },
    { value: "FaLaptop", name: "Computer" },
    { value: "FaPaw", name: "Animale" },
    { value: "FaRegSun", name: "Sole (Alt)" },
    { value: "FaBeer", name: "Birra" },
    { value: "FaMedkit", name: "Medicina" },
    { value: "FaCameraRetro", name: "Camera Retro" },
    { value: "FaWallet", name: "Portafoglio" },
    { value: "FaShoppingBasket", name: "Cestino Spesa" },
    { value: "FaGlasses", name: "Occhiali" },
    { value: "FaLeaf", name: "Foglia" },
    { value: "FaBook", name: "Libro" },
    { value: "FaTshirt", name: "Tshirt" },
    { value: "FaDog", name: "Cane" },
    { value: "FaCat", name: "Gatto" },

    // Material (Md)
    { value: "MdAttachMoney", name: "Soldi" },
    { value: "MdHealthAndSafety", name: "Sanità" },
    { value: "MdPets", name: "Pet" },
    { value: "MdWork", name: "Lavoro (Alt)" },
    { value: "MdLocalBar", name: "Bar" },
    { value: "MdDirectionsCar", name: "Auto (Alt)" },
    { value: "MdRestaurant", name: "Ristorante" },
    { value: "MdFlight", name: "Aereo (Alt)" },
    { value: "MdHome", name: "Casa (Alt)" },
    { value: "MdSportsSoccer", name: "Calcio" },
    { value: "MdSchool", name: "Scuola" },
    { value: "MdChildCare", name: "Bambino" },
    { value: "MdDirectionsBike", name: "Bici (Alt)" },
    { value: "MdShoppingBag", name: "Borsa Spesa" },
    { value: "MdLocalGroceryStore", name: "Negozio" },
    { value: "MdSavings", name: "Risparmio" },
    { value: "MdChair", name: "Sedia" },
    { value: "MdFastfood", name: "Fast Food" },
    { value: "MdLocalCafe", name: "Caffetteria" },
    { value: "MdLocalHospital", name: "Ospedale" },
    { value: "MdSpa", name: "Spa" },
    { value: "MdBeachAccess", name: "Spiaggia" },
    { value: "MdOutlineSportsHandball", name: "Pallamano" },
    { value: "MdOutlineTrain", name: "Treno" },
    { value: "MdOutlineFlightTakeoff", name: "Decollo" },
    { value: "MdOutlineShoppingCart", name: "Carrello (Alt)" },
] as const;

export const CATEGORY_ICONS_MAP = {
    FiTag,
    FiHome,
    FiTrendingUp,
    FiGift,
    FiBookOpen,
    FiBriefcase,
    FiShoppingCart,
    FiCreditCard,
    FiCoffee,
    FiHeart,
    FiUser,
    FiTruck,
    FiCalendar,
    FiGlobe,
    FiStar,
    FiCamera,
    FiPhone,
    FiDroplet,
    FiBell,
    FiSun,
    FiMoon,

    FaUtensils,
    FaCar,
    FaRegSmile,
    FaHeartbeat,
    FaPlane,
    FaPiggyBank,
    FaRegMoneyBillAlt,
    FaBus,
    FaBolt,
    FaTree,
    FaDumbbell,
    FaBicycle,
    FaLaptop,
    FaPaw,
    FaRegSun,
    FaBeer,
    FaMedkit,
    FaCameraRetro,
    FaWallet,
    FaShoppingBasket,
    FaGlasses,
    FaLeaf,
    FaBook,
    FaTshirt,
    FaDog,
    FaCat,

    MdAttachMoney,
    MdHealthAndSafety,
    MdPets,
    MdWork,
    MdLocalBar,
    MdDirectionsCar,
    MdRestaurant,
    MdFlight,
    MdHome,
    MdSportsSoccer,
    MdSchool,
    MdChildCare,
    MdDirectionsBike,
    MdShoppingBag,
    MdLocalGroceryStore,
    MdSavings,
    MdChair,
    MdFastfood,
    MdLocalCafe,
    MdLocalHospital,
    MdSpa,
    MdBeachAccess,
    MdOutlineSportsHandball,
    MdOutlineTrain,
    MdOutlineFlightTakeoff,
    MdOutlineShoppingCart,
} as const;

export type CategoryIconName = keyof typeof CATEGORY_ICONS_MAP;

export function getIconComponent(name?: CategoryIconName): IconType {
    if (name && CATEGORY_ICONS_MAP[name]) return CATEGORY_ICONS_MAP[name];
    return FiTag;
}
