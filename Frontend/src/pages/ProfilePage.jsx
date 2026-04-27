import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const profile = currentUser || {};
    const savedAddresses = []; // Temporary until backend handles this
    const removeAddress = () => {}; 

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const hasGenderEmoji = (gender) => {
        if (gender === 'Male') return '👨 ';
        if (gender === 'Female') return '👩 ';
        if (gender === 'Other') return '🌈 ';
        return '';
    };

    // Dummy data for visited doctors
    const visitedDoctors = [
        { id: 1, name: "Dr. Sarah Mitchell", specialty: "Cardiologist", date: "Mar 15, 2026", type: "In-Person Clinic" },
        { id: 2, name: "Dr. James Wilson", specialty: "Neurologist", date: "Feb 02, 2026", type: "Video Consultation" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col w-full">
            <Navbar />

            <main className="flex-grow flex flex-col items-center p-4 py-12 w-full max-w-2xl mx-auto space-y-6">
                
                {/* ---------- MAIN PROFILE CARD ---------- */}
                <section className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative animate-[fadeIn_0.4s_ease-out_both]">
                    {/* Top Right Edit Button */}
                    <button 
                        onClick={() => navigate('/dashboard/profile/edit')}
                        className="absolute top-6 right-6 text-gray-400 hover:text-[#028090] transition-colors p-2 rounded-full hover:bg-gray-50"
                        title="Edit Profile"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                    </button>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Left: Avatar */}
                        <div className="w-24 h-24 rounded-full bg-[#028090] text-white flex items-center justify-center text-3xl font-bold overflow-hidden shrink-0 shadow-inner">
                            {profile.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                getInitials(profile.name)
                            )}
                        </div>

                        {/* Right: Info */}
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{profile.role}</p>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-gray-50">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    <span className="text-sm">{profile.email}</span>
                                </div>

                                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    <span className="text-sm">{profile.phone || <span className="text-gray-300 italic">Not set</span>}</span>
                                </div>

                                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    <span className="text-sm">
                                        {profile.gender ? (
                                            <>{hasGenderEmoji(profile.gender)}{profile.gender}</>
                                        ) : (
                                            <span className="text-gray-300 italic">Not set</span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ---------- VISITED DOCTORS SECTION ---------- */}
                <section className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-[slideUp_0.5s_ease-out_both]">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        Visited Doctors
                    </h3>
                    
                    <div className="space-y-4">
                        {visitedDoctors.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0277BD] flex items-center justify-center font-bold text-sm border border-blue-100">
                                        {getInitials(doc.name)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm group-hover:text-[#01579B] transition-colors">{doc.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-[#028090] text-xs font-medium">{doc.specialty}</p>
                                            <span className="text-gray-300">•</span>
                                            <p className="text-gray-400 text-xs">{doc.type}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                                        {doc.date}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                {/* ---------- SAVED ADDRESSES SECTION ---------- */}
                <section className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-[slideUp_0.6s_ease-out_both]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#028090]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Saved Addresses
                        </h3>
                        <button
                            onClick={() => navigate('/lab-tests')}
                            className="text-xs font-bold text-[#028090] hover:text-[#00A896] flex items-center gap-1 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            Add via Lab Tests
                        </button>
                    </div>

                    {savedAddresses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-500">No saved addresses yet</p>
                            <p className="text-xs text-gray-400 mt-1">Add an address when booking home collection lab tests.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {savedAddresses.map((addr) => (
                                <div key={addr.id} className="flex items-start justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-[#E1F5FE] text-[#0277BD] flex items-center justify-center shrink-0 mt-0.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm group-hover:text-[#01579B] transition-colors">{addr.fullName}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                                {[addr.house, addr.area, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                {addr.phone}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeAddress(addr.id)}
                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Remove address"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;
