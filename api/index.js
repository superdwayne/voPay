const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/api/withdraw', (req, res) => {
    const data = req.body;

    const providedApiKey = req.headers['x-api-key'];
    if (providedApiKey !== process.env.API_KEY) {
        return res.status(401).json({
            message: 'Unauthorized: Invalid API key'
        });
    }

    // Log the received data to the console
    console.log('Received Data:', data);

    // Respond with a success message
    return res.status(200).json({
        message: 'Data received successfully!',
        data: data
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
