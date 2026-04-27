import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { apiFetch } from "../utils/api";
import { Eye, EyeOff } from 'lucide-react';


const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [role, setRole] = useState("patient");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await apiFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Context injection
            if (data.token) {
                login(data, data.token);
                
                // Role-based redirection
                if (data.user.role === "admin") {
                    navigate("/admin/dashboard");
                } else if (data.user.role === "doctor") {
                    navigate("/doctor/dashboard");
                } else {
                    navigate("/dashboard");
                }
            }
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

                {/* Logo */}
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

                    <h2 className="text-xl font-bold mt-4">Welcome Back</h2>
                    <p className="text-gray-500 text-sm">
                        Sign in to continue your healthcare journey
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Role Selector */}
                    <div className="flex gap-3 mb-4">
                        {[
                            { id: "patient", icon: "👶", label: "Patient" },
                            { id: "doctor", icon: "🩺", label: "Doctor" },
                            { id: "admin", icon: "🛡️", label: "Admin" }
                        ].map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setRole(r.id)}
                                className={`flex-1 px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer text-sm flex items-center justify-center gap-2 ${role === r.id
                                    ? "border-[#0277BD] bg-[#E1F5FE] text-[#0277BD] font-semibold shadow-sm"
                                    : "border-gray-200 text-gray-500 hover:border-[#42A5F5] hover:text-[#0277BD]"
                                    }`}
                            >
                                <span>{r.icon}</span> {r.label}
                            </button>
                        ))}
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">📧</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                            style={{
                                borderColor: "#B3E5FC",
                                "--tw-ring-color": "#039BE5",
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
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

                    {/* Forgot Password */}
                    <div className="text-right">
                        <span
                            className="text-sm cursor-pointer"
                            style={{ color: "#028090" }}
                        >
                            Forgot Password?
                        </span>
                    </div>

                    {/* Error state */}
                    {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white font-semibold py-3 rounded-xl transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        style={{ backgroundColor: "#0277BD" }}
                        onMouseOver={(e) =>
                            !isLoading && (e.currentTarget.style.backgroundColor = "#01579B")
                        }
                        onMouseOut={(e) =>
                            !isLoading && (e.currentTarget.style.backgroundColor = "#0277BD")
                        }
                    >
                        {isLoading ? "Logging in..." : "Log In →"}
                    </button>
                </form>

                {/* Bottom Link */}
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">
                        Don’t have an account?
                    </p>
                    <Link
                        to="/signup"
                        className="block mt-2 py-2 rounded-xl border font-semibold"
                        style={{ borderColor: "#028090", color: "#028090" }}
                    >
                        Create Account
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Login;