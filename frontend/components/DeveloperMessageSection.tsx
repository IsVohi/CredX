"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";

export default function DeveloperMessageSection() {
    return (
        <section className="py-24 relative overflow-hidden bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Left Column - Message */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
                            A Word from the Developers
                        </h2>

                        <div className="w-12 h-1 bg-primary rounded-full mb-4"></div>

                        <p className="text-lg text-slate-600 leading-relaxed">
                            CredX was built to solve one of the biggest problems in academic verification: <span className="font-semibold text-slate-800">trust</span>.
                        </p>

                        <p className="text-lg text-slate-600 leading-relaxed">
                            Today, institutions and employers rely on slow, manual processes to confirm credentials. CredX replaces this with cryptographic verification powered by the Algorand blockchain.
                        </p>

                        <p className="text-lg text-slate-600 leading-relaxed">
                            By combining decentralized storage, NFT credential standards (ARC-3), and modern authentication systems, CredX enables institutions to issue credentials once and have them verifiable anywhere in the world instantly.
                        </p>
                    </motion.div>

                    {/* Right Column - Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex justify-center md:justify-end"
                    >
                        <motion.div
                            whileHover={{ y: -5, rotateZ: 1 }}
                            className="glass p-8 rounded-3xl shadow-xl border border-white/60 bg-white/70 backdrop-blur-xl w-full max-w-md flex flex-col items-center text-center relative overflow-hidden"
                        >
                            {/* Background accent */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-200/50 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>

                            <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden mb-6 bg-slate-100 flex items-center justify-center">
                                {/* Fallback avatar */}
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=CredXDev&backgroundColor=e2e8f0"
                                    alt="Developer"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-1">Jane Doe</h3>
                            <p className="text-primary font-semibold mb-6">Creator of CredX</p>

                            <p className="text-sm text-slate-500 mb-8 max-w-xs leading-relaxed">
                                Passionate about Web3, identity primitives, and building tools that empower users with data sovereignty.
                            </p>

                            <div className="flex items-center gap-4 border-t border-slate-100 pt-6 w-full justify-center">
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:text-white hover:bg-slate-900 transition-colors shadow-sm border border-slate-200">
                                    <Github size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:text-white hover:bg-blue-600 transition-colors shadow-sm border border-slate-200">
                                    <Linkedin size={18} />
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
