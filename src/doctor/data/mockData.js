export const mockPatients = [
    { id: 1, name: "John Doe", email: "john.d@example.com", lastVisit: "Oct 24, 2026", symptoms: "Fever, Headache", avatar: "JD" },
    { id: 2, name: "Emma Wilson", email: "emma.w@example.com", lastVisit: "Oct 22, 2026", symptoms: "Chest pain", avatar: "EW" },
    { id: 3, name: "David Chen", email: "david.c@example.com", lastVisit: "Oct 20, 2026", symptoms: "Knee pain", avatar: "DC" },
    { id: 4, name: "Sarah Jenkins", email: "sarah.j@example.com", lastVisit: "Oct 15, 2026", symptoms: "Skin rash", avatar: "SJ" }
];

export const mockMedicalRecords = [
    { id: 101, patientId: 1, title: "General Consultation", condition: "Viral Infection", description: "Patient has high fever and body aches. Prescribed rest.", status: "Resolved", date: "Oct 24, 2026" },
    { id: 102, patientId: 2, title: "Cardiac Checkup", condition: "Arrhythmia Monitoring", description: "Irregular heartbeat detected during stress test.", status: "Ongoing", date: "Oct 22, 2026" },
];

export const mockPrescriptions = [
    { id: 201, patientId: 1, medicine: "Paracetamol", dosage: "500mg - Twice daily", notes: "Take after meals for 3 days.", date: "Oct 24, 2026" },
    { id: 202, patientId: 2, medicine: "Aspirin", dosage: "75mg - Once daily", notes: "Take in the morning.", date: "Oct 22, 2026" }
];
