const Activity = require("../models/Activity");

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(20);

    console.log("Activities fetched:", activities.length);

    res.json(activities);
  } catch (err) {
    console.error("Activity fetch error:", err);

    res.status(500).json({
      message: "Failed to fetch activities",
    });
  }
};
