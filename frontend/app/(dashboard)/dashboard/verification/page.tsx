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
    Volume2,
    Play,
    Pause,
    Sparkles
} from "lucide-react";

import { api } from "@/lib/api";
import QRScanner from "@/components/QRScanner";

function VerificationContent() {
    const searchParams = useSearchParams();
    const [assetId, setAssetId] = useState(searchParams.get("assetId") || "");
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [showScanner, setShowScanner] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const handlePlayAudio = async (id: string) => {
        if (isPlaying && audio) {
            audio.pause();
            setIsPlaying(false);
            return;
        }

        setIsPlaying(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
            const audioUrl = `${baseUrl}/credentials/${id}/audio`;
            const newAudio = new Audio(audioUrl);
            newAudio.onended = () => setIsPlaying(false);
            newAudio.onerror = () => {
                setIsPlaying(false);
                const msg = new SpeechSynthesisUtterance();
                msg.text = `Verified credential for ${result.details.metadata?.name}. Issued by ${result.details.metadata?.properties?.issuer_name}.`;
                window.speechSynthesis.speak(msg);
            };
            setAudio(newAudio);
            newAudio.play();
        } catch (err) {
            setIsPlaying(false);
        }
    };

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
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 font-display">Verification Center</h1>
                <p className="text-slate-500">Securely verify credentials on the Algorand blockchain.</p>
            </div>

            {/* Verification Form */}
            <div className="glass p-6 rounded-[2rem] bg-white border border-slate-200/60 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Enter Asset ID"
                            value={assetId}
                            onChange={(e) => setAssetId(e.target.value)}
                            className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-mono font-bold text-sm"
                        />
                    </div>
                    <button
                        onClick={() => handleVerify(assetId)}
                        disabled={isVerifying || !assetId}
                        className="h-12 px-6 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        {isVerifying ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                        Verify
                    </button>
                    <button
                        onClick={() => setShowScanner(true)}
                        className="h-12 w-12 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all shrink-0"
                    >
                        <QrCode size={20} />
                    </button>
                </div>
            </div>

            {/* Results Area */}
            <AnimatePresence mode="wait">
                {isVerifying && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                    >
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">Validating...</h3>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-8 rounded-[2rem] border border-red-100 bg-red-50/30 text-center"
                    >
                        <ShieldX className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Verification Failed</h2>
                        <p className="text-sm text-slate-600 mb-4">{error}</p>
                        <button onClick={() => setError(null)} className="text-primary text-sm font-bold hover:underline">
                            Try another ID
                        </button>
                    </motion.div>
                )}

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Result Banner */}
                        <div className={`glass p-6 rounded-[2rem] border-2 text-center flex items-center justify-center gap-4 ${result.status === 'VALID' ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/50'
                            }`}>
                            {result.status === 'VALID' ? (
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            ) : (
                                <ShieldAlert className="w-8 h-8 text-amber-500" />
                            )}
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900 font-display">
                                    STATUS: {result.status}
                                </h2>
                                <p className="text-xs text-slate-600 font-medium">Verified by Algorand Consensus</p>
                            </div>
                            <button
                                onClick={() => handlePlayAudio(assetId)}
                                className={`ml-auto flex items-center gap-2 px-4 h-10 rounded-xl font-bold transition-all ${isPlaying
                                    ? "bg-slate-900 text-white"
                                    : "bg-white text-slate-900 border border-slate-200 hover:border-primary/40"
                                    }`}
                            >
                                {isPlaying ? (
                                    <Pause size={16} className="animate-pulse" />
                                ) : (
                                    <Volume2 size={16} className="text-primary" />
                                )}
                                {isPlaying ? "Listening..." : "Listen"}
                            </button>
                        </div>

                        {/* Credential Details */}
                        {/* Credential Details */}
                        {result.status === 'VALID' && (
                            <>
                                <div className="glass p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm relative overflow-hidden text-sm">
                                    <div className="absolute top-0 right-0 p-6 opacity-10">
                                        <img src="/favicon.png" alt="Logo" className="w-24 h-24 object-contain grayscale" />
                                    </div>

                                    <div className="mb-8 relative z-10">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                            {result.details.metadata?.name || "Official Credential"}
                                        </h3>
                                        <p className="text-slate-500 max-w-lg">
                                            {result.details.metadata?.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pt-6 border-t border-slate-50 relative z-10">
                                        <div>
                                            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1 flex items-center gap-2">
                                                <Building2 size={12} /> Issuer
                                            </div>
                                            <p className="font-bold text-slate-900">{result.details.metadata?.properties?.issuer_name || "N/A"}</p>
                                            <p className="text-[10px] font-mono text-slate-400 truncate mt-1">{result.details.creator}</p>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1 flex items-center gap-2">
                                                <Calendar size={12} /> Issued On
                                            </div>
                                            <p className="font-bold text-slate-900">
                                                {result.details.metadata?.properties?.issued_timestamp
                                                    ? new Date(result.details.metadata.properties.issued_timestamp).toLocaleDateString()
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* --- AI INSIGHTS SECTION --- */}
                                {result.aiInsights && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-8 p-5 rounded-2xl bg-slate-900 text-white relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5">
                                            <Sparkles size={80} className="text-primary" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-4">
                                                <Sparkles size={12} /> AI Insight Analysis
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Authenticity</div>
                                                    <div className="text-lg font-bold font-mono text-primary">{result.aiInsights.confidenceScore}%</div>
                                                </div>
                                                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Category</div>
                                                    <div className="text-sm font-bold truncate">{result.aiInsights.category}</div>
                                                </div>
                                            </div>

                                            <p className="text-[11px] text-slate-300 leading-relaxed italic p-3 rounded-xl bg-primary/5 border border-primary/10">
                                                "{result.aiInsights.analysisSummary}"
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                                {/* --------------------------- */}

                                <div className="flex gap-4 relative z-10">
                                    <a
                                        href={result.details.documentUrl}
                                        target="_blank"
                                        className="h-12 px-6 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all flex-grow shadow-lg"
                                    >
                                        <Download size={18} />
                                        Document
                                    </a>
                                    <a
                                        href={`https://testnet.explorer.perawallet.app/asset/${assetId}`}
                                        target="_blank"
                                        className="h-12 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all flex-grow"
                                    >
                                        <ExternalLink size={18} />
                                        Pera Explorer
                                    </a>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence >

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
        </div >
    );
}

export default function VerificationPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[40vh]"><Loader2 className="animate-spin text-primary" size={32} /></div>}>
            <VerificationContent />
        </Suspense>
    );
}
