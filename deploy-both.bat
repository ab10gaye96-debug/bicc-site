@echo off
echo ========================================
echo Deploying to BOTH sites
echo ========================================
echo.

echo Building project...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Deploying to MAIN site (bicc-gambia)
echo ========================================
firebase use default
firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo Main site deployment failed!
)

echo.
echo ========================================
echo Main site deployed: https://bicc-gambia.web.app
echo ========================================
echo.
echo.
echo ========================================
echo MANUAL STEP NEEDED for Admin Site
echo ========================================
echo.
echo The admin site (bicc-gambia-admin) has CLI upload issues.
echo.
echo To update https://bicc-gambia-admin.web.app/:
echo.
echo 1. Open: https://console.firebase.google.com/
echo 2. Select project: bicc-gambia-admin
echo 3. Go to: Hosting
echo 4. Click menu (3 dots) -^> Deploy to site
echo 5. Drag and drop everything from the 'dist' folder
echo.
echo Your dist folder is at:
echo %cd%\dist
echo.
echo Opening dist folder in Explorer...
start explorer "%cd%\dist"
echo.
echo ========================================
pause
