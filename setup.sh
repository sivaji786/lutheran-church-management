#!/bin/bash

# Lutheran Church Management System - Automated Setup Script
# This script will guide you through the complete installation process

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}$1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Welcome banner
clear
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║   Lutheran Church Management System                        ║"
echo "║   Automated Setup Script                                   ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
print_info "This script will install and configure the application."
echo ""

# Check if running with sudo for certain operations
if [[ $EUID -eq 0 ]]; then
   print_warning "This script should NOT be run as root/sudo"
   print_info "Please run as a regular user. Sudo will be requested when needed."
   exit 1
fi

# Step 1: Check Prerequisites
print_header "Step 1: Checking Prerequisites"

PREREQ_OK=true

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
else
    print_error "Node.js is NOT installed"
    PREREQ_OK=false
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
else
    print_error "npm is NOT installed"
    PREREQ_OK=false
fi

# Check PHP
if command -v php &> /dev/null; then
    PHP_VERSION=$(php --version | head -n 1)
    print_success "PHP is installed: $PHP_VERSION"
else
    print_error "PHP is NOT installed"
    PREREQ_OK=false
fi

# Check MySQL
if command -v mysql &> /dev/null; then
    MYSQL_VERSION=$(mysql --version)
    print_success "MySQL is installed: $MYSQL_VERSION"
else
    print_error "MySQL is NOT installed"
    PREREQ_OK=false
fi

# Check Composer
if command -v composer &> /dev/null; then
    COMPOSER_VERSION=$(composer --version | head -n 1)
    print_success "Composer is installed: $COMPOSER_VERSION"
else
    print_error "Composer is NOT installed"
    PREREQ_OK=false
fi

if [ "$PREREQ_OK" = false ]; then
    echo ""
    print_error "Some prerequisites are missing!"
    print_info "Please install the missing software and run this script again."
    print_info "See README.md for installation instructions."
    exit 1
fi

echo ""
print_success "All prerequisites are installed!"
echo ""

# Ask for confirmation to proceed
read -p "Do you want to proceed with the installation? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Installation cancelled by user."
    exit 0
fi

# Step 2: Install Frontend Dependencies
print_header "Step 2: Installing Frontend Dependencies"

print_info "Running: npm install"
if npm install; then
    print_success "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Step 3: Install Backend Dependencies
print_header "Step 3: Installing Backend Dependencies"

cd backend
print_info "Running: composer install"
if composer install; then
    print_success "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi
cd ..

# Step 4: Configure Environment Files
print_header "Step 4: Configuring Environment Files"

# Frontend .env
if [ ! -f .env ]; then
    print_info "Creating frontend .env file..."
    cp .env.example .env
    print_success "Frontend .env created"
else
    print_warning "Frontend .env already exists, skipping..."
fi

# Backend .env
if [ ! -f backend/.env ]; then
    print_info "Creating backend .env file..."
    cp backend/.env.example backend/.env
    
    # Ask for database configuration
    echo ""
    print_info "Database Configuration"
    echo ""
    
    read -p "Enter MySQL hostname [localhost]: " DB_HOST
    DB_HOST=${DB_HOST:-localhost}
    
    read -p "Enter database name [lutheran_church]: " DB_NAME
    DB_NAME=${DB_NAME:-lutheran_church}
    
    read -p "Enter MySQL username [root]: " DB_USER
    DB_USER=${DB_USER:-root}
    
    read -sp "Enter MySQL password: " DB_PASS
    echo ""
    
    read -p "Enter MySQL port [3306]: " DB_PORT
    DB_PORT=${DB_PORT:-3306}
    
    # Generate random JWT secret
    JWT_SECRET=$(openssl rand -hex 32)
    
    # Update .env file
    sed -i "s/database.default.hostname = localhost/database.default.hostname = $DB_HOST/" backend/.env
    sed -i "s/database.default.database = lutheran_church/database.default.database = $DB_NAME/" backend/.env
    sed -i "s/database.default.username = root/database.default.username = $DB_USER/" backend/.env
    sed -i "s/database.default.password = your_password_here/database.default.password = $DB_PASS/" backend/.env
    sed -i "s/database.default.port = 3306/database.default.port = $DB_PORT/" backend/.env
    sed -i "s/JWT_SECRET = 'your-secret-key-here-please-change-in-production'/JWT_SECRET = '$JWT_SECRET'/" backend/.env
    
    print_success "Backend .env configured"
else
    print_warning "Backend .env already exists, skipping configuration..."
fi

# Step 5: Database Setup
print_header "Step 5: Database Setup"

echo ""
read -p "Do you want to create the database now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Creating database: $DB_NAME"
    
    # Try to create database
    if mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null; then
        print_success "Database created successfully"
    else
        print_warning "Could not create database automatically"
        print_info "Please create the database manually:"
        echo "  mysql -u root -p"
        echo "  CREATE DATABASE $DB_NAME;"
        echo ""
        read -p "Press Enter after creating the database manually..."
    fi
    
    # Check if schema file exists
    if [ -f "database/schema.sql" ]; then
        echo ""
        read -p "Do you want to import the database schema? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Importing database schema..."
            if mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < database/schema.sql 2>/dev/null; then
                print_success "Database schema imported successfully"
            else
                print_error "Failed to import schema"
            fi
        fi
    else
        print_warning "No schema.sql file found in database/ directory"
        print_info "You'll need to set up the database manually"
    fi
    
    # Check if seed file exists
    if [ -f "database/seed.sql" ]; then
        echo ""
        read -p "Do you want to import seed data (demo data)? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Importing seed data..."
            if mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < database/seed.sql 2>/dev/null; then
                print_success "Seed data imported successfully"
            else
                print_error "Failed to import seed data"
            fi
        fi
    fi
else
    print_info "Skipping database creation"
    print_warning "Remember to create the database manually before running the application"
fi

# Step 6: Set Permissions
print_header "Step 6: Setting Permissions"

print_info "Setting permissions for writable directories..."

# Make writable directories writable
chmod -R 777 backend/writable/cache 2>/dev/null || true
chmod -R 777 backend/writable/logs 2>/dev/null || true
chmod -R 777 backend/writable/session 2>/dev/null || true
chmod -R 777 backend/writable/uploads 2>/dev/null || true

print_success "Permissions set successfully"

# Step 7: Build Frontend (Optional)
print_header "Step 7: Build Frontend (Optional)"

echo ""
read -p "Do you want to build the frontend for production? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Building frontend..."
    if npm run build; then
        print_success "Frontend built successfully"
        print_info "Production files are in the 'dist' directory"
    else
        print_error "Frontend build failed"
    fi
else
    print_info "Skipping frontend build"
fi

# Step 8: Summary and Next Steps
print_header "Installation Complete!"

echo ""
print_success "Lutheran Church Management System has been installed successfully!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Start the backend server:"
echo "   cd backend"
echo "   php spark serve"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080"
echo ""
echo "4. Default login credentials:"
echo "   Admin:  username: admin, password: admin123"
echo "   Member: code: LCH001, password: member123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_warning "IMPORTANT: Change default passwords in production!"
echo ""
print_success "Happy managing! 🎉"
echo ""
