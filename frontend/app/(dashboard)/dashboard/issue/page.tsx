"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Wallet,
    FileBadge,
    GraduationCap,
    Calendar,
    Upload,
    CheckCircle2,
    ShieldCheck,
    Loader2,
    ArrowRight,
    ExternalLink,
    Download,
    AlertCircle,
    X
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

type Status = "idle" | "uploading" | "minting" | "success" | "error";

export default function IssueCredentialPage() {
    const [formData, setFormData] = useState({
        studentWallet: "",
        studentName: "",
        credentialTitle: "",
        programName: "",
        issueDate: "",
        expiryDate: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [result, setResult] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage("Please upload a credential document.");
            return;
        }

        setStatus("uploading");
        setErrorMessage(""); // Clear previous error

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        data.append("document", file);

        try {
            // Simulate progress timing for UX
            setTimeout(async () => {
                setStatus("minting");
                const { data: response, error } = await api.post("/credentials/issue", data);

                if (error) {
                    setErrorMessage(error);
                    setStatus("error");
                } else {
                    setResult(response);
                    setStatus("success");
                }
            }, 1000);
        } catch (err: any) {
            setErrorMessage(err.message || "An unexpected error occurred.");
            setStatus("error");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Link href="/dashboard" className="text-sm font-semibold text-slate-400 hover:text-primary transition-colors">Dashboard</Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-sm font-semibold text-slate-900">Issue New Credential</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 font-display">Mint Academic Credential</h1>
                <p className="text-slate-500 mt-2">Issue a tamper-proof blockchain certificate using IPFS and Algorand.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Student Details */}
                        <div className="glass p-8 rounded-[2rem] border border-slate-200/60 shadow-sm bg-white/70">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <User size={20} className="text-primary" />
                                Student Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Student Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="studentName"
                                            value={formData.studentName}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            required
                                            className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Wallet Address</label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="studentWallet"
                                            value={formData.studentWallet}
                                            onChange={handleChange}
                                            placeholder="0x... or Algorand Address"
                                            required
                                            className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Credential Details */}
                        <div className="glass p-8 rounded-[2rem] border border-slate-200/60 shadow-sm bg-white/70">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <FileBadge size={20} className="text-primary" />
                                Credential Details
                            </h3>
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">Credential Title</label>
                                        <div className="relative">
                                            <FileBadge className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                name="credentialTitle"
                                                value={formData.credentialTitle}
                                                onChange={handleChange}
                                                placeholder="e.g. B.S. Computer Science"
                                                required
                                                className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">Program / Major</label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                name="programName"
                                                value={formData.programName}
                                                onChange={handleChange}
                                                placeholder="e.g. Faculty of Engineering"
                                                required
                                                className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">Issue Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="date"
                                                name="issueDate"
                                                value={formData.issueDate}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">Expiry Date (Optional)</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="date"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="glass p-8 rounded-[2rem] border border-slate-200/60 shadow-sm bg-white/70">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Upload size={20} className="text-primary" />
                                Credential Document
                            </h3>
                            <div
                                className={`border-2 border-dashed rounded-[1.5rem] p-8 flex flex-col items-center justify-center transition-all ${file ? 'border-primary/40 bg-primary/5' : 'border-slate-200 hover:border-primary/20 hover:bg-slate-50/50'
                                    }`}
                            >
                                <input
                                    type="file"
                                    id="doc-upload"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.png"
                                />
                                <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${file ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        <Upload size={24} />
                                    </div>
                                    <p className="font-semibold text-slate-900">
                                        {file ? file.name : 'Click to upload document'}
                                    </p>
                                    <p className="text-xs text-slate-500">PDF, JPG or PNG (max. 10MB)</p>
                                </label>
                                {file && (
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="mt-4 text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                                    >
                                        <X size={14} /> Remove
                                    </button>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status !== "idle"}
                            className="h-14 w-full rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-2 transition-all mt-4 shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            Issue Credential
                            <ArrowRight size={20} />
                        </button>
                        {errorMessage && <p className="text-center text-sm font-bold text-red-500">{errorMessage}</p>}
                    </form>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-24 flex flex-col gap-6">
                        <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100">
                            <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                <ShieldCheck size={18} />
                                Security Note
                            </h4>
                            <p className="text-xs text-indigo-700/80 leading-relaxed font-medium">
                                Credential data is permanently stored on the Algorand blockchain and IPFS. This action cannot be undone once minted. Ensure all student details are accurate.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Overlay omitted for brevity in this specific write, normally included. I will re-include full content to be safe. */}
            {/* Re-adding the rest of the file to be safe */}
            <AnimatePresence>
                {status !== "idle" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="max-w-md w-full glass p-10 rounded-[2.5rem] shadow-2xl border border-white bg-white text-center"
                        >
                            {status === "uploading" && (
                                <>
                                    <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Uploading to IPFS</h2>
                                    <p className="text-slate-500">Securely encrypting and storing your document...</p>
                                </>
                            )}
                            {status === "minting" && (
                                <>
                                    <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Minting Algorand NFT</h2>
                                    <p className="text-slate-500">Confirming transaction on the decentralized network...</p>
                                </>
                            )}
                            {status === "success" && (
                                <>
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Credential Issued!</h2>
                                    <p className="text-slate-500 mb-8">Successfully minted as NFT asset on blockchain.</p>

                                    <div className="flex flex-col gap-3 mb-8">
                                        <div className="p-4 rounded-2xl bg-slate-50 text-left border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Asset ID</p>
                                            <p className="text-sm font-mono font-bold text-slate-900">{result?.assetId}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 text-left border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
                                            <p className="text-xs font-mono text-slate-500 break-all">{result?.transactionId}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setStatus("idle")}
                                            className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                                        >
                                            Done
                                        </button>
                                        <a
                                            href={`https://testnet.explorer.perawallet.app/tx/${result?.transactionId}`}
                                            target="_blank"
                                            className="flex-1 h-12 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                        >
                                            View Explorer
                                            <ExternalLink size={16} />
                                        </a>
                                    </div>
                                </>
                            )}
                            {status === "error" && (
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
                                        <AlertCircle size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Issuance Failed</h3>
                                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">{errorMessage}</p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="h-12 px-8 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
