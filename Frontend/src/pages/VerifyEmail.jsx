import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { login } = useAuth();
    
    const [email, setEmail] = useState(state?.email || "");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState(state?.message || "Please enter the 6-digit code sent to your email.");
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        if (!email) {
            navigate("/login");
        }
    }, [email, navigate]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && e.target.previousSibling) {
                e.target.previousSibling.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const otpString = otp.join("");
        
        if (otpString.length < 6) {
            setError("Please enter the full 6-digit code.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await apiFetch("/api/users/verify-email", {
                method: "POST",
                body: JSON.stringify({ email, otp: otpString }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Verification failed");
            }

            // Success! Log the user in
            login(data, data.token);
            alert("Email verified successfully! ✅");
            
            // Redirect based on role
            if (data.user.role === "admin") {
                navigate("/admin/dashboard");
            } else if (data.user.role === "doctor") {
                navigate("/doctor/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;

        try {
            const response = await apiFetch("/api/users/resend-otp", {
                method: "POST",
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage("A new code has been sent to your email.");
                setResendTimer(60); // 1 minute cooldown
                setError("");
            } else {
                const data = await response.json();
                setError(data.message || "Failed to resend code");
            }
        } catch (err) {
            setError("Error resending code. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#B3E5FC]">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
                
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-[#E1F5FE] text-[#0277BD] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                        📧
                    </div>
                    <h2 className="text-3xl font-black text-gray-900">Verify Email</h2>
                    <p className="text-gray-500 font-medium px-4">
                        {message}
                    </p>
                    <p className="text-[#01579B] font-bold text-sm truncate">{email}</p>
                </div>

                {/* OTP Inputs */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between gap-2">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                onFocus={e => e.target.select()}
                                className="w-12 h-14 text-center text-2xl font-black text-[#01579B] bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#028090] focus:bg-white focus:outline-none transition-all"
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold text-center border border-red-100 animate-[shake_0.4s_ease-in-out]">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-[#0277BD] hover:bg-[#01579B] text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Verifying...</span>
                            </div>
                        ) : "Verify Account ➡️"}
                    </button>
                </form>

                {/* Resend Footer */}
                <div className="text-center">
                    <p className="text-gray-500 text-sm font-medium">
                        Didn't receive the code?
                    </p>
                    <button
                        onClick={handleResend}
                        disabled={resendTimer > 0}
                        className={`mt-2 font-bold text-[#028090] hover:text-[#01579B] transition-colors ${resendTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend New Code"}
                    </button>
                </div>

                <div className="text-center pt-4 border-t border-gray-50">
                    <button 
                        onClick={() => navigate("/login")}
                        className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ← Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
