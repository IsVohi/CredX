"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function TestimonialsSection() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
    };

    return (
        <section className="py-24 relative overflow-hidden bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4"
                    >
                        People just like you are already using CredX
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600 max-w-2xl mx-auto"
                    >
                        Join hundreds of institutions securing their credentials on our decentralized network.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6"
                >
                    {/* Card 1: Large Featured */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
                        className="md:col-span-8 bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-slate-100 flex flex-col justify-between"
                        style={{ perspective: 1000 }}
                    >
                        <p className="text-xl md:text-2xl text-slate-700 italic mb-10 leading-relaxed font-serif relative z-10">
                            "CredX eliminated our manual verification backlog completely. We now instantly issue degrees directly to our students' wallets and our alumni love having absolute control over their academic passport."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full border-2 border-indigo-100 bg-indigo-50 flex items-center justify-center font-bold text-indigo-500 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ`} alt="Sarah" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">Dr. Sarah Jenkins</h4>
                                <p className="text-sm text-slate-500">Registrar, Future University</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Small Grid Item */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -5, rotateZ: 1 }}
                        className="md:col-span-4 bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-indigo-100/50 flex flex-col justify-between"
                    >
                        <div className="flex mb-6">
                            {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-amber-400 text-lg">★</span>)}
                        </div>
                        <p className="text-slate-600 mb-8 relative z-10">
                            "Verifying candidates used to take weeks of emails. Now, I just scan a QR code and know their degree is 100% authentic."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center font-bold text-slate-500 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelR`} alt="Michael" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Michael Ross</h4>
                                <p className="text-xs text-slate-500">HR Director, TechCorp</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3: Video Element Mock */}
                    <motion.div
                        variants={item}
                        whileHover={{ scale: 1.02 }}
                        className="md:col-span-5 relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex items-center justify-center bg-slate-200 min-h-[300px]"
                    >
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center"></div>
                        <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/40 transition-colors"></div>
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white z-10 border border-white/50 group-hover:scale-110 transition-transform cursor-pointer">
                            <Play fill="currentColor" size={24} className="ml-1" />
                        </div>
                        <div className="absolute bottom-6 left-6 z-10 text-white">
                            <p className="font-bold text-lg">Watch their story</p>
                            <p className="text-sm opacity-80">Stanford Global Program</p>
                        </div>
                    </motion.div>

                    {/* Card 4: Normal */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -5, rotateZ: -1 }}
                        className="md:col-span-7 bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-slate-100 flex flex-col justify-between"
                    >
                        <p className="text-lg text-slate-700 mb-8 relative z-10 leading-relaxed font-medium">
                            "Having my certifications in my own digital wallet gives me total control over my resume. No more paying transcript fees or dealing with terrible university portals."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-slate-200 bg-rose-50 flex items-center justify-center overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaR`} alt="Elena" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 font-sm">Elena Rodriguez</h4>
                                <p className="text-xs text-slate-500">Software Engineer</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
