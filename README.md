# 💙 CareMate Plus 🏥

![CareMate Banner](https://img.shields.io/badge/Status-Active-brightgreen.svg) ![License](https://img.shields.io/badge/License-MIT-blue.svg) ![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react) ![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)

> **CareMate Plus** is a comprehensive, full-stack healthcare management platform designed to seamlessly connect patients, doctors, and hospital administrators. It streamlines appointment scheduling, medical record management, digital prescriptions, and online payments.

---

## 🚀 Key Features

### 👤 For Patients
- **Find Doctors:** Browse through a verified list of specialized doctors.
- **Book Appointments:** Real-time scheduling system for hassle-free bookings.
- **Digital Medical Records:** Access health records and lab test results securely.
- **Online Payments:** Integrated with Razorpay for secure appointment fee transactions.

### 🩺 For Doctors
- **Manage Schedule:** Set availability and manage daily appointment slots.
- **Patient Dashboard:** View detailed patient history and medical records.
- **Digital Prescriptions:** Generate and send prescriptions digitally to patients.
- **AI Monitoring:** Track specific patient parameters (if applicable).

### 🛡️ For Administrators
- **Doctor Verification:** Review and approve/reject doctor registrations.
- **User Management:** Complete oversight of all registered patients and staff.
- **Analytics Dashboard:** Monitor platform usage, appointments, and revenue.

---

## 💻 Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (for responsive, modern UI)
- **React Router** (for navigation)
- **Context API** (State Management & Auth)

### Backend
- **Node.js & Express.js**
- **MongoDB** (with Mongoose ODM)
- **JSON Web Tokens (JWT)** (Authentication & Authorization)
- **Bcrypt** (Password Hashing)
- **Razorpay API** (Payment Gateway Integration)

---

## 🛠️ Installation & Setup

Follow these steps to set up the project locally on your machine.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Piyushtanwani/caremate.git
cd caremate
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and start the server:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and start the Vite dev server:
```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend application:
```bash
npm run dev
```

---

## 📂 Folder Structure

```text
caremate/
├── Backend/                 # Node.js Express API
│   ├── controllers/         # Business logic
│   ├── middleware/          # JWT auth & Uploads
│   ├── models/              # Mongoose Schemas
│   ├── routes/              # Express Routes
│   ├── server.js            # Entry Point
│   └── ...
└── Frontend/                # React Vite Application
    ├── src/
    │   ├── Admin/           # Admin Dashboard Components
    │   ├── doctor/          # Doctor Dashboard Components
    │   ├── pages/           # Patient/Public Pages
    │   ├── context/         # Auth & Data Contexts
    │   ├── components/      # Reusable UI Components
    │   └── utils/           # API fetchers & helpers
    └── ...
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 

---

## 📝 License
This project is licensed under the MIT License.
