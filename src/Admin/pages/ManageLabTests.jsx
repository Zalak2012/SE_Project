import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, Filter, Search, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ManageLabTests = () => {
    const { labTests, addLabTest, updateLabTest, deleteLabTest } = useData();
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Blood Test',
        price: '',
        description: '',
        status: 'Active',
        icon: '🔬',
        responseTime: '24 hours'
    });

    // Filtering
    const filteredTests = labTests.filter(test => {
        const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              test.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || test.status.toLowerCase() === filter.toLowerCase();
        
        return matchesSearch && matchesFilter;
    });

    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    const openAddModal = () => {
        setEditingTest(null);
        setFormData({
            name: '',
            category: 'Blood Test',
            price: '',
            description: '',
            status: 'Active',
            icon: '🔬',
            responseTime: '24 hours'
        });
        setIsModalOpen(true);
    };

    const openEditModal = (test) => {
        setEditingTest(test);
        setFormData({
            name: test.name,
            category: test.category,
            price: test.price,
            description: test.description,
            status: test.status,
            icon: test.icon,
            responseTime: test.responseTime
        });
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const testData = { ...formData, price: Number(formData.price) };
        if (editingTest) {
            updateLabTest(editingTest.id, testData);
        } else {
            addLabTest(testData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="p-6 md:p-8 space-y-8 bg-white min-h-screen relative">
            {/* Header */}
            <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#01579B] tracking-tight">Manage Lab Tests</h1>
                    <p className="text-gray-500 mt-1 text-[15px]">Add, update and manage lab test services</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-[#028090] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#00A896] transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Add Lab Test
                </button>
            </motion.div>

            {/* Search + Filter Section */}
            <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:flex-1 max-w-xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-500" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search by test name or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#028090]/20 focus:border-[#028090] transition-all shadow-sm"
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setFilter('All')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-sm font-bold shadow-sm ${
                            filter === 'All'
                                ? 'bg-[#028090] border-[#028090] text-white hover:bg-[#00A896]' 
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        All
                    </button>
                    {['Active', 'Inactive'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-xl border transition-all text-sm font-bold shadow-sm ${
                                filter === f 
                                    ? 'bg-[#028090] border-[#028090] text-white hover:bg-[#00A896]' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Table Container */}
            <motion.div {...fadeUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Test Name</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Description</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTests.map((test) => (
                                <tr key={test.id} className="bg-white hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl bg-gray-100 w-10 h-10 flex items-center justify-center rounded-lg">{test.icon}</span>
                                            <p className="font-bold text-gray-900 text-[15px]">{test.name}</p>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 align-middle">
                                        <span className="text-sm font-medium text-gray-600 border border-gray-200 px-2.5 py-1 rounded-md bg-white">
                                            {test.category}
                                        </span>
                                    </td>

                                    <td className="py-4 px-6 align-middle font-bold text-gray-900">
                                        ${test.price}
                                    </td>

                                    <td className="py-4 px-6 align-middle">
                                        <p className="text-gray-600 text-sm line-clamp-2">{test.description}</p>
                                    </td>

                                    <td className="py-4 px-6 align-middle">
                                        <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border ${
                                            test.status === 'Active' 
                                                ? 'bg-[#E6F4EA] text-[#1E8E3E] border-[#CEEAD6]' 
                                                : 'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                            {test.status}
                                        </span>
                                    </td>

                                    <td className="py-4 px-6 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(test)}
                                                className="p-2 text-[#01579B] hover:bg-[#E1F5FE] rounded-lg transition-colors focus:outline-none"
                                                title="Edit"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if(window.confirm('Are you sure you want to delete this lab test?')) {
                                                        deleteLabTest(test.id);
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

                {filteredTests.length === 0 && (
                    <div className="p-12 text-center text-gray-500 font-medium bg-gray-50/50">
                        No lab tests found.
                    </div>
                )}
            </motion.div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingTest ? 'Edit Lab Test' : 'Add Lab Test'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Test Name *</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                                    <select 
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090] bg-white appearance-none"
                                    >
                                        <option value="Blood Test">Blood Test</option>
                                        <option value="Hormone Test">Hormone Test</option>
                                        <option value="Diabetes">Diabetes</option>
                                        <option value="Vitamin">Vitamin</option>
                                        <option value="Scan">Scan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price ($) *</label>
                                    <input 
                                        type="number" 
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                                <textarea 
                                    required
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090] resize-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status *</label>
                                    <select 
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090] bg-white appearance-none"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Icon (Emoji)</label>
                                    <input 
                                        type="text" 
                                        value={formData.icon}
                                        onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090]"
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-100 flex gap-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl font-bold text-white bg-[#028090] hover:bg-[#00A896] shadow-md transition-colors"
                                >
                                    {editingTest ? 'Save Changes' : 'Add Test'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageLabTests;
