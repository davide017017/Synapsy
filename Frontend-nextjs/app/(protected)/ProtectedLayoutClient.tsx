"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./layout-components/Sidebar";
import Header from "./layout-components/Header";
import { useSidebar } from "@/context/GlobalContextProvider";

export default function ProtectedLayoutClient({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const { isCollapsed } = useSidebar();
    const router = useRouter();

    /* redirect se non loggato */
    useEffect(() => {
        if (status === "unauthenticated") router.replace("/login");
    }, [status, router]);

    /* loading.tsx si occupa dello skeleton */
    if (status === "loading" || status === "unauthenticated") return null;

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isCollapsed ? "md:pl-0" : "md:pl-56"}`}>
                <Header />
                <main className="flex-1 p-4">{children}</main>
            </div>
        </div>
    );
}
