"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap,
    ShieldCheck,
    Download,
    Link as LinkIcon,
    Search,
    ExternalLink,
    AlertCircle,
    Calendar,
    Building2,
    User,
    ArrowLeft,
    Share2,
    CheckCircle2,
    Globe,
    Cpu
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function CredentialDetailPage() {
    const params = useParams();
    const assetId = params.assetId;

    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSharing, setIsSharing] = useState(false);

    useEffect(() => {
        const fetchCredential = async () => {
            const { data: result, error: apiError } = await api.get(`/credentials/${assetId}`);

            if (apiError) {
                setError(apiError);
            } else {
                setData(result);
            }
            setIsLoading(false);
        };

        if (assetId) fetchCredential();
    }, [assetId]);

    const handleShare = () => {
        const url = `${window.location.origin}/verify?assetId=${assetId}`;
        navigator.clipboard.writeText(url);
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Credential Not Found</h3>
                <p className="text-slate-500 max-w-sm">{error || "The requested credential could not be retrieved from the blockchain."}</p>
                <Link href="/dashboard" className="mt-6 text-primary font-bold flex items-center gap-2 hover:underline">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const { metadata, onChainStatus, creator, documentUrl } = data;

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8">
                <ArrowLeft size={16} />
                Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Header Section */}
                    <div className="glass p-8 sm:p-10 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
                            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-inner">
                                <GraduationCap size={40} />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border ${onChainStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                                    }`}>
                                    {onChainStatus}
                                </div>
                                <div className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-slate-50 text-slate-600 border border-slate-100">
                                    Algorand Testnet
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold text-slate-900 font-display leading-tight mb-4">
                                {metadata?.name || "Academic Credential"}
                            </h1>
                            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
                                {metadata?.description || "Verified proof of academic achievement issued via the CredX Network."}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-8 border-t border-slate-50">
                            <a
                                href={documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                            >
                                <Download size={20} />
                                Download PDF
                            </a>
                            <button
                                onClick={handleShare}
                                className="h-14 px-8 rounded-2xl border border-slate-200 text-slate-600 font-bold flex items-center gap-3 hover:bg-slate-50 transition-all relative overflow-hidden"
                            >
                                <AnimatePresence mode="wait">
                                    {isSharing ? (
                                        <motion.span
                                            key="check"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            className="flex items-center gap-2 text-emerald-600"
                                        >
                                            <CheckCircle2 size={20} />
                                            Copied!
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="share"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <Share2 size={20} />
                                            Share Link
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>

                    {/* Metadata Details */}
                    <div className="glass p-8 sm:p-10 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-8 font-display">Credential Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Institution</p>
                                        <p className="text-slate-900 font-bold">{metadata?.properties?.issuer_name || "Official Issuer"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Student</p>
                                        <p className="text-slate-900 font-bold">{metadata?.properties?.student_name || "Verified Student"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                        <Search size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Program</p>
                                        <p className="text-slate-900 font-bold">{metadata?.properties?.program_name || "Academic Program"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Date</p>
                                        <p className="text-slate-900 font-bold">
                                            {metadata?.properties?.issued_timestamp ? new Date(metadata.properties.issued_timestamp).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Blockchain Card */}
                    <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden shadow-xl shadow-slate-200">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <Cpu size={24} className="text-primary" />
                                <h3 className="text-lg font-bold font-display">On-Chain Info</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Asset ID</p>
                                    <p className="font-mono text-primary font-bold text-lg">#{assetId}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Creator Wallet</p>
                                    <p className="font-mono text-xs text-slate-400 truncate break-all bg-white/5 p-3 rounded-xl border border-white/5">
                                        {creator}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Verification Contract</p>
                                    <p className="font-mono text-xs text-slate-400 p-3 rounded-xl bg-white/5 border border-white/5">
                                        APP ID: 1004523
                                    </p>
                                </div>
                            </div>

                            <a
                                title="View on Pera Explorer"
                                href={`https://testnet.explorer.perawallet.app/asset/${assetId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-12 mt-10 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all border border-white/10"
                            >
                                <ExternalLink size={16} />
                                View on Pera Explorer
                            </a>
                        </div>

                        {/* Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
                    </div>

                    {/* IPFS Card */}
                    <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200/60 shadow-inner">
                        <div className="flex items-center gap-3 mb-6">
                            <Globe size={24} className="text-slate-400" />
                            <h3 className="text-lg font-bold text-slate-900 font-display">IPFS Decentralized Storage</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                            This credential's metadata and documents are stored on the InterPlanetary File System (IPFS), ensuring that the content remains accessible and permanent regardless of individual server uptime.
                        </p>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Metadata Hash</p>
                            <p className="text-[10px] font-mono text-slate-600 break-all leading-relaxed">
                                {data.metadataCid || "QmVskvD3mJ...8w9vY"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
