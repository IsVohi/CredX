import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full border-t border-slate-200 bg-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
                    <div className="col-span-2 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
                                C
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900">CredX</span>
                        </div>
                        <p className="text-slate-500 text-sm md:max-w-[250px] leading-relaxed">
                            Instantly verify academic credentials via the power of the Algorand blockchain and ARC-3 assets.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Product</h4>
                        <ul className="flex flex-col gap-3 text-sm text-slate-500">
                            <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">How it works</Link></li>
                            <li><Link href="/institutions" className="hover:text-primary transition-colors">Institutions</Link></li>
                            <li><Link href="/verify" className="hover:text-primary transition-colors">Verify Portal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
                        <ul className="flex flex-col gap-3 text-sm text-slate-500">
                            <li><a href="https://developer.algorand.org/" target="_blank" className="hover:text-primary transition-colors">Algorand Docs</a></li>
                            <li><a href="https://github.com/algorand/arcx" target="_blank" className="hover:text-primary transition-colors">ARC-3 Standard</a></li>
                            <li><Link href="/signin" className="hover:text-primary transition-colors">Institution Login</Link></li>
                            <li><Link href="/signup" className="hover:text-primary transition-colors">Student Signup</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                        <ul className="flex flex-col gap-3 text-sm text-slate-500">
                            <li><Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} CredX Network. Built for Algorand Hackathon 2026.
                    </p>

                    <div className="flex gap-4">
                        <a href="https://twitter.com" target="_blank" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-100 transition-all">
                            <Twitter size={18} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-100 transition-all">
                            <Linkedin size={18} />
                        </a>
                        <a href="https://github.com" target="_blank" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-100 transition-all">
                            <Github size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
