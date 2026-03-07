"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
    const router = useRouter();

    useEffect(() => {
        window.location.href = "/auth/login";
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-slate-500 font-medium">Redirecting to secure login...</p>
        </div>
    );
}
