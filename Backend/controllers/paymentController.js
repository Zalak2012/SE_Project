const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_ShOSBAQY65rTHB",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "tsBvFGkucNpJnh1toonBlPt4",
});

exports.createOrder = async (req, res) => {
    try {
        const { amount, currency, receipt } = req.body;

        const options = {
            amount: amount * 100, // Razorpay works in smallest currency unit (paise/cents)
            currency: currency || "INR",
            receipt: receipt || `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error("❌ Razorpay order creation failed:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET || "tsBvFGkucNpJnh1toonBlPt4";

        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            res.status(200).json({ message: "Payment verified successfully", success: true });
        } else {
            res.status(400).json({ message: "Payment verification failed", success: false });
        }
    } catch (error) {
        console.error("❌ Razorpay payment verification failed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
