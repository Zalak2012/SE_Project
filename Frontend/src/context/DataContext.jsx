import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {

    const [reviews, setReviews] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [doctorProfile, setDoctorProfile] = useState(() => {
        const stored = localStorage.getItem('cmp_doctorprofile');
        return stored ? JSON.parse(stored) : {};
    });

    // Sync doctor profile to local storage
    useEffect(() => {
        localStorage.setItem('cmp_doctorprofile', JSON.stringify(doctorProfile));
    }, [doctorProfile]);

    const updateDoctorProfile = (updatedData) => {
        setDoctorProfile(prev => ({ ...prev, ...updatedData }));
    };

    // Fetch Reviews from backend
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await apiFetch("/api/reviews");
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data);
                }
            } catch (err) {
                console.error("Reviews fetch error:", err);
            }
        };
        fetchReviews();
    }, []);

    // Review Actions
    const addReview = async (review) => {
        try {
            const res = await apiFetch("/api/reviews", {
                method: "POST",
                body: JSON.stringify(review)
            });
            if (res.ok) {
                const newReview = await res.json();
                setReviews(prev => [newReview, ...prev]);
            }
        } catch (err) {
            console.error("Add review error:", err);
        }
    };

    const updateReviewStatus = async (id, status) => {
        try {
            const res = await apiFetch(`/api/reviews/${id}`, {
                method: "PUT",
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                const updated = await res.json();
                setReviews(prev => prev.map(r => r._id === id ? updated : r));
            }
        } catch (err) {
            console.error("Update review status error:", err);
        }
    };

    const deleteReview = async (id) => {
        try {
            const res = await apiFetch(`/api/reviews/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setReviews(prev => prev.filter(r => r._id !== id));
            }
        } catch (err) {
            console.error("Delete review error:", err);
        }
    };

    // Fetch lab tests from backend
    useEffect(() => {
        const fetchLabTests = async () => {
            try {
                const res = await apiFetch("/api/labtests");
                if (res.ok) {
                    const data = await res.json();
                    setLabTests(data);
                }
            } catch (err) {
                console.error("Lab tests fetch error:", err);
            }
        };
        fetchLabTests();
    }, []);

    // Lab Test Actions
    const addLabTest = async (test) => {
        try {
            const res = await apiFetch("/api/labtests", {
                method: "POST",
                body: JSON.stringify(test)
            });
            if (res.ok) {
                const newTest = await res.json();
                setLabTests(prev => [newTest, ...prev]);
            }
        } catch (err) {
            console.error("Add lab test error:", err);
        }
    };

    const updateLabTest = async (id, updatedData) => {
        try {
            const res = await apiFetch(`/api/labtests/${id}`, {
                method: "PUT",
                body: JSON.stringify(updatedData)
            });
            if (res.ok) {
                const updated = await res.json();
                setLabTests(prev => prev.map(t => t._id === id ? updated : t));
            }
        } catch (err) {
            console.error("Update lab test error:", err);
        }
    };

    const deleteLabTest = async (id) => {
        try {
            const res = await apiFetch(`/api/labtests/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setLabTests(prev => prev.filter(t => t._id !== id));
            }
        } catch (err) {
            console.error("Delete lab test error:", err);
        }
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
