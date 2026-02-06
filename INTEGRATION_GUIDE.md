# Integration Guide: How to Use This With Your Own Website

You can easily connect your existing website (Portfolio, E-commerce, etc.) to this Log Monitoring System.

## Architecture Change
Currently, everything runs on `localhost`. To use this with a real site:
1.  **Frontend**: Your real website (React/HTML/etc.)
2.  **Backend Services**: Need to be deployed (AWS, Vercel, Render, Heroku).

## Step 1: Deploy the "Collector Service"
You must host the `collector-service` online so your website can reach it.
- **Where to deploy?** Render or Railway (Free tiers).
- **URL**: You will get something like `https://my-log-collector.onrender.com`.

## Step 2: Connect Your Website (The "Producer")
You don't need the `producer-service` folder anymore. Your **Own Website** becomes the producer.

### Scenario A: If you have a React/Next.js Website
Install axios:
```bash
npm install axios
```

Create a helper function `logger.js`:
```javascript
import axios from 'axios';

const COLLECTOR_URL = 'https://your-deployed-collector.com/logs';

export const logEvent = async (action, details) => {
  try {
    await axios.post(COLLECTOR_URL, {
      service: 'my-portfolio-site',
      level: 'INFO',
      action: action,
      details: details,
      // Add browser info if needed
      metadata: { ua: navigator.userAgent }
    });
  } catch (err) {
    console.error('Logging failed', err);
  }
};
```

**Usage in your Code:**
```javascript
import { logEvent } from './logger';

const handleLogin = async () => {
  try {
    await loginUser();
    logEvent('LOGIN_SUCCESS', { user: 'ishan' });
  } catch (err) {
    logEvent('LOGIN_FAILED', { error: err.message }); // <--- This triggers the alert!
  }
};
```

### Scenario B: If you have a Node.js Backend
Install axios and add this to your error handler:

```javascript
app.use((err, req, res, next) => {
    // Send error to collector before responding to user
    axios.post('https://your-deployed-collector.com/logs', {
        service: 'my-backend-api',
        level: 'ERROR',
        action: 'API_CRASH',
        details: { error: err.message, stack: err.stack }
    });
    
    res.status(500).send('Something broke!');
});
```

## Step 3: View the Dashboard (The "Manager")
1.  Deploy the `dashboard-ui` to Vercel/Netlify.
2.  Update its `frontend/dashboard-ui/src/App.jsx` to point to your deployed Collector URL.
3.  Now you can visit your dashboard from anywhere and see who is attacking your website!
