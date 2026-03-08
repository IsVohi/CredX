/**
 * CredX Global API Client
 * Centralizes all backend communication, authentication, and error handling.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001/api/v1";

if (typeof window !== 'undefined') {
    console.log(`[API DEBUG] Base URL: ${BASE_URL}`);
}

export type ApiResponse<T = any> = {
    data?: T;
    error?: string;
};

let cachedToken: string | undefined = undefined;

/**
 * Helper to get authentication token asynchronously via Auth0
 */
export const getAuthTokenAsync = async (): Promise<string | undefined> => {
    if (typeof window === 'undefined') return undefined; // SSR check
    if (cachedToken) return cachedToken;
    try {
        console.log("[API DEBUG] Fetching new access token...");
        const res = await fetch('/api/auth/access-token');
        if (res.ok) {
            const data = await res.json();
            cachedToken = typeof data === 'string' ? data : (data.token ?? data.access_token);
            console.log("[API DEBUG] Token acquired successfully.");
            return cachedToken;
        } else {
            console.warn(`[API DEBUG] Failed to get access token: ${res.status} ${res.statusText}`);
        }
    } catch (err) {
        console.error("[API DEBUG] Error fetching access token:", err);
    }
    return undefined;
};

/**
 * Standardized fetch wrapper
 */
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const token = await getAuthTokenAsync();
        const headers: Record<string, string> = {
            ...(options.headers as Record<string, string> || {}),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Only set Content-Type if not sending FormData (browser sets it automatically for FormData)
        if (!(options.body instanceof FormData) && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                error: result.error || "An unexpected error occurred.",
                data: response.status === 422 ? result : undefined
            };
        }

        return { data: result as T };
    } catch (err: any) {
        console.error(`API Request Error [${endpoint}]:`, err);
        return { error: err.message || "Failed to connect to the server." };
    }
}

export const api = {
    get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body?: any) => request<T>(endpoint, {
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify(body)
    }),
    put: <T>(endpoint: string, body?: any) => request<T>(endpoint, {
        method: 'PUT',
        body: body instanceof FormData ? body : JSON.stringify(body)
    }),
    delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
