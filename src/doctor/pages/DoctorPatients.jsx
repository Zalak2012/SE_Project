import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPatients } from '../data/mockData';
import PatientCard from '../components/PatientCard';

const DoctorPatients = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out_both] pb-12">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Patients</h2>
                <p className="text-gray-500">View and manage patient records</p>
            </div>
            
            <div className="flex flex-col gap-4">
                {mockPatients.map(patient => (
                    <PatientCard 
                        key={patient.id} 
                        patient={patient} 
                        onClick={() => navigate(`/doctor-patient/${patient.id}`)} 
                    />
                ))}
            </div>
        </div>
    );
};

export default DoctorPatients;
