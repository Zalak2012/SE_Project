const Schedule = require("../models/Schedule");

exports.getSchedule = async (req, res) => {
    try {
        const { doctorId, date } = req.query;
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        let schedule = await Schedule.findOne({ doctorId, date: targetDate });

        if (!schedule) {
            // Create default schedule if none exists for that day
            const defaultSlots = [
                { time: "09:00 AM", status: "available" },
                { time: "09:30 AM", status: "available" },
                { time: "10:00 AM", status: "available" },
                { time: "10:30 AM", status: "available" },
                { time: "11:00 AM", status: "available" },
                { time: "11:30 AM", status: "available" },
                { time: "01:00 PM", status: "available" },
                { time: "01:30 PM", status: "available" },
                { time: "02:00 PM", status: "available" },
                { time: "02:30 PM", status: "available" },
            ];
            schedule = new Schedule({ doctorId, date: targetDate, slots: defaultSlots });
            await schedule.save();
        }

        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch schedule" });
    }
};

exports.updateSlot = async (req, res) => {
    try {
        const { date, time, status } = req.body;
        const doctorId = req.user.userId;
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const schedule = await Schedule.findOneAndUpdate(
            { doctorId, date: targetDate, "slots.time": time },
            { $set: { "slots.$.status": status } },
            { new: true }
        );

        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ message: "Failed to update slot" });
    }
};
