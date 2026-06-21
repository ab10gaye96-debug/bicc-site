@echo off
echo ========================================
echo Deploy PUBLIC site (apps/public-site)
echo Target: https://bicc-gambia.web.app
echo ========================================
echo.

cd /d "%~dp0apps\public-site"
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)

firebase deploy --only hosting,firestore
if %errorlevel% neq 0 (
    echo Deploy failed!
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Public site deployed successfully!
echo Website: https://bicc-gambia.web.app
echo Admin:   https://bicc-gambia-admin.web.app
echo ========================================
pause
