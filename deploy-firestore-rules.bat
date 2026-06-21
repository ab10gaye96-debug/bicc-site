@echo off
echo ========================================
echo Deploying Firestore Security Rules
echo ========================================
echo.
echo This will deploy the FIXED rules that allow:
echo  - Public read access to siteSettings
echo  - Public read access to mediaLibrary
echo  - Admin write access for both
echo.
echo This fixes the issue where admin content wasn't showing on the frontend!
echo.
pause

echo.
echo [1/3] Deploying main project rules...
firebase deploy --only firestore:rules
if %errorlevel% neq 0 (
    echo ERROR: Main rules deployment failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Deploying admin-portal rules...
cd apps\admin-portal
firebase deploy --only firestore:rules
if %errorlevel% neq 0 (
    echo ERROR: Admin portal rules deployment failed!
    cd ..\..
    pause
    exit /b %errorlevel%
)
cd ..\..

echo.
echo [3/3] Deploying public-site rules...
cd apps\public-site
firebase deploy --only firestore:rules
if %errorlevel% neq 0 (
    echo ERROR: Public site rules deployment failed!
    cd ..\..
    pause
    exit /b %errorlevel%
)
cd ..\..

echo.
echo ========================================
echo SUCCESS! All Firestore rules deployed
echo ========================================
echo.
echo What was fixed:
echo  ✓ Added siteSettings read access for frontend
echo  ✓ Added mediaLibrary read access for frontend
echo  ✓ Your admin content changes will now appear!
echo.
echo Next steps:
echo 1. Clear your browser cache
echo 2. Test admin content changes
echo 3. Refresh the public site to see changes
echo.
pause
