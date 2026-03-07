"use client";

import { motion, Variants } from "framer-motion";
import { Building, Shield, Wallet, QrCode } from "lucide-react";

const steps = [
    {
        title: "Institution Issues Credential",
        description: "Institutions upload credential data and mint a blockchain credential NFT.",
        icon: Building,
        color: "bg-blue-50 text-blue-500",
    },
    {
        title: "Credential Stored Securely",
        description: "Credential metadata is stored on Algorand and documents are stored on IPFS.",
        icon: Shield,
        color: "bg-emerald-50 text-emerald-500",
    },
    {
        title: "Student Owns Credential",
        description: "Students receive their credential NFT in their wallet.",
        icon: Wallet,
        color: "bg-violet-50 text-violet-500",
    },
    {
        title: "Instant Verification",
        description: "Employers verify credentials instantly using blockchain verification.",
        icon: QrCode,
        color: "bg-amber-50 text-amber-500",
    }
];

export default function HowItWorksSection() {
    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } }
    };

    return (
        <section id="how-it-works" className="py-24 relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4"
                    >
                        How CredX Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600"
                    >
                        A seamless, decentralized flow from issuance to verification.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative grid grid-cols-1 md:grid-cols-4 gap-8"
                >
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[60px] left-[12%] right-[12%] h-0.5 bg-slate-100 -z-10">
                        <motion.div
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-primary via-indigo-400 to-accent"
                        />
                    </div>

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            whileHover={{ y: -8 }}
                            className="relative flex flex-col items-center text-center group"
                        >
                            <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-sm border border-slate-100 bg-white z-10 transition-transform group-hover:scale-110 duration-300`}>
                                <step.icon size={32} strokeWidth={1.5} />
                            </div>
                            <div className="glass p-6 rounded-2xl shadow-sm border border-slate-100 bg-white/50 w-full h-full flex flex-col items-center">
                                <div className="text-sm font-bold text-slate-400 mb-2 tracking-widest uppercase">Step {i + 1}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
