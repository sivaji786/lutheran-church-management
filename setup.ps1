# Lutheran Church Management System - PowerShell Setup Script
Set-Location $PSScriptRoot
# This script will guide you through the complete installation process

# Requires PowerShell 5.0 or higher

# Set error action preference
$ErrorActionPreference = "Stop"

# Function to print colored messages
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Message {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning-Message {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
}

# Welcome banner
Clear-Host
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║   Lutheran Church Management System                        ║" -ForegroundColor Cyan
Write-Host "║   Automated Setup Script (PowerShell)                      ║" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Info "This script will install and configure the application."
Write-Host ""
Read-Host "Press Enter to continue"

# Step 1: Check Prerequisites
Write-Header "Step 1: Checking Prerequisites"

$prereqOk = $true

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js is installed: $nodeVersion"
} catch {
    Write-Error-Message "Node.js is NOT installed"
    $prereqOk = $false
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Success "npm is installed: $npmVersion"
} catch {
    Write-Error-Message "npm is NOT installed"
    $prereqOk = $false
}

# Check PHP
try {
    $phpVersion = php --version | Select-Object -First 1
    Write-Success "PHP is installed: $phpVersion"
} catch {
    Write-Error-Message "PHP is NOT installed"
    $prereqOk = $false
}

# Check MySQL
try {
    $mysqlVersion = mysql --version
    Write-Success "MySQL is installed"
} catch {
    Write-Error-Message "MySQL is NOT installed"
    $prereqOk = $false
}

# Check Composer
try {
    $composerVersion = composer --version | Select-Object -First 1
    Write-Success "Composer is installed: $composerVersion"
} catch {
    Write-Error-Message "Composer is NOT installed"
    $prereqOk = $false
}

Write-Host ""

if (-not $prereqOk) {
    Write-Error-Message "Some prerequisites are missing!"
    Write-Info "Please install the missing software and run this script again."
    Write-Info "See README.md for installation instructions."
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Success "All prerequisites are installed!"
Write-Host ""
Read-Host "Press Enter to continue"

# Step 2: Install Frontend Dependencies
Write-Header "Step 2: Installing Frontend Dependencies"

Write-Info "Running: npm install"
try {
    npm install
    Write-Success "Frontend dependencies installed successfully"
} catch {
    Write-Error-Message "Failed to install frontend dependencies"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Read-Host "Press Enter to continue"

# Step 3: Install Backend Dependencies
Write-Header "Step 3: Installing Backend Dependencies"

Set-Location backend
Write-Info "Running: composer install"
try {
    composer install
    Write-Success "Backend dependencies installed successfully"
} catch {
    Write-Error-Message "Failed to install backend dependencies"
    Set-Location ..
    Read-Host "Press Enter to exit"
    exit 1
}
Set-Location ..

Write-Host ""
Read-Host "Press Enter to continue"

# Step 4: Configure Environment Files
Write-Header "Step 4: Configuring Environment Files"

# Frontend .env
if (-not (Test-Path .env)) {
    Write-Info "Creating frontend .env file..."
    Copy-Item .env.example .env
    Write-Success "Frontend .env created"
} else {
    Write-Warning-Message "Frontend .env already exists, skipping..."
}

# Backend .env
if (-not (Test-Path backend\.env)) {
    Write-Info "Creating backend .env file..."
    Copy-Item backend\.env.example backend\.env
    
    Write-Host ""
    Write-Info "Database Configuration"
    Write-Host "====================="
    Write-Host ""
    
    $dbHost = Read-Host "Enter MySQL hostname [localhost]"
    if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = "localhost" }
    
    $dbName = Read-Host "Enter database name [lutheran_church]"
    if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "lutheran_church" }
    
    $dbUser = Read-Host "Enter MySQL username [root]"
    if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "root" }
    
    $dbPass = Read-Host "Enter MySQL password" -AsSecureString
    $dbPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPass))
    
    $dbPort = Read-Host "Enter MySQL port [3306]"
    if ([string]::IsNullOrWhiteSpace($dbPort)) { $dbPort = "3306" }
    
    # Generate random JWT secret
    $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    
    # Update .env file
    (Get-Content backend\.env) -replace 'database.default.hostname = localhost', "database.default.hostname = $dbHost" | Set-Content backend\.env
    (Get-Content backend\.env) -replace 'database.default.database = lutheran_church', "database.default.database = $dbName" | Set-Content backend\.env
    (Get-Content backend\.env) -replace 'database.default.username = root', "database.default.username = $dbUser" | Set-Content backend\.env
    (Get-Content backend\.env) -replace 'database.default.password = your_password_here', "database.default.password = $dbPassPlain" | Set-Content backend\.env
    (Get-Content backend\.env) -replace 'database.default.port = 3306', "database.default.port = $dbPort" | Set-Content backend\.env
    (Get-Content backend\.env) -replace "JWT_SECRET = 'your-secret-key-here-please-change-in-production'", "JWT_SECRET = '$jwtSecret'" | Set-Content backend\.env
    
    Write-Success "Backend .env configured"
} else {
    Write-Warning-Message "Backend .env already exists, skipping configuration..."
}

