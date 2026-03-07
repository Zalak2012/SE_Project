import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        alert("Account created successfully! ✅");

        setTimeout(() => {
            navigate("/login");
        }, 1000);
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

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full text-white font-semibold py-3 rounded-xl transition-all"
                        style={{ backgroundColor: "#0277BD" }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#01579B")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#0277BD")
                        }
                    >
                        Create Account →
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