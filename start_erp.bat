@echo off
echo ===========================================
echo Starting Balaji Cotton ERP System...
echo ===========================================

echo Installing any missing python requirements...
cd backend
pip install -r requirements.txt >nul 2>&1
echo Starting Python Backend...
start /b cmd /c "streamlit run app.py --server.port 8501 --server.enableCORS false --server.enableXsrfProtection false --server.baseUrlPath /streamlit >nul 2>&1"

cd ../api
echo Installing any missing Node modules for API...
npm install >nul 2>&1
echo Starting API Server...
start cmd /k "npm run dev"

cd ../frontend
echo Installing any missing Node modules for Frontend...
npm install >nul 2>&1
echo Starting Frontend Development Server...
start cmd /k "npm run dev"

echo.
echo All three servers have been officially started!
echo Leave the terminal window open to keep them running.
echo To close all servers, just close the terminal windows.
pause
