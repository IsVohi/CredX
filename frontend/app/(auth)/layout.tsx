"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden pb-48">
            {/* Soft background glows matching hero */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-indigo-100/40 rounded-full blur-3xl opacity-70 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-violet-100/40 rounded-full blur-3xl opacity-70 animate-pulse delay-700"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-md px-6"
            >
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                            C
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-slate-900">CredX</span>
                    </Link>
                </div>

                <div className="glass p-8 rounded-[2rem] shadow-xl border border-white/60 bg-white/70 backdrop-blur-xl">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
