import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
    appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
    signInReturnToPath: "/dashboard",
    enableAccessTokenEndpoint: true,
    allowInsecureRequests: process.env.NODE_ENV === "development",
    routes: {
        login: "/api/auth/login",
        logout: "/api/auth/logout",
        callback: "/api/auth/callback"
    },
    authorizationParameters: {
        audience: process.env.AUTH0_AUDIENCE
    }
});