Write-Host ""
Read-Host "Press Enter to continue"

# Step 5: Database Setup
Write-Header "Step 5: Database Setup"

Write-Host ""
$createDb = Read-Host "Do you want to create the database now? (Y/N)"
if ($createDb -eq "Y" -or $createDb -eq "y") {
    Write-Info "Creating database: $dbName"
    
    # Try to create database
    try {
        $query = "CREATE DATABASE IF NOT EXISTS $dbName;"
        if ([string]::IsNullOrWhiteSpace($dbPassPlain)) {
            echo $query | mysql -h $dbHost -u $dbUser
        } else {
            echo $query | mysql -h $dbHost -u $dbUser -p$dbPassPlain
        }
        Write-Success "Database created successfully"
    } catch {
        Write-Warning-Message "Could not create database automatically"
        Write-Info "Please create the database manually:"
        Write-Host "  mysql -u root -p"
        Write-Host "  CREATE DATABASE $dbName;"
        Write-Host ""
        Read-Host "Press Enter after creating the database manually"
    }
    
    # Import schema if exists
    if (Test-Path database\schema.sql) {
        Write-Host ""
        $importSchema = Read-Host "Do you want to import the database schema? (Y/N)"
        if ($importSchema -eq "Y" -or $importSchema -eq "y") {
            Write-Info "Importing database schema..."
            try {
                if ([string]::IsNullOrWhiteSpace($dbPassPlain)) {
                    Get-Content database\schema.sql | mysql -h $dbHost -u $dbUser $dbName
                } else {
                    Get-Content database\schema.sql | mysql -h $dbHost -u $dbUser -p$dbPassPlain $dbName
                }
                Write-Success "Database schema imported successfully"
            } catch {
                Write-Error-Message "Failed to import schema"
            }
        }
    } else {
        Write-Warning-Message "No schema.sql file found in database\ directory"
    }
    
    # Import seed data if exists
    if (Test-Path database\seed.sql) {
        Write-Host ""
        $importSeed = Read-Host "Do you want to import seed data (demo data)? (Y/N)"
        if ($importSeed -eq "Y" -or $importSeed -eq "y") {
            Write-Info "Importing seed data..."
            try {
                if ([string]::IsNullOrWhiteSpace($dbPassPlain)) {
                    Get-Content database\seed.sql | mysql -h $dbHost -u $dbUser $dbName
                } else {
                    Get-Content database\seed.sql | mysql -h $dbHost -u $dbUser -p$dbPassPlain $dbName
                }
                Write-Success "Seed data imported successfully"
            } catch {
                Write-Error-Message "Failed to import seed data"
            }
        }
    }
} else {
    Write-Info "Skipping database creation"
    Write-Warning-Message "Remember to create the database manually before running the application"
}

Write-Host ""
Read-Host "Press Enter to continue"

# Step 6: Build Frontend (Optional)
Write-Header "Step 6: Build Frontend (Optional)"

Write-Host ""
$buildFrontend = Read-Host "Do you want to build the frontend for production? (Y/N)"
if ($buildFrontend -eq "Y" -or $buildFrontend -eq "y") {
    Write-Info "Building frontend..."
    try {
        npm run build
        Write-Success "Frontend built successfully"
        Write-Info "Production files are in the 'build' directory"
    } catch {
        Write-Error-Message "Frontend build failed"
    }
} else {
    Write-Info "Skipping frontend build"
}

Write-Host ""
Read-Host "Press Enter to continue"

# Installation Complete
Clear-Host
Write-Header "Installation Complete!"

Write-Host ""
Write-Success "Lutheran Church Management System has been installed successfully!"
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start the backend server:"
Write-Host "   cd backend"
Write-Host "   php spark serve"
Write-Host ""
Write-Host "2. In a new PowerShell window, start the frontend:"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "3. Access the application:"
Write-Host "   Frontend: http://localhost:5173"
Write-Host "   Backend:  http://localhost:8080"
Write-Host ""
Write-Host "4. Default login credentials:"
Write-Host "   Admin:  username: admin, password: admin123"
Write-Host "   Member: code: LCH001, password: member123"
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Warning-Message "IMPORTANT: Change default passwords in production!"
Write-Host ""
Write-Success "Happy managing! 🎉"
Write-Host ""
Read-Host "Press Enter to exit"
