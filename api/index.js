const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

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

app.post('/api/withdraw', async (req, res) => {
    const data = req.body;

    const providedApiKey = req.headers['x-api-key'];
    if (providedApiKey !== process.env.API_KEY) {
        return res.status(401).json({
            message: 'Unauthorized: Invalid API key'
        });
    }

    const requiredFields = [
        'amount', 'currency', 'bank_account', 'account_holder_name',
        'account_type', 'reference', 'scheduled_date'
    ];

    const bankAccountFields = ['number', 'institution', 'branch'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (data.bank_account) {
        const missingBankAccountFields = bankAccountFields.filter(field => !data.bank_account[field]);
        if (missingBankAccountFields.length) {
            return res.status(400).json({
                message: 'Missing required fields in bank_account: ' + missingBankAccountFields.join(', ')
            });
        }
    }

    if (missingFields.length) {
        return res.status(400).json({
            message: 'Missing required fields: ' + missingFields.join(', ')
        });
    }

    if (data.currency !== 'USD') {
        return res.status(400).json({
            message: 'Invalid currency. Only USD is supported.'
        });
    }

    if (isNaN(data.amount) || data.amount <= 0) {
        return res.status(400).json({
            message: 'Invalid amount. Must be a positive number.'
        });
    }

    const validAccountTypes = ['chequing', 'savings'];
    if (!validAccountTypes.includes(data.account_type)) {
        return res.status(400).json({
            message: 'Invalid account_type. Must be either "chequing" or "savings".'
        });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (data.scheduled_date && !dateRegex.test(data.scheduled_date)) {
        return res.status(400).json({
            message: 'Invalid scheduled_date. Must be in YYYY-MM-DD format.'
        });
    }

    // Example external API call to VoPay
    try {
        const response = await axios.post('https://api.vopay.com/ach/withdraw', data, {
            headers: {
                'Authorization': `Bearer ${process.env.VOPAY_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: 'Error processing withdrawal request',
            error: error.response ? error.response.data : error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
