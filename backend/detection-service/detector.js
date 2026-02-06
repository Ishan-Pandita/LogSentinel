require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/log-monitoring';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected to Detection Engine'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Log Schema (must match Collector)
const LogSchema = new mongoose.Schema({}, { strict: false });
const Log = mongoose.model('Log', LogSchema, 'logs');

// Alert Schema
const AlertSchema = new mongoose.Schema({
    rule: String,
    severity: String,
    ip: String,
    description: String,
    createdAt: { type: Date, default: Date.now }
});
const Alert = mongoose.model('Alert', AlertSchema);

// Rule 1: Brute Force Detection (Failed Logins)
const checkBruteForce = async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Aggregate failed logins by IP in the last 5 minutes
    const results = await Log.aggregate([
        {
            $match: {
                action: 'LOGIN_FAILED',
                timestamp: { $gte: fiveMinutesAgo.toISOString() } // Ensure timestamp format matches
            }
        },
        {
            $group: {
                _id: "$ip",
                count: { $sum: 1 }
            }
        },
        {
            $match: {
                count: { $gte: 5 } // Threshold: 5 failed attempts
            }
        }
    ]);

    for (const result of results) {
        const ip = result._id;
        const count = result.count;

        // Check if alert already exists recently to avoid spam (Simple dedup)
        const recentAlert = await Alert.findOne({
            rule: 'Brute Force Attempt',
            ip: ip,
            createdAt: { $gte: fiveMinutesAgo }
        });

        if (!recentAlert) {
            await Alert.create({
                rule: 'Brute Force Attempt',
                severity: 'HIGH',
                ip: ip,
                description: `Detected ${count} failed login attempts from IP ${ip}`
            });
            console.log(`[ALERT] Brute Force detected from ${ip}`);
        }
    }
};

// Main Job Scheduler
console.log('Starting Detection Engine...');
// Run every 2 seconds for demo purposes
cron.schedule('*/2 * * * * *', async () => {
    try {
        await checkBruteForce();
    } catch (error) {
        console.error('Error in detection job:', error);
    }
});
