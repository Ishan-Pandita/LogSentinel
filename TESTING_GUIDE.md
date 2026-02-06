# Testing Guide - Distributed Log Monitoring System

This guide contains all the commands you need to run to demonstrate your project during the interview.

## 1. Start the Project
Open a fresh **PowerShell** window in `c:\Project3` and run:
```powershell
.\start-all.ps1
```
*(This will open 4 windows: Producer, Collector, Detector, and Dashboard)*

## 2. Open the Dashboard
Open your Google Chrome/Edge browser and go to:
[http://localhost:5173](http://localhost:5173)

---

## 3. Demonstration Commands
Run these commands in the **Main PowerShell Window** (the one where you typed start-all.ps1).

### Step A: Show "Normal" Traffic (No Alerts)
Explain: *"First, I will simulate normal user activity. Logs are sent to the system but no alerts are raised."*
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/simulate-traffic
```
*Result: Dashboard stats might move slightly, but list remains empty.*

### Step B: Show "Successful Login" (No Alerts)
Explain: *"Now a valid user logs in. This is also a safe event."*
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/login -Body '{"username":"admin", "password":"password123"}' -ContentType "application/json"
```

### Step C: The "Brute Force" Attack (Triggers Alert!)
Explain: *"Now I will simulate a hacker trying to guess passwords. This will trigger the Intrusion Detection System."*
```powershell
1..10 | ForEach-Object { 
    Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/login -Body '{"username":"hacker", "password":"badpassword"}' -ContentType "application/json" 
}
```
*Result: A red **HIGH SEVERITY** alert will appear on the dashboard instantly.*

---

## 4. How to Reset
If you want to clear the dashboard to try again:
```powershell
node clean-db.js
```
