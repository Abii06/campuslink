# CampusLink - Start Both Frontend and Backend
Write-Host "🚀 Starting CampusLink Application..." -ForegroundColor Green
Write-Host ""

# Start Backend in background
Write-Host "📡 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\gururaj\Downloads\campuslink-frontend\campuslink-backend'; npm start"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend in background
Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\gururaj\Downloads\campuslink-frontend'; npm run dev"

# Wait a moment
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "✅ Both servers are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📡 Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🌐 Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Please wait 10-15 seconds for both servers to fully start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🔍 Check the opened terminal windows for startup status" -ForegroundColor Magenta