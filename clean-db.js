const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://localhost:27017/log-monitoring';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB...');
        try {
            await mongoose.connection.collection('logs').drop();
            console.log('✅ Dropped "logs" collection.');
        } catch (e) { console.log('Logs collection might not exist, skipping.'); }

        try {
            await mongoose.connection.collection('alerts').drop();
            console.log('✅ Dropped "alerts" collection.');
        } catch (e) { console.log('Alerts collection might not exist, skipping.'); }

        console.log('Database cleared! You can now start fresh.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
