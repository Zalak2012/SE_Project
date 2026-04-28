import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const LabTestsPage = () => {
    const [savedAddresses, setSavedAddresses] = useState(() => {
        const stored = localStorage.getItem('cmp_addresses');
        return stored ? JSON.parse(stored) : [];
    });

    const addAddress = (addr) => {
        const newAddr = { ...addr, id: Date.now() };
        const newAddrs = [...savedAddresses, newAddr];
        setSavedAddresses(newAddrs);
        localStorage.setItem('cmp_addresses', JSON.stringify(newAddrs));
        return newAddr;
    };

    const updateAddress = (id, updatedAddr) => {
        const newAddrs = savedAddresses.map(a => a.id === id ? { ...a, ...updatedAddr } : a);
        setSavedAddresses(newAddrs);
        localStorage.setItem('cmp_addresses', JSON.stringify(newAddrs));
    };

    // Lab test data
    const labTestData = [
        { id: 1, name: "Complete Blood Count (CBC)", category: "Blood Test", description: "Measures different components of your blood.", price: 35, responseTime: "24 hours", icon: "🔬" },
        { id: 2, name: "Lipid Panel", category: "Blood Test", description: "Checks cholesterol and triglycerides levels.", price: 50, responseTime: "24 hours", icon: "🧪" },
        { id: 3, name: "Thyroid Function Test", category: "Hormone Test", description: "Evaluates how well your thyroid is working.", price: 65, responseTime: "48 hours", icon: "🦋" },
        { id: 4, name: "HbA1c", category: "Diabetes", description: "Measures your average blood sugar levels.", price: 45, responseTime: "24 hours", icon: "🩸" },
        { id: 5, name: "Vitamin D Test", category: "Vitamin", description: "Checks for vitamin D deficiency.", price: 55, responseTime: "24 hours", icon: "☀️" },
        { id: 6, name: "Liver Function Test", category: "Blood Test", description: "Checks the levels of enzymes and proteins.", price: 40, responseTime: "24 hours", icon: "🧬" }
    ];

    // Cart state
    const [selectedTests, setSelectedTests] = useState([]);

    // Modal states
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showAddressSelect, setShowAddressSelect] = useState(false);
    const [showBookingConfirm, setShowBookingConfirm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    // Selected address for booking
    const [selectedAddress, setSelectedAddress] = useState(null);

    // Toast
    const [toastMessage, setToastMessage] = useState('');

    // Address form state
    const emptyForm = { fullName: '', phone: '', house: '', area: '', city: '', state: '', pincode: '' };
    const [addressForm, setAddressForm] = useState(emptyForm);

    // Form State
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Cart Logic ---
    const handleAddToCart = (test) => {
        if (selectedTests.some(t => t.id === test.id)) {
            setSelectedTests(selectedTests.filter(t => t.id !== test.id));
        } else {
            setSelectedTests([...selectedTests, test]);
        }
    };

    const totalSelected = selectedTests.length;
    const totalPrice = selectedTests.reduce((acc, test) => acc + test.price, 0);
    const isSelected = (id) => selectedTests.some(t => t.id === id);

    const getBadgeStyle = (category) => {
        switch (category) {
            case 'Blood Test': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Hormone Test': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Diabetes': return 'bg-red-50 text-red-600 border-red-100';
            case 'Vitamin': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    // --- Toast ---
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // --- Home Collection Click ---
    const handleHomeCollection = () => {
        if (savedAddresses.length === 0) {
            setEditingAddress(null);
            setAddressForm(emptyForm);
            setShowAddressForm(true);
        } else {
            setShowAddressSelect(true);
        }
    };

    // --- Pay & Book Click ---
    const handlePayAndBook = () => {
        if (!selectedAddress) {
            showToast("⚠️ Please select an address first via Home Collection");
            return;
        }
        setShowBookingConfirm(true);
    };

    // --- Address Form Handlers ---
    const handleFormChange = (field, value) => {
        setAddressForm(prev => ({ ...prev, [field]: value }));
    };

    const isFormValid = () => {
        return addressForm.fullName && addressForm.phone && addressForm.house && addressForm.city && addressForm.state && addressForm.pincode;
    };

    const handleSaveAddress = () => {
        if (!isFormValid()) return;

        if (editingAddress) {
            updateAddress(editingAddress.id, addressForm);
            if (selectedAddress && selectedAddress.id === editingAddress.id) {
                setSelectedAddress({ ...selectedAddress, ...addressForm });
            }
            showToast("✅ Address updated successfully");
        } else {
            const newAddr = addAddress(addressForm);
            setSelectedAddress(newAddr);
            showToast("✅ Address saved successfully");
        }
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressForm(emptyForm);
    };

    const handleEditAddress = (addr) => {
        setEditingAddress(addr);
        setAddressForm({
            fullName: addr.fullName,
            phone: addr.phone,
            house: addr.house,
            area: addr.area || '',
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode
        });
        setShowAddressSelect(false);
        setShowAddressForm(true);
    };

    const handleUseAddress = (addr) => {
        setSelectedAddress(addr);
        setShowAddressSelect(false);
        showToast("✅ Address selected for home collection");
    };

    const handleAddNewFromSelect = () => {
        setShowAddressSelect(false);
        setEditingAddress(null);
        setAddressForm(emptyForm);
        setShowAddressForm(true);
    };

    const handleConfirmBooking = async () => {
        setIsProcessing(true);
        try {
            const orderRes = await apiFetch("/api/payment/create-order", {
                method: "POST",
                body: JSON.stringify({ amount: totalPrice })
            });
            const orderData = await orderRes.json();
            
            if (!orderRes.ok) throw new Error(orderData.message);

            const options = {
                key: "rzp_test_ShOSBAQY65rTHB",
                amount: orderData.amount,
                currency: orderData.currency,
                name: "CareMate AI",
                description: "Lab Test Home Collection",
                order_id: orderData.id,
                handler: async (response) => {
                    const verifyRes = await apiFetch("/api/payment/verify", {
                        method: "POST",
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })
                    });
                    const verifyData = await verifyRes.json();
                    
                    if (verifyData.success) {
                        setShowBookingConfirm(false);
                        setSelectedTests([]);
                        setSelectedAddress(null);
                        showToast("🎉 Payment successful! Your samples will be collected.");
                    } else {
                        alert("Payment verification failed.");
                    }
                    setIsProcessing(false);
                },
                prefill: {
                    name: addressForm.fullName || "Patient",
                    contact: addressForm.phone || "9999999999"
                },
                theme: { color: "#028090" }
            };
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert(response.error.description);
                setIsProcessing(false);
            });
            rzp.open();
        } catch (error) {
            console.error("Payment error:", error);
            alert("Could not initialize payment");
            setIsProcessing(false);
        }
    };

    // Format address for display
    const formatAddress = (addr) => {
        const parts = [addr.house, addr.area, addr.city, addr.state, addr.pincode].filter(Boolean);
        return parts.join(', ');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col w-full relative pb-24 md:pb-32">
            <Navbar />

            {/* --- TOAST --- */}
            <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[300] transition-all duration-300 ${toastMessage ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}`}>
                <div className="bg-white px-6 py-3 rounded-xl shadow-lg border border-gray-100 font-bold text-gray-800 flex items-center gap-2">
                    {toastMessage}
                </div>
            </div>

            <main className="flex-grow flex flex-col items-center p-4 py-12 w-full max-w-7xl mx-auto space-y-12">
                {/* PAGE HEADER */}
                <header className="w-full text-center space-y-3 animate-[fadeIn_0.4s_ease-out_both]">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Lab Tests</h1>
                    <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
                        Book diagnostic tests with home collection or lab visit.
                    </p>
                </header>

                {/* Selected address indicator */}
                {selectedAddress && (
                    <div className="w-full max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4 animate-[fadeIn_0.3s_ease-out_both]">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-green-800">Delivery Address Selected</p>
                            <p className="text-xs text-green-600 truncate">{selectedAddress.fullName} — {formatAddress(selectedAddress)}</p>
                        </div>
                        <button onClick={() => setShowAddressSelect(true)} className="text-xs font-bold text-green-700 hover:text-green-900 underline shrink-0">Change</button>
                    </div>
                )}

                {/* GRID LAYOUT */}
                <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-[slideUp_0.5s_ease-out_both]">
                    {labTestData.map((test) => (
                        <div key={test.id} className={`group relative bg-white rounded-2xl shadow-sm border p-6 md:p-8 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isSelected(test.id) ? 'border-[#00A896] ring-2 ring-[#00A896]/10 bg-[#f0f9f8]' : 'border-gray-100'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-4xl bg-gray-50 w-14 h-14 flex items-center justify-center rounded-xl shadow-inner group-hover:scale-110 transition-transform">{test.icon}</div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(test.category)}`}>{test.category}</span>
                            </div>
                            <div className="flex-grow space-y-2">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#01579B] transition-colors">{test.name}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{test.description}</p>
                                <div className="flex items-center gap-2 pt-2">
                                    <span className="text-[10px] uppercase font-bold text-[#028090] bg-[#E1F5FE] px-2 py-0.5 rounded">⏱ {test.responseTime}</span>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-50">
                                <span className="text-2xl font-bold text-gray-900">${test.price}</span>
                                <button onClick={() => handleAddToCart(test)} className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${isSelected(test.id) ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-[#00A896] text-white hover:bg-[#028090] shadow-md hover:shadow-lg'}`}>
                                    {isSelected(test.id) ? 'Remove' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            {/* ========== STICKY SUMMARY BAR ========== */}
            <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] p-4 md:p-6 z-[100] transform transition-transform duration-500 ${totalSelected > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6 text-center md:text-left">
                        <div className="flex flex-col">
                            <span className="text-lg md:text-xl font-bold text-gray-900">{totalSelected} {totalSelected === 1 ? 'test' : 'tests'} selected</span>
                            <span className="text-xs text-gray-500 font-medium">Selected tests for booking</span>
                        </div>
                        <div className="w-px h-10 bg-gray-100 hidden md:block"></div>
                        <div className="flex flex-col">
                            <span className="text-lg md:text-2xl font-black text-[#028090] tracking-tight">${totalPrice}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Total Amount</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <button onClick={handleHomeCollection} className="flex-1 md:flex-none bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold px-8 py-3 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                            Home Collection
                        </button>
                        <button onClick={handlePayAndBook} className="flex-1 md:flex-none bg-[#01579B] hover:bg-[#0277BD] text-white font-bold px-10 py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 border border-transparent">
                            Pay & Book Now
                        </button>
                    </div>
                </div>
            </div>

            {/* ========== ADDRESS FORM MODAL ========== */}
            {showAddressForm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]" onClick={() => { setShowAddressForm(false); setEditingAddress(null); }}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
                            <p className="text-sm text-gray-500 mt-1">Enter your address for home sample collection</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                                <input type="text" value={addressForm.fullName} onChange={(e) => handleFormChange('fullName', e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090] bg-white text-gray-800 font-medium transition-colors" />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                                <input type="tel" value={addressForm.phone} onChange={(e) => handleFormChange('phone', e.target.value)} placeholder="+1 (234) 567-890" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090] bg-white text-gray-800 font-medium transition-colors" />
                            </div>

                            {/* House */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">House / Flat / Building *</label>
                                <input type="text" value={addressForm.house} onChange={(e) => handleFormChange('house', e.target.value)} placeholder="Apt 4B, Sunrise Tower" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090] bg-white text-gray-800 font-medium transition-colors" />
                            </div>

                            {/* Area */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Area / Street</label>
                                <input type="text" value={addressForm.area} onChange={(e) => handleFormChange('area', e.target.value)} placeholder="MG Road" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090] bg-white text-gray-800 font-medium transition-colors" />
                            </div>

                            {/* City & State */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                                    <input type="text" value={addressForm.city} onChange={(e) => handleFormChange('city', e.target.value)} placeholder="Mumbai" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090] bg-white text-gray-800 font-medium transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">State *</label>
                                    <input type="text" value={addressForm.state} onChange={(e) => handleFormChange('state', e.target.value)} placeholder="Maharashtra" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090] bg-white text-gray-800 font-medium transition-colors" />
                                </div>
                            </div>

                            {/* Pincode */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pincode *</label>
                                <input type="text" value={addressForm.pincode} onChange={(e) => handleFormChange('pincode', e.target.value)} placeholder="400001" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#028090] focus:ring-1 focus:ring-[#028090] bg-white text-gray-800 font-medium transition-colors" />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button onClick={() => { setShowAddressForm(false); setEditingAddress(null); }} className="flex-1 py-3 rounded-xl font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSaveAddress} disabled={!isFormValid()} className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${isFormValid() ? 'bg-[#028090] hover:bg-[#00A896] shadow-md' : 'bg-gray-300 cursor-not-allowed'}`}>
                                {editingAddress ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== ADDRESS SELECTION MODAL ========== */}
            {showAddressSelect && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]" onClick={() => setShowAddressSelect(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Select Address</h2>
                            <p className="text-sm text-gray-500 mt-1">Choose a delivery address for home collection</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {savedAddresses.map((addr) => (
                                <div key={addr.id} className={`p-4 rounded-xl border-2 transition-all cursor-pointer group ${selectedAddress?.id === addr.id ? 'border-[#028090] bg-[#f0fdfa]' : 'border-gray-100 hover:border-gray-300'}`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0" onClick={() => handleUseAddress(addr)}>
                                            <p className="font-bold text-gray-900 text-sm">{addr.fullName}</p>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{formatAddress(addr)}</p>
                                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                {addr.phone}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button onClick={() => handleEditAddress(addr)} className="p-2 text-gray-400 hover:text-[#028090] hover:bg-gray-50 rounded-lg transition-colors" title="Edit">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                    {selectedAddress?.id === addr.id && (
                                        <div className="mt-3 pt-3 border-t border-[#028090]/20">
                                            <span className="text-xs font-bold text-[#028090] flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                Currently selected
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Add New Address Button */}
                            <button onClick={handleAddNewFromSelect} className="w-full p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#028090] hover:bg-[#f0fdfa] text-gray-500 hover:text-[#028090] font-bold text-sm transition-all flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Add New Address
                            </button>
                        </div>

                        <div className="p-6 border-t border-gray-100">
                            <button onClick={() => setShowAddressSelect(false)} className="w-full py-3 rounded-xl font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== BOOKING CONFIRMATION MODAL ========== */}
            {showBookingConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]" onClick={() => setShowBookingConfirm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Confirm Booking</h2>
                            <p className="text-sm text-gray-500 mt-1">Review your order before confirming</p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Selected Tests */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Selected Tests</h3>
                                <div className="space-y-2">
                                    {selectedTests.map(test => (
                                        <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{test.icon}</span>
                                                <span className="text-sm font-semibold text-gray-800">{test.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">${test.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-600">Total Amount</span>
                                    <span className="text-xl font-black text-[#028090]">${totalPrice}</span>
                                </div>
                            </div>

                            {/* Selected Address */}
                            {selectedAddress && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Collection Address</h3>
                                    <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                        <p className="font-bold text-gray-900 text-sm">{selectedAddress.fullName}</p>
                                        <p className="text-xs text-gray-600 mt-1">{formatAddress(selectedAddress)}</p>
                                        <p className="text-xs text-gray-500 mt-1">📞 {selectedAddress.phone}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button onClick={() => setShowBookingConfirm(false)} className="flex-1 py-3 rounded-xl font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                                Go Back
                            </button>
                            <button onClick={handleConfirmBooking} disabled={isProcessing} className="flex-1 py-3 rounded-xl font-bold text-white bg-[#01579B] hover:bg-[#0277BD] shadow-md transition-all">
                                {isProcessing ? "Processing..." : `Confirm & Pay $${totalPrice}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default LabTestsPage;
