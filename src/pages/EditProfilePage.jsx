import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const { userProfile, updateUserProfile } = useAuth();
    
    // States
    const [isSaving, setIsSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    
    const fileInputRef = useRef(null);

    // Initial local state from shared context
    const [originalProfile, setOriginalProfile] = useState(userProfile);
    const [editedProfile, setEditedProfile] = useState(userProfile);
    const [previewImage, setPreviewImage] = useState(null);

    // Handlers
    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setEditedProfile(prev => ({ ...prev, avatarUrl: imageUrl }));
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const hasChanges = () => {
        return JSON.stringify(originalProfile) !== JSON.stringify(editedProfile) || previewImage !== null;
    };

    const isValidPhone = (phone) => {
        if (!phone) return true;
        return /^\+?[\d\s-]{7,15}$/.test(phone);
    };

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleSave = () => {
        if (!hasChanges()) return;

        if (editedProfile.phone && !isValidPhone(editedProfile.phone)) {
            showToast("⚠️ Please enter a valid phone number");
            return;
        }

        setIsSaving(true);
        // Simulate a tiny delay for realism before applying frontend-only changes
        setTimeout(() => {
            const newAvatar = previewImage || editedProfile.avatarUrl;
            const updatedProfile = { ...editedProfile, avatarUrl: newAvatar };
            
            // Update global context state
            updateUserProfile(updatedProfile);
            
            // Update local state and toast
            setOriginalProfile(updatedProfile);
            setEditedProfile(updatedProfile);
            setPreviewImage(null); // Clear preview since it's now saved
            
            setIsSaving(false);
            showToast("✅ Profile updated successfully");
            
            setTimeout(() => {
                navigate('/profile');
            }, 800);
        }, 600);
    };

    const currentAvatarUrl = previewImage || editedProfile.avatarUrl;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col relative w-full">
            <Navbar />

            {/* Custom Toast Notification */}
            <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[200] transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}`}>
                <div className="bg-white px-6 py-3 rounded-xl shadow-lg border border-gray-100 font-bold text-gray-800 flex items-center gap-2">
                    {toastMessage}
                </div>
            </div>

            <main className="flex-grow flex justify-center p-4 py-8 md:py-12 w-full">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-[fadeIn_0.5s_ease-out_both] h-max mx-auto my-0">
                    
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-[#01579B] to-[#0277BD] relative flex px-6 md:px-8 pt-6">
                        <div className="w-full">
                            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Edit Profile</h1>
                            <p className="text-blue-100 text-sm mt-1">Update your personal information</p>
                        </div>
                    </div>

                    <div className="px-6 md:px-8 pb-10 relative -mt-14">
                        {/* Avatar Section */}
                        <div className="flex flex-col sm:flex-row gap-6 mb-8 items-start sm:items-end">
                            <div className="relative group">
                                <div 
                                    className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-[#028090] text-white flex items-center justify-center text-4xl font-bold overflow-hidden cursor-pointer"
                                    onClick={handleImageClick}
                                >
                                    {currentAvatarUrl ? (
                                        <img src={currentAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        getInitials(editedProfile.name)
                                    )}

                                    {/* Camera Overlay */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    </div>
                                </div>
                                
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md border border-gray-100 pointer-events-none">
                                    <svg className="w-4 h-4 text-[#028090]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields Section */}
                        <div className="space-y-5 max-w-lg">
                            {/* Readonly Identity Fields */}
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={editedProfile.name} 
                                        readOnly 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8FAFC] text-gray-500 font-medium focus:outline-none cursor-not-allowed"
                                        title="Name cannot be changed"
                                    />
                                    <p className="text-xs text-gray-400 mt-1 pl-1">Name changes require support contact.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={editedProfile.email} 
                                        readOnly 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8FAFC] text-gray-500 font-medium focus:outline-none cursor-not-allowed"
                                        title="Email cannot be changed"
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-100 my-6" />

                            {/* Mutable Details Fields */}
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        value={editedProfile.phone}
                                        onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                                        placeholder="+1 (234) 567-890"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090] bg-white text-gray-800 font-medium transition-colors shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                                    <select 
                                        value={editedProfile.gender || ""}
                                        onChange={(e) => setEditedProfile({...editedProfile, gender: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090] bg-white text-gray-800 font-medium transition-colors shadow-sm appearance-none"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'#6B7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                                    >
                                        <option value="" disabled>Select Gender...</option>
                                        <option value="Male">👨 Male</option>
                                        <option value="Female">👩 Female</option>
                                        <option value="Other">🌈 Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 border-t border-gray-100 mt-8">
                                <button 
                                    onClick={() => navigate('/profile')}
                                    disabled={isSaving}
                                    className="w-1/3 py-3 px-6 rounded-xl font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={!hasChanges() || isSaving}
                                    className={`flex-1 py-3 px-6 rounded-xl font-bold text-white shadow-md transition-all flex justify-center items-center gap-2 ${
                                        !hasChanges() 
                                            ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                                            : 'bg-[#028090] hover:bg-[#00A896] hover:shadow-lg hover:-translate-y-0.5'
                                    }`}
                                >
                                    {isSaving ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EditProfilePage;
