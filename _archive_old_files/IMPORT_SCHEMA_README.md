# Database Schema Import Script

## Overview

The `import_schema.php` script automates the process of importing the complete database schema into your MySQL database. It reads the `schema.sql` file and executes all SQL statements to create tables, stored procedures, triggers, views, and insert seed data.

## Features

✅ **Automatic Database Creation** - Creates the database if it doesn't exist  
✅ **Progress Tracking** - Shows real-time progress during import  
✅ **Error Handling** - Comprehensive error reporting and validation  
✅ **Verification** - Automatically verifies the import was successful  
✅ **Web & CLI Support** - Can be run from browser or command line  

## Usage

### Method 1: Command Line (Recommended)

```bash
php import_schema.php
```

### Method 2: Web Browser

1. Make sure your web server is running (Apache/Nginx)
2. Navigate to: `http://localhost/import_schema.php`
3. The script will execute and show progress in the browser

## Requirements

- PHP 7.4 or higher
- MySQL 8.0+ or MariaDB 10.5+
- MySQLi extension enabled
- `schema.sql` file in the same directory
- `backend/.env` file with database credentials

## What Gets Imported

The script imports the complete database schema including:

### Database Objects
- **9 Tables**: admin_users, members, offerings, non_member_offerings, tickets, ticket_history, audit_logs, sessions, member_login_history
- **5 Stored Procedures**: Dashboard stats, member offering stats, code generators
- **10 Triggers**: UUID auto-generation and ticket status tracking
- **4 Views**: Member summary, monthly offerings, ticket statistics, upcoming birthdays

### Seed Data
- **1 Admin User**: username `admin`, password `admin123`
- **1 Demo Member**: member code `LCH001`, password `member123`
- **2 Sample Offerings**
- **1 Sample Ticket**

## Output

The script provides detailed feedback including:

- ✅ Connection status
- ✅ Database creation confirmation
- ✅ SQL execution progress
- ✅ Object counts (tables, procedures, triggers, views)
- ✅ Data verification (admin users, members)
- ✅ Login credentials for testing

## Configuration

The script automatically reads database configuration from `backend/.env`:

```ini
database.default.hostname = localhost
database.default.database = lutheran_church_main
database.default.username = root
database.default.password = root
database.default.port = 3306
```

## Troubleshooting

### Error: "backend/.env file not found"
- Ensure the `backend/.env` file exists
- Check file permissions

### Error: "Connection failed"
- Verify MySQL server is running
- Check database credentials in `backend/.env`
- Ensure MySQL port is correct (default: 3306)

### Error: "schema.sql file not found"
- Ensure `schema.sql` is in the same directory as `import_schema.php`
- Check file permissions

### Error: "Access denied for user"
- Verify database username and password in `backend/.env`
- Ensure the database user has CREATE DATABASE privileges

## Security Notes

⚠️ **Important**: This script should only be used during development or initial setup. Do not leave it accessible on production servers.

For production deployment:
1. Run the script once to set up the database
2. Delete or move the script to a secure location
3. Change default admin password immediately

## Post-Import Steps

After successful import:

1. **Test Admin Login**
   - Username: `admin`
   - Password: `admin123`

2. **Test Member Login**
   - Member Code: `LCH001`
   - Password: `member123`

3. **Change Default Passwords**
   - Update admin password in the admin portal
   - Update or delete the demo member

4. **Verify Database Objects**
   ```sql
   SHOW TABLES;
   SHOW PROCEDURE STATUS WHERE Db = 'lutheran_church_main';
   SHOW TRIGGERS;
   ```

## Files

- `import_schema.php` - The import script
- `schema.sql` - Complete database schema with seed data
- `backend/.env` - Database configuration file

## Support

If you encounter any issues:
1. Check the error messages displayed by the script
2. Verify MySQL server is running: `mysql -u root -p`
3. Check MySQL error logs
4. Ensure all required PHP extensions are installed
