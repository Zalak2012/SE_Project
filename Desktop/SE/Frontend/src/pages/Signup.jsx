import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { apiSignup } from '../services/mockApi';

const Signup = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [role, setRole] = useState(state?.defaultRole || "patient");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.fullName || !formData.email || !formData.password) {
            setError("All fields are required.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            const { token, user } = await apiSignup({
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                role: role
            });
            
            // Log the user into Context
            login(user, token);
            
            alert("Account created successfully! ✅");
            navigate("/dashboard");
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
                    <h2 className="text-xl font-bold mt-4">Create Account</h2>
                    <p className="text-gray-500 text-sm">
                        Get started with your healthcare journey
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
                                    ? "border-blue-500 bg-blue-100 text-blue-700 font-semibold"
                                    : "border-gray-300 text-gray-600 hover:border-blue-400"
                                    }`}
                            >
                                <span>{r.icon}</span> {r.label}
                            </button>
                        ))}
                    </div>

                    {/* Full Name */}
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">👤</span>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                            style={{
                                borderColor: "#B3E5FC",
                                "--tw-ring-color": "#039BE5",
                            }}
                        />
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
                            type="password"
                            name="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                            style={{
                                borderColor: "#B3E5FC",
                                "--tw-ring-color": "#039BE5",
                            }}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                            style={{
                                borderColor: "#B3E5FC",
                                "--tw-ring-color": "#039BE5",
                            }}
                        />
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-gray-500 text-center">
                        By creating an account, you agree to our{" "}
                        <span style={{ color: "#028090" }}>Terms</span> and{" "}
                        <span style={{ color: "#028090" }}>Privacy Policy</span>.
                    </p>

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
                        {isLoading ? "Creating Account..." : "Create Account →"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">Already have an account?</p>
                    <Link
                        to="/login"
                        className="block mt-2 py-2 rounded-xl border font-semibold"
                        style={{ borderColor: "#028090", color: "#028090" }}
                    >
                        LogIn Instead
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;