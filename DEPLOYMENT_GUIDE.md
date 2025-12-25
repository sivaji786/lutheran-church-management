# Lutheran Church Management System - Deployment Guide

## Quick Start

This guide explains how to create and use the deployment package for shared hosting.

## Creating the Deployment Package

### Prerequisites
- Node.js and npm installed
- Composer installed
- Project built and tested locally

### Steps

1. **Run the deployment script:**
   ```bash
   chmod +x create-deployment-package.sh
   ./create-deployment-package.sh
   ```

2. **Output:**
   - Creates `lutheran-deployment.zip` (ready to upload)
   - Contains frontend, backend, installer, and database files

## Installing on Shared Hosting

### Step 1: Upload Files
- Upload `lutheran-deployment.zip` to your hosting via cPanel or FTP
- Extract the zip file

### Step 2: Create and Import Database
1. Create a MySQL database in cPanel
2. Go to phpMyAdmin
3. Select your database
4. Click "Import" tab
5. Upload `database/schema.sql`
6. Click "Go" to import

### Step 3: Run the Installer
1. Navigate to: `https://yourdomain.com/installer.php`
2. Follow the installation wizard:
   - System requirements check
   - Database configuration
   - Admin user creation
   - Security settings
3. Click "Install Now"

### Step 4: Secure Your Installation
1. **Delete `installer.php`** immediately
2. Login to your application
3. Change the default admin password

## What the Installer Does

✅ Creates `.env` configuration file for backend
✅ Creates `config.js` for frontend API configuration  
✅ Creates admin user in database
✅ Tests database connectivity
✅ Validates system requirements

❌ Does NOT run database migrations (you do this manually via phpMyAdmin)
❌ Does NOT modify existing data

## File Structure After Installation

```
your-domain.com/
├── installer.php          # DELETE THIS AFTER INSTALL
├── backend/               # CodeIgniter 4 API
│   ├── .env              # Created by installer
│   └── ...
├── frontend/             # React application
│   ├── config.js         # Created by installer
│   └── ...
└── database/             # SQL files (for reference)
```

## Troubleshooting

### "Database connection failed"
- Verify database credentials
- Check if database exists
- Ensure user has ALL PRIVILEGES

### "Permission denied" errors
- Set writable permissions on `backend/writable/` folders
- Use cPanel File Manager → Permissions → 755

### Installer won't load
- Check PHP version (needs 8.1+)
- Verify mod_rewrite is enabled
- Contact hosting support

## Support

For detailed instructions, see:
- `INSTALL_SHARED_HOSTING.md` - Complete installation guide
- `database/README.md` - Database import instructions
- Installer includes inline help and validation

## Security Checklist

- [ ] Deleted `installer.php`
- [ ] Changed default admin password
- [ ] Set proper file permissions (644 for files, 755 for directories)
- [ ] Enabled HTTPS/SSL
- [ ] Configured regular database backups

---

**Need Help?** Check the error logs in `backend/writable/logs/` or contact your hosting provider.
