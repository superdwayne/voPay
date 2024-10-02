// api/endpoint.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Endpoint to handle POST requests
app.post('/api/submit', (req, res) => {
    const data = req.body;

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

    // Here, you can handle the data, e.g., save it to a database

    // Respond with a success message
    return res.status(200).json({
        message: 'Data received successfully!',
        data: data
    });
});

// Export the app for Vercel
module.exports = app;