"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function SubPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-primary mb-8 shadow-sm">
                <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4 font-display">Module Implementation in Progress</h1>
            <p className="text-slate-500 text-lg leading-relaxed">
                This view is being connected to the Algorand blockchain and IPFS layer. You will soon be able to manage credentials and verify tokens here.
            </p>
        </div>
    );
}
