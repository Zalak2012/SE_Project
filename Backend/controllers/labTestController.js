const LabTest = require("../models/LabTest");

exports.getLabTests = async (req, res) => {
  try {
    const tests = await LabTest.find().sort({ createdAt: -1 });
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lab tests" });
  }
};

exports.addLabTest = async (req, res) => {
  try {
    const { name, category, price, description, status, responseTime, icon } = req.body;
    const newTest = new LabTest({
      name,
      category,
      price,
      description,
      status: status || "Active",
      responseTime,
      icon
    });
    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    res.status(500).json({ message: "Failed to add lab test" });
  }
};

exports.updateLabTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await LabTest.findByIdAndUpdate(id, req.body, { new: true });
    if (!test) return res.status(404).json({ message: "Lab test not found" });
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: "Failed to update lab test" });
  }
};

exports.deleteLabTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await LabTest.findByIdAndDelete(id);
    if (!test) return res.status(404).json({ message: "Lab test not found" });
    res.status(200).json({ message: "Lab test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete lab test" });
  }
};
