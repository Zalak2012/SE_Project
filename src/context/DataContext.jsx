import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {

    // Doctor Profile (shared between patient view & doctor edit)
    const initialDoctorProfile = {
        name: "Dr. Sarah Jenkins",
        specialty: "Cardiologist",
        experience: 15,
        rating: 4.9,
        reviews: 124,
        fee: 1500,
        about: "Dr. Sarah Jenkins is a board-certified Cardiologist with over 15 years of experience in diagnosing and treating cardiovascular diseases. She specializes in preventive cardiology, echocardiography, and heart failure management. She is dedicated to providing compassionate, patient-centered care and utilizing the latest medical advancements.",
        education: [
            { degree: "M.D.", institute: "Harvard Medical School" },
            { degree: "Residency in Internal Medicine", institute: "Johns Hopkins Hospital" },
            { degree: "Fellowship in Cardiovascular Disease", institute: "Mayo Clinic" }
        ],
        availability: { days: "Mon-Fri", time: "9 AM – 5 PM" },
        address: "HeartCare Center, NY",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    };

    
    // Initial Data
    const initialReviews = [
        {
            id: 1,
            userName: "Sarah Jenkins",
            userType: "Patient",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
            text: "The platform is incredibly easy to use. I was able to find a specialist and book an appointment for my mother within just 5 minutes. Highly recommended!",
            rating: 5,
            status: "Approved"
        },
        {
            id: 2,
            userName: "Dr. Marcus Thorne",
            userType: "Doctor",
            avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
            text: "CareMatePlus has completely streamlined my clinic's workflow. The digital records and easy scheduling system give me more time to focus on actual patient care.",
            rating: 5,
            status: "Approved"
        },
        {
            id: 3,
            userName: "David Chen",
            userType: "Patient",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
            text: "The AI symptom checker is remarkably accurate! It guided me to the right type of doctor when I wasn't sure what my symptoms meant. True peace of mind.",
            rating: 5,
            status: "Approved"
        },
        {
            id: 4,
            userName: "Emma Wilson",
            userType: "Patient",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
            text: "Fantastic experience with the lab tests at home. The phlebotomist was on time and very professional.",
            rating: 4,
            status: "Pending"
        }
    ];

    const initialLabTests = [
        { id: 1, name: "Complete Blood Count (CBC)", category: "Blood Test", description: "Measures different components of your blood.", price: 35, responseTime: "24 hours", icon: "🔬", status: "Active" },
        { id: 2, name: "Lipid Panel", category: "Blood Test", description: "Checks cholesterol and triglycerides levels.", price: 50, responseTime: "24 hours", icon: "🧪", status: "Active" },
        { id: 3, name: "Thyroid Function Test", "category": "Hormone Test", description: "Evaluates how well your thyroid is working.", price: 65, responseTime: "48 hours", icon: "🦋", status: "Active" },
        { id: 4, name: "HbA1c", category: "Diabetes", description: "Measures your average blood sugar levels.", price: 45, responseTime: "24 hours", icon: "🩸", status: "Active" },
        { id: 5, name: "Vitamin D Test", category: "Vitamin", description: "Checks for vitamin D deficiency.", price: 55, responseTime: "24 hours", icon: "☀️", status: "Active" },
        { id: 6, name: "Liver Function Test", category: "Blood Test", description: "Checks the levels of enzymes and proteins.", price: 40, responseTime: "24 hours", icon: "🧬", status: "Active" },
        { id: 7, name: "Kidney Profile", category: "Blood Test", description: "Evaluates kidney health.", price: 60, responseTime: "24 hours", icon: "🩺", status: "Inactive" }
    ];

    const initialAppointments = [
        { id: 1, name: "Dr. Sarah Chen", specialization: "Cardiologist", date: "Feb 26, 2026", time: "3:00 PM", status: "upcoming", initials: "SC" },
        { id: 2, name: "Dr. Emily Park", specialization: "Pediatrician", date: "Feb 20, 2026", time: "10:00 AM", status: "completed", initials: "EP" },
        { id: 3, name: "Dr. James Wilson", specialization: "Dermatologist", date: "Feb 15, 2026", time: "2:00 PM", status: "completed", initials: "JW" }
    ];

    const initialMedicalRecords = [
        { id: 1, patientName: "John Doe", initials: "JD", condition: "Type 2 Diabetes", description: "Regular 3-month follow up check. Blood sugar levels stable.", date: "Feb 10, 2026", status: "Ongoing" },
        { id: 2, patientName: "Emma Wilson", initials: "EW", condition: "Hypertension", description: "Blood pressure elevated. Medication adjusted.", date: "Jan 25, 2026", status: "Ongoing" },
        { id: 3, patientName: "David Chen", initials: "DC", condition: "Viral Bronchitis", description: "Patient recovered fully after 2 weeks of rest and fluids.", date: "Dec 15, 2025", status: "Resolved" }
    ];

    const initialPrescriptions = [
        { id: 1, patientName: "John Doe", date: "Feb 10, 2026", diagnosis: "Type 2 Diabetes", medicines: [{ name: "Metformin", dosage: "500mg twice daily", duration: "90 days" }], notes: "Maintain low carb diet." },
        { id: 2, patientName: "Emma Wilson", date: "Jan 25, 2026", diagnosis: "Hypertension", medicines: [{ name: "Lisinopril", dosage: "10mg once daily", duration: "30 days" }, { name: "Amlodipine", dosage: "5mg once daily", duration: "30 days" }], notes: "Check BP weekly." }
    ];

    // Try load from local storage
    const loadDataFromStorage = (key, defaultData) => {
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored);
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
    };

    const [reviews, setReviews] = useState(() => loadDataFromStorage('cmp_reviews', initialReviews));
    const [labTests, setLabTests] = useState(() => loadDataFromStorage('cmp_labtests', initialLabTests));
    const [appointments, setAppointments] = useState(() => loadDataFromStorage('cmp_appointments', initialAppointments));
    const [medicalRecords, setMedicalRecords] = useState(() => loadDataFromStorage('cmp_medicalrecords', initialMedicalRecords));
    const [prescriptions, setPrescriptions] = useState(() => loadDataFromStorage('cmp_prescriptions', initialPrescriptions));
    const [doctorProfile, setDoctorProfile] = useState(() => loadDataFromStorage('cmp_doctorprofile', initialDoctorProfile));

    // Sync to local storage
    useEffect(() => {
        localStorage.setItem('cmp_reviews', JSON.stringify(reviews));
    }, [reviews]);

    useEffect(() => {
        localStorage.setItem('cmp_labtests', JSON.stringify(labTests));
    }, [labTests]);

    useEffect(() => {
        localStorage.setItem('cmp_appointments', JSON.stringify(appointments));
    }, [appointments]);

    useEffect(() => {
        localStorage.setItem('cmp_medicalrecords', JSON.stringify(medicalRecords));
    }, [medicalRecords]);

    useEffect(() => {
        localStorage.setItem('cmp_prescriptions', JSON.stringify(prescriptions));
    }, [prescriptions]);

    useEffect(() => {
        localStorage.setItem('cmp_doctorprofile', JSON.stringify(doctorProfile));
    }, [doctorProfile]);

    // Doctor Profile Actions
    const updateDoctorProfile = (updatedData) => {
        setDoctorProfile(prev => ({ ...prev, ...updatedData }));
    };

    // Review Actions
    const addReview = (review) => {
        const newReview = { ...review, id: Date.now() };
        setReviews(prev => [newReview, ...prev]);
    };

    const updateReviewStatus = (id, status) => {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    };

    const deleteReview = (id) => {
        setReviews(prev => prev.filter(r => r.id !== id));
    };

    // Lab Test Actions
    const addLabTest = (test) => {
        const newTest = {
            ...test,
            id: Date.now(), 
            responseTime: test.responseTime || "24 hours",
            icon: test.icon || "🧪"
        };
        setLabTests(prev => [...prev, newTest]);
    };

    const updateLabTest = (id, updatedData) => {
        setLabTests(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    };

    const deleteLabTest = (id) => {
        setLabTests(prev => prev.filter(t => t.id !== id));
    };

    // Appointments actions
    const addAppointment = (appointment) => {
        const newAppt = { ...appointment, id: Date.now() };
        setAppointments(prev => [newAppt, ...prev]);
    };

    const cancelAppointment = (id) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    };

    // Prescription actions
    const addPrescription = (prescription) => {
        setPrescriptions(prev => [{ ...prescription, id: Date.now() }, ...prev]);
    };

    const updatePrescription = (id, updatedData) => {
        setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    const value = {
        reviews,
        addReview,
        updateReviewStatus,
        deleteReview,
        labTests,
        addLabTest,
        updateLabTest,
        deleteLabTest,
        appointments,
        addAppointment,
        cancelAppointment,
        medicalRecords,
        prescriptions,
        addPrescription,
        updatePrescription,
        doctorProfile,
        updateDoctorProfile
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
