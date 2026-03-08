"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle, X } from "lucide-react";

interface QRScannerProps {
    onScan: (decodedText: string) => void;
    onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
    const scannerRef = useRef<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState(true);

    useEffect(() => {
        const startScanner = async () => {
            setError(null);
            setIsStarting(true);

            try {
                const { Html5Qrcode } = await import("html5-qrcode");
                const html5QrCode = new Html5Qrcode("qr-reader");
                scannerRef.current = html5QrCode;

                await html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    (decodedText) => {
                        onScan(decodedText);
                        html5QrCode.stop().catch(() => {});
                    },
                    () => {}
                );
            } catch (err: any) {
                setError(err?.message || "Failed to access camera. Use HTTPS or paste the code below.");
            } finally {
                setIsStarting(false);
            }
        };

        startScanner();
        return () => {
            scannerRef.current?.stop().catch(() => {});
        };
    }, [onScan]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            />
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10 text-center"
            >
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Scan QR Code</h3>
                <p className="text-slate-500 mb-6">
                    Position the credential QR code within the frame to verify automatically.
                </p>

                <div className="aspect-square w-full max-w-[280px] mx-auto rounded-3xl overflow-hidden bg-slate-100 border-2 border-slate-200 mb-6 relative">
                    <div id="qr-reader" className="w-full min-h-[250px]" />
                    {isStarting && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-amber-800 text-sm">
                        <AlertCircle size={20} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <p className="text-xs text-slate-400 font-medium mb-4">
                    Or paste the verification code / Asset ID below:
                </p>
                <input
                    type="text"
                    placeholder="Paste Asset ID or verification URL"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-center font-mono text-sm"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                                const match = val.match(/assetId=(\d+)/);
                                const assetId = match ? match[1] : val;
                                onScan(assetId);
                            }
                        }
                    }}
                />
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>
        </div>
    );
}
