import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Basic validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
            return;
        }

        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await apiFetch(`/api/auth/reset-password/${token}`, {
                method: "POST",
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setMessage("Password reset successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
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
                    <h2 className="text-xl font-bold mt-4">Reset Password</h2>
                    <p className="text-gray-500 text-sm">
                        Enter your new password below
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2"
                            style={{
                                borderColor: "#B3E5FC",
                                "--tw-ring-color": "#039BE5",
                            }}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-[#0277BD] transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2"
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
                        {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
