"use client";

import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface QRCodeModalProps {
    url: string;
    title: string;
    onClose: () => void;
}

export default function QRCodeModal({ url, title, onClose }: QRCodeModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white rounded-[2rem] shadow-2xl p-8 text-center max-w-sm w-full"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                >
                    <X size={24} />
                </button>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-xs text-slate-500 mb-6">Scan to verify this credential</p>
                <div className="flex justify-center p-4 bg-white rounded-2xl border border-slate-100">
                    <QRCodeSVG value={url} size={200} level="M" includeMargin />
                </div>
                <p className="text-xs text-slate-400 mt-4 font-mono break-all">{url}</p>
            </motion.div>
        </div>
    );
}
