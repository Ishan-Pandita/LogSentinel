Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/producer-service; node server.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/collector-service; node server.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/detection-service; node detector.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend/dashboard-ui; npm run dev"
