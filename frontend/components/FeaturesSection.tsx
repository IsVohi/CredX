"use client";

import { motion } from "framer-motion";
import {
    Users, ShieldCheck, FileBadge, Zap, ShieldAlert,
    LayoutDashboard, Search, Bell, Menu, FileText, CheckCircle, BarChart3, Settings, CreditCard, HelpCircle
} from "lucide-react";

const features = [
    {
        title: "Seamless Collaboration",
        description: "Connect multiple departments and verifiers into a single unified cryptographic truth network.",
        icon: Users,
        color: "bg-blue-50 text-blue-500",
        preview: (
            <div className="flex -space-x-3 mt-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white ${['bg-indigo-400', 'bg-emerald-400', 'bg-rose-400', 'bg-amber-400'][i - 1]} shadow-sm`}>
                        {['SJ', 'MR', 'ER', 'AL'][i - 1]}
                    </div>
                ))}
            </div>
        )
    },
    {
        title: "Credential Verification",
        description: "Scan a document or input a token ID to fetch the immutable on-chain record instantly.",
        icon: ShieldCheck,
        color: "bg-emerald-50 text-emerald-500",
        preview: (
            <div className="w-full h-12 mt-4 bg-emerald-50 rounded-lg flex items-center px-4 gap-3 border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-medium text-emerald-700">Status: Verified & Active</span>
            </div>
        )
    },
    {
        title: "Academic Passport",
        description: "Students aggregate all global credentials into one portable digital identity wallet.",
        icon: FileBadge,
        color: "bg-violet-50 text-violet-500",
        preview: (
            <div className="w-full mt-4 flex gap-2">
                <div className="flex-1 h-12 bg-white rounded-lg shadow-sm border border-slate-100 p-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-violet-100"></div>
                    <div className="w-12 h-2 bg-slate-200 rounded-full"></div>
                </div>
                <div className="flex-1 h-12 bg-white rounded-lg shadow-sm border border-slate-100 p-2 flex items-center gap-2 opacity-50">
                    <div className="w-6 h-6 rounded bg-slate-100"></div>
                    <div className="w-12 h-2 bg-slate-100 rounded-full"></div>
                </div>
            </div>
        )
    },
    {
        title: "Instant Employer Verification",
        description: "Eliminate HR bottlenecks by shifting to instant verification portals embedded into ATS pipelines.",
        icon: Zap,
        color: "bg-amber-50 text-amber-500",
        className: "md:col-span-2",
        preview: (
            <div className="mt-4 p-3 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                    <div>
                        <div className="w-24 h-2.5 bg-slate-200 rounded-full mb-1"></div>
                        <div className="w-16 h-2 bg-slate-100 rounded-full"></div>
                    </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-xs font-semibold whitespace-nowrap">
                    Click to Verify
                </button>
            </div>
        )
    },
    {
        title: "Fraud Detection",
        description: "Automatic flagging of altered documents, expired certificates, or unregistered issuing entities.",
        icon: ShieldAlert,
        color: "bg-rose-50 text-rose-500",
        preview: (
            <div className="w-full mt-4 h-16 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ffe4e6_10px,#ffe4e6_20px)] rounded-xl opacity-60"></div>
        )
    }
];

