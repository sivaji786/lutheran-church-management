# Web Installer Usage Guide

## Quick Start

### For Fresh Installation

1. **Upload Files**
   - Upload all project files to your web server
   - Ensure `install.php` is in the root directory

2. **Access Installer**
   - Open your browser and navigate to: `http://yourdomain.com/install.php`
   - Or for local: `http://localhost/install.php`

3. **Follow the Wizard**
   - The installer will guide you through 6 steps
   - Takes approximately 5-10 minutes

### Installation Steps

#### Step 1: Prerequisites Check
- Automatically checks PHP version (requires 8.1+)
- Verifies required PHP extensions
- Checks file permissions
- Validates database files exist

#### Step 2: Database Configuration
- Enter MySQL connection details:
  - Host (usually `localhost`)
  - Port (usually `3306`)
  - Database name
  - Username and password
- Tests connection before proceeding

#### Step 3: Database Import
- Imports database schema (8 tables, 4 views, 4 procedures)
- Optional: Import demo data
  - 1 admin user (admin/admin123)
  - 1 member (LCH001/member123)
  - Sample offerings and tickets

#### Step 4: Application Configuration
- Select environment (development/production)
- Set frontend URL
- Set backend API URL

#### Step 5: Finalize
- Review configuration
- Automatic generation of:
  - Strong encryption keys
  - JWT secrets
  - Frontend `.env` file
  - Backend `.env` file

#### Step 6: Complete
- Installation summary
- Next steps instructions
- **IMPORTANT**: Delete `install.php` file

---

## Post-Installation

### 1. Delete Installer (CRITICAL)
```bash
rm install.php
```

### 2. Start Backend
```bash
cd backend
php spark serve
```

### 3. Start Frontend
```bash
npm install
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000 (or your configured URL)
- Backend: http://localhost:8080 (or your configured URL)

---

## Demo Credentials (if seed data imported)

### Admin Panel
- Username: `admin`
- Password: `admin123`

### Member Portal
- Member Code: `LCH001`
- Password: `member123`

**⚠️ Change these immediately in production!**

---

## Troubleshooting

### "Prerequisites not met"
- Check PHP version: `php -v` (must be 8.1+)
- Install missing extensions:
  ```bash
  # Ubuntu/Debian
  sudo apt-get install php-mysqli php-mbstring php-json php-curl php-intl
  ```

### "Database connection failed"
- Verify MySQL is running
- Check credentials are correct
- Ensure database user has CREATE DATABASE privilege

### "Could not write .env file"
- Check file permissions:
  ```bash
  chmod 755 .
  chmod 755 backend
  ```

### "Already Installed" message
- If you want to reinstall, add `?force=1` to URL:
  `http://yourdomain.com/install.php?force=1`
- **WARNING**: This will overwrite existing configuration

---

## Security Notes

1. **Always delete install.php after installation**
2. **Change default passwords immediately**
3. **Use strong database passwords**
4. **Enable HTTPS in production**
5. **Set environment to 'production' for live sites**

---

## What Gets Created

### Files Created:
- `.env` (frontend configuration)
- `backend/.env` (backend configuration)
- `.installed` (installation lock file)

### Database Objects:
- 8 tables (admin_users, members, offerings, tickets, ticket_history, audit_logs, sessions, member_login_history)
- 4 views (member_summary, monthly_offerings, ticket_statistics, upcoming_birthdays)
- 4 stored procedures (dashboard_stats, member_offering_stats, generate_member_code, generate_ticket_number)
- 8 triggers (UUID generation, status tracking)

---

## Production Deployment

### Before Installation:
1. Upload files to web server
2. Point domain to server
3. Install SSL certificate
4. Configure web server (Apache/Nginx)

### During Installation:
1. Select "Production" environment
2. Use production URLs (https://yourdomain.com)
3. Use strong database credentials
4. Do NOT import demo data

### After Installation:
1. Delete install.php
2. Test all functionality
3. Change any default passwords
4. Set up backups
5. Configure monitoring

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Check `backend/writable/logs/` for backend errors
3. Verify all prerequisites are met
4. Ensure database credentials are correct
