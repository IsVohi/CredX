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
    ArrowRight,
    Volume2,
    Play,
    Pause,
    Music,
    Sparkles
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
    const [lookupAddress, setLookupAddress] = useState(searchParams.get("address") || "");
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [addressResult, setAddressResult] = useState<any>(null);
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
                // Fallback to browser TTS if backend fails/no key
                const msg = new SpeechSynthesisUtterance();
                msg.text = `Verified credential for ${result.details.metadata?.name}. Issued by ${result.details.metadata?.properties?.issuer_name}. Status: VALID.`;
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
        setAddressResult(null);

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

    const handleAddressLookup = async (address: string) => {
        if (!address) return;
        setIsVerifying(true);
        setError(null);
        setResult(null);
        setAddressResult(null);

        const { data, error: apiError } = await api.get(`/credentials/student/${address}`);

        if (apiError) {
            setError(apiError);
        } else {
            setAddressResult(data);
        }
        setIsVerifying(false);
    };

    useEffect(() => {
        const id = searchParams.get("assetId");
        const addr = searchParams.get("address");
        if (id) {
            setAssetId(id);
            handleVerify(id);
        } else if (addr) {
            setLookupAddress(addr);
            handleAddressLookup(addr);
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
                        className="space-y-6"
                    >
                        {/* Result Banner */}
                        <div className={`glass p-8 rounded-[2.5rem] border-2 text-center flex flex-col md:flex-row items-center justify-between gap-6 ${result.status === 'VALID' ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/50'
                            }`}>
                            <div className="flex items-center gap-4">
                                {result.status === 'VALID' ? (
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-500">
                                        <CheckCircle2 size={28} />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500">
                                        <ShieldAlert size={28} />
                                    </div>
                                )}
                                <div className="text-left">
                                    <h2 className="text-2xl font-extrabold text-slate-900 font-display">
                                        {result.status}
                                    </h2>
                                    <p className="text-xs text-slate-600 font-medium tracking-tight">Verified on Algorand Testnet</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handlePlayAudio(assetId)}
                                className={`flex items-center gap-3 px-6 h-12 rounded-2xl font-bold transition-all shadow-lg ${isPlaying
                                    ? "bg-slate-900 text-white"
                                    : "bg-white text-slate-900 border border-slate-200 hover:border-primary/40"
                                    }`}
                            >
                                {isPlaying ? (
                                    <>
                                        <Pause size={18} className="animate-pulse" />
                                        Listening...
                                    </>
                                ) : (
                                    <>
                                        <Volume2 size={18} className="text-primary" />
                                        Listen to Credential
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Credential Card */}
                        <div className="glass p-10 rounded-[3rem] bg-white border border-slate-200/60 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <GraduationCap size={200} />
                            </div>

                            <div className="mb-10 relative z-10">
                                <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">Official Verification Result</div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-3 font-display">
                                    {result.details?.metadata?.name || "Academic Credential"}
                                </h3>
                                <p className="text-slate-500 max-w-xl leading-relaxed">
                                    {result.details?.metadata?.description || "This document confirms the successful completion of the academic program listed below."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pt-8 border-t border-slate-100 relative z-10">
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mb-1.5 flex items-center gap-2">
                                            <Building2 size={12} className="text-primary" /> Institution
                                        </div>
                                        <p className="font-bold text-slate-900 text-lg">{result.details?.metadata?.properties?.issuer_name || "Verified Institution"}</p>
                                        <p className="text-[10px] font-mono text-slate-400 truncate mt-1 bg-slate-50 px-2 py-1 rounded inline-block">
                                            {result.details?.creator}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mb-1.5 flex items-center gap-2">
                                            <Calendar size={12} className="text-primary" /> Issue Date
                                        </div>
                                        <p className="font-bold text-slate-900">
                                            {result.details?.metadata?.properties?.issued_timestamp
                                                ? new Date(result.details.metadata.properties.issued_timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mb-1.5 flex items-center gap-2">
                                            <Music size={12} className="text-primary" /> Audio Summary
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed italic">
                                            "CredX AI has generated a certified voice summary of this academic achievement. Click play to listen."
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100/50">
                                        <div className="text-[10px] uppercase tracking-widest text-emerald-600 font-extrabold mb-2 flex items-center gap-2">
                                            <ShieldCheck size={12} /> Verification Fingerprint
                                        </div>
                                        <p className="text-[10px] font-mono text-emerald-800 break-all opacity-70">
                                            {result.details?.metadata?.properties?.document_hash || "HASH_NOT_AVAILABLE"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* --- AI INSIGHTS SECTION --- */}
                            {result.aiInsights && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-10 p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden ring-4 ring-primary/20"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Sparkles size={100} className="text-primary" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-4">
                                            <Sparkles size={14} /> CredX AI Insights
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Authenticity Confidence</div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl font-bold font-mono text-primary">{result.aiInsights.confidenceScore}%</div>
                                                    <div className="flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary"
                                                            style={{ width: `${result.aiInsights.confidenceScore}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Credential Category</div>
                                                <div className="text-xl font-bold">{result.aiInsights.category}</div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                                            <div className="text-[10px] text-primary font-bold uppercase mb-1">AI Analysis Summary</div>
                                            <p className="text-xs text-slate-300 leading-relaxed italic">
                                                "{result.aiInsights.analysisSummary}"
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            {/* --------------------------- */}

                            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                                <a
                                    href={result.details?.documentUrl}
                                    target="_blank"
                                    className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all flex-grow shadow-lg"
                                >
                                    <Download size={20} />
                                    View Document
                                </a>
                                <a
                                    href={`https://testnet.explorer.perawallet.app/asset/${assetId}`}
                                    target="_blank"
                                    className="h-14 px-8 rounded-2xl border border-slate-200 text-slate-600 font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all flex-grow"
                                >
                                    <ExternalLink size={20} />
                                    Blockchain Explorer
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )
                }

                {
                    addressResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Student Profile Banner */}
                            <div className="glass p-10 rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                                            <GraduationCap size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold font-display">Student Verification Profile</h2>
                                            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs mt-1">
                                                <ShieldCheck size={14} className="text-primary" />
                                                {addressResult.address}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm max-w-xl">
                                        This profile contains all academic credentials cryptographically linked to this Algorand wallet address.
                                    </p>
                                </div>
                                {/* Decoration */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                            </div>

                            {/* Public Credentials List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {addressResult.credentials.map((cred: any) => (
                                    <motion.div
                                        key={cred.assetId}
                                        whileHover={{ y: -5 }}
                                        className="glass p-6 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                                <GraduationCap size={24} />
                                            </div>
                                            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold tracking-wider uppercase">
                                                {cred.status}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{cred.title}</h3>
                                        <p className="text-xs text-slate-500 mb-4 font-medium">{cred.issuer}</p>

                                        <div className="space-y-2 mb-6 flex-grow">
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-slate-400 uppercase font-bold">Asset ID</span>
                                                <span className="text-slate-900 font-mono font-bold">#{cred.assetId}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-slate-400 uppercase font-bold">Issue Date</span>
                                                <span className="text-slate-900 font-bold">{new Date(cred.issueDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setAssetId(cred.assetId.toString());
                                                handleVerify(cred.assetId.toString());
                                                window.scrollTo({ top: 400, behavior: 'smooth' });
                                            }}
                                            className="h-10 w-full rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                        >
                                            <ShieldCheck size={14} />
                                            Verify This Credential
                                        </button>
                                    </motion.div>
                                ))}

                                {addressResult.credentials.length === 0 && (
                                    <div className="col-span-full py-20 text-center">
                                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                                            <ShieldX size={40} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">No Credentials Found</h3>
                                        <p className="text-slate-500">This wallet address does not have any issued credentials on the CredX network.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >

            {/* Security Explanation */}
            < div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8" >
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
            </div >
            {/* Real QR Scanner */}
            {
                showScanner && (
                    <QRScanner
                        onScan={(decodedText) => {
                            const assetId = parseScannedValue(decodedText);
                            setAssetId(assetId);
                            handleVerify(assetId);
                            setShowScanner(false);
                        }}
                        onClose={() => setShowScanner(false)}
                    />
                )
            }
        </div >
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
