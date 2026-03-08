import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export const GET = async (req: NextRequest) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Manually handle access-token redirect/fallback
    if (pathname.endsWith("/access-token")) {
        try {
            const token = await auth0.getAccessToken();
            return NextResponse.json(token);
        } catch (error) {
            console.error("[AUTH ROUTE] Access token error:", error);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    // Manually handle profile/me
    if (pathname.endsWith("/me")) {
        try {
            const session = await auth0.getSession();
            if (!session) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
            return NextResponse.json(session.user);
        } catch (error) {
            return NextResponse.json({ error: "Internal error" }, { status: 500 });
        }
    }

    // Fallback to SDK middleware for login, logout, callback
    return auth0.middleware(req);
};

export const POST = (req: NextRequest) => auth0.middleware(req);
