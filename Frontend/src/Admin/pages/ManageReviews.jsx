import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Trash2, Filter, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ManageReviews = () => {
    const { reviews, updateReviewStatus, deleteReview } = useData();
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Filtering
    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              review.text.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || review.status.toLowerCase() === filter.toLowerCase();
        
        return matchesSearch && matchesFilter;
    });

    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    const renderStars = (rating) => {
        return "⭐".repeat(rating);
    };

    return (
        <div className="p-6 md:p-8 space-y-8 bg-white min-h-screen">
            {/* Header */}
            <motion.div {...fadeUp}>
                <h1 className="text-[28px] font-bold text-[#01579B] tracking-tight">Manage Reviews</h1>
                <p className="text-gray-500 mt-1 text-[15px]">Approve and manage user and doctor reviews</p>
            </motion.div>

            {/* Search + Filter Section */}
            <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Search */}
                <div className="relative w-full sm:flex-1 max-w-xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-500" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search by name or review text..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 focus:border-[#0277BD] transition-all shadow-sm"
                    />
                </div>

                {/* Filter Buttons */}
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
                    {['Approved', 'Pending'].map(f => (
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

            {/* Reviews Table Container */}
            <motion.div {...fadeUp} className="bg-white rounded-2xl shadow-sm border border-[#E1F5FE] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-[#F5FAFF]">
                                <th className="py-4 px-6 text-xs font-bold text-[#4B6884] uppercase tracking-wider">User</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#4B6884] uppercase tracking-wider">Type</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#4B6884] uppercase tracking-wider w-1/3">Review Text</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#4B6884] uppercase tracking-wider">Rating</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#4B6884] uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#4B6884] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                            {filteredReviews.map((review) => (
                                <tr key={review._id} className="bg-white hover:bg-[#FAFAFA] transition-colors group">
                                    
                                    {/* User Column */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-[#E1F5FE] flex items-center justify-center font-bold text-lg">
                                                {review.avatar ? (
                                                    <img src={review.avatar} alt={review.userName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-[#0277BD]">{review.userName.charAt(0)}</span>
                                                )}
                                            </div>
                                            <p className="font-bold text-[#1F2937] text-[15px]">{review.userName}</p>
                                        </div>
                                    </td>

                                    {/* Type Column */}
                                    <td className="py-4 px-6 align-middle">
                                        <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border ${
                                            review.userType === 'Doctor' 
                                                ? 'bg-[#00BFA5]/10 text-[#00BFA5] border-[#00BFA5]/20' 
                                                : 'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                            {review.userType}
                                        </span>
                                    </td>

                                    {/* Review Text Column */}
                                    <td className="py-4 px-6 align-middle">
                                        <p className="text-gray-600 text-sm line-clamp-2 md:line-clamp-3 italic">"{review.text}"</p>
                                    </td>

                                    {/* Rating Column */}
                                    <td className="py-4 px-6 align-middle whitespace-nowrap">
                                        <div className="text-sm">{renderStars(review.rating)}</div>
                                    </td>

                                    {/* Status Column */}
                                    <td className="py-4 px-6 align-middle">
                                        <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border ${
                                            review.status === 'Approved' 
                                                ? 'bg-[#E6F4EA] text-[#1E8E3E] border-[#CEEAD6]' 
                                                : 'bg-[#FEF7E0] text-[#E37400] border-[#FAD28B]'
                                        }`}>
                                            {review.status}
                                        </span>
                                    </td>

                                    {/* Actions Column */}
                                    <td className="py-4 px-6 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            {review.status === 'Pending' && (
                                                <button
                                                    onClick={() => updateReviewStatus(review._id, 'Approved')}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors focus:outline-none"
                                                    title="Approve"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            )}
                                            {review.status === 'Approved' && (
                                                <button
                                                    onClick={() => updateReviewStatus(review._id, 'Pending')}
                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors focus:outline-none"
                                                    title="Reject/Pending"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    if(window.confirm('Are you sure you want to delete this review?')) {
                                                        deleteReview(review._id);
                                                    }
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredReviews.length === 0 && (
                    <div className="p-12 text-center text-gray-500 font-medium bg-gray-50/50">
                        No reviews found matching your search.
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ManageReviews;
