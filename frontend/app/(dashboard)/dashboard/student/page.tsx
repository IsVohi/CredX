"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap,
    ShieldCheck,
    Download,
    Link as LinkIcon,
    QrCode,
    Search,
    Filter,
    ExternalLink,
    AlertCircle,
    Calendar,
    Building2,
    ArrowRight,
    X,
    Plus,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCodeModal from "@/components/QRCodeModal";

interface CredentialCardProps {
    credential: {
        assetId: number;
        title: string;
        issuer: string;
        issueDate: string;
        status: string;
        program: string;
        documentUrl: string;
    };
    onViewDetails: (cred: any) => void;
    onDownload: (cred: any) => void;
    onShare: (cred: any) => void;
    onShowQR: (cred: any) => void;
}

const CredentialCard = ({ credential, onViewDetails, onDownload, onShare, onShowQR }: CredentialCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <GraduationCap size={28} />
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${credential.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                {credential.status}
            </div>
        </div>

        <div className="flex-grow">
            <h3 className="text-xl font-bold text-slate-900 mb-1 font-display leading-tight">{credential.title}</h3>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                <Building2 size={14} />
                <span className="font-medium">{credential.issuer}</span>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider">Issue Date</span>
                    <span className="text-slate-700 font-bold flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(credential.issueDate).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider">Asset ID</span>
                    <span className="text-slate-700 font-mono font-bold">#{credential.assetId}</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-50">
            <button
                onClick={() => onViewDetails(credential)}
                className="col-span-2 h-10 rounded-xl bg-slate-100 text-slate-900 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all mb-1"
            >
                <Search size={14} />
                View Details
            </button>
            <button
                onClick={() => onDownload(credential)}
                className="h-10 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
            >
                <Download size={14} />
                Download
            </button>
            <button
                onClick={() => onShare(credential)}
                className="h-10 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
            >
                <LinkIcon size={14} />
                Share
            </button>
            <button
                onClick={() => onShowQR(credential)}
                className="h-10 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
            >
                <QrCode size={14} />
                QR Code
            </button>
            <Link href={`/verify?assetId=${credential.assetId}`} className="h-10 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                <ShieldCheck size={14} />
                Verify
            </Link>
        </div>
    </motion.div>
);

import { api } from "@/lib/api";

export default function StudentDashboard() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCredential, setSelectedCredential] = useState<any>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [qrCredential, setQrCredential] = useState<any>(null);

    const verificationUrl = (assetId: number) =>
        `${typeof window !== "undefined" ? window.location.origin : ""}/verify?assetId=${assetId}`;

    const handleDownload = (cred: any) => {
        if (cred.documentUrl) {
            window.open(cred.documentUrl, "_blank", "noopener,noreferrer");
        } else {
            window.open(verificationUrl(cred.assetId), "_blank");
        }
    };

    const handleShare = async (cred: any) => {
        const url = verificationUrl(cred.assetId);
        const text = `Verify my credential: ${cred.title}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: cred.title, text, url });
            } catch {
                navigator.clipboard.writeText(url);
            }
        } else {
            navigator.clipboard.writeText(url);
        }
    };

    const handleShareProfile = () => {
        const url = `${typeof window !== "undefined" ? window.location.origin : ""}/verify`;
        navigator.clipboard.writeText(url);
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 2000);
    };

    useEffect(() => {
        const fetchCredentials = async () => {
            const { data: result, error: apiError } = await api.get("/student/credentials");

            if (apiError) {
                // Check if it's a permission error or missing profile
                const { data: meData } = await api.get("/auth/me");
                if (meData && !(meData as any).role) {
                    router.replace("/onboarding");
                    return;
                }
                setError(apiError);
            } else {
                setData(result);
            }
            setIsLoading(false);
        };

        fetchCredentials();
    }, [router]);

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
                <h3 className="text-xl font-bold text-slate-900 mb-2">Error Loading Credentials</h3>
                <p className="text-slate-500">{error || "User data not found"}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display">My Credentials</h1>
                    <div className="flex flex-col gap-1">
                        <p className="text-slate-500">Welcome, {data.student} • Manage your blockchain-verified profile</p>
                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 bg-slate-50 w-fit px-2 py-1 rounded-lg border border-slate-100">
                            <ShieldCheck size={10} className="text-primary" />
                            {data.address}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search credentials..."
                            className="h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64 transition-all"
                        />
                    </div>
                    <button className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Credentials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.credentials.map((cred: any) => (
                    <CredentialCard
                        key={cred.assetId}
                        credential={cred}
                        onViewDetails={setSelectedCredential}
                        onDownload={handleDownload}
                        onShare={handleShare}
                        onShowQR={setQrCredential}
                    />
                ))}

                {/* Empty State / Add Wallet Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-4 group hover:border-primary/20 hover:bg-slate-50/50 transition-all"
                >
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">Missing a credential?</h4>
                        <p className="text-xs text-slate-500 max-w-[15rem] mx-auto">Contact your institution to issue your degree to your wallet address.</p>
                    </div>
                    <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                        View Wallet Settings
                        <ArrowRight size={14} />
                    </button>
                </motion.div>
            </div>

            {/* Info Section */}
            <div className="mt-8 p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <h3 className="text-2xl font-bold mb-3 font-display">Share your verification Link</h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                            Copy the verification portal link. Share it with employers so they can verify your credentials by entering the Asset ID.
                        </p>
                    </div>
                    <button
                        onClick={handleShareProfile}
                        className="h-14 px-8 rounded-2xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all shadow-xl shadow-black/20 flex items-center gap-2 whitespace-nowrap"
                    >
                        {isSharing ? (
                            <>
                                <CheckCircle2 size={20} className="text-emerald-500" />
                                Copied Link!
                            </>
                        ) : (
                            <>
                                <LinkIcon size={20} />
                                Get Shareable Link
                            </>
                        )}
                    </button>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* QR Code Modal */}
            <AnimatePresence>
                {qrCredential && (
                    <QRCodeModal
                        url={verificationUrl(qrCredential.assetId)}
                        title={qrCredential.title}
                        onClose={() => setQrCredential(null)}
                    />
                )}
            </AnimatePresence>

            {/* Credential Detail Modal */}
            <AnimatePresence>
                {selectedCredential && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCredential(null)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 sm:p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                        <GraduationCap size={32} />
                                    </div>
                                    <button
                                        onClick={() => setSelectedCredential(null)}
                                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="mb-8">
                                    <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-3 ${selectedCredential.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {selectedCredential.status}
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 font-display mb-2">{selectedCredential.title}</h2>
                                    <p className="text-slate-500 font-medium flex items-center gap-2">
                                        <Building2 size={18} />
                                        {selectedCredential.issuer}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Program</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedCredential.program}</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Issue Date</p>
                                        <p className="text-sm font-bold text-slate-900">{new Date(selectedCredential.issueDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Asset ID</p>
                                        <p className="text-sm font-mono font-bold text-slate-900">#{selectedCredential.assetId}</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Blockchain</p>
                                        <p className="text-sm font-bold text-slate-900">Algorand Testnet</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {selectedCredential.documentUrl ? (
                                        <a
                                            href={selectedCredential.documentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-12 px-6 rounded-xl bg-slate-900 text-white font-bold flex items-center gap-2 hover:bg-slate-800 transition-all flex-1 justify-center"
                                        >
                                            <Download size={18} />
                                            Download PDF
                                        </a>
                                    ) : (
                                        <button
                                            onClick={() => handleDownload(selectedCredential)}
                                            className="h-12 px-6 rounded-xl bg-slate-900 text-white font-bold flex items-center gap-2 hover:bg-slate-800 transition-all flex-1 justify-center"
                                        >
                                            <Download size={18} />
                                            View Credential
                                        </button>
                                    )}
                                    <Link
                                        href={`/verify?assetId=${selectedCredential.assetId}`}
                                        className="h-12 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all flex-1 justify-center"
                                    >
                                        <ExternalLink size={18} />
                                        View On-Chain
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
