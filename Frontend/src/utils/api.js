const BASE_URL = import.meta.env.VITE_API_URL || ""; // Default to relative for production/docker deployment

/**
 * Centralized API utility for CareMatePlus
 * Handles: Authorization, Token Expiry (401), and Safe Parsing
 */
export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    
    // Construct full URL if endpoint is relative
    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    console.log(`[API] ${config.method || 'GET'} ${url}`);

    try {
        const response = await fetch(url, config);

        // Global 401 Handling: Logout user if token expired
        if (response.status === 401) {
            const clonedResponse = response.clone();
            const data = await clonedResponse.json().catch(() => ({}));
            if (data.message === "Token expired" || data.message === "Invalid token") {
                console.warn("🔐 Auth Error: Session expired. Logging out...");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("role");
                // Optional: window.location.href = "/login"; // Force redirect
                throw new Error("Session expired. Please login again.");
            }
        }

        return response;
    } catch (error) {
        console.error(`[API ERROR] ${url}:`, error.message);
        throw error;
    }
};
