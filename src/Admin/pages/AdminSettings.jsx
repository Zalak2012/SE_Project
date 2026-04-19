import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Globe, Database, Smartphone, Mail } from 'lucide-react';

const AdminSettings = () => {
    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    const ToggleSwitch = ({ enabled, setEnabled }) => (
        <button 
            type="button"
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-[#00BFA5]' : 'bg-gray-200'}`}
            onClick={() => setEnabled(!enabled)}
        >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    );

    const [settings, setSettings] = useState({
        emailAlerts: true,
        smsAlerts: false,
        newRegistrations: true,
        maintenanceMode: false,
        publicSignup: true
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="p-6 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
            
            {/* Header */}
            <motion.div {...fadeUp}>
                <h1 className="text-[28px] font-bold text-[#01579B] tracking-tight">System Settings</h1>
                <p className="text-[#4B5563] mt-1 text-[15px]">Configure platform parameters and notifications</p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Left Navigation col */}
                <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="lg:col-span-1 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-white text-[#0277BD] rounded-xl font-semibold shadow-sm border border-[#E1F5FE] transition-colors">
                        <Globe className="w-5 h-5 flex-shrink-0" /> General Setup
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white text-gray-500 rounded-xl font-medium border border-transparent hover:border-gray-100 hover:shadow-sm transition-colors">
                        <Bell className="w-5 h-5 flex-shrink-0" /> Notifications
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white text-gray-500 rounded-xl font-medium border border-transparent hover:border-gray-100 hover:shadow-sm transition-colors">
                        <Shield className="w-5 h-5 flex-shrink-0" /> Security & Access
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white text-gray-500 rounded-xl font-medium border border-transparent hover:border-gray-100 hover:shadow-sm transition-colors">
                        <Database className="w-5 h-5 flex-shrink-0" /> Database Backup
                    </button>
                </motion.div>

                {/* Right Configurations */}
                <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6">
                    
                    {/* General Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">General Platform Settings</h3>
                            <p className="text-xs text-gray-500 mt-1">Core settings regulating application behavior.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="pr-4">
                                    <h4 className="text-sm font-bold text-gray-800">Public Signups</h4>
                                    <p className="text-xs text-gray-500 mt-1">Allow new users to create accounts without invites from the frontend portal.</p>
                                </div>
                                <ToggleSwitch enabled={settings.publicSignup} setEnabled={() => toggleSetting('publicSignup')} />
                            </div>
                            <div className="w-full h-px bg-gray-50"></div>
                            <div className="flex items-center justify-between">
                                <div className="pr-4">
                                    <h4 className="text-sm font-bold text-red-600">Maintenance Mode</h4>
                                    <p className="text-xs text-gray-500 mt-1">Temporarily disable access to all public clients for infrastructure fixes.</p>
                                </div>
                                <ToggleSwitch enabled={settings.maintenanceMode} setEnabled={() => toggleSetting('maintenanceMode')} />
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Administrator Alerts</h3>
                            <p className="text-xs text-gray-500 mt-1">How you receive important operational notifications.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Mail className="w-5 h-5"/></div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800">Email Alerts</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">Receive summary digest to your admin email.</p>
                                    </div>
                                </div>
                                <ToggleSwitch enabled={settings.emailAlerts} setEnabled={() => toggleSetting('emailAlerts')} />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Smartphone className="w-5 h-5"/></div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800">SMS Notifications</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">Get texts for critical severity application errors.</p>
                                    </div>
                                </div>
                                <ToggleSwitch enabled={settings.smsAlerts} setEnabled={() => toggleSetting('smsAlerts')} />
                            </div>

                            <div className="w-full h-px bg-gray-50 my-2"></div>
                            
                            <div className="space-y-4 pt-2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Specific Triggers</h4>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={settings.newRegistrations} onChange={() => toggleSetting('newRegistrations')} className="w-4 h-4 text-[#0277BD] rounded border-gray-300 focus:ring-[#0277BD]" />
                                    <span className="text-sm text-gray-700 font-medium">New Doctor Registration Requests</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0277BD] rounded border-gray-300 focus:ring-[#0277BD]" />
                                    <span className="text-sm text-gray-700 font-medium">Daily Revenue Summaries</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button className="bg-[#0277BD] hover:bg-[#01579B] text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0277BD]">
                            Save System Configuration
                        </button>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default AdminSettings;
