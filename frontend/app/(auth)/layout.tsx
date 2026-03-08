"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden py-12">
            {/* Soft background glows matching hero */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-500/10 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-violet-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="z-10 w-full max-w-2xl px-6"
            >
                <div className="flex flex-col items-center mb-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            C
                        </div>
                        <span className="font-extrabold text-3xl tracking-tight text-white">CredX</span>
                    </Link>
                </div>

                <div className="glass-dark p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/10 backdrop-blur-2xl">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
