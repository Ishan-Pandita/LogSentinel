require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/log-monitoring';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected to Log Collector'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Log API Endpoint
app.post('/logs', async (req, res) => {
    try {
        const logData = req.body;

        // Basic Validation
        if (!logData.service || !logData.level || !logData.action) {
            return res.status(400).json({ error: 'Missing required fields: service, level, action' });
        }

        // Store in MongoDB (using Mongoose directly for simplicity in Phase 1, usually goes to Model)
        // Ideally, we move this to specific model file
        const collection = mongoose.connection.collection('logs');
        await collection.insertOne({
            ...logData,
            receivedAt: new Date()
        });

        console.log(`[LOG RECEIVED] ${logData.service} - ${logData.action}`);
        res.status(201).send({ status: 'Log received' });
    } catch (error) {
        console.error('Error saving log:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Alerts API Endpoint
app.get('/alerts', async (req, res) => {
    try {
        const collection = mongoose.connection.collection('alerts');
        const alerts = await collection.find({}).sort({ createdAt: -1 }).limit(50).toArray();
        res.json(alerts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Health Check
app.get('/', (req, res) => {
    res.send('Log Collector Service is running');
});

app.listen(PORT, () => {
    console.log(`Collector Service running on port ${PORT}`);
});
