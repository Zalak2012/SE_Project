import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Please enter your email.");
            return;
        }

        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await apiFetch("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setMessage("Password reset link has been sent to your email.");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: "#B3E5FC" }}
        >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <div
                            className="w-10 h-10 flex items-center justify-center rounded-lg text-white text-xl"
                            style={{ backgroundColor: "#0277BD" }}
                        >
                            💙
                        </div>
                        <h1 className="text-2xl font-bold">
                            CareMate<span style={{ color: "#00A896" }}>Plus</span>
                        </h1>
                    </div>
                    <h2 className="text-xl font-bold mt-4">Forgot Password?</h2>
                    <p className="text-gray-500 text-sm">
                        Enter your email to receive a password reset link
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">📧</span>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                            style={{
                                borderColor: "#B3E5FC",
                                "--tw-ring-color": "#039BE5",
                            }}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
                    {message && <p className="text-green-500 text-sm text-center font-semibold">{message}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white font-semibold py-3 rounded-xl transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        style={{ backgroundColor: "#0277BD" }}
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <Link
                        to="/login"
                        className="text-sm font-semibold"
                        style={{ color: "#028090" }}
                    >
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
