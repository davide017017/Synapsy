export type SidebarContextType = {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    // Menu mobile (Depth + Synapse)
    isMobileOpen: boolean;
    openMobile: () => void;
    closeMobile: () => void;
};
