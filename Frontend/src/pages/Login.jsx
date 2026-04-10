import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });

    const data = await response.json();

    alert(data.message);

    navigate("/");   // 👈 go to home page

  } catch (error) {
    console.log(error);
    alert("Login failed");
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
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                            style={{
                                borderColor: "#B3E5FC",
                                "--tw-ring-color": "#039BE5",
                            }}
                        />
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
                        Log In →
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