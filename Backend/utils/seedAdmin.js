const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const seedAdmin = async () => {
    try {
        const email = "admin@caremate.com";
        const passwordPlain = "Admin@12345678";

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log("✅ Admin user already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(passwordPlain, 10);

        const newAdmin = new User({
            name: "Super Admin",
            email,
            password: hashedPassword,
            role: "admin",
            isApproved: true,
            status: "approved"
        });

        await newAdmin.save();
        console.log("🚀 Admin account successfully seeded!");
    } catch (err) {
        console.error("❌ Admin seeding error:", err.message);
    }
};

module.exports = seedAdmin;
