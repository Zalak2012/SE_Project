const Activity = require("../models/Activity");

const logActivity = async (type, message) => {
  try {
    await Activity.create({
      type,
      message,
    });

    console.log("Activity Logged:", message);
  } catch (err) {
    console.error("Activity log error:", err.message);
  }
};

module.exports = logActivity;
