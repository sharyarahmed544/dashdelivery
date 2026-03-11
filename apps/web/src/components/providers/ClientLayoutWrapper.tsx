"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/ui/Nav";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Cursor from "@/components/ui/Cursor";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    return (
        <>
            {!isAdmin && <ThemeToggle />}
            {!isAdmin && <Nav />}
            {children}
            {!isAdmin && <Cursor />}
        </>
    );
}
