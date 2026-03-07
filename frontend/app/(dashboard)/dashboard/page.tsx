"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function DashboardOverview() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkRole = async () => {
            const { data, error } = await api.get("/auth/me");

            if (error) {
                router.push("/signin");
                return;
            }

            const user = data as any;
            if (!user.role) {
                router.replace("/onboarding");
                return;
            }

            if (user.role === "ISSUER") {
                router.replace("/dashboard/institution");
            } else if (user.role === "STUDENT") {
                router.replace("/dashboard/student");
            } else {
                setIsLoading(false); // Stay here if admin or something else
            }
        };

        checkRole();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Tailoring your experience...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome to CredX</h1>
            <p className="text-slate-500 max-w-md mx-auto">
                You are logged in, but your role doesn't have a specific dashboard view.
                Please contact support if this is unexpected.
            </p>
        </div>
    );
}
