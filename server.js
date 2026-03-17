const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config(); // सुरक्षा के लिए API Key को छुपाने के लिए

const app = express();
app.use(express.json());
app.use(cors()); // ताकि आपकी वेबसाइट इसे एक्सेस कर सके

// 1. Innofulfill / ShipZip Tracking API
app.get("/track/:awb", async (req, res) => {
    const awb = req.params.awb;
    
    // Innofulfill का बेस URL (इसे डॉक्यूमेंटेशन के हिसाब से अपडेट करें)
    const INNO_URL = "https://api.innofulfill.com/v1/track"; 
    const API_KEY = "YOUR_INNOFULFILL_TOKEN_HERE"; // यहाँ अपना टोकन डालें

    try {
        const response = await axios.get(INNO_URL, {
            headers: { "Authorization": `Bearer ${API_KEY}` },
            params: { tracking_number: awb }
        });

        // यूजर को साफ़ डेटा भेजना
        const trackingData = response.data;
        res.json({
            success: true,
            awb: awb,
            status: trackingData.status || "In Transit",
            location: trackingData.current_location || "Processing",
            last_update: trackingData.updated_at || "Updating..."
        });

    } catch (error) {
        console.error("Tracking Error:", error.message);
        res.status(500).json({ success: false, message: "Tracking data not found" });
    }
});

// 2. New Booking API (Divya Express / ShipZip)
app.post("/create-order", async (req, res) => {
    try {
        const response = await axios.post("https://api.innofulfill.com/v1/orders", req.body, {
            headers: { "Authorization": "Bearer YOUR_INNOFULFILL_TOKEN_HERE" }
        });
        res.json({ success: true, order_id: response.data.id, message: "Order Created Successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Booking failed" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ShipZip Server running on port ${PORT}`);
});
