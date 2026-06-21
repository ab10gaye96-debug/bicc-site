@echo off
echo ========================================
echo Deploy PUBLIC + ADMIN sites
echo ========================================
echo.

echo --- Building public site ---
cd /d "%~dp0apps\public-site"
call npm run build
if %errorlevel% neq 0 goto :fail
firebase deploy --only hosting,firestore
if %errorlevel% neq 0 goto :fail

echo.
echo --- Building admin portal ---
cd /d "%~dp0apps\admin-portal"
call npm run build
if %errorlevel% neq 0 goto :fail
firebase deploy --only hosting,firestore
if %errorlevel% neq 0 goto :fail

echo.
echo ========================================
echo Both sites deployed!
echo Website: https://bicc-gambia.web.app
echo Admin:   https://bicc-gambia-admin.web.app
echo ========================================
pause
exit /b 0

:fail
echo Deployment failed!
pause
exit /b 1
