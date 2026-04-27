import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientCard from '../components/PatientCard';
import { apiFetch } from '../../utils/api';
import { Loader2 } from 'lucide-react';

const DoctorPatients = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await apiFetch("/api/doctor/patients");
                if (res.ok) {
                    setPatients(await res.json());
                }
            } catch (err) {
                console.error("Patients fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-[#0ea5e9] animate-spin" />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out_both] pb-12">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Patients</h2>
                <p className="text-gray-500">View and manage patient records</p>
            </div>
            
            <div className="flex flex-col gap-4">
                {patients.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 font-medium">No patients found yet.</p>
                    </div>
                ) : patients.map(patient => (
                    <PatientCard 
                        key={patient._id} 
                        patient={patient} 
                        onClick={() => navigate(`/doctor/patient/${patient._id}`)} 
                    />
                ))}
            </div>
        </div>
    );
};

export default DoctorPatients;
