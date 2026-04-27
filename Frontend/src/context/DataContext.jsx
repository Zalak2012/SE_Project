import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {

    // Doctor Profile (shared between patient view & doctor edit)
    const initialDoctorProfile = {};

    
    // Initial Data
    const initialReviews = [];

    const initialLabTests = [];

    // Try load from local storage
    const loadDataFromStorage = (key, defaultData) => {
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored);
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
    };

    const [reviews, setReviews] = useState(() => loadDataFromStorage('cmp_reviews', initialReviews));
    const [labTests, setLabTests] = useState(() => loadDataFromStorage('cmp_labtests', initialLabTests));
    const [doctorProfile, setDoctorProfile] = useState(() => loadDataFromStorage('cmp_doctorprofile', initialDoctorProfile));

    // Sync to local storage
    useEffect(() => {
        localStorage.setItem('cmp_reviews', JSON.stringify(reviews));
    }, [reviews]);

    useEffect(() => {
        localStorage.setItem('cmp_labtests', JSON.stringify(labTests));
    }, [labTests]);

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

    const value = {
        reviews,
        addReview,
        updateReviewStatus,
        deleteReview,
        labTests,
        addLabTest,
        updateLabTest,
        deleteLabTest,
        doctorProfile,
        updateDoctorProfile
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
