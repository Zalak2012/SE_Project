import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Clock, CheckCircle2, XCircle, UserCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiFetch } from "../../utils/api";
import { getImageUrl } from "../../utils/getImageUrl";

const DoctorApprovals = () => {
    const navigate = useNavigate();

    // ✅ Dynamic State
    const [allDoctors, setAllDoctors] = useState([]);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);

    const fetchAllDoctors = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            console.log("⏳ Fetching all doctors from MongoDB...");
            const res = await apiFetch("/api/admin/all-doctors");
            
            if (res.ok) {
                const data = await res.json();
                console.log("✅ All Doctors Loaded:", data.length);
                setAllDoctors(data);
                
                // Calculate pending count for the badge
                const count = data.filter(d => d.status === 'pending').length;
                setPendingCount(count);
            }
        } catch (err) {
            console.error("❌ Fetch All Doctors Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllDoctors();
    }, []);

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            console.log("⏳ Approving doctor id:", id);
            const res = await apiFetch(`/api/admin/approve/${id}`, { method: "PUT" });
            if (res.ok) {
                console.log("✅ Approved successfully, refreshing list...");
                await fetchAllDoctors();
            }
        } catch (error) {
            console.error("❌ Approval error:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        setActionLoading(id);
        try {
            console.log("⏳ Rejecting doctor id:", id);
            const res = await apiFetch(`/api/admin/reject/${id}`, { method: "PUT" });
            if (res.ok) {
                console.log("✅ Rejected successfully, refreshing list...");
                await fetchAllDoctors();
            }
        } catch (error) {
            console.error("❌ Rejection error:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredApprovals = allDoctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              doc.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || doc.status === filter.toLowerCase();
        
        return matchesSearch && matchesFilter;
    });

    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium tracking-tight">Fetching registrations...</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
            
            {/* Header Area */}
            <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-[28px] font-bold text-[#01579B] tracking-tight">Doctor Approvals</h1>
                    <p className="text-[#4B5563] mt-1 text-[15px]">Real-time registration queue</p>
                </div>
                
                {/* Pending Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-[#FFF7ED] text-[#EA580C] rounded-full border border-[#FED7AA] shadow-sm font-bold text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{pendingCount} Pending</span>
                </div>
            </motion.div>

            {/* Search + Filter */}
            <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Search */}
                <div className="relative w-full sm:flex-1 max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-500" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 focus:border-[#0277BD] transition-all shadow-sm"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setFilter('All')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-sm font-bold shadow-sm ${
                            filter === 'All'
                                ? 'bg-[#0277BD] border-[#0277BD] text-white hover:bg-[#01579B]' 
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        All
                    </button>
                    {['Pending', 'Approved'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-xl border transition-all text-sm font-bold shadow-sm ${
                                filter === f 
                                    ? 'bg-[#0277BD] border-[#0277BD] text-white hover:bg-[#01579B]' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Approvals List */}
            <motion.div {...fadeUp} className="space-y-4">
                {filteredApprovals.map((doc, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={doc._id} 
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow gap-4"
                    >
                        {/* Doctor Info */}
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#F0F8FF] text-[#0277BD] flex items-center justify-center font-bold text-xl shadow-sm overflow-hidden border border-gray-100">
                                {doc.image ? (
                                    <img 
                                        src={getImageUrl(doc.image)} 
                                        alt={doc.name} 
                                        onError={(e) => { e.target.src = "/default-doctor.png"; }}
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    doc.name.charAt(0) || 'D'
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-[#1F2937] text-[17px] tracking-tight">{doc.name}</h3>
                                <div className="text-[14px] text-[#6B7280] font-medium flex flex-wrap items-center gap-1.5 mt-0.5">
                                    <span>{doc.specialization || "Physician"}</span>
                                    <span>•</span>
                                    <span>{doc.email}</span>
                                </div>
                                <p className="text-[13px] text-[#9CA3AF] mt-1.5 font-medium">Applied {new Date(doc.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 w-full sm:w-auto">
                            {doc.status === 'pending' ? (
                                <>
                                    <button 
                                        onClick={() => handleApprove(doc._id)}
                                        disabled={actionLoading === doc._id}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0277BD] hover:bg-[#01579B] text-white font-bold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        {actionLoading === doc._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Approve</>}
                                    </button>
                                    <button 
                                        onClick={() => handleReject(doc._id)}
                                        disabled={actionLoading === doc._id}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-[#FCA5A5] hover:bg-[#FEF2F2] text-[#EF4444] font-bold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        {actionLoading === doc._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 text-[#EF4444]" /> Reject</>}
                                    </button>
                                </>
                            ) : doc.status === 'approved' ? (
                                <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E0F2F1] text-[#00897B] font-bold text-sm shadow-sm border border-[#B2DFDB]">
                                    <UserCheck className="w-4 h-4" />
                                    Approved
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 text-red-600 font-bold text-sm shadow-sm border border-red-100">
                                    <XCircle className="w-4 h-4" />
                                    Rejected
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}

                {filteredApprovals.length === 0 && (
                    <div className="p-12 text-center text-gray-500 font-medium bg-white rounded-2xl border border-gray-200">
                        No registrations found matching your filters.
                    </div>
                )}
            </motion.div>
        
        </div>
    );
};

export default DoctorApprovals;

