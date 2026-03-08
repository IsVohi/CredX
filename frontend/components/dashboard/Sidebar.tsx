"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Users,
    ShieldCheck,
    PlusCircle,
    Settings,
    LogOut,
    Building2,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard", roles: ["STUDENT", "ISSUER", "ADMIN"] },
    { icon: Building2, label: "Institution Dashboard", href: "/dashboard/institution", roles: ["ISSUER", "ADMIN"] },
    { icon: Users, label: "Student Dashboard", href: "/dashboard/student", roles: ["STUDENT", "ADMIN"] },
    { icon: PlusCircle, label: "Issue Credential", href: "/dashboard/issue", roles: ["ISSUER", "ADMIN"] },
    { icon: Search, label: "Verify Portal", href: "/dashboard/verification", roles: ["STUDENT", "ISSUER", "ADMIN"] },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchRole = async () => {
            const { data } = await api.get("/auth/me");
            if (data && (data as any).role) {
                setRole((data as any).role);
            }
        };
        fetchRole();
    }, []);

    const handleLogout = () => {
        document.cookie = "credx_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/auth/logout"; // Use Auth0 logout
    };

    const visibleItems = role ? menuItems.filter(item => item.roles.includes(role)) : menuItems.filter(item => item.roles.includes("STUDENT")); // Fallback or wait for role

    return (
        <div className="w-64 h-full border-r border-slate-200 bg-white/50 backdrop-blur-xl flex flex-col p-4">
            <div className="flex items-center gap-2 px-2 mb-10">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/favicon.png" alt="CredX Logo" className="w-10 h-10 object-contain" />
                    <span className="font-bold text-xl tracking-tight text-slate-900">CredX</span>
                </Link>
            </div>

            <nav className="flex-1 flex flex-col gap-1">
                {visibleItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20 font-medium"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            )}
                        >
                            <item.icon size={20} className={cn(isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-1">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all w-full text-left">
                    <Settings size={20} className="text-slate-400" />
                    <span className="text-sm">Settings</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-all w-full text-left font-medium"
                >
                    <LogOut size={20} />
                    <span className="text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
}
