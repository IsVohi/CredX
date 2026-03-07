"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    Building2,
    CheckCircle2,
    FileText,
    ArrowRight,
    Loader2,
    Globe,
    ShieldCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Institution {
    id: string;
    name: string;
    logo: string;
    status: string;
    credentialsIssued: number;
    address: string;
    reputation: number;
}

import { api } from "@/lib/api";

export default function InstitutionsDirectory() {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInstitutions = async () => {
            const { data, error: apiError } = await api.get("/institutions");

            if (apiError) {
                setError(apiError);
            } else if (data) {
                setInstitutions(data as Institution[]);
            }
            setIsLoading(false);
        };
        fetchInstitutions();
    }, []);

    const filteredInstitutions = institutions.filter(inst =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-widest uppercase mb-6"
                >
                    <Building2 size={14} />
                    Verified Network
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl font-extrabold text-slate-900 font-display mb-6"
                >
                    Trusted Institutions
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed"
                >
                    Explore the network of universities, colleges, and certification bodies that issue blockchain-verified credentials on the CredX Network.
                </motion.p>
            </div>

            {/* Search & Filter */}
            <div className="glass p-6 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-xl mb-12">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search universities or organizations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                        />
                    </div>
                    <button className="h-14 px-8 rounded-2xl border border-slate-200 text-slate-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                        <Filter size={20} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredInstitutions.map((inst, index) => (
                    <motion.div
                        key={inst.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass group p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className="w-16 h-16 rounded-2xl border border-slate-100 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                                <img
                                    src={inst.logo}
                                    alt={inst.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-wider uppercase border border-emerald-100">
                                    <ShieldCheck size={12} />
                                    {inst.status}
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display group-hover:text-primary transition-colors">
                                {inst.name}
                            </h3>
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                                <Globe size={14} />
                                <span className="font-mono text-xs">{inst.address.substring(0, 10)}...{inst.address.slice(-6)}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issued</p>
                                    <p className="text-xl font-bold text-slate-900">{inst.credentialsIssued.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reputation</p>
                                    <div className="flex items-center justify-end gap-1 text-emerald-500 font-bold">
                                        {inst.reputation || 0.0}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={`/verify?issuer=${inst.id}`}
                            className="h-12 w-full rounded-xl bg-slate-50 group-hover:bg-slate-900 group-hover:text-white text-slate-900 font-bold flex items-center justify-center gap-2 transition-all mt-8"
                        >
                            View Credentials
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                ))}
            </div>

            {filteredInstitutions.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-slate-500 text-lg">No institutions found matching your search.</p>
                </div>
            )}
        </div>
    );
}
