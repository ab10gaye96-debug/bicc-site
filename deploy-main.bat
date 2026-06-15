@echo off
echo ========================================
echo Deploying to MAIN site (bicc-gambia)
echo ========================================
echo.

call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)

firebase use default
firebase deploy --only hosting

echo.
echo ========================================
echo Main site deployed successfully!
echo URL: https://bicc-gambia.web.app
echo ========================================
pause
