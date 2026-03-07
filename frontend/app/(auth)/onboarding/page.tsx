"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Building2, User, ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [accountType, setAccountType] = useState<"STUDENT" | "INSTITUTION" | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fade in animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !accountType) {
            setError("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const { error: apiError } = await api.post("/auth/complete-profile", {
                name,
                accountType
            });

            if (apiError) {
                setError(apiError);
            } else {
                router.replace("/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                className="w-full max-w-xl z-10"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="glass shadow-2xl rounded-3xl p-8 md:p-12 border border-white/10">
                    <motion.div variants={itemVariants} className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-6 shadow-glow">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Complete Your Profile</h1>
                        <p className="text-slate-400">Tell us a bit more about how you'll use CredX.</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Name Input */}
                        <motion.div variants={itemVariants} className="space-y-3">
                            <label className="text-sm font-medium text-slate-300 ml-1">
                                {accountType === "INSTITUTION" ? "Institution Name" : "Full Name"}
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={accountType === "INSTITUTION" ? "e.g. Stanford University" : "e.g. John Doe"}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                required
                            />
                        </motion.div>

                        {/* Role Selection */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <label className="text-sm font-medium text-slate-300 ml-1">I am a...</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setAccountType("STUDENT")}
                                    className={cn(
                                        "flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group",
                                        accountType === "STUDENT"
                                            ? "bg-primary/20 border-primary text-white shadow-glow-sm"
                                            : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-900/60"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                        accountType === "STUDENT" ? "bg-primary text-white" : "bg-slate-800 text-slate-500 group-hover:text-slate-300"
                                    )}>
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Student</div>
                                        <div className="text-xs opacity-60">Verify & share my credentials</div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setAccountType("INSTITUTION")}
                                    className={cn(
                                        "flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group",
                                        accountType === "INSTITUTION"
                                            ? "bg-primary/20 border-primary text-white shadow-glow-sm"
                                            : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-900/60"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                        accountType === "INSTITUTION" ? "bg-primary text-white" : "bg-slate-800 text-slate-500 group-hover:text-slate-300"
                                    )}>
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Institution</div>
                                        <div className="text-xs opacity-60">Issue verifiable credentials</div>
                                    </div>
                                </button>
                            </div>
                        </motion.div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting || !name || !accountType}
                            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/25 flex items-center justify-center gap-2 transition-all"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Complete Setup <ChevronRight size={20} />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>

                <motion.p variants={itemVariants} className="text-center mt-8 text-slate-500 text-sm">
                    Protected by Auth0 Security & Algorand Blockchain
                </motion.p>
            </motion.div>
        </div>
    );
}
