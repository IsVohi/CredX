"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Building2, User, ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import algosdk from "algosdk";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [accountType, setAccountType] = useState<"STUDENT" | "INSTITUTION" | null>(null);
    const [address, setAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkExistingProfile = async () => {
            try {
                const { data } = await api.get("/auth/me");
                if (data && (data as any).role) {
                    router.replace("/dashboard");
                    return;
                }
            } catch (err) {
                console.error("Failed to check existing profile:", err);
            } finally {
                setIsChecking(false);
            }
        };
        checkExistingProfile();
    }, [router]);

    if (isChecking) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

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

        if (accountType === "STUDENT" && !address) {
            setError("Please provide your Algorand wallet address.");
            return;
        }

        if (accountType === "STUDENT" && !algosdk.isValidAddress(address)) {
            setError("Invalid Algorand wallet address format.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const { error: apiError } = await api.post("/auth/complete-profile", {
                name,
                accountType,
                address: accountType === "STUDENT" ? address : undefined
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
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full"
        >
            <motion.div variants={itemVariants} className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6 shadow-glow-sm border border-primary/20">
                    <ShieldCheck size={40} />
                </div>
                <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Complete Profile</h1>
                <p className="text-slate-400 text-lg">Personalize your decentralized experience.</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Role Selection */}
                <motion.div variants={itemVariants} className="space-y-5">
                    <label className="text-sm font-semibold uppercase tracking-wider text-slate-500 ml-1">Account Category</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <button
                            type="button"
                            onClick={() => setAccountType("STUDENT")}
                            className={cn(
                                "flex flex-col gap-4 p-6 rounded-3xl border transition-all text-left group relative overflow-hidden",
                                accountType === "STUDENT"
                                    ? "bg-primary/20 border-primary text-white shadow-glow"
                                    : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10"
                            )}
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                                accountType === "STUDENT" ? "bg-primary text-white" : "bg-slate-800 text-slate-400 group-hover:text-white"
                            )}>
                                <User size={28} />
                            </div>
                            <div>
                                <div className="font-bold text-xl mb-1">Student</div>
                                <div className="text-sm opacity-60 leading-relaxed">Manage and share your verifiable academic records.</div>
                            </div>
                            {accountType === "STUDENT" && (
                                <motion.div
                                    layoutId="active-bg"
                                    className="absolute inset-0 bg-primary/5 -z-10"
                                />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setAccountType("INSTITUTION")}
                            className={cn(
                                "flex flex-col gap-4 p-6 rounded-3xl border transition-all text-left group relative overflow-hidden",
                                accountType === "INSTITUTION"
                                    ? "bg-primary/20 border-primary text-white shadow-glow"
                                    : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10"
                            )}
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                                accountType === "INSTITUTION" ? "bg-primary text-white" : "bg-slate-800 text-slate-400 group-hover:text-white"
                            )}>
                                <Building2 size={28} />
                            </div>
                            <div>
                                <div className="font-bold text-xl mb-1">Institution</div>
                                <div className="text-sm opacity-60 leading-relaxed">Issue and authenticate tamper-proof digital credentials.</div>
                            </div>
                            {accountType === "INSTITUTION" && (
                                <motion.div
                                    layoutId="active-bg"
                                    className="absolute inset-0 bg-primary/5 -z-10"
                                />
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Details Input */}
                <motion.div variants={itemVariants} className="space-y-5">
                    <label className="text-sm font-semibold uppercase tracking-wider text-slate-500 ml-1">
                        {accountType === "INSTITUTION" ? "Official Name" : "Your Full Name"}
                    </label>
                    <div className="relative group">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={accountType === "INSTITUTION" ? "e.g. Harvard University" : "e.g. Alex Johnson"}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
                            required
                        />
                        <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                </motion.div>

                {/* Wallet Address Input for Students */}
                <AnimatePresence>
                    {accountType === "STUDENT" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            variants={itemVariants}
                            className="space-y-5 overflow-hidden"
                        >
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                                    Algorand Wallet Address
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Simulated wallet connect for hackathon
                                        const mockAddr = "HXN2YYVTQRMYNETLO2Y2TVYE472XDTGR7XWQ2QTKE5SCKN7EPO67FEDSPY";
                                        setAddress(mockAddr);
                                    }}
                                    className="text-primary text-xs font-bold hover:underline"
                                >
                                    Connect Pera Wallet (Demo)
                                </button>
                            </div>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your Algorand address (32 chars)"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg font-mono"
                                    required={accountType === "STUDENT"}
                                />
                                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                            <p className="text-[10px] text-slate-500 px-2 leading-relaxed">
                                Your scholarly credentials will be minted to this address as verifiable digital assets (ASAs).
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting || !name || !accountType}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all text-lg"
                >
                    {isSubmitting ? (
                        <Loader2 className="animate-spin" size={24} />
                    ) : (
                        <>
                            Get Started <ChevronRight size={24} />
                        </>
                    )}
                </motion.button>
            </form>

            <motion.p variants={itemVariants} className="text-center mt-12 text-slate-600 text-sm font-medium">
                Verified Security by Auth0 & Algorand
            </motion.p>
        </motion.div>
    );
}
