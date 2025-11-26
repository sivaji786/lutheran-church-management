# Prerequisites Check Guide
## Lutheran Church Management System

Use these commands to verify all required software is installed on your system.

---

## ✅ Check Node.js and npm

```bash
# Check Node.js version (should be 18 or higher)
node --version

# Check npm version
npm --version
```

**Expected Output:**
```
v18.x.x or higher
9.x.x or higher
```

**If not installed:** Download from https://nodejs.org/

---

## ✅ Check PHP

```bash
# Check PHP version (should be 8.1 or higher)
php --version

# Check PHP CLI is working
php -r "echo 'PHP is working!';"
```

**Expected Output:**
```
PHP 8.1.x or higher
PHP is working!
```

**If not installed:**
- **Ubuntu/Debian:** `sudo apt install php8.1 php8.1-cli php8.1-mysql php8.1-mbstring php8.1-xml php8.1-curl`
- **macOS:** `brew install php@8.1`
- **Windows:** Download from https://windows.php.net/download/

---

## ✅ Check MySQL

```bash
# Check MySQL version (should be 8.0 or higher)
mysql --version

# Test MySQL connection
mysql -u root -p -e "SELECT VERSION();"
```

**Expected Output:**
```
mysql  Ver 8.0.x or higher
```

**If not installed:**
- **Ubuntu/Debian:** `sudo apt install mysql-server`
- **macOS:** `brew install mysql`
- **Windows:** Download from https://dev.mysql.com/downloads/installer/

---

## ✅ Check Composer

```bash
# Check Composer version (should be 2.x)
composer --version
```

**Expected Output:**
```
Composer version 2.x.x
```

**If not installed:**
```bash
# Install Composer globally
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

Or download from https://getcomposer.org/download/

---

## ✅ Check Git (Optional, for cloning)

```bash
# Check Git version
git --version
```

**Expected Output:**
```
git version 2.x.x or higher
```

**If not installed:**
- **Ubuntu/Debian:** `sudo apt install git`
- **macOS:** `brew install git`
- **Windows:** Download from https://git-scm.com/download/win

---

## 🔧 All-in-One Check Script

Save this as `check_prerequisites.sh` and run it:

```bash
#!/bin/bash

echo "=== Checking Prerequisites ==="
echo ""

# Check Node.js
echo "1. Node.js:"
if command -v node &> /dev/null; then
    node --version
    echo "✅ Node.js is installed"
else
    echo "❌ Node.js is NOT installed"
fi
echo ""

# Check npm
echo "2. npm:"
if command -v npm &> /dev/null; then
    npm --version
    echo "✅ npm is installed"
else
    echo "❌ npm is NOT installed"
fi
echo ""

# Check PHP
echo "3. PHP:"
if command -v php &> /dev/null; then
    php --version | head -n 1
    echo "✅ PHP is installed"
else
    echo "❌ PHP is NOT installed"
fi
echo ""

# Check MySQL
echo "4. MySQL:"
if command -v mysql &> /dev/null; then
    mysql --version
    echo "✅ MySQL is installed"
else
    echo "❌ MySQL is NOT installed"
fi
echo ""

# Check Composer
echo "5. Composer:"
if command -v composer &> /dev/null; then
    composer --version | head -n 1
    echo "✅ Composer is installed"
else
    echo "❌ Composer is NOT installed"
fi
echo ""

# Check Git
echo "6. Git (optional):"
if command -v git &> /dev/null; then
    git --version
    echo "✅ Git is installed"
else
    echo "⚠️  Git is NOT installed (optional)"
fi
echo ""

echo "=== Check Complete ==="
```

**Run the script:**
```bash
chmod +x check_prerequisites.sh
./check_prerequisites.sh
```

---

## 📋 Quick Checklist

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] PHP 8.1+ installed
- [ ] MySQL 8.0+ installed
- [ ] Composer 2.x installed
- [ ] Git installed (optional)

---

## 🆘 Troubleshooting

### Node.js/npm not found
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node

# Windows
# Download installer from https://nodejs.org/
```

### PHP not found or wrong version
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install php8.1 php8.1-cli php8.1-mysql php8.1-mbstring php8.1-xml php8.1-curl

# macOS
brew install php@8.1
brew link php@8.1

# Windows
# Download from https://windows.php.net/download/
```

### MySQL not found
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation

# macOS
brew install mysql
brew services start mysql

# Windows
# Download installer from https://dev.mysql.com/downloads/installer/
```

### Composer not found
```bash
# Global installation
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
sudo mv composer.phar /usr/local/bin/composer
php -r "unlink('composer-setup.php');"
```

---

## ✅ After Installation

Once all prerequisites are installed, verify again:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
php --version     # Should show 8.1.x or higher
mysql --version   # Should show 8.0.x or higher
composer --version # Should show 2.x.x
```

**All checks passing?** You're ready to install the Lutheran Church Management System! 🎉

Proceed to the installation steps in `README.md`.
