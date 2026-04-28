import React, { useState, useEffect } from 'react';
import { Pencil, X, Plus, Trash2, Save, MapPin, Clock, IndianRupee, Briefcase, GraduationCap, User as UserIcon } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { getImageUrl } from '../../utils/getImageUrl';

const DoctorProfilePage = () => {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Edit form state
    const [form, setForm] = useState({});

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            try {
                setLoading(true);
                const res = await apiFetch("/api/doctor/me");
                const data = await res.json();
                if (res.ok) {
                    setDoctor(data);
                }
            } catch (err) {
                console.error("Fetch doctor profile logic error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorProfile();
    }, []);

    const startEditing = () => {
        setForm({
            name: doctor.name || "",
            specialization: doctor.specialization || "General Physician",
            bio: doctor.bio || "",
            experience: doctor.experience || 5,
            consultationFee: doctor.consultationFee || 500,
            availability: doctor.availability || "Mon-Fri, 9 AM – 5 PM",
            location: doctor.location || "Sector 21, Gandhinagar, Gujarat",
            education: doctor.education || "MBBS - B.J. Medical College, Ahmedabad",
        });
        setSelectedImage(null);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            const token = localStorage.getItem("token");
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const res = await fetch(`${API_URL}/api/doctor/profile`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const updated = await res.json();
                setDoctor(updated.user || updated);
                setIsEditing(false);
            }
        } catch (err) {
            console.error("Save profile error:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0277BD]"></div>
                <span className="ml-3 text-gray-500 font-medium">Loading Profile...</span>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Failed to load doctor profile.</p>
            </div>
        );
    }

    return (
        <div className="animate-[fadeIn_0.5s_ease-out_both] max-w-4xl mx-auto">

            {/* Header Banner */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-[#B3E5FC] to-[#0277BD]/30 w-full relative"></div>

                <div className="px-6 md:px-8 pb-8">
                    {/* Avatar & Name Row */}
                    <div className="flex flex-col sm:flex-row gap-5 relative -mt-14 mb-6">
                        <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden shrink-0 bg-white relative flex items-center justify-center">
                            <img
                                src={getImageUrl(doctor.image)}
                                alt={doctor.name}
                                onError={(e) => { e.target.src = "/default-doctor.png"; }}
                                className="w-full h-full object-cover"
                            />
                            
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <label className="cursor-pointer text-[10px] text-white font-bold bg-black/50 p-1 rounded">
                                        Upload
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setSelectedImage(e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                    {selectedImage && <span className="text-[8px] text-white mt-1 truncate max-w-full px-1">{selectedImage.name}</span>}
                                </div>
                            )}
                            <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                                <div className="bg-[#00A896] text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                    ✓
                                </div>
                            </div>
                        </div>

                        <div className="pt-14 sm:pt-2 flex-grow min-w-0">
                            {isEditing ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="text-2xl font-bold text-[#01579B] border-b border-gray-200 w-full bg-transparent focus:outline-none"
                                        placeholder="Doctor Name"
                                    />
                                    <input
                                        type="text"
                                        value={form.specialization}
                                        onChange={e => setForm(prev => ({ ...prev, specialization: e.target.value }))}
                                        className="text-[#028090] font-medium border-b border-gray-200 w-full bg-transparent focus:outline-none"
                                        placeholder="Specialization"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-bold text-[#01579B]">{doctor.name}</h1>
                                    <p className="text-[#028090] font-medium">{doctor.specialization || "General Physician"}</p>
                                </>
                            )}
                            <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex text-yellow-400 text-sm">★★★★★</div>
                                <span className="font-bold text-gray-700 text-sm">{doctor.rating || 5.0}</span>
                                <span className="text-gray-400 text-xs">({doctor.patientsCount || 0} reviews)</span>
                            </div>
                        </div>

                        {/* Edit / Save / Cancel Buttons */}
                        <div className="sm:pt-4 flex-shrink-0 flex gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={cancelEditing}
                                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="bg-[#0277BD] hover:bg-[#01579B] text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5"
                                    >
                                        <Save className="w-4 h-4" /> Save
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={startEditing}
                                    className="bg-[#0277BD] hover:bg-[#01579B] text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5"
                                >
                                    <Pencil className="w-4 h-4" /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-3 gap-6 border-t border-gray-100 pt-6">

                        {/* Left Column: About & Education */}
                        <div className="md:col-span-2 space-y-6">

                            {/* About */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="text-[#0277BD]"><UserIcon className="w-5 h-5" /></span> About Doctor
                                </h2>
                                {isEditing ? (
                                    <textarea
                                        rows="4"
                                        value={form.bio}
                                        onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                                        className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#0277BD] focus:ring-1 focus:ring-[#0277BD] resize-none leading-relaxed"
                                        placeholder="Enter bio..."
                                    />
                                ) : (
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {doctor.bio || "Experienced healthcare professional dedicated to providing quality patient care, diagnosis, and preventive treatment with compassionate medical support."}
                                    </p>
                                )}
                            </div>

                            {/* Education */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <span className="text-[#0277BD]"><GraduationCap className="w-5 h-5" /></span> Education & Training
                                    </h2>
                                </div>

                                {isEditing ? (
                                    <textarea
                                        rows="3"
                                        value={form.education}
                                        onChange={e => setForm(prev => ({ ...prev, education: e.target.value }))}
                                        className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#0277BD] focus:ring-1 focus:ring-[#0277BD]"
                                        placeholder="e.g. MBBS - B.J. Medical College, MD - GMC Gandhinagar"
                                    />
                                ) : (
                                    <div className="space-y-2">
                                        {(doctor.education || "MBBS - B.J. Medical College, Ahmedabad\nMD - Government Medical College, Gandhinagar\nClinical Practice - Gujarat Medical Council").split('\n').map((line, idx) => (
                                            <p key={idx} className="text-gray-600 text-sm leading-relaxed flex gap-2">
                                                <span className="text-[#00A896] font-bold">•</span>
                                                {line.trim()}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Info Cards */}
                        <div className="space-y-4">

                            {/* Experience */}
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                                    <Briefcase className="w-3.5 h-3.5" /> Experience
                                </p>
                                {isEditing ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="number"
                                            value={form.experience}
                                            onChange={e => setForm(prev => ({ ...prev, experience: e.target.value }))}
                                            className="w-20 border border-gray-200 bg-white rounded px-3 py-1.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#0277BD]"
                                        />
                                        <span className="text-sm text-gray-500 font-medium">Years</span>
                                    </div>
                                ) : (
                                    <p className="text-base font-bold text-gray-800">{doctor.experience || 5}+ Years</p>
                                )}
                            </div>

                            {/* Consultation Fee */}
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                                    <IndianRupee className="w-3.5 h-3.5" /> Consultation Fee
                                </p>
                                {isEditing ? (
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-sm font-bold text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            value={form.consultationFee}
                                            onChange={e => setForm(prev => ({ ...prev, consultationFee: e.target.value }))}
                                            className="w-24 border border-gray-200 bg-white rounded px-3 py-1.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#0277BD]"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-base font-bold text-[#028090]">₹{doctor.consultationFee || 500}</p>
                                )}
                            </div>

                            {/* Availability */}
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> Availability
                                </p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        placeholder="Availability (e.g. Mon-Fri, 9am - 5pm)"
                                        value={form.availability}
                                        onChange={e => setForm(prev => ({ ...prev, availability: e.target.value }))}
                                        className="w-full border border-gray-200 bg-white rounded px-3 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#0277BD]"
                                    />
                                ) : (
                                    <>
                                        <p className="text-sm font-medium text-gray-800">{doctor.availability || "Mon-Fri, 9 AM – 5 PM"}</p>
                                        <span className="inline-block mt-1.5 bg-[#E6F4EA] text-[#00A896] text-xs font-bold px-3 py-1 rounded-full border border-[#00A896]/20">
                                            Available Today
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Clinic Address */}
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" /> Clinic Address
                                </p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                                        className="w-full border border-gray-200 bg-white rounded px-3 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#0277BD] mt-1"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-800">{doctor.location || doctor.hospital || "Sector 21, Gandhinagar, Gujarat"}</p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfilePage;
