"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    QrCode,
    ShieldCheck,
    ShieldAlert,
    ShieldX,
    Loader2,
    CheckCircle2,
    ExternalLink,
    Building2,
    Calendar,
    GraduationCap,
    Download,
    ArrowRight
} from "lucide-react";

import { api } from "@/lib/api";
import QRScanner from "@/components/QRScanner";

import { useRouter } from "next/navigation";

// Separate component for search params handling
function VerificationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await api.get("/auth/me");
            if (data && (data as any).role) {
                const assetIdParam = searchParams.get("assetId");
                const target = assetIdParam
                    ? `/dashboard/verification?assetId=${assetIdParam}`
                    : "/dashboard/verification";
                router.replace(target);
            }
        };
        checkAuth();
    }, []);

    const [assetId, setAssetId] = useState(searchParams.get("assetId") || "");
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [showScanner, setShowScanner] = useState(false);

    const parseScannedValue = (value: string): string => {
        const trimmed = value.trim();
        const match = trimmed.match(/assetId=(\d+)/);
        if (match) return match[1];
        if (/^\d+$/.test(trimmed)) return trimmed;
        try {
            const url = new URL(trimmed);
            return url.searchParams.get("assetId") || trimmed;
        } catch {
            return trimmed;
        }
    };

    const handleVerify = async (id: string) => {
        if (!id) return;
        setIsVerifying(true);
        setError(null);
        setResult(null);

        const { data: verifyData, error: verifyError } = await api.get(`/credentials/${id}/verify`);

        if (verifyError) {
            setError(verifyError);
            setIsVerifying(false);
            return;
        }

        const { data: detailData, error: detailError } = await api.get(`/credentials/${id}`);

        if (detailError) {
            setError(detailError);
        } else {
            setResult({
                ...(verifyData as any),
                details: detailData
            });
        }
        setIsVerifying(false);
    };

    useEffect(() => {
        const id = searchParams.get("assetId");
        if (id) {
            setAssetId(id);
            handleVerify(id);
        }
    }, [searchParams]);

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-4">
                    <ShieldCheck size={32} />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 font-display mb-4">Trust Verification Portal</h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                    Instantly verify the authenticity of any CredX academic credential using its unique Algorand Asset ID.
                </p>
            </div>

            {/* Verification Form */}
            <div className="glass p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-xl mb-12">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Enter Asset ID (e.g. 54201)"
                            value={assetId}
                            onChange={(e) => setAssetId(e.target.value)}
                            className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-mono font-bold"
                        />
                    </div>
                    <button
                        onClick={() => handleVerify(assetId)}
                        disabled={isVerifying || !assetId}
                        className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
                    >
                        {isVerifying ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                        Verify Authenticity
                    </button>
                    <button
                        onClick={() => setShowScanner(true)}
                        className="h-14 w-14 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all shrink-0"
                        title="Scan QR Code"
                    >
                        <QrCode size={24} />
                    </button>
                </div>
            </div>

            {/* Results Area */}
            <AnimatePresence mode="wait">
                {isVerifying && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-slate-900">Validating On-Chain Records...</h3>
                        <p className="text-slate-500">Connecting to Algorand verification network...</p>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-10 rounded-[2.5rem] border border-red-100 bg-red-50/30 text-center"
                    >
                        <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h2>
                        <p className="text-slate-600 mb-6">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="text-primary font-bold hover:underline"
                        >
                            Try another ID
                        </button>
                    </motion.div>
                )}

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Result Banner */}
                        <div className={`glass p-8 rounded-[2.5rem] border-2 text-center shadow-lg ${result.status === 'VALID'
                            ? 'border-emerald-200 bg-emerald-50/50'
                            : 'border-amber-200 bg-amber-50/50'
                            }`}>
                            {result.status === 'VALID' ? (
                                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            ) : (
                                <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                            )}
                            <h2 className="text-3xl font-extrabold text-slate-900 font-display mb-1 underline decoration-emerald-500/30 underline-offset-8">
                                STATUS: {result.status}
                            </h2>
                            <p className="text-slate-600 font-medium">Verified by CredX Smart Contract Consensus</p>
                        </div>

                        {/* Credential Details */}
                        {result.status === 'VALID' && (
                            <div className="glass p-10 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8">
                                    <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-inner">
                                        <GraduationCap size={40} />
                                    </div>
                                </div>

                                <div className="mb-10 max-w-lg">
                                    <h3 className="text-3xl font-bold text-slate-900 font-display mb-3">
                                        {result.details.metadata?.name || "Official Credential"}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed font-medium">
                                        {result.details.metadata?.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 pt-10 border-t border-slate-50">
                                    <div>
                                        <div className="flex items-center gap-3 text-slate-400 mb-4 font-bold text-[10px] uppercase tracking-widest">
                                            <Building2 size={16} /> Issuer
                                        </div>
                                        <p className="text-lg font-bold text-slate-900">{result.details.metadata?.properties?.issuer_name || "N/A"}</p>
                                        <p className="text-xs font-mono text-slate-400 break-all mt-2 truncate bg-slate-50 p-2 rounded-lg">{result.details.creator || "Unknown Creator"}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 text-slate-400 mb-4 font-bold text-[10px] uppercase tracking-widest">
                                            <Calendar size={16} /> Issue Date
                                        </div>
                                        <p className="text-lg font-bold text-slate-900">
                                            {result.details.metadata?.properties?.issued_timestamp
                                                ? new Date(result.details.metadata.properties.issued_timestamp).toLocaleDateString()
                                                : "N/A"}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-xs font-bold text-emerald-600">On-Chain Verified</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a
                                        href={result.details.documentUrl}
                                        target="_blank"
                                        className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all flex-grow shadow-lg"
                                    >
                                        <Download size={20} />
                                        View Original Document
                                    </a>
                                    <a
                                        href={`https://testnet.explorer.perawallet.app/asset/${assetId}`}
                                        target="_blank"
                                        className="h-14 px-8 rounded-2xl border border-slate-200 text-slate-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all flex-grow"
                                    >
                                        <ExternalLink size={20} />
                                        Verify on Explorer
                                    </a>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Security Explanation */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center mb-4">
                        <ShieldCheck size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Immutable Record</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Data is hashed and signed on Algorand. Once issued, certifications cannot be altered by anyone.
                    </p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center mb-4">
                        <Building2 size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Verified Issuers</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Only verified educational institutions with cryptographically linked wallets can issue credentials.
                    </p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                        <ArrowRight size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Instant Validation</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Validation happens in seconds through direct smart contract consensus, eliminating manual checks.
                    </p>
                </div>
            </div>
            {/* Real QR Scanner */}
            {showScanner && (
                <QRScanner
                    onScan={(decodedText) => {
                        const assetId = parseScannedValue(decodedText);
                        setAssetId(assetId);
                        handleVerify(assetId);
                        setShowScanner(false);
                    }}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </div>
    );
}

export default function VerificationPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        }>
            <VerificationContent />
        </Suspense>
    );
}
