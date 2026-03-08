"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Building2,
    FileText,
    ShieldCheck,
    AlertCircle,
    PlusCircle,
    ArrowUpRight,
    TrendingUp,
    History
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: any;
    color: string;
    change?: string;
}

const StatCard = ({ label, value, icon: Icon, color, change }: StatCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-[2rem] bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
                <Icon size={24} />
            </div>
            {change && (
                <div className="flex items-center gap-1 text-emerald-500 font-medium text-sm">
                    <TrendingUp size={16} />
                    {change}
                </div>
            )}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-slate-900 font-display">{value}</h3>
        </div>
    </motion.div>
);

import { api } from "@/lib/api";

export default function InstitutionDashboard() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const { data: result, error: apiError } = await api.get("/institutions/me");

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

        fetchDashboardData();
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
                <h3 className="text-xl font-bold text-slate-900 mb-2">Error Loading Dashboard</h3>
                <p className="text-slate-500">{error || "User data not found"}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display">{data.name}</h1>
                    <p className="text-slate-500">Official Institution Dashboard • {data.address.substring(0, 10)}...</p>
                </div>
                <Link href="/dashboard/issue">
                    <button className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                        <PlusCircle size={20} />
                        Issue New Credential
                    </button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Credentials Issued"
                    value={data.stats.totalIssued}
                    icon={FileText}
                    color="bg-blue-50 text-blue-500"
                    change="+12%"
                />
                <StatCard
                    label="Active Credentials"
                    value={data.stats.activeCredentials}
                    icon={ShieldCheck}
                    color="bg-emerald-50 text-emerald-500"
                    change="+5%"
                />
                <StatCard
                    label="Verification Requests"
                    value={data.stats.verifiedToday}
                    icon={Building2}
                    color="bg-indigo-50 text-indigo-500"
                />
                <StatCard
                    label="Revocations"
                    value={data.stats.revokedCount}
                    icon={AlertCircle}
                    color="bg-red-50 text-red-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
                {/* Recent Activity Table */}
                <div className="lg:col-span-8 p-8 rounded-[2rem] bg-white border border-slate-200/60 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                            <History size={20} className="text-slate-400" />
                            <h3 className="text-xl font-bold text-slate-900 font-display">Recent Activity</h3>
                        </div>
                        <button className="text-primary font-semibold text-sm hover:underline">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-slate-100 pb-4">
                                    <th className="pb-4 font-semibold text-slate-500 text-sm">Type</th>
                                    <th className="pb-4 font-semibold text-slate-500 text-sm">Student</th>
                                    <th className="pb-4 font-semibold text-slate-500 text-sm">Credential</th>
                                    <th className="pb-4 font-semibold text-slate-500 text-sm">Date</th>
                                    <th className="pb-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.recentActivity.map((activity: any) => (
                                    <tr key={activity.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${activity.type === 'ISSUANCE' ? 'bg-emerald-100 text-emerald-700' :
                                                activity.type === 'REVOCATION' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {activity.type}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm font-semibold text-slate-900">{activity.student}</td>
                                        <td className="py-4 text-sm text-slate-500">{activity.credential}</td>
                                        <td className="py-4 text-xs text-slate-400 font-medium">
                                            {new Date(activity.date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 text-right">
                                            <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 opacity-0 group-hover:opacity-100 transition-all">
                                                <ArrowUpRight size={16} className="text-slate-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Analytics Sidebar */}
                <div className="lg:col-span-4 p-8 rounded-[2rem] bg-white border border-slate-200/60 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 font-display">Status Analytics</h3>
                    <div className="flex items-end justify-between h-48 gap-2">
                        {data.analytics.data.map((val: number, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(val / 65) * 100}%` }}
                                    className="w-full bg-slate-100 rounded-lg relative group cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded whitespace-nowrap z-10">
                                        {val} certs
                                    </div>
                                </motion.div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{data.analytics.labels[i]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Verification requests are <span className="text-emerald-500 font-bold">up 15%</span> compared to last week. Your institution status remains high.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
