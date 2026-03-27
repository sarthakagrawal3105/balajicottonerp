@echo off
echo Installing required libraries...
pip install -r requirements.txt
echo.
echo Starting the CCI Bill Generator App...
streamlit run app.py
pause
