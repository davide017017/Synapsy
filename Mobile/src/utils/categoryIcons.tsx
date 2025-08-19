// src/utils/categoryIcons.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Category icons per React Native (@expo/vector-icons)
// - Accetta id "semplici" (es. 'shopping', 'car', 'food', …)
// - Accetta anche nomi web (es. 'FiShoppingCart', 'MdRestaurant', …) → normalizza
// - Fallback: pricetag-outline
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";

// ── Spec e mappa base (id → icona RN) ────────────────────────────────────────
type IconSpec = { lib: "ion" | "mi" | "fa5" | "fe"; name: string };

export const CATEGORY_ICON_MAP: Record<string, IconSpec> = {
    tag: { lib: "ion", name: "pricetag-outline" },
    home: { lib: "ion", name: "home-outline" },
    user: { lib: "ion", name: "person-outline" },
    heart: { lib: "ion", name: "heart-outline" },
    star: { lib: "ion", name: "star-outline" },
    calendar: { lib: "ion", name: "calendar-outline" },
    bell: { lib: "ion", name: "notifications-outline" },
    globe: { lib: "ion", name: "globe-outline" },

    shopping: { lib: "ion", name: "cart-outline" },
    cart: { lib: "ion", name: "cart-outline" },
    grocery: { lib: "mi", name: "local-grocery-store" },
    wallet: { lib: "fa5", name: "wallet" },
    creditcard: { lib: "ion", name: "card-outline" },
    money: { lib: "mi", name: "attach-money" },
    savings: { lib: "mi", name: "savings" },

    food: { lib: "mi", name: "restaurant" },
    fastfood: { lib: "mi", name: "fastfood" },
    coffee: { lib: "mi", name: "local-cafe" },
    beer: { lib: "fa5", name: "beer" },

    house: { lib: "ion", name: "home-outline" },
    energy: { lib: "fa5", name: "bolt" },
    light: { lib: "mi", name: "lightbulb-outline" },
    water: { lib: "ion", name: "water-outline" },

    car: { lib: "mi", name: "directions-car" },
    bus: { lib: "fa5", name: "bus" },
    train: { lib: "mi", name: "train" },
    flight: { lib: "mi", name: "flight" },
    bike: { lib: "mi", name: "directions-bike" },

    health: { lib: "mi", name: "health-and-safety" },
    hospital: { lib: "mi", name: "local-hospital" },
    spa: { lib: "mi", name: "spa" },
    fitness: { lib: "fa5", name: "dumbbell" },

    work: { lib: "mi", name: "work" },
    briefcase: { lib: "fe", name: "briefcase" },
    school: { lib: "mi", name: "school" },
    book: { lib: "fe", name: "book-open" },

    game: { lib: "fa5", name: "gamepad" },
    camera: { lib: "ion", name: "camera-outline" },
    phone: { lib: "ion", name: "call-outline" },
    pet: { lib: "mi", name: "pets" },
    leaf: { lib: "fa5", name: "leaf" },
    clothes: { lib: "fa5", name: "tshirt" },
    other: { lib: "fa5", name: "ellipsis-h" },
};

