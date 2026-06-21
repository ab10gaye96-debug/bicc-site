@echo off
echo ========================================
echo JWT Secret Generator
echo ========================================
echo.
echo Generating secure JWT secret...
echo.

node -e "console.log('Copy this secret to your .env file:'); console.log(''); console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex')); console.log('');"

if errorlevel 1 (
    echo.
    echo ERROR: Node.js not found or crypto module unavailable.
    echo.
    echo Alternative: Use an online generator
    echo https://generate-secret.vercel.app/64
    echo.
)

echo.
echo Instructions:
echo 1. Copy the JWT_SECRET line above
echo 2. Open .env file
echo 3. Replace the JWT_SECRET line with the one generated
echo 4. Save the file
echo.
echo ⚠️  Keep this secret secure and never commit it to git!
echo.
pause
