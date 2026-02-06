# 🛡️ LogSentinel - Distributed Log Monitoring & Intrusion Detection System

**LogSentinel** is a MERN-stack distributed system designed to ingest, analyze, and visualize logs from multiple services in real-time. It features an Intrusion Detection System (IDS) that automatically flags suspicious activities like **Brute Force Attacks** and displays them on a professional Security Dashboard.


---

## 🚀 Key Features

*   **⚡ Real-time Log Ingestion**: Decoupled Producer-Collector architecture using REST APIs.
*   **🧠 Intelligent Detection Engine**: Background Cron jobs analyze traffic patterns to detect threats.
*   **🛡️ Brute Force Protection**: Automatically flags IPs with repeated failed login attempts.
*   **📊 Enterprise Security Dashboard**:
    *   Dark/Light Mode Support 🌗
    *   Interactive Real-time Metrics
    *   Visual Threat Maps & Server Status
*   **🐳 Microservices Ready**: Modular structure with distinct services for Production, Collection, and Analysis.

---

## 🏗️ System Architecture

1.  **Producer Service** (Port 3001): Simulates a business application (e.g., an E-commerce site) generating logs.
2.  **Collector Service** (Port 3002): Centralized API that receives logs and stores them in **MongoDB**.
3.  **Detection Engine**: Background worker that scans the database for attack patterns (e.g., *5 failed logins in 5 mins*).
4.  **Dashboard UI** (Port 5173): React + Vite frontend for SOC Analysts to monitor threats.

---

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, TailwindCSS, Lucide Icons
*   **Backend**: Node.js, Express
*   **Database**: MongoDB (Mongoose)
*   **Automation**: Node-Cron (for detection jobs)

---

## 📥 Installation & Setup

### Prerequisites
*   Node.js (v16+)
*   MongoDB (Running locally or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/sentinel-flow.git
cd sentinel-flow
```

### 2. Fast Startup (Windows PowerShell) ⚡
We have included a startup script to launch all 4 services at once:
```powershell
.\start-all.ps1
```

### 3. Manual Startup (Optional)
If you prefer running services individually:

**Backend - Log Collector:**
```bash
cd backend/collector-service
npm install
node server.js
```

**Backend - Log Producer:**
```bash
cd backend/producer-service
npm install
node server.js
```

**Backend - Detection Engine:**
```bash
cd backend/detection-service
npm install
node detector.js
```

**Frontend - Dashboard:**
```bash
cd frontend/dashboard-ui
npm install
npm run dev
```

---

## 🧪 Testing the System

### 1. View Dashboard
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. Simulate Normal Traffic (No Alert)
Run this in PowerShell to send safely logs:
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/simulate-traffic
```

### 3. Simulate an Attack 🚨
Run this to simulate a **Brute Force Attack** (multiple failed logins):
```powershell
1..10 | ForEach-Object { 
    Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/login -Body '{"username":"hacker", "password":"badpassword"}' -ContentType "application/json" 
}
```
**Result**: Watch the Dashboard! A **HIGH SEVERITY** alert will appear instantly.

---

## 📂 Project Structure

```
c:\Project3
├── backend/
│   ├── producer-service/   # Generates Traffic
│   ├── collector-service/  # Ingests & Stores Logs
│   └── detection-service/  # Analyzes Threats
├── frontend/
│   └── dashboard-ui/       # React Admin Dashboard
├── start-all.ps1           # Quick Start Script
└── README.md
```

---

## 🔮 Future Improvements
- [ ] Add Email/SMS Notifications via Twilio/SendGrid.
- [ ] Dockerize the entire stack with `docker-compose`.
- [ ] Implement JWT Authentication for the Dashboard.

---

*Thank You.*
