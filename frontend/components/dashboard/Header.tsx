"use client";

import { Bell, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Header() {
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await api.get("/auth/me");
            if (data) {
                setUser({
                    name: (data as any).name || (data as any).nickname || "User",
                    role: (data as any).role || "User"
                });
            }
        };
        fetchUser();
    }, []);

    return (
        <header className="h-16 border-b border-slate-200 bg-white/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-20">
            <div className="relative w-96 max-w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search for credentials, students..."
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

                <button className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border border-slate-200 hover:bg-slate-100 transition-all">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <User size={18} />
                    </div>
                    <div className="text-left hidden md:block">
                        <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[120px]">
                            {user?.name || "Loading..."}
                        </p>
                        <p className="text-[10px] text-slate-500 leading-none mt-1 uppercase tracking-tight">
                            {user?.role || "..."}
                        </p>
                    </div>
                </button>
            </div>
        </header>
    );
}
