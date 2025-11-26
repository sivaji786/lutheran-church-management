# Installation Guide for Windows XAMPP Users

This guide is specifically for Windows users who have XAMPP installed.

---

## 📋 Prerequisites

### What XAMPP Provides (Already Installed):
- ✅ PHP 8.x
- ✅ MySQL/MariaDB
- ✅ phpMyAdmin
- ✅ Apache (optional)

### What You Need to Install:

#### 1. Node.js & npm
- Download from: https://nodejs.org/
- Choose "LTS" version (recommended)
- Run installer and follow prompts
- **Important:** Check "Add to PATH" during installation

#### 2. Composer
- Download from: https://getcomposer.org/download/
- Run `Composer-Setup.exe`
- During installation, point to XAMPP's PHP:
  - Usually: `C:\xampp\php\php.exe`
- Complete installation

---

## 🚀 Quick Installation

### Step 1: Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Start **MySQL** (click Start button)
3. Apache is optional (we'll use PHP's built-in server)

### Step 2: Clone Repository

Open Command Prompt or PowerShell:

```cmd
cd C:\xampp\htdocs
git clone https://github.com/sivaji786/lutheran-church-management.git
cd lutheran-church-management
```

### Step 3: Run Automated Setup

```cmd
setup.bat
```

The script will:
- ✅ Check all prerequisites
- ✅ Install dependencies
- ✅ Configure environment files
- ✅ Set up database (using XAMPP's MySQL)
- ✅ Build frontend (optional)

### Step 4: Database Configuration

When prompted during setup:

```
Enter MySQL hostname [localhost]: localhost
Enter database name [lutheran_church]: lutheran_church
Enter MySQL username [root]: root
Enter MySQL password: (leave empty - XAMPP default has no password)
Enter MySQL port [3306]: 3306
```

**Note:** XAMPP's default MySQL has **no password** for root user. Just press Enter when asked for password.

---

## 🎯 Alternative: Manual Installation for XAMPP

If you prefer manual installation:

### 1. Install Dependencies

```cmd
# Frontend
npm install

# Backend
cd backend
composer install
cd ..
```

### 2. Configure Environment

**Frontend (.env):**
```
VITE_API_BASE_URL=http://localhost:8080
```

**Backend (backend/.env):**
```ini
CI_ENVIRONMENT = development

app.baseURL = 'http://localhost:8080'

database.default.hostname = localhost
database.default.database = lutheran_church
database.default.username = root
database.default.password = 
database.default.DBDriver = MySQLi
database.default.port = 3306

JWT_SECRET = 'your-secret-key-here'
```

**Important:** Leave password empty for XAMPP's default MySQL!

### 3. Create Database

**Option A: Using phpMyAdmin**

1. Open http://localhost/phpmyadmin
2. Click "New" in left sidebar
3. Database name: `lutheran_church`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

**Option B: Using Command Line**

```cmd
cd C:\xampp\mysql\bin
mysql -u root
CREATE DATABASE lutheran_church;
exit;
```

### 4. Import Database Schema

**Using phpMyAdmin:**
1. Select `lutheran_church` database
2. Click "Import" tab
3. Choose `database/schema.sql`
4. Click "Go"
5. Repeat for `database/seed.sql` (optional)

**Using Command Line:**
```cmd
cd C:\xampp\mysql\bin
mysql -u root lutheran_church < C:\xampp\htdocs\lutheran-church-management\database\schema.sql
mysql -u root lutheran_church < C:\xampp\htdocs\lutheran-church-management\database\seed.sql
```

---

## 🖥️ Running the Application

### Start Backend Server

Open Command Prompt:

```cmd
cd C:\xampp\htdocs\lutheran-church-management\backend
php spark serve
```

Backend runs on: http://localhost:8080

### Start Frontend Server

Open **another** Command Prompt:

```cmd
cd C:\xampp\htdocs\lutheran-church-management
npm run dev
```

Frontend runs on: http://localhost:3000

---

## 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **phpMyAdmin:** http://localhost/phpmyadmin

### Default Login Credentials:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Member:**
- Member Code: `LCH001`
- Password: `member123`

---

## 🔧 Common XAMPP Issues & Solutions

### Issue 1: MySQL Won't Start

**Solution:**
- Check if port 3306 is already in use
- In XAMPP Control Panel, click "Config" → "my.ini"
- Change port if needed (e.g., 3307)
- Update `backend/.env` with new port

### Issue 2: Port 80 Already in Use

**Solution:**
- You don't need Apache for this project
- We use PHP's built-in server (port 8080)
- Just keep MySQL running

### Issue 3: Composer Not Found

**Solution:**
- Reinstall Composer
- Make sure to select XAMPP's PHP during installation: `C:\xampp\php\php.exe`
- Restart Command Prompt after installation

### Issue 4: Node/npm Not Found

**Solution:**
- Restart Command Prompt after installing Node.js
- Or add to PATH manually:
  - `C:\Program Files\nodejs\`

### Issue 5: "Access Denied" for MySQL

**Solution:**
- XAMPP's default MySQL has no password
- In `backend/.env`, set:
  ```
  database.default.password = 
  ```
  (leave it empty)

---

## 📦 Production Deployment from XAMPP

### Build for Production

```cmd
npm run build
```

This creates a `build/` folder ready for deployment.

### Deploy to Shared Hosting

1. **Upload Files:**
   - Upload `backend/` to hosting (e.g., `public_html/api/`)
   - Upload `build/` contents to hosting (e.g., `public_html/app/`)

2. **Configure Production Database:**
   - Update `backend/.env` with hosting database credentials
   - Import schema via hosting's phpMyAdmin

3. **Test:**
   - Visit your domain
   - Login and verify functionality

---

## 🎯 XAMPP-Specific Tips

### 1. Use XAMPP's MySQL

The application works perfectly with XAMPP's MySQL/MariaDB. No need to install separate MySQL.

### 2. phpMyAdmin is Your Friend

Use phpMyAdmin for:
- Creating databases
- Importing SQL files
- Viewing/editing data
- Managing users

### 3. File Locations

XAMPP default locations:
- **htdocs:** `C:\xampp\htdocs\`
- **PHP:** `C:\xampp\php\`
- **MySQL:** `C:\xampp\mysql\`
- **Config:** `C:\xampp\mysql\bin\my.ini`

### 4. Backup Database

Using phpMyAdmin:
1. Select database
2. Click "Export"
3. Choose "Quick" method
4. Click "Go"
5. Save `.sql` file

---

## ✅ Verification Checklist

After installation, verify:

- [ ] XAMPP MySQL is running
- [ ] Database `lutheran_church` exists
- [ ] Backend server runs on port 8080
- [ ] Frontend runs on port 3000
- [ ] Can login as admin
- [ ] Can login as member
- [ ] phpMyAdmin shows tables

---

## 🆘 Getting Help

If you encounter issues:

1. **Check XAMPP Control Panel:**
   - Is MySQL running? (green indicator)
   
2. **Check Error Logs:**
   - XAMPP: `C:\xampp\mysql\data\mysql_error.log`
   - Backend: `backend/writable/logs/`

3. **Common Commands:**
   ```cmd
   # Check if MySQL is accessible
   C:\xampp\mysql\bin\mysql -u root
   
   # Check PHP version
   C:\xampp\php\php -v
   
   # Check Node version
   node --version
   
   # Check Composer
   composer --version
   ```

---

## 🎉 Success!

Your Lutheran Church Management System is now running on XAMPP!

**Development URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Database: http://localhost/phpmyadmin

**Next Steps:**
1. Change default passwords
2. Add real members
3. Customize as needed
4. Deploy to production when ready

Happy managing! 🚀
