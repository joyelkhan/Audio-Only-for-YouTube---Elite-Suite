@echo off
echo.
echo ========================================
echo  Audio Only for YouTube - Icon Creator
echo ========================================
echo.
echo Checking for Python...

python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python found! Running icon generator...
    python create_icons.py
    pause
    exit
)

echo Python not found. Trying alternative method...
echo.
echo Opening HTML icon generator in your browser...
echo.
echo Instructions:
echo 1. Click "Generate Icons" button
echo 2. Save each file to this icons folder
echo 3. Then reload the extension in Chrome
echo.

start create-icons-simple.html

echo.
echo After downloading the icons, press any key to continue...
pause >nul
