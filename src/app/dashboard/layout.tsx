"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ElevenLabsClient } from "@/components/ElevenLabsClient";
import {
    LayoutDashboard,
    Receipt,
    RefreshCw,
    Settings,
    Puzzle
} from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/dashboard/transactions", label: "Transactions", icon: <Receipt size={20} /> },
    { href: "/dashboard/subscriptions", label: "Subscriptions", icon: <RefreshCw size={20} /> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings size={20} /> },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <Link href="/dashboard" className="sidebar-logo">
                    Friction
                </Link>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: "auto", paddingTop: "var(--spacing-xl)" }}>
                    <Link
                        href="#"
                        className="sidebar-link"
                        style={{ marginBottom: "var(--spacing-md)" }}
                    >
                        <span><Puzzle size={20} /></span>
                        <span>Install Extension</span>
                    </Link>

                    <div className="flex items-center gap-md" style={{ padding: "var(--spacing-md)" }}>
                        <UserButton afterSignOutUrl="/" />
                        <span className="text-sm text-secondary">Account</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>

            {/* Conversational AI Agent */}
            <ElevenLabsClient />

        </div>
    );
}
