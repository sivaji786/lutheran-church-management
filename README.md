# Lutheran Church Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-42%2F42%20passing-brightgreen)](https://github.com/sivaji786/lutheran-church-management)
[![PHP](https://img.shields.io/badge/PHP-8.1%2B-blue)](https://www.php.net/)
[![Node](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)

**Repository:** https://github.com/sivaji786/lutheran-church-management

A comprehensive full-stack web application for managing church members, offerings, and support tickets with separate portals for administrators and members.

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Default Credentials](#-default-credentials)
- [Features](#-features)
- [Testing](#-testing)
- [Tech Stack](#️-tech-stack)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Production Deployment](#-production-deployment)
- [Contributing](#-contributing)

---

## 🔧 Prerequisites

Before installation, ensure you have the following installed:

- **Node.js** 18+ and npm
- **PHP** 8.1+
- **MySQL** 8.0+
- **Composer** 2.x

### Quick Check

Run the prerequisites check script:
```bash
./check_prerequisites.sh
```

Or check manually:
```bash
node --version    # Should be v18.x.x or higher
npm --version     # Should be 9.x.x or higher
php --version     # Should be 8.1.x or higher
mysql --version   # Should be 8.0.x or higher
composer --version # Should be 2.x.x
```

---

## 🚀 Installation

### Method 1: Web Installer (Recommended) ⭐

The easiest way to install on any environment (local or production):

1. **Upload Files**
   - Upload all project files to your server
   - Or clone the repository locally

2. **Access Installer**
   - Open browser: `http://localhost/install.php` (local)
   - Or: `http://yourdomain.com/install.php` (production)

3. **Follow the Wizard**
   - 6-step guided installation
   - Automatic prerequisites check
   - Database setup and import
   - Environment configuration
   - Security key generation

4. **Delete Installer**
   ```bash
   rm install.php  # IMPORTANT: Do this after installation!
   ```

📖 **Detailed Guide:** See [INSTALLATION.md](INSTALLATION.md) for complete instructions.

---

### Method 2: Automated Scripts

For automated installation:

**Linux/Mac:**
```bash
./setup.sh
```

**Windows (Command Prompt):**
```cmd
setup.bat
```

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

> **Note:** If you get "execution policy" error in PowerShell, run:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

The setup script will:
- ✅ Check all prerequisites
- ✅ Install frontend and backend dependencies
- ✅ Configure environment files
- ✅ Set up the database (with your input)
- ✅ Set proper permissions
- ✅ Optionally build for production

### Method 3: Manual Installation

If you prefer manual installation, follow these steps:

### 1. Clone Repository
```bash
git clone https://github.com/sivaji786/lutheran-church-management.git
cd lutheran-church-management
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Backend Setup
```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
nano .env
```

Update these values in `backend/.env`:
```ini
database.default.hostname = localhost
database.default.database = lutheran_church
database.default.username = root
database.default.password = your_password
database.default.DBDriver = MySQLi
database.default.port = 3306

JWT_SECRET = 'your-secret-key-here-change-in-production'
```

### 4. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE lutheran_church;
exit;

# Import schema (create your schema.sql based on the database structure)
# Or use the existing database migration tools
```

### 5. Start Backend Server
```bash
cd backend
php spark serve
```

Backend will run on `http://localhost:8080`

### 6. Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080

---

## 🔐 Default Credentials

### Admin Login
- **Username:** `admin`
- **Password:** `admin123`

### Demo Member Login
- **Member Code:** `LCH001`
- **Password:** `member123`

> ⚠️ **Important:** Change these credentials in production!

---

## ✅ Features

### Authentication System
- ✅ Admin login with username/password
- ✅ Member login with mobile number or member code
- ✅ JWT token-based authentication
- ✅ Secure password hashing (bcrypt)
- ✅ Session management

### Admin Portal

#### Dashboard
- ✅ Total members count
- ✅ Total offerings amount
- ✅ Monthly offerings chart
- ✅ Quick statistics overview

#### Member Management
- ✅ View all members (paginated, 10 per page)
- ✅ Search by name, mobile, member code, area, ward
- ✅ Filter by status, confirmation status, area, ward
- ✅ Add new member with complete registration form
- ✅ Edit member details
- ✅ View detailed member profile
- ✅ Update member status (Active/Inactive)
- ✅ Reset member password
- ✅ Import members from CSV/Excel
- ✅ Export members to CSV
- ✅ Birthday filter (view members with birthdays this month)

#### Offering Management
- ✅ View all offerings (paginated)
- ✅ Search by member name/code
- ✅ Filter by date range and offering type
- ✅ Add new offering
- ✅ Edit offering details
- ✅ Delete offering
- ✅ Export offerings data

#### Ticket Management
- ✅ View all tickets from all members
- ✅ Search by subject, description, ticket number
- ✅ Filter by status, priority, category
- ✅ View full ticket details
- ✅ Update ticket status (Open → In Progress → Updated → Done)
- ✅ Add admin notes/responses to tickets
- ✅ Pagination (10 tickets per page)
- ✅ Priority badges (High/Medium/Low)

### Member Portal

#### Dashboard
- ✅ Welcome message with member name
- ✅ Total offerings contributed
- ✅ Recent offerings list
- ✅ Ticket status overview

#### My Details
- ✅ View personal information
- ✅ Member code display
- ✅ Contact details
- ✅ Address information
- ✅ Confirmation status

#### My Offerings
- ✅ View all personal offerings
- ✅ Total amount contributed
- ✅ Date-wise listing
- ✅ Offering type categorization

#### My Tickets
- ✅ Create new ticket (category, subject, description)
- ✅ View all submitted tickets
- ✅ Track ticket status
- ✅ View admin responses
- ✅ Categories: Profile Update, Suggestion, Request, Other

#### Account Management
- ✅ Change password
- ✅ Secure logout

### Public Pages
- ✅ Home page
- ✅ About page
- ✅ Services page
- ✅ Contact page
- ✅ Photos gallery
- ✅ Dual login page (Admin/Member)

---

## 🧪 Testing

### Run E2E Tests
```bash
# Run all Playwright tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

**Test Coverage:** 42/42 tests passing (100%)

### Run Unit Tests
```bash
npm test
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** React Hooks
- **HTTP Client:** Fetch API
- **Testing:** Playwright (E2E), Jest (Unit)

### Backend
- **Framework:** CodeIgniter 4
- **Language:** PHP 8.1+
- **Database:** MySQL 8.0+
- **Authentication:** JWT (firebase/php-jwt)
- **API:** RESTful

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/member/login` - Member login

### Members
- `GET /api/members` - List members (with filters, pagination)
- `GET /api/members/:id` - Get single member
- `POST /api/members` - Create member
- `PUT /api/members/:id` - Update member
- `PATCH /api/members/:id/status` - Update member status
- `POST /api/members/:id/reset-password` - Reset password

### Offerings
- `GET /api/offerings` - List offerings (with filters, pagination)
- `POST /api/offerings` - Create offering
- `PUT /api/offerings/:id` - Update offering
- `DELETE /api/offerings/:id` - Delete offering

### Tickets
- `GET /api/tickets` - List tickets (with filters, pagination)
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket (admin notes)
- `PATCH /api/tickets/:id/status` - Update ticket status

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

---

## 📁 Project Structure

```
lutheran-church-management/
├── backend/                 # CodeIgniter 4 Backend
│   ├── app/
│   │   ├── Controllers/    # API Controllers
│   │   ├── Models/         # Database Models
│   │   └── Config/         # Configuration
│   ├── public/             # Entry point
│   └── .env                # Environment config
├── src/                    # React Frontend
│   ├── components/         # React components
│   ├── services/           # API client
│   └── utils/              # Utilities
├── e2e/                    # E2E tests (Playwright)
├── tests/                  # Unit tests (Jest)
├── check_prerequisites.sh  # Prerequisites checker
└── README.md               # This file
```

---

## 🚀 Production Deployment

### Deployment Options

This application can be deployed on:
- ✅ Shared Hosting (GoDaddy, Bluehost, HostGator, etc.)
- ✅ VPS/Cloud (DigitalOcean, AWS, Azure, Google Cloud)
- ✅ cPanel Hosting
- ✅ Dedicated Servers

---

### Option 1: Shared Hosting (GoDaddy, cPanel)

This is the most common deployment method for small to medium applications.

#### Prerequisites
- Shared hosting account with:
  - PHP 8.1+ support
  - MySQL database access
  - SSH access (optional but recommended)
  - File Manager or FTP access

#### Step 1: Build the Application Locally

On your local machine:

```bash
# Build frontend for production
npm run build

# This creates a 'dist' folder with optimized files
```

#### Step 2: Prepare Backend Files

```bash
# Install backend dependencies (production only)
cd backend
composer install --no-dev --optimize-autoloader

# Remove development files
rm -rf tests/
rm phpunit.xml.dist
```

#### Step 3: Upload Files

**Option A: Using cPanel File Manager**

1. Login to cPanel
2. Go to File Manager
3. Navigate to `public_html` (or your domain's root)
4. Create folder structure:
   ```
   public_html/
   ├── api/          (upload backend files here)
   └── app/          (upload dist files here)
   ```

**Option B: Using FTP (FileZilla)**

1. Connect to your hosting via FTP
2. Upload `backend/` folder to `public_html/api/`
3. Upload `dist/` contents to `public_html/app/`

**Option C: Using SSH (Recommended)**

```bash
# On your local machine, create deployment package
tar -czf lutheran-app.tar.gz backend/ dist/

# Upload to server
scp lutheran-app.tar.gz user@yourserver.com:~/

# SSH into server
ssh user@yourserver.com

# Extract files
tar -xzf lutheran-app.tar.gz
mv backend public_html/api
mv dist/* public_html/app/
```

#### Step 4: Create MySQL Database

1. Login to cPanel
2. Go to **MySQL Databases**
3. Create new database: `lutheran_church`
4. Create database user with password
5. Add user to database with ALL PRIVILEGES
6. Note down:
   - Database name (e.g., `username_lutheran`)
   - Database user (e.g., `username_dbuser`)
   - Database password
   - Database host (usually `localhost`)

#### Step 5: Import Database Schema

**Using phpMyAdmin:**
1. Go to cPanel → phpMyAdmin
2. Select your database
3. Click "Import" tab
4. Upload `database/schema.sql`
5. Click "Go"
6. Repeat for `database/seed.sql` (optional)

**Using SSH:**
```bash
mysql -u username_dbuser -p username_lutheran < schema.sql
mysql -u username_dbuser -p username_lutheran < seed.sql
```

#### Step 6: Configure Backend Environment

1. Navigate to `public_html/api/`
2. Rename `env` to `.env`
3. Edit `.env` file:

```ini
CI_ENVIRONMENT = production

app.baseURL = 'https://yourdomain.com/api'

database.default.hostname = localhost
database.default.database = username_lutheran
database.default.username = username_dbuser
database.default.password = your_db_password
database.default.DBDriver = MySQLi
database.default.port = 3306

# Generate new secret: openssl rand -hex 32
JWT_SECRET = 'your-production-secret-key-here'

# Disable debug in production
app.forceGlobalSecureRequests = true
```

#### Step 7: Configure Frontend

1. Navigate to `public_html/app/`
2. Create/edit `.env` file:

```env
VITE_API_BASE_URL=https://yourdomain.com/api
```

**Important:** Since frontend is already built, you need to rebuild with production API URL:

```bash
# On local machine
VITE_API_BASE_URL=https://yourdomain.com/api npm run build

# Re-upload dist/ contents to public_html/app/
```

#### Step 8: Set Permissions

Using cPanel File Manager or SSH:

```bash
# Set writable permissions
chmod -R 755 public_html/api/writable
chmod -R 755 public_html/api/writable/cache
chmod -R 755 public_html/api/writable/logs
chmod -R 755 public_html/api/writable/session
chmod -R 755 public_html/api/writable/uploads
```

#### Step 9: Configure .htaccess

**Backend (.htaccess in public_html/api/public/):**

Already included in CodeIgniter, but verify:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php/$1 [L]
```

**Frontend (.htaccess in public_html/app/):**

Create this file for SPA routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /app/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /app/index.html [L]
</IfModule>
```

#### Step 10: Update API Base URL in Code

If you hardcoded API URLs, update `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://yourdomain.com/api';
```

#### Step 11: Test the Deployment

1. **Test Backend API:**
   ```
   https://yourdomain.com/api/health
   ```
   Should return: `{"status": "ok"}`

2. **Test Frontend:**
   ```
   https://yourdomain.com/app/
   ```
   Should load the login page

3. **Test Login:**
   - Admin: `admin` / `admin123`
   - Member: `LCH001` / `member123`

#### Step 12: Enable HTTPS (SSL)

**Using cPanel:**
1. Go to **SSL/TLS Status**
2. Enable AutoSSL for your domain
3. Or install Let's Encrypt certificate

**Force HTTPS in .htaccess:**

Add to `public_html/.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

### Option 2: VPS/Cloud Deployment (DigitalOcean, AWS, etc.)

#### Prerequisites
- VPS with Ubuntu 20.04+ or similar
- Root/sudo access
- Domain name pointed to server IP

#### Quick Setup

```bash
# 1. Install required software
sudo apt update
sudo apt install -y nginx mysql-server php8.1-fpm php8.1-mysql php8.1-mbstring php8.1-xml php8.1-curl composer nodejs npm

# 2. Clone repository
git clone https://github.com/sivaji786/lutheran-church-management.git
cd lutheran-church-management

# 3. Run setup
./setup.sh

# 4. Build frontend
npm run build

# 5. Configure Nginx
sudo nano /etc/nginx/sites-available/lutheran
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Frontend
    location / {
        root /var/www/lutheran/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        alias /var/www/lutheran/backend/public;
        try_files $uri $uri/ /api/index.php?$query_string;
        
        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $request_filename;
            include fastcgi_params;
        }
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/lutheran /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

### Option 3: Subdomain Deployment

If deploying on a subdomain (e.g., `church.yourdomain.com`):

1. Create subdomain in cPanel
2. Point subdomain to a folder (e.g., `public_html/church`)
3. Upload files to that folder
4. Follow same steps as shared hosting
5. Update API URLs to match subdomain

---

### Production Checklist

Before going live, ensure:

- [ ] Changed default admin password
- [ ] Changed default member passwords
- [ ] Updated JWT_SECRET in production
- [ ] Set `CI_ENVIRONMENT = production`
- [ ] Enabled HTTPS/SSL
- [ ] Configured CORS properly
- [ ] Set up database backups
- [ ] Tested all features (login, CRUD operations)
- [ ] Removed development files
- [ ] Set proper file permissions
- [ ] Configured error logging
- [ ] Set up monitoring (optional)

---

### Troubleshooting

**Issue: 500 Internal Server Error**
- Check `backend/writable/logs/` for errors
- Verify `.htaccess` is present
- Check file permissions (755 for directories, 644 for files)

**Issue: API not found (404)**
- Verify mod_rewrite is enabled
- Check API base URL in frontend
- Verify backend path is correct

**Issue: Database connection failed**
- Verify database credentials in `.env`
- Check if database user has proper privileges
- Ensure MySQL is running

**Issue: CORS errors**
- Update `backend/app/Config/Filters.php`
- Add your domain to allowed origins

---

### Performance Optimization

1. **Enable PHP OPcache** (in php.ini):
   ```ini
   opcache.enable=1
   opcache.memory_consumption=128
   opcache.max_accelerated_files=10000
   ```

2. **Enable Gzip Compression** (.htaccess):
   ```apache
   <IfModule mod_deflate.c>
     AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
   </IfModule>
   ```

3. **Browser Caching** (.htaccess):
   ```apache
   <IfModule mod_expires.c>
     ExpiresActive On
     ExpiresByType image/jpg "access plus 1 year"
     ExpiresByType image/jpeg "access plus 1 year"
     ExpiresByType image/gif "access plus 1 year"
     ExpiresByType image/png "access plus 1 year"
     ExpiresByType text/css "access plus 1 month"
     ExpiresByType application/javascript "access plus 1 month"
   </IfModule>
   ```

---

### Backup Strategy

**Database Backup (Automated):**

Create cron job in cPanel:
```bash
0 2 * * * mysqldump -u username -p'password' database_name > /home/user/backups/db_$(date +\%Y\%m\%d).sql
```

**File Backup:**
- Use cPanel backup feature (weekly)
- Or create manual backups before updates

---

### Support

For deployment issues:
- Check server error logs
- Review CodeIgniter logs in `backend/writable/logs/`
- Contact your hosting provider for server-specific issues
- Open an issue on GitHub for application-specific problems

---

## 📊 Database

**Database Name:** `lutheran_church`

**Tables:**
- `admin_users` - Admin accounts
- `members` - Church members
- `offerings` - Offering records
- `tickets` - Support tickets

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Support

For issues or questions:
- Create a support ticket through the member portal
- Open an issue on GitHub
- Contact the administrator

---

## 📈 Project Status

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** November 26, 2025  
**Test Coverage:** 100% (42/42 E2E tests passing)

---

**Made with ❤️ for Lutheran Church Management**
