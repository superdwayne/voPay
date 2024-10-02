// api/endpoint.js
const express = require('express'); // Import express
const cors = require('cors'); // Import cors
const axios = require('axios'); // Import axios
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000; // Set port

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Allow requests from your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Middleware to parse JSON and enable CORS
app.use(cors(corsOptions));
app.use(express.json());

// Endpoint to handle POST requests
app.post('/api/submit', async (req, res) => {
    const data = req.body;

    // Validate API key from headers
    const providedApiKey = req.headers['x-api-key'];
    if (providedApiKey !== process.env.API_KEY) {
        return res.status(401).json({
            message: 'Unauthorized: Invalid API key'
        });
    }

    // Validate required fields
    const requiredFields = [
        'AccountID', 'Key', 'Signature',
        'FirstName', 'LastName', 'CompanyName',
        'IdentificationNumber', 'EmailAddress',
        'PhoneNumber', 'Address1', 'City',
        'State', 'Country', 'ZipCode',
        'ABARoutingNumber', 'AccountNumber', 'Amount'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length) {
        return res.status(400).json({
            message: 'Missing required fields: ' + missingFields.join(', ')
        });
    }

    // You can add additional functionality here, such as making a request to an external API

    // Example of making an external API request using Axios
    // Uncomment the following code block if needed
    /*
    const externalApiUrl = 'https://example.com/api/endpoint';
    try {
        const externalResponse = await axios.post(externalApiUrl, data);
        return res.status(200).json({
            message: 'Data processed successfully!',
            externalData: externalResponse.data
        });
    } catch (error) {
        console.error('Error calling external API:', error.message);
        return res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
    */

    // Respond with a success message if no external request is made
    return res.status(200).json({
        message: 'Data received successfully!',
        data: data
    });
});

// Start the server (for local testing)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export the app for Vercel
module.exports = app;