// ── Mappa nomi web → id RN ───────────────────────────────────────────────────
const WEB_ICON_TO_ID: Record<string, string> = {
    // Feather / FontAwesome / Material / Game Icons (dalla tua lista web)
    FiShoppingCart: "shopping",
    FiHome: "home",
    FiCreditCard: "creditcard",
    FiCoffee: "coffee",
    FiGift: "star",
    FiBookOpen: "book",
    FiBriefcase: "briefcase",
    FiHeart: "heart",
    FiUser: "user",
    FiCalendar: "calendar",
    FiGlobe: "globe",
    FiStar: "star",
    FiCamera: "camera",
    FiPhone: "phone",
    FiDroplet: "water",
    FiBell: "bell",
    FiSun: "light",
    FiMoon: "night",
    GiKnifeFork: "food",

    FaUtensils: "food",
    FaCar: "car",
    FaPiggyBank: "savings",
    FaRegMoneyBillAlt: "money",
    FaMoneyBillWave: "money",
    FaChartLine: "work",
    FaBus: "bus",
    FaBolt: "energy",
    FaTree: "leaf",
    FaDumbbell: "fitness",
    FaBicycle: "bike",
    FaLaptop: "work",
    FaPaw: "pet",
    FaRegSun: "light",
    FaBeer: "beer",
    FaMedkit: "health",
    FaCameraRetro: "camera",
    FaWallet: "wallet",
    FaShoppingBasket: "shopping",
    FaGlasses: "other",
    FaLeaf: "leaf",
    FaBook: "book",
    FaTshirt: "clothes",
    FaDog: "pet",
    FaCat: "pet",
    FaEllipsisH: "other",

    MdAttachMoney: "money",
    MdHealthAndSafety: "health",
    MdPets: "pet",
    MdWork: "work",
    MdLocalBar: "beer",
    MdDirectionsCar: "car",
    MdRestaurant: "food",
    MdFlight: "flight",
    MdHome: "home",
    MdSportsSoccer: "game",
    MdSchool: "school",
    MdChildCare: "other",
    MdDirectionsBike: "bike",
    MdShoppingBag: "shopping",
    MdLocalGroceryStore: "grocery",
    MdSavings: "savings",
    MdChair: "other",
    MdFastfood: "fastfood",
    MdLocalCafe: "coffee",
    MdLocalHospital: "hospital",
    MdSpa: "spa",
    MdBeachAccess: "other",
    MdOutlineLightbulb: "light",
    MdOutlineSportsHandball: "game",
    MdOutlineTrain: "train",
    MdOutlineFlightTakeoff: "flight",
    MdOutlineShoppingCart: "shopping",
    PiStudentBold: "school",
};

// ── Normalizza: prova id già valido; poi nomi web; poi nomi IT comuni ───────
export function normalizeCategoryIconId(raw?: string, nameHint?: string): string {
    if (!raw && !nameHint) return "tag";
    const r = (raw || "").trim();
    if (r) {
        const id = r.toLowerCase();
        if (CATEGORY_ICON_MAP[id]) return id;
        if (WEB_ICON_TO_ID[r]) return WEB_ICON_TO_ID[r];
    }
    const n = (nameHint || "").toLowerCase();
    if (n.includes("spesa") || n.includes("supermerc")) return "shopping";
    if (n.includes("casa") || n.includes("affitto")) return "home";
    if (n.includes("bolle") || n.includes("utenze") || n.includes("energia") || n.includes("luce")) return "energy";
    if (n.includes("auto") || n.includes("carb") || n.includes("benz")) return "car";
    if (n.includes("trasport") || n.includes("bus")) return "bus";
    if (n.includes("ristor") || n.includes("cibo") || n.includes("food")) return "food";
    if (n.includes("bar") || n.includes("caff")) return "coffee";
    if (n.includes("salute") || n.includes("medic")) return "health";
    if (n.includes("lavoro") || n.includes("stipend")) return "work";
    return "tag";
}

// ── Renderer unico ───────────────────────────────────────────────────────────
export function renderCategoryIcon(
    rawIdOrWebName?: string,
    props?: { size?: number; color?: string; nameHint?: string },
): React.ReactElement {
    const id = normalizeCategoryIconId(rawIdOrWebName, props?.nameHint);
    const spec = CATEGORY_ICON_MAP[id] || CATEGORY_ICON_MAP["tag"];
    const size = props?.size ?? 18;
    const color = props?.color ?? "#94a3b8";

    switch (spec.lib) {
        case "ion":
            return <Ionicons name={spec.name as any} size={size} color={color} />;
        case "mi":
            return <MaterialIcons name={spec.name as any} size={size} color={color} />;
        case "fa5":
            return <FontAwesome5 name={spec.name as any} size={size} color={color} />;
        case "fe":
            return <Feather name={spec.name as any} size={size} color={color} />;
        default:
            return <Ionicons name="pricetag-outline" size={size} color={color} />;
    }
}