export default function FeaturesSection() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } }
    };

    return (
        <section id="features" className="py-24 relative bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4"
                    >
                        Keep everything in one place
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600"
                    >
                        Manage the entire credential lifecycle from issuance to verification in a unified SaaS interface.
                    </motion.p>
                </div>

                {/* Feature Cards Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-3 gap-6 mb-20"
                >
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            className={`floating-card glass p-6 flex flex-col relative overflow-hidden group ${feature.className || ''}`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>

                            <div className="flex-grow">
                                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5 shadow-sm`}>
                                    <feature.icon size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                {feature.preview}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Huge Dashboard Preview Container */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, type: "spring" as const, bounce: 0.3 }}
                    className="relative rounded-[2rem] bg-white border border-slate-200/60 shadow-2xl overflow-hidden glass p-2"
                >
                    {/* Dashboard Window Chrome (macOS style dots) */}
                    <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 rounded-t-[1.5rem] flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        <div className="mx-auto w-48 h-5 bg-white rounded-md shadow-sm border border-slate-200/50 flex items-center px-2">
                            <Search size={10} className="text-slate-400" />
                        </div>
                    </div>

                    {/* Dashboard App Grid */}
                    <div className="flex h-[500px] md:h-[600px] bg-white rounded-b-[1.5rem] overflow-hidden">

                        {/* Sidebar */}
                        <div className="w-20 md:w-64 border-r border-slate-100 bg-slate-50/50 p-4 flex flex-col gap-6">
                            <div className="flex items-center gap-2 px-2 hidden md:flex mb-6">
                                <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center font-bold text-xs">C</div>
                                <span className="font-bold">CredX Admin</span>
                            </div>
                            <div className="flex items-center justify-center md:hidden mb-6">
                                <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold text-sm">C</div>
                            </div>

                            <div className="flex flex-col gap-1">
                                {[
                                    { icon: LayoutDashboard, label: "Overview", active: true },
                                    { icon: FileText, label: "Credentials" },
                                    { icon: Users, label: "Students" },
                                    { icon: ShieldCheck, label: "Verifications" },
                                    { icon: BarChart3, label: "Analytics" },
                                ].map((item, id) => (
                                    <div key={id} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${item.active ? 'bg-white shadow-sm text-primary font-medium' : 'text-slate-500 hover:bg-slate-100/50'}`}>
                                        <item.icon size={18} />
                                        <span className="hidden md:block text-sm">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto flex flex-col gap-1">
                                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100/50 cursor-pointer">
                                    <Settings size={18} />
                                    <span className="hidden md:block text-sm">Settings</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50/20">

                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
                                    <p className="text-sm text-slate-500">Welcome back, Dr. Jenkins</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500">
                                        <Bell size={18} />
                                    </button>
                                    <button className="h-10 px-4 rounded-xl bg-primary shadow-sm shadow-primary/30 text-white text-sm font-medium flex items-center gap-2">
                                        Issue New <span className="hidden md:inline">Credential</span>
                                    </button>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {[
                                    { label: "Total Issued", value: "24,592", change: "+12%", color: "text-emerald-500" },
                                    { label: "Active Verifications", value: "8,204", change: "+5%", color: "text-emerald-500" },
                                    { label: "Revoked", value: "14", change: "-2%", color: "text-rose-500" }
                                ].map((stat, id) => (
                                    <div key={id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
                                        <div className="flex items-end justify-between">
                                            <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
                                            <span className={`text-xs font-semibold ${stat.color} bg-slate-50 px-2 py-1 rounded-md`}>{stat.change}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chart & List Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                                {/* Activity Chart Mock */}
                                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-slate-800">Verification Activity</h3>
                                        <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">This Month</div>
                                    </div>
                                    <div className="w-full h-48 flex items-end gap-2 px-2">
                                        {[30, 45, 25, 60, 75, 40, 85, 55, 90, 65, 50, 80].map((h, i) => (
                                            <div key={i} className="flex-1 rounded-t-sm bg-primary/20 relative group">
                                                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Credentials List */}
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-slate-800">Recent Issues</h3>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {[
                                            { name: "John Doe", course: "B.S. CompSci", time: "2h ago" },
                                            { name: "Emma Smith", course: "M.A. Design", time: "4h ago" },
                                            { name: "Alex Chen", course: "B.A. History", time: "5h ago" },
                                            { name: "Sarah Jones", course: "Ph.D. Physics", time: "1d ago" },
                                        ].map((item, id) => (
                                            <div key={id} className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                                                    {item.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                                    <p className="text-xs text-slate-500">{item.course}</p>
                                                </div>
                                                <span className="text-xs text-slate-400">{item.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
