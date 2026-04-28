import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-16 mt-20">
            <div className="container mx-auto px-6 md:px-10 max-w-7xl">

                <div className="grid md:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-[#039BE5] rounded-lg flex items-center justify-center text-white font-bold">
                                C
                            </div>

                            <span className="text-xl font-bold text-white">
                                CareMatePlus
                            </span>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed">
                            Making premium healthcare accessible, intelligent, and seamless for everyone.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Quick Links</h3>

                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-white transition">
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link to="/doctors" className="hover:text-white transition">
                                    Find Doctors
                                </Link>
                            </li>

                            <li>
                                <Link to="/login" className="hover:text-white transition">
                                    Login
                                </Link>
                            </li>

                            <li>
                                <Link to="/signup" className="hover:text-white transition">
                                    Signup
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Services</h3>

                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>General Consultation</li>
                            <li>Doctor Appointment</li>
                            <li>Health Checkups</li>
                            <li>AI Symptom Checker</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Contact</h3>

                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>support@caremateplus.com</li>
                            <li>+91 9876543210</li>
                            <li>Ahmedabad, India</li>
                        </ul>
                    </div>

                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
                    © 2026 CareMatePlus. All rights reserved.
                </div>

            </div>
        </footer>
    );
};

export default Footer;