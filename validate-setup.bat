@echo off
echo ========================================
echo BICC Setup Validation
echo ========================================
echo.

:: Check Node version
echo [1/6] Checking Node.js version...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found!
    goto :error
)
echo.

:: Check if .env exists
echo [2/6] Checking .env file...
if exist ".env" (
    echo ✓ .env file exists
) else (
    echo ✗ .env file missing!
    goto :error
)
echo.

:: Check if node_modules exists
echo [3/6] Checking dependencies...
if exist "node_modules" (
    echo ✓ node_modules found
) else (
    echo ✗ node_modules not found. Run: npm install
    goto :error
)
echo.

:: Check package.json
echo [4/6] Checking package.json...
if exist "package.json" (
    echo ✓ package.json exists
) else (
    echo ✗ package.json missing!
    goto :error
)
echo.

:: Check firebase.json
echo [5/6] Checking firebase.json...
if exist "firebase.json" (
    echo ✓ firebase.json exists
) else (
    echo ✗ firebase.json missing!
    goto :error
)
echo.

:: Check for space in folder name
echo [6/6] Checking folder name...
cd
echo Current directory: %CD%
echo %CD% | findstr /C:" " >nul
if errorlevel 1 (
    echo ✓ No spaces in folder path
) else (
    echo ⚠ WARNING: Folder path contains spaces!
    echo   This can cause issues. Please rename using RENAME_FOLDER.bat
)
echo.

echo ========================================
echo Validation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update .env with secure values
echo 2. If folder has spaces, run RENAME_FOLDER.bat
echo 3. Run: npm install
echo 4. Run: npm run dev
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo Validation Failed!
echo ========================================
echo Please fix the errors above and try again.
echo.
pause
exit /b 1
