require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const COLLECTOR_URL = process.env.COLLECTOR_URL || 'http://localhost:3002/logs';

app.use(cors());
app.use(express.json());

// Helper function to send logs
const sendLog = async (logData) => {
    try {
        await axios.post(COLLECTOR_URL, {
            ...logData,
            timestamp: new Date().toISOString(),
            service: 'auth-service'
        });
        console.log(`[LOG SENT] ${logData.action}`);
    } catch (error) {
        console.error(`[LOG FAILED] Could not send log: ${error.message}`);
    }
};

// Root route
app.get('/', (req, res) => {
    res.send('Producer Service is running');
});

// Simulated Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Simulate login logic
    if (username === 'admin' && password === 'password123') {
        await sendLog({ level: 'INFO', action: 'LOGIN_SUCCESS', username, ip: req.ip });
        return res.json({ success: true, message: 'Login successful' });
    } else {
        await sendLog({ level: 'WARN', action: 'LOGIN_FAILED', username, ip: req.ip });
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Random activity generator (to simulate traffic)
app.post('/api/simulate-traffic', async (req, res) => {
    // Randomly generate success or failure
    const isSuccess = Math.random() > 0.3;
    const username = `user_${Math.floor(Math.random() * 1000)}`;
    
    if (isSuccess) {
        await sendLog({ level: 'INFO', action: 'API_REQUEST', details: { endpoint: '/api/data', status: 200 } });
        res.json({ message: 'Simulated success activity' });
    } else {
        await sendLog({ level: 'ERROR', action: 'API_ERROR', details: { endpoint: '/api/data', status: 500 } });
        res.status(500).json({ message: 'Simulated error activity' });
    }
});

app.listen(PORT, () => {
    console.log(`Producer Service running on port ${PORT}`);
});
