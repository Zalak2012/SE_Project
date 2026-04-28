const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB.");

        const email = "admincaremate@gmail.com";
        const passwordPlain = "Admin_care@1404";

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log("Admin already exists!");
            process.exit(0);
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
        console.log("✅ Admin successfully created!");
        process.exit(0);
    } catch (err) {
        console.error("Error creating admin:", err);
        process.exit(1);
    }
}

seedAdmin();
