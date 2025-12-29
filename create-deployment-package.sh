#!/bin/bash

# Lutheran Church Management System - Deployment Package Creator
# This script creates a production-ready deployment package for shared hosting

set -e  # Exit on error

echo "======================================"
echo "Lutheran Church Deployment Packager"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Clean up old deployment files
echo -e "${YELLOW}[1/7] Cleaning up old deployment files...${NC}"
rm -rf deployment/
rm -f lutheran-deployment.zip

# Build frontend
echo -e "${YELLOW}[2/7] Building frontend...${NC}"
npm run build
if [ ! -d "build" ]; then
    echo -e "${RED}Error: Frontend build failed - build directory not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend built successfully${NC}"

# Install backend dependencies
echo -e "${YELLOW}[3/7] Installing backend dependencies...${NC}"
cd backend
if [ ! -f "composer.json" ]; then
    echo -e "${RED}Error: composer.json not found in backend directory${NC}"
    exit 1
fi

# Check if composer is installed
if ! command -v composer &> /dev/null; then
    echo -e "${RED}Error: Composer is not installed. Please install composer first.${NC}"
    exit 1
fi

composer install --no-dev --optimize-autoloader --no-interaction
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
cd ..

# Create deployment directory structure
echo -e "${YELLOW}[4/7] Creating deployment directory structure...${NC}"
mkdir -p deployment/backend

# Copy backend files
echo -e "${YELLOW}[5/7] Copying backend files...${NC}"
rsync -av --exclude='vendor' \
    --exclude='.git' \
    --exclude='tests' \
    --exclude='.env' \
    --exclude='writable/logs/*' \
    --exclude='writable/cache/*' \
    --exclude='writable/session/*' \
    --exclude='writable/uploads/*' \
    --exclude='writable/debug/*' \
    backend/ deployment/backend/

# Copy vendor directory separately (already optimized)
cp -r backend/vendor deployment/backend/

# Create .env.example in deployment
cp backend/.env.example deployment/backend/.env.example

# Ensure writable directories exist but are empty
mkdir -p deployment/backend/writable/{cache,logs,session,uploads}
touch deployment/backend/writable/{cache,logs,session,uploads}/.gitkeep

echo -e "${GREEN}✓ Backend files copied${NC}"

# Copy frontend files directly to root
echo -e "${YELLOW}[6/7] Copying frontend files...${NC}"
cp -r build/* deployment/

# Inject config.js script tag into index.html BEFORE other scripts
echo "Injecting config.js script tag into index.html..."
sed -i 's|<script type="module"|  <!-- Runtime API configuration - must load before app bundle -->\n  <script src="./config.js"></script>\n  <script type="module"|' deployment/index.html

# Create config.template.js for runtime configuration in root
cat > deployment/config.template.js << 'EOF'
// This file will be renamed to config.js by the installer
// DO NOT EDIT - This is a template file
window.APP_CONFIG = {
  API_BASE_URL: '{{API_BASE_URL}}'
};
EOF

echo -e "${GREEN}✓ Frontend files copied${NC}"

# Copy installer.php to deployment root
echo "Copying installer.php..."
if [ -f "installer.php" ]; then
    cp installer.php deployment/
else
    echo -e "${YELLOW}Warning: installer.php not found yet - will be created separately${NC}"
fi

# Create README_INSTALL.txt
cat > deployment/README_INSTALL.txt << 'EOF'
========================================
Lutheran Church Management System
Shared Hosting Installation Guide
========================================

QUICK START:
-----------

1. UPLOAD FILES
   - Upload this entire folder to your hosting via cPanel File Manager or FTP
   - Extract if you uploaded as ZIP

2. SETUP DATABASE
   - Create a MySQL database in cPanel
   - Import database/schema.sql via phpMyAdmin
   - Note your database name, username, and password

3. RUN INSTALLER
   - Navigate to: https://yourdomain.com/installer.php
   - Fill in the installation form
   - Follow on-screen instructions

4. SECURE YOUR INSTALLATION
   - DELETE installer.php after installation
   - Change default admin password immediately

DIRECTORY STRUCTURE:
-------------------

deployment/
├── installer.php          # Run this in browser to install
├── README_INSTALL.txt     # This file
├── index.html             # Frontend entry point
├── assets/                # Frontend assets (CSS, JS, images)
├── backend/               # CodeIgniter 4 API
└── database/              # SQL files for manual import
    ├── schema.sql         # Import this via phpMyAdmin
    └── README.md          # Database import instructions

REQUIREMENTS:
------------

- PHP 8.1 or higher
- MySQL 5.7 or higher
- Apache with mod_rewrite enabled
- PHP Extensions: mysqli, mbstring, intl, json, xml

SUPPORT:
--------

For detailed instructions, see INSTALL_SHARED_HOSTING.md in the main repository.

For issues, check:
- Backend logs: backend/writable/logs/
- PHP error logs in cPanel

========================================
EOF

# Create .htaccess for frontend in root
cat > deployment/.htaccess << 'EOF'
<FilesMatch ".(?:html|php)$">
    SetHandler application/x-httpd-alt-php82
</FilesMatch>

EOF


# Create the ZIP file
echo -e "${YELLOW}[7/7] Creating deployment package...${NC}"
cd deployment
zip -r ../lutheran-deployment.zip . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

# Get file size
FILESIZE=$(du -h lutheran-deployment.zip | cut -f1)

echo ""
echo -e "${GREEN}======================================"
echo "✓ Deployment package created successfully!"
echo "======================================${NC}"
echo ""
echo "Package: lutheran-deployment.zip"
echo "Size: $FILESIZE"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Upload lutheran-deployment.zip to your shared hosting"
echo "2. Extract the zip file"
echo "3. Import database/schema.sql via phpMyAdmin"
echo "4. Navigate to installer.php in your browser"
echo "5. Follow the installation wizard"
echo ""
echo -e "${RED}Important: Delete installer.php after installation!${NC}"
echo ""
