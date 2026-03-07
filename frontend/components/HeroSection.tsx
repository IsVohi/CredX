"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";

export default function HeroSection() {
    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } }
    };

    // Floating animation for decorative UI cards
    const floatAnim1 = {
        y: ["-10px", "10px"],
        transition: {
            y: { duration: 3.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
        }
    };

    const floatAnim2 = {
        y: ["15px", "-15px"],
        transition: {
            y: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }
        }
    };

    return (
        <section className="relative min-h-[95vh] w-full flex flex-col items-center justify-center pt-20 pb-10 overflow-hidden bg-slate-50">
            {/* Background Soft Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-indigo-200/40 rounded-full blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-[35rem] h-[35rem] bg-violet-200/40 rounded-full blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-[45rem] h-[45rem] bg-sky-200/40 rounded-full blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Decorative Floating Glass Cards */}
            <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none hidden lg:block z-0">
                <motion.div
                    animate={floatAnim1 as any}
                    className="absolute top-1/3 left-10 glass p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex items-center gap-4 bg-white/60 backdrop-blur-xl"
                >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Credential</p>
                        <p className="text-sm font-bold text-slate-800">Verified • MIT</p>
                    </div>
                </motion.div>

                <motion.div
                    animate={floatAnim2 as any}
                    className="absolute bottom-1/4 right-10 glass p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex items-center gap-4 bg-white/60 backdrop-blur-xl"
                >
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Identity</p>
                        <p className="text-sm font-bold text-slate-800">100% Match</p>
                    </div>
                </motion.div>
            </div>

            {/* Main Content */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="z-10 text-center max-w-4xl px-4 flex flex-col items-center relative"
            >
                <motion.div variants={item} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-10 shadow-sm border border-slate-200/60 bg-white/80 backdrop-blur-xl">
                    <ShieldCheck size={18} className="text-primary" />
                    <span className="text-sm font-semibold text-slate-700 tracking-wide">The New Standard in Verification</span>
                </motion.div>

                <motion.h1 variants={item} className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                    Verify Academic <br />
                    Credentials <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-accent relative inline-block pb-2">
                        Instantly.
                        <svg className="absolute w-full h-3 -bottom-0 left-0 text-indigo-300/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                    </span>
                </motion.h1>

                <motion.p variants={item} className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                    Issue, own, and verify academic documents with cryptographic certainty on the Algorand blockchain. <span className="font-medium text-slate-700">No more manual confirmations.</span>
                </motion.p>

                <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                    <button className="h-14 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(15,23,42,0.6)] hover:-translate-y-1 w-full sm:w-auto text-lg">
                        Start Issuing
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </button>

                    <button className="h-14 px-8 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-semibold flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 w-full sm:w-auto border border-slate-200 text-lg">
                        Verify a Document
                    </button>
                </motion.div>

                <motion.div variants={item} className="mt-20 pt-8 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-sm text-slate-500 font-medium opacity-80">
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <span>Powered by Algorand</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary/70"></div>
                        <span>ARC-3 NFT Standard</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                        <span>IPFS Storage</span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
