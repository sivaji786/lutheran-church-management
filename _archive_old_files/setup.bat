@echo off
cd /d %~dp0
REM Lutheran Church Management System - Windows Setup Script
REM This script will guide you through the complete installation process

setlocal enabledelayedexpansion

REM Color codes (Windows 10+)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

cls
echo ================================================================
echo.
echo    Lutheran Church Management System
echo    Automated Setup Script (Windows)
echo.
echo ================================================================
echo.
echo This script will install and configure the application.
echo.
pause

REM Step 1: Check Prerequisites
echo.
echo ================================================================
echo Step 1: Checking Prerequisites
echo ================================================================
echo.

set PREREQ_OK=1

REM Check Node.js
where node >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [92m[OK][0m Node.js is installed: !NODE_VERSION!
) else (
    echo [91m[ERROR][0m Node.js is NOT installed
    set PREREQ_OK=0
)

REM Check npm
where npm >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [92m[OK][0m npm is installed: !NPM_VERSION!
) else (
    echo [91m[ERROR][0m npm is NOT installed
    set PREREQ_OK=0
)

REM Check PHP
where php >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=1-3" %%a in ('php --version ^| findstr /R "^PHP"') do set PHP_VERSION=%%a %%b %%c
    echo [92m[OK][0m PHP is installed: !PHP_VERSION!
) else (
    echo [91m[ERROR][0m PHP is NOT installed
    set PREREQ_OK=0
)

REM Check MySQL
where mysql >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('mysql --version') do set MYSQL_VERSION=%%i
    echo [92m[OK][0m MySQL is installed
) else (
    echo [91m[ERROR][0m MySQL is NOT installed
    set PREREQ_OK=0
)

REM Check Composer
where composer >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=1-3" %%a in ('composer --version ^| findstr /R "^Composer"') do set COMPOSER_VERSION=%%a %%b %%c
    echo [92m[OK][0m Composer is installed: !COMPOSER_VERSION!
) else (
    echo [91m[ERROR][0m Composer is NOT installed
    set PREREQ_OK=0
)

echo.

if !PREREQ_OK! equ 0 (
    echo [91m[ERROR][0m Some prerequisites are missing!
    echo Please install the missing software and run this script again.
    echo See README.md for installation instructions.
    pause
    exit /b 1
)

echo [92m[OK][0m All prerequisites are installed!
echo.
pause

REM Step 2: Install Frontend Dependencies
echo.
echo ================================================================
echo Step 2: Installing Frontend Dependencies
echo ================================================================
echo.

echo Running: npm install
call npm install
if %errorlevel% neq 0 (
    echo [91m[ERROR][0m Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [92m[OK][0m Frontend dependencies installed successfully
echo.
pause

REM Step 3: Install Backend Dependencies
echo.
echo ================================================================
echo Step 3: Installing Backend Dependencies
echo ================================================================
echo.

cd backend
echo Running: composer install
call composer install
if %errorlevel% neq 0 (
    echo [91m[ERROR][0m Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
echo [92m[OK][0m Backend dependencies installed successfully
cd ..
echo.
pause

REM Step 4: Configure Environment Files
echo.
echo ================================================================
echo Step 4: Configuring Environment Files
echo ================================================================
echo.

REM Frontend .env
if not exist .env (
    echo Creating frontend .env file...
    copy .env.example .env >nul
    echo [92m[OK][0m Frontend .env created
) else (
    echo [93m[WARNING][0m Frontend .env already exists, skipping...
)

REM Backend .env
if not exist backend\.env (
    echo Creating backend .env file...
    copy backend\.env.example backend\.env >nul
    
    echo.
    echo Database Configuration
    echo =====================
    echo.
    
    set /p DB_HOST="Enter MySQL hostname [localhost]: "
    if "!DB_HOST!"=="" set DB_HOST=localhost
    
    set /p DB_NAME="Enter database name [lutheran_church]: "
    if "!DB_NAME!"=="" set DB_NAME=lutheran_church
    
    set /p DB_USER="Enter MySQL username [root]: "
    if "!DB_USER!"=="" set DB_USER=root
    
    set /p DB_PASS="Enter MySQL password: "
    
    set /p DB_PORT="Enter MySQL port [3306]: "
    if "!DB_PORT!"=="" set DB_PORT=3306
    
    REM Update .env file using PowerShell
    powershell -Command "(Get-Content backend\.env) -replace 'database.default.hostname = localhost', 'database.default.hostname = !DB_HOST!' | Set-Content backend\.env"
    powershell -Command "(Get-Content backend\.env) -replace 'database.default.database = lutheran_church', 'database.default.database = !DB_NAME!' | Set-Content backend\.env"
    powershell -Command "(Get-Content backend\.env) -replace 'database.default.username = root', 'database.default.username = !DB_USER!' | Set-Content backend\.env"
    powershell -Command "(Get-Content backend\.env) -replace 'database.default.password = your_password_here', 'database.default.password = !DB_PASS!' | Set-Content backend\.env"
    powershell -Command "(Get-Content backend\.env) -replace 'database.default.port = 3306', 'database.default.port = !DB_PORT!' | Set-Content backend\.env"
    
    echo [92m[OK][0m Backend .env configured
) else (
    echo [93m[WARNING][0m Backend .env already exists, skipping configuration...
)

echo.
pause

REM Step 5: Database Setup
echo.
echo ================================================================
echo Step 5: Database Setup
echo ================================================================
echo.

set /p CREATE_DB="Do you want to create the database now? (Y/N): "
if /i "!CREATE_DB!"=="Y" (
    echo Creating database: !DB_NAME!
    
    REM Try to create database
    echo CREATE DATABASE IF NOT EXISTS !DB_NAME!; | mysql -h !DB_HOST! -u !DB_USER! -p!DB_PASS! 2>nul
    if %errorlevel% equ 0 (
        echo [92m[OK][0m Database created successfully
    ) else (
        echo [93m[WARNING][0m Could not create database automatically
        echo Please create the database manually:
        echo   mysql -u root -p
        echo   CREATE DATABASE !DB_NAME!;
        echo.
        pause
    )
    
    REM Import schema if exists
    if exist database\schema.sql (
        set /p IMPORT_SCHEMA="Do you want to import the database schema? (Y/N): "
        if /i "!IMPORT_SCHEMA!"=="Y" (
            echo Importing database schema...
            mysql -h !DB_HOST! -u !DB_USER! -p!DB_PASS! !DB_NAME! < database\schema.sql 2>nul
            if %errorlevel% equ 0 (
                echo [92m[OK][0m Database schema imported successfully
            ) else (
                echo [91m[ERROR][0m Failed to import schema
            )
        )
    ) else (
        echo [93m[WARNING][0m No schema.sql file found in database\ directory
    )
    
    REM Import seed data if exists
    if exist database\seed.sql (
        set /p IMPORT_SEED="Do you want to import seed data (demo data)? (Y/N): "
        if /i "!IMPORT_SEED!"=="Y" (
            echo Importing seed data...
            mysql -h !DB_HOST! -u !DB_USER! -p!DB_PASS! !DB_NAME! < database\seed.sql 2>nul
            if %errorlevel% equ 0 (
                echo [92m[OK][0m Seed data imported successfully
            ) else (
                echo [91m[ERROR][0m Failed to import seed data
            )
        )
    )
) else (
    echo Skipping database creation
    echo [93m[WARNING][0m Remember to create the database manually before running the application
)

echo.
pause

REM Step 6: Build Frontend (Optional)
echo.
echo ================================================================
echo Step 6: Build Frontend (Optional)
echo ================================================================
echo.

set /p BUILD_FRONTEND="Do you want to build the frontend for production? (Y/N): "
if /i "!BUILD_FRONTEND!"=="Y" (
    echo Building frontend...
    call npm run build
    if %errorlevel% equ 0 (
        echo [92m[OK][0m Frontend built successfully
        echo Production files are in the 'build' directory
    ) else (
        echo [91m[ERROR][0m Frontend build failed
    )
) else (
    echo Skipping frontend build
)

echo.
pause

REM Installation Complete
cls
echo ================================================================
echo.
echo    Installation Complete!
echo.
echo ================================================================
echo.
echo [92mLutheran Church Management System has been installed successfully![0m
echo.
echo ================================================================
echo Next Steps:
echo ================================================================
echo.
echo 1. Start the backend server:
echo    cd backend
echo    php spark serve
echo.
echo 2. In a new command prompt, start the frontend:
echo    npm run dev
echo.
echo 3. Access the application:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8080
echo.
echo 4. Default login credentials:
echo    Admin:  username: admin, password: admin123
echo    Member: code: LCH001, password: member123
echo.
echo ================================================================
echo.
echo [93m[WARNING] IMPORTANT: Change default passwords in production![0m
echo.
echo Happy managing! 🎉
echo.
pause
