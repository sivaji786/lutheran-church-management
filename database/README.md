# Database Files

This directory contains SQL files for setting up the Lutheran Church Management System database.

## Files

### schema.sql
Complete database schema including:
- `admin_users` table - Admin accounts
- `members` table - Church members
- `offerings` table - Offering records
- `tickets` table - Support tickets
- Stored procedures for ticket number generation
- Triggers for auto-generating ticket numbers
- All necessary indexes and foreign keys

### seed.sql
Demo/seed data including:
- 1 Admin user (username: `admin`, password: `admin123`)
- 5 Demo members (all with password: `member123`)
- 10 Demo offerings
- 5 Demo tickets with various statuses

## Usage

### Option 1: Using MySQL Command Line

```bash
# Create database
mysql -u root -p
CREATE DATABASE lutheran_church;
exit;

# Import schema
mysql -u root -p lutheran_church < schema.sql

# Import seed data (optional)
mysql -u root -p lutheran_church < seed.sql
```

### Option 2: Using phpMyAdmin

1. Open phpMyAdmin
2. Create database: `lutheran_church`
3. Select the database
4. Click "Import" tab
5. Choose `schema.sql` and click "Go"
6. Repeat for `seed.sql` (optional)

### Option 3: Using XAMPP

```cmd
# Navigate to MySQL bin directory
cd C:\xampp\mysql\bin

# Create database
mysql -u root
CREATE DATABASE lutheran_church;
exit;

# Import files
mysql -u root lutheran_church < path\to\schema.sql
mysql -u root lutheran_church < path\to\seed.sql
```

### Option 4: Automated (using setup scripts)

The setup scripts (`setup.sh`, `setup.bat`, `setup.ps1`) will automatically:
- Create the database
- Import schema.sql
- Import seed.sql (if you choose)

## Default Credentials (from seed.sql)

### Admin Login
- **Username:** admin
- **Password:** admin123

### Member Login (any of these)
- **Member Code:** LCH001 (or LCH002, LCH003, LCH004, LCH005)
- **Password:** member123

## Database Configuration

Make sure your `.env` file has the correct database settings:

```ini
database.default.hostname = localhost
database.default.database = lutheran_church
database.default.username = root
database.default.password = your_password
database.default.DBDriver = MySQLi
database.default.port = 3306
```

## Notes

- All passwords are hashed using bcrypt
- UUIDs are used for primary keys
- Timestamps are automatically managed
- Foreign keys ensure referential integrity
- Indexes optimize query performance

## Production Deployment

For production:
1. Change all default passwords
2. Remove or modify seed data
3. Add your real members and data
4. Set up regular database backups
