import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminProfile = () => {
    const { currentUser } = useAuth();
    
    const [formData, setFormData] = useState({
        name: currentUser?.name || 'Administrator Admin',
        email: currentUser?.email || 'admin@caremateplus.com',
        phone: '+1 (555) 123-4567',
        role: 'Super Admin',
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
            
            {/* Header */}
            <motion.div {...fadeUp}>
                <h1 className="text-[28px] font-bold text-[#01579B] tracking-tight">Profile Setup</h1>
                <p className="text-[#4B5563] mt-1 text-[15px]">Manage your personal administrator details</p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Left Col: Avatar & Status */}
                <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center">
                        <div className="relative group cursor-pointer mb-6">
                            <div className="w-32 h-32 rounded-full bg-[#E1F5FE] text-[#0277BD] flex items-center justify-center text-4xl font-black shadow-inner border-4 border-white outline outline-1 outline-gray-200">
                                {formData.name.charAt(0)}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
                        <p className="text-[#0277BD] font-semibold text-sm mt-1">{formData.role}</p>
                        
                        <div className="w-full mt-6 flex justify-center gap-2">
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Active Account
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Col: Details Form */}
                <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Personal Information</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#0277BD]" /> Full Name
                                </label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 focus:border-[#0277BD] transition-all text-sm font-medium"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-[#0277BD]" /> Email Address
                                </label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 focus:border-[#0277BD] transition-all text-sm font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[#0277BD]" /> Phone Number
                                </label>
                                <input 
                                    type="text" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 focus:border-[#0277BD] transition-all text-sm font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-[#0277BD]" /> Admin Role
                                </label>
                                <input 
                                    type="text" 
                                    name="role"
                                    value={formData.role}
                                    disabled
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed font-medium text-sm"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button className="bg-[#0277BD] hover:bg-[#01579B] text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0277BD]">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default AdminProfile;
