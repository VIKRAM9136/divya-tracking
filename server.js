const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const API_KEY = process.env.API_KEY;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/track/:awb', async (req, res) => {
    try {
        const awb = req.params.awb;
        const response = await axios.get(`https://apis.innofulfill.com/tracking?awb=${awb}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        const data = response.data;
        res.json({
            success: true,
            status: data.current_status || "Processing",
            location: data.current_location || "In Transit"
        });
    } catch (error) {
        res.json({ success: false, message: "Data not found" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
