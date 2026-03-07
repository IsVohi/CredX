"use client";

import { motion, Variants } from "framer-motion";
import { Link2 } from "lucide-react";
import { useState, useEffect } from "react";

// Placeholder icons using recognizable colors until actual SVGs are mapped
const integrations = [
    { name: "Google Drive", color: "bg-green-100 text-green-600", letter: "G" },
    { name: "Figma", color: "bg-pink-100 text-pink-600", letter: "F" },
    { name: "Slack", color: "bg-purple-100 text-purple-600", letter: "S" },
    { name: "Gmail", color: "bg-red-100 text-red-600", letter: "M" },
    { name: "Salesforce", color: "bg-blue-100 text-blue-600", letter: "Sf" },
    { name: "HubSpot", color: "bg-orange-100 text-orange-600", letter: "H" },
    { name: "Intercom", color: "bg-sky-100 text-sky-600", letter: "I" },
    { name: "Calendar", color: "bg-blue-50 text-blue-500", letter: "C" },
];

export default function IntegrationsSection() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
    };

    // Generate random float animation phases for organic feel
    const getRandomFloat = (delay: number) => ({
        y: ["-6px", "6px"],
        transition: {
            y: {
                duration: 2.5 + Math.random(),
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: delay
            }
        }
    });

    return (
        <section id="integrations" className="py-24 relative overflow-hidden bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4"
                    >
                        Connect integrations you use every day
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600"
                    >
                        Export and verify records directly from your existing SaaS ecosystem.
                    </motion.p>
                </div>

                {/* Floating Grid Container */}
                <div className="relative max-w-4xl mx-auto h-[400px] md:h-[500px] flex items-center justify-center">

                    {/* Central Connecting Node */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="absolute z-20 w-24 h-24 rounded-3xl bg-primary shadow-[0_0_40px_-5px_rgba(99,102,241,0.5)] flex items-center justify-center"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                            <span className="font-bold text-2xl">C</span>
                        </div>

                        {/* Pulse rings */}
                        <div className="absolute inset-0 rounded-3xl border border-primary/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <div className="absolute -inset-4 rounded-[2rem] border border-primary/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    </motion.div>

                    {/* Connection Lines (Desktop only for cleaner look) */}
                    <svg className="absolute inset-0 w-full h-full -z-10 hidden md:block opacity-20">
                        <g stroke="currentColor" className="text-slate-400" strokeWidth="1" strokeDasharray="4 4">
                            <line x1="50%" y1="50%" x2="20%" y2="20%" />
                            <line x1="50%" y1="50%" x2="80%" y2="20%" />
                            <line x1="50%" y1="50%" x2="20%" y2="80%" />
                            <line x1="50%" y1="50%" x2="80%" y2="80%" />
                            <line x1="50%" y1="50%" x2="15%" y2="50%" />
                            <line x1="50%" y1="50%" x2="85%" y2="50%" />
                            <line x1="50%" y1="50%" x2="50%" y2="15%" />
                            <line x1="50%" y1="50%" x2="50%" y2="85%" />
                        </g>
                    </svg>

                    {/* Orbiting / Floating Cards */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="absolute inset-0"
                    >
                        {isMounted && integrations.map((app, i) => {
                            // Distribute nodes roughly around the center
                            const angle = (i / integrations.length) * Math.PI * 2;
                            const radiusX = window.innerWidth < 768 ? 120 : 250;
                            const radiusY = window.innerWidth < 768 ? 140 : 180;

                            const left = `calc(50% + ${Math.cos(angle) * radiusX}px - 32px)`;
                            const top = `calc(50% + ${Math.sin(angle) * radiusY}px - 32px)`;

                            return (
                                <motion.div
                                    key={app.name}
                                    variants={item}
                                    style={{ position: 'absolute', left, top }}
                                    className="z-10"
                                >
                                    <motion.div
                                        animate={getRandomFloat(i * 0.2) as any}
                                        whileHover={{ scale: 1.15, zIndex: 30 }}
                                        title={app.name}
                                        className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center justify-center gap-1 cursor-pointer floating-card"
                                    >
                                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${app.color} flex items-center justify-center font-bold text-lg md:text-xl`}>
                                            {app.letter}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
