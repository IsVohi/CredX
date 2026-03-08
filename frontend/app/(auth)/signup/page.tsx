"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
    useEffect(() => {
        window.location.href = "/api/auth/login?screen_hint=signup";
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-slate-500 font-medium">Redirecting to secure registration...</p>
        </div>
    );
}
