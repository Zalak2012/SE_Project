const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Path to User model
require('dotenv').config(); // Load .env from current working directory (Backend root)

const doctorsData = [
  {
    name: "Dr. Sarah Jenkins",
    email: "sarah.jenkins@caremate.com",
    password: "123456",
    role: "doctor",
    specialization: "Cardiologist",
    experience: 15,
    consultationFee: 1500,
    location: "HeartCare Center, NY",
    hospital: "HeartCare Center",
    rating: 4.9,
    patientsCount: 124,
    verified: true,
    available: true,
    image: "/uploads/doctors/doctor1.jpg",
    bio: "Senior Consultant Cardiologist with vast experience in interventional cardiology.",
    education: "MD, DM (Cardiology) - AIIMS",
    availability: "Mon-Fri, 9am - 5pm",
    city: "Ahmedabad",
    state: "Gujarat"
  },
  {
    name: "Dr. Marcus Thorne",
    email: "marcus.thorne@caremate.com",
    password: "123456",
    role: "doctor",
    specialization: "Neurologist",
    experience: 12,
    consultationFee: 2000,
    location: "Neuro Health Clinic",
    hospital: "Neuro Health Clinic",
    rating: 4.8,
    patientsCount: 98,
    verified: true,
    available: true,
    image: "/uploads/doctors/doctor2.jpg",
    bio: "Specialist in high-risk pregnancy and laparoscopic surgeries.",
    education: "MS - Obstetrics & Gynaecology",
    availability: "Tue-Sat, 10am - 6pm",
    city: "Ahmedabad",
    state: "Gujarat"
  },
  {
    name: "Dr. Emily Chen",
    email: "emily.chen@caremate.com",
    password: "123456",
    role: "doctor",
    specialization: "Pediatrician",
    experience: 8,
    consultationFee: 1000,
    location: "KidsFirst Hospital",
    hospital: "KidsFirst Hospital",
    rating: 4.9,
    patientsCount: 215,
    verified: true,
    available: true,
    image: "/uploads/doctors/doctor3.jpg",
    bio: "Joint replacement and sports injury specialist.",
    education: "MS (Ortho), Fellowship in Arthroplasty (Germany)",
    availability: "Mon-Sat, 8am - 4pm",
    city: "Ahmedabad",
    state: "Gujarat"
  },
  {
    name: "Dr. James Wilson",
    email: "james.wilson@caremate.com",
    password: "123456",
    role: "doctor",
    specialization: "Dermatologist",
    experience: 20,
    consultationFee: 1200,
    location: "Skin Perfect Clinic",
    hospital: "Skin Perfect Clinic",
    rating: 4.7,
    patientsCount: 156,
    verified: true,
    available: true,
    image: "/uploads/doctors/doctor4.jpg",
    bio: "Dedicated to providing compassionate care for newborns and children.",
    education: "MBBS, DCH (Pediatrics)",
    availability: "Mon-Wed, 10am - 7pm",
    city: "Ahmedabad",
    state: "Gujarat"
  },
  {
    name: "Dr. Vikram Rathod",
    email: "vikram.rathod@caremate.com",
    password: "123456",
    role: "doctor",
    specialization: "Neurologist",
    experience: 22,
    consultationFee: 1500,
    location: "Science City Road, Ahmedabad",
    hospital: "CIMS Hospital",
    rating: 4.9,
    patientsCount: 2200,
    verified: true,
    available: true,
    image: "/uploads/doctors/doctor5.jpg",
    bio: "Expert in stroke management and epilepsy treatment.",
    education: "MD (Medicine), DM (Neurology)",
    availability: "Mon-Fri (04:00 PM - 08:00 PM)",
    city: "Ahmedabad",
    state: "Gujarat"
  },
  {
    name: "Dr. Neha Gupta",
    email: "neha.gupta@caremate.com",
    password: "123456",
    role: "doctor",
    specialization: "Dermatologist",
    experience: 10,
    consultationFee: 700,
    location: "Prahladnagar, Ahmedabad",
    hospital: "Sterling Hospital",
    rating: 4.6,
    patientsCount: 1100,
    verified: true,
    available: true,
    image: "/uploads/doctors/doctor6.jpg",
    bio: "Clinical and cosmetic dermatology specialist.",
    education: "MD (Dermatology)",
    availability: "Daily (10:00 AM - 02:00 PM)",
    city: "Ahmedabad",
    state: "Gujarat"
  },
  {
    name: "Dr. Sameer Joshi",
    email: "sameer.joshi@caremate.com",
    password: "123456",
    role: "doctor",
    specialization: "General Physician",
    experience: 25,
    consultationFee: 500,
    location: "Sector 7, Gandhinagar",
    hospital: "Civil Hospital",
    rating: 4.5,
    patientsCount: 5000,
    verified: true,
    available: true,
    image: "/uploads/doctors/doctor7.jpg",
    bio: "Family physician with focus on preventive care.",
    education: "MBBS, MD (General Medicine)",
    availability: "Mon-Sat (08:00 AM - 02:00 PM)",
    city: "Gandhinagar",
    state: "Gujarat"
  },
  {
    name: "Dr. Kavita Desai",
    email: "kavita.desai@caremate.com",
    password: "123456",
    role: "doctor",
    specialization: "ENT Specialist",
    experience: 14,
    consultationFee: 650,
    location: "Sector 21, Gandhinagar",
    hospital: "Apollo Clinic",
    rating: 4.7,
    patientsCount: 1400,
    verified: true,
    available: true,
    image: "/uploads/doctors/doctor8.jpg",
    bio: "Expert in hearing disorders and sinus surgeries.",
    education: "MS (ENT)",
    availability: "Tue-Sat (05:00 PM - 09:00 PM)",
    city: "Gandhinagar",
    state: "Gujarat"
  }
];

const seedDoctors = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB.");

        const hashedPassword = await bcrypt.hash("123456", 10);

        for (const doc of doctorsData) {
            const existing = await User.findOne({ email: doc.email });
            if (!existing) {
                const newDoctor = new User({
                    ...doc,
                    password: hashedPassword,
                    isApproved: true,
                    status: "approved"
                });
                await newDoctor.save();
                console.log(`✅ Seeded: ${doc.name}`);
            } else {
                console.log(`⚠️ Skipped (exists): ${doc.name}`);
            }
        }

        console.log("🚀 All doctors seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedDoctors();
