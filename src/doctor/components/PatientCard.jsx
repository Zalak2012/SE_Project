import React from 'react';

const PatientCard = ({ patient, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-[#028090]/40 transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-start md:items-center gap-4 group"
        >
            <div className="w-14 h-14 bg-gradient-to-br from-[#01579B] to-[#028090] rounded-xl text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
                {patient.avatar}
            </div>
            
            <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#01579B] transition-colors">{patient.name}</h3>
                <p className="text-sm text-gray-500">{patient.email}</p>
            </div>
            
            <div className="hidden md:block w-px h-10 bg-gray-100 mx-4" />
            
            <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Recent Symptoms</p>
                <div className="flex flex-wrap gap-1">
                    {patient.symptoms.split(',').map((s, i) => (
                        <span key={i} className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-100">
                            {s.trim()}
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="hidden md:block w-px h-10 bg-gray-100 mx-4" />
            
            <div className="flex flex-col items-start md:items-end w-full md:w-auto">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Last Visit</p>
                <p className="text-sm font-semibold text-gray-800">{patient.lastVisit}</p>
            </div>
            
            <div className="hidden md:flex ml-4 w-8 h-8 rounded-full bg-gray-50 border border-gray-200 items-center justify-center text-gray-400 group-hover:bg-[#028090] group-hover:text-white group-hover:border-transparent transition-all">
                →
            </div>
        </div>
    );
};

export default PatientCard;
