import React, { useState } from 'react';
import { Plus, Info, X } from 'lucide-react';

const DoctorSchedule = () => {
    // State for selected day
    const [selectedDay, setSelectedDay] = useState('Monday');
    
    // Add Node states
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSlotTime, setNewSlotTime] = useState('');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // State for slots availability
    const [schedule, setSchedule] = useState({
        Monday: [
            { time: '9:00 AM', available: true },
            { time: '9:30 AM', available: true },
            { time: '10:00 AM', available: true },
            { time: '10:30 AM', available: true },
            { time: '11:00 AM', available: true },
            { time: '11:30 AM', available: false },
            { time: '12:00 PM', available: false },
            { time: '12:30 PM', available: false },
            { time: '1:00 PM', available: false },
            { time: '1:30 PM', available: true },
            { time: '2:00 PM', available: true },
            { time: '2:30 PM', available: true },
            { time: '3:00 PM', available: true },
            { time: '3:30 PM', available: true },
            { time: '4:00 PM', available: true }
        ],
        Tuesday: [
            { time: '9:00 AM', available: true },
            { time: '9:30 AM', available: true },
            { time: '10:00 AM', available: true },
            { time: '10:30 AM', available: true },
            { time: '11:00 AM', available: true },
            { time: '11:30 AM', available: true },
            { time: '12:00 PM', available: false },
            { time: '1:00 PM', available: true },
            { time: '1:30 PM', available: true },
            { time: '2:00 PM', available: true }
        ],
        Wednesday: [
            { time: '9:00 AM', available: true },
            { time: '9:30 AM', available: true },
            { time: '10:00 AM', available: true },
            { time: '10:30 AM', available: true }
        ],
        Thursday: [
            { time: '1:00 PM', available: true },
            { time: '1:30 PM', available: true },
            { time: '2:00 PM', available: true },
            { time: '2:30 PM', available: true },
            { time: '3:00 PM', available: true }
        ],
        Friday: [
            { time: '9:00 AM', available: true },
            { time: '9:30 AM', available: true },
            { time: '10:00 AM', available: true }
        ],
        Saturday: [
            { time: '10:00 AM', available: true },
            { time: '10:30 AM', available: true },
            { time: '11:00 AM', available: true },
            { time: '11:30 AM', available: true }
        ],
    });

    // Handle slot toggle
    const toggleSlot = (timeToToggle) => {
        setSchedule(prev => ({
            ...prev,
            [selectedDay]: prev[selectedDay].map(slot => 
                slot.time === timeToToggle 
                    ? { ...slot, available: !slot.available }
                    : slot
            )
        }));
    };

    // Handle delete slot
    const deleteSlot = (e, timeToDelete) => {
        e.stopPropagation();
        setSchedule(prev => ({
            ...prev,
            [selectedDay]: prev[selectedDay].filter(slot => slot.time !== timeToDelete)
        }));
    };

    // Handle add slot mapping
    const handleAddSlot = () => {
        if (!newSlotTime.trim()) return;
        setSchedule(prev => {
            // Avoid duplicate times
            if (prev[selectedDay].some(s => s.time === newSlotTime.trim())) return prev;
            return {
                ...prev,
                [selectedDay]: [...prev[selectedDay], { time: newSlotTime.trim(), available: true }]
            };
        });
        setNewSlotTime('');
        setShowAddModal(false);
    };

    const currentSlots = schedule[selectedDay] || [];
    const availableCount = currentSlots.filter(s => s.available).length;

    return (
        <div className="bg-[#f5f7fb] -m-4 md:-m-8 p-6 md:p-10 min-h-[calc(100vh-64px)] animate-[fadeIn_0.3s_ease-out_both] font-sans text-[#1f2937]">
            
            {/* Header */}
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#1f2937]">Manage Schedule</h1>
                    <p className="text-[#6b7280] font-medium mt-1">Set your weekly availability for patients.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-sm transition-colors text-sm"
                >
                    <Plus className="w-5 h-5" /> Add Slot
                </button>
            </div>

            <div className="max-w-[1200px] mx-auto">
                {/* Day Selector */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm
                                ${selectedDay === day 
                                    ? 'bg-[#3b82f6] text-white shadow-md' 
                                    : 'bg-[#e0f2fe] text-[#3b82f6] hover:bg-[#bae6fd]' 
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* Slots Card */}
                <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="p-6 md:px-8 md:py-6 border-b border-gray-100 flex justify-between items-center bg-[#ffffff]">
                        <h2 className="text-xl font-bold text-[#1f2937]">{selectedDay}'s Slots</h2>
                        <span className="bg-[#e6f7f1] text-[#059669] text-xs font-bold px-3 py-1.5 rounded-full border border-[#34d399]/30">
                            {availableCount} available
                        </span>
                    </div>

                    <div className="p-6 md:p-8">
                        {currentSlots.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                                {currentSlots.map((slot, index) => (
                                    <button
                                        key={index}
                                        onClick={() => toggleSlot(slot.time)}
                                        className={`group relative py-3.5 px-3 rounded-xl text-center font-bold text-sm tracking-wide transition-all border 
                                            ${slot.available 
                                                ? 'bg-[#e6f7f1] border-[#34d399] text-[#1f2937] shadow-sm hover:shadow-md' 
                                                : 'bg-[#e5e7eb] border-transparent text-[#6b7280] hover:bg-gray-300'
                                            }`}
                                    >
                                        {slot.time}
                                        <div className={`absolute top-1/2 -translate-y-1/2 right-3 w-2 h-2 rounded-full ${slot.available ? 'bg-[#34d399]' : 'bg-gray-400'}`}></div>
                                        
                                        {/* Hover Delete Action */}
                                        <div 
                                            onClick={(e) => deleteSlot(e, slot.time)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                                            title="Delete slot"
                                        >
                                            <X className="w-3 h-3" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-[#6b7280] font-medium text-lg">No slots configured for {selectedDay}.</p>
                                <button className="mt-4 text-[#3b82f6] font-bold hover:underline transition-all">
                                    + Generate Default Slots
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Info Box */}
                <div className="bg-blue-50 border border-blue-100/50 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                    <div className="bg-white shadow-sm p-1.5 rounded-full text-[#3b82f6] shrink-0">
                        <Info className="w-5 h-5" />
                    </div>
                    <p className="text-[#6b7280] text-sm md:text-base leading-relaxed font-medium">
                        <strong className="text-[#1f2937] mr-1">Tip:</strong> Click a time slot to toggle its availability. Hover over a slot and click the red 'X' to delete it completely.
                    </p>
                </div>
            </div>

            {/* Add Slot Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                        <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                            <h3 className="text-xl font-bold text-[#1f2937]">Add Slot for {selectedDay}</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot <span className="font-normal text-gray-400">(e.g., 05:00 PM)</span></label>
                            <input 
                                type="text" 
                                value={newSlotTime} 
                                onChange={e => setNewSlotTime(e.target.value)} 
                                placeholder="HH:MM AM/PM"
                                autoFocus
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 font-medium"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddSlot();
                                }}
                            />
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddSlot}
                                className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2.5 font-bold rounded-xl shadow-sm transition-colors"
                            >
                                Save Slot
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorSchedule;
