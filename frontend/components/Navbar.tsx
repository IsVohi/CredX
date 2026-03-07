"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl glass rounded-full px-6 py-4 flex items-center justify-between shadow-sm"
        >
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
                    C
                </div>
                <span className="font-bold text-xl tracking-tight text-foreground">CredX</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <Link href="/#features" className="hover:text-primary transition-colors">Features</Link>
                <Link href="/#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
                <Link href="/institutions" className="hover:text-primary transition-colors">Institutions</Link>
                <Link href="/verify" className="hover:text-primary transition-colors">Verify</Link>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/signin" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-foreground transition-colors">
                    Sign In
                </Link>
                <Link href="/signup" className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                    Get Started
                </Link>
            </div>
        </motion.nav>
    );
}
