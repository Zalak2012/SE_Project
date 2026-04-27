const LabTest = require("../models/LabTest");

const initialLabTests = [
  { name: "Complete Blood Count (CBC)", category: "Blood Test", description: "Measures different components of your blood.", price: 35, responseTime: "24 hours", icon: "🔬", status: "Active" },
  { name: "Lipid Panel", category: "Blood Test", description: "Checks cholesterol and triglycerides levels.", price: 50, responseTime: "24 hours", icon: "🧪", status: "Active" },
  { name: "Thyroid Function Test", category: "Hormone Test", description: "Evaluates how well your thyroid is working.", price: 65, responseTime: "48 hours", icon: "🦋", status: "Active" },
  { name: "HbA1c", category: "Diabetes", description: "Measures your average blood sugar levels.", price: 45, responseTime: "24 hours", icon: "🩸", status: "Active" },
  { name: "Vitamin D Test", category: "Vitamin", description: "Checks for vitamin D deficiency.", price: 55, responseTime: "24 hours", icon: "☀️", status: "Active" },
  { name: "Liver Function Test", category: "Blood Test", description: "Checks the levels of enzymes and proteins.", price: 40, responseTime: "24 hours", icon: "🧬", status: "Active" },
  { name: "AIDS Checkup", category: "Blood Test", description: "Comprehensive AIDS screening.", price: 200, responseTime: "24 hours", icon: "🔬", status: "Active" }
];

const seedLabTests = async () => {
  try {
    const count = await LabTest.countDocuments();
    if (count === 0) {
      await LabTest.insertMany(initialLabTests);
      console.log("✅ Lab tests seeded successfully");
    }
  } catch (error) {
    console.error("❌ Error seeding lab tests:", error);
  }
};

module.exports = seedLabTests;
