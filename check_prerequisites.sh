#!/bin/bash

# Lutheran Church Management System
# Prerequisites Check Script
# This script checks if all required software is installed

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Lutheran Church Management System                        ║"
echo "║   Prerequisites Check                                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ALL_OK=true

# Function to check version
check_version() {
    local name=$1
    local command=$2
    local required=$3
    local version_cmd=$4
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Checking: $name"
    echo "Required: $required or higher"
    echo ""
    
    if command -v $command &> /dev/null; then
        version=$($version_cmd 2>&1)
        echo "$version"
        echo ""
        echo -e "${GREEN}✅ $name is installed${NC}"
    else
        echo -e "${RED}❌ $name is NOT installed${NC}"
        echo ""
        ALL_OK=false
    fi
    echo ""
}

# Check Node.js
check_version "Node.js" "node" "v18.x.x" "node --version"

# Check npm
check_version "npm" "npm" "9.x.x" "npm --version"

# Check PHP
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Checking: PHP"
echo "Required: 8.1.x or higher"
echo ""

if command -v php &> /dev/null; then
    php --version | head -n 1
    echo ""
    
    # Check required PHP extensions
    echo "Checking PHP extensions..."
    extensions=("mysqli" "mbstring" "xml" "curl" "json")
    missing_ext=false
    
    for ext in "${extensions[@]}"; do
        if php -m | grep -q "^$ext$"; then
            echo -e "  ${GREEN}✓${NC} $ext"
        else
            echo -e "  ${RED}✗${NC} $ext (missing)"
            missing_ext=true
        fi
    done
    
    echo ""
    if [ "$missing_ext" = false ]; then
        echo -e "${GREEN}✅ PHP and all required extensions are installed${NC}"
    else
        echo -e "${YELLOW}⚠️  PHP is installed but some extensions are missing${NC}"
        ALL_OK=false
    fi
else
    echo -e "${RED}❌ PHP is NOT installed${NC}"
    ALL_OK=false
fi
echo ""

# Check MySQL
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Checking: MySQL"
echo "Required: 8.0.x or higher"
echo ""

if command -v mysql &> /dev/null; then
    mysql --version
    echo ""
    echo -e "${GREEN}✅ MySQL is installed${NC}"
else
    echo -e "${RED}❌ MySQL is NOT installed${NC}"
    ALL_OK=false
fi
echo ""

# Check Composer
check_version "Composer" "composer" "2.x.x" "composer --version | head -n 1"

# Check Git (optional)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Checking: Git (optional)"
echo ""

if command -v git &> /dev/null; then
    git --version
    echo ""
    echo -e "${GREEN}✅ Git is installed${NC}"
else
    echo -e "${YELLOW}⚠️  Git is NOT installed (optional for development)${NC}"
fi
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Summary                                                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$ALL_OK" = true ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ All required prerequisites are installed!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "You can now proceed with the installation:"
    echo "  1. Install frontend dependencies: npm install"
    echo "  2. Install backend dependencies: cd backend && composer install"
    echo "  3. Follow the setup instructions in README.md"
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ Some prerequisites are missing!${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Please install the missing software:"
    echo ""
    echo "Node.js & npm:"
    echo "  Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs"
    echo "  macOS: brew install node"
    echo "  Windows: Download from https://nodejs.org/"
    echo ""
    echo "PHP 8.1+:"
    echo "  Ubuntu/Debian: sudo apt install php8.1 php8.1-cli php8.1-mysql php8.1-mbstring php8.1-xml php8.1-curl"
    echo "  macOS: brew install php@8.1"
    echo "  Windows: Download from https://windows.php.net/download/"
    echo ""
    echo "MySQL 8.0+:"
    echo "  Ubuntu/Debian: sudo apt install mysql-server"
    echo "  macOS: brew install mysql"
    echo "  Windows: Download from https://dev.mysql.com/downloads/installer/"
    echo ""
    echo "Composer 2.x:"
    echo "  curl -sS https://getcomposer.org/installer | php"
    echo "  sudo mv composer.phar /usr/local/bin/composer"
    echo ""
    echo "For detailed instructions, see PREREQUISITES_CHECK.md"
fi

echo ""
