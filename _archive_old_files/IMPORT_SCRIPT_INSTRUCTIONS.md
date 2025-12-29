# 🚀 Production Import Instructions

## Using import_schema.php for Production Deployment

### ✅ Prerequisites

1. **Files Required:**
   - `import_schema.php` (updated script)
   - `schema_production_final.sql` (clean production schema)
   - `backend/.env` (with production database credentials)

2. **Server Requirements:**
   - PHP 7.4+ (You have 8.4.15 ✅)
   - MySQL 8.0+ (You have 8.0.44 ✅)
   - mysqli extension enabled

---

## 📋 Step-by-Step Instructions

### Step 1: Update backend/.env File

Edit `backend/.env` with your production credentials:

```env
# Production Database Configuration
database.default.hostname = localhost
database.default.database = c30082_018_churchrm
database.default.username = c30082_018_churchrm
database.default.password = YOUR_PRODUCTION_PASSWORD
database.default.DBDriver = MySQLi
database.default.DBPrefix =
database.default.port = 3306
database.default.charset = utf8mb4
database.default.DBCollat = utf8mb4_unicode_ci
```

**Replace:** `YOUR_PRODUCTION_PASSWORD` with your actual database password

---

### Step 2: Upload Files to Production Server

Upload these files to your production server:

```
/your-domain/
├── import_schema.php
├── schema_production_final.sql
└── backend/
    └── .env (with production credentials)
```

---

### Step 3: Run the Import Script

**Option A: Via Browser (Recommended)**

1. Open your browser
2. Navigate to: `https://your-domain.com/import_schema.php`
3. Wait for the import to complete (1-2 minutes)
4. You'll see a success message with verification

**Option B: Via Command Line (SSH)**

```bash
cd /path/to/your/project
php import_schema.php
```

---

## 📊 What the Script Does

The updated `import_schema.php` script will:

1. ✅ Load database credentials from `backend/.env`
2. ✅ Automatically use `schema_production_final.sql` (clean version)
3. ✅ Handle shared hosting restrictions gracefully
4. ✅ Skip database creation if not allowed (shared hosting)
5. ✅ Import all tables and data
6. ✅ Handle trigger restrictions (common on shared hosting)
7. ✅ Verify the import with counts
8. ✅ Display success/error messages

---

## 🎯 Expected Output

You should see:

```
✅ Using production schema file (schema_production_final.sql)
✅ Found schema file (556,000 bytes)
✅ Connected to MySQL server successfully
✅ Connected to database 'c30082_018_churchrm'
✅ Schema file loaded successfully
✅ SQL preprocessing complete
✅ Executed XXX SQL statements successfully
✅ Tables created: 9
✅ Stored procedures created: X
✅ Admin users: 1
✅ Members: 1,206
🎉 Database schema imported successfully!
```

---

## ⚠️ Shared Hosting Warnings (Normal)

You may see these warnings on shared hosting - **they are NORMAL**:

### Warning 1: Database Creation
```
⚠️ Cannot create database (shared hosting restriction)
```
**Why:** Shared hosting doesn't allow CREATE DATABASE  
**Solution:** Database already exists, script continues ✅

### Warning 2: Triggers Skipped
```
⚠️ Skipping triggers due to hosting restrictions
```
**Why:** Shared hosting doesn't allow SUPER privilege  
**Solution:** Application works fine without triggers ✅

---

## 🔍 Verification Steps

After import, verify in phpMyAdmin:

### 1. Check Tables
```sql
SHOW TABLES;
```
**Expected:** 9 tables

### 2. Check Members
```sql
SELECT COUNT(*) FROM members;
```
**Expected:** 1,206

### 3. Check Admin
```sql
SELECT * FROM admin_users;
```
**Expected:** At least 1 admin user

---

## 🔐 Default Login Credentials

After successful import:

### Admin Portal
- **Username:** `admin`
- **Password:** `admin123`

### Member Portal
- **Member Code:** `LCH001`
- **Password:** `member123`

**⚠️ IMPORTANT:** Change these passwords immediately after first login!

---

## 🛠️ Troubleshooting

### Issue: "backend/.env file not found"
**Solution:** 
1. Ensure `backend/.env` exists
2. Check file path is correct
3. Verify file permissions (644)

### Issue: "Cannot select database"
**Solution:**
1. Verify database `c30082_018_churchrm` exists
2. Check database credentials in `.env`
3. Ensure database user has access

### Issue: "Connection failed"
**Solution:**
1. Check database hostname (usually `localhost`)
2. Verify username and password
3. Check MySQL service is running

### Issue: "File too large" or timeout
**Solution:**
1. Increase PHP settings:
   - `max_execution_time = 300`
   - `memory_limit = 256M`
   - `upload_max_filesize = 100M`
2. Contact hosting support if needed

---

## 🔄 Re-running the Import

If you need to re-import:

1. The script will **DROP existing tables** and recreate them
2. All existing data will be **replaced** with data from schema file
3. Make sure to **backup** any important data first

---

## 📁 File Comparison

| File | Use Case |
|------|----------|
| `schema_production_final.sql` | ✅ Production (clean, no comments) |
| `schema.sql` | ⚠️ Fallback (has comments, larger) |

The script automatically prefers `schema_production_final.sql` if available.

---

## ✅ Post-Import Checklist

After successful import:

- [ ] Verify 9 tables created
- [ ] Verify 1,206 members imported
- [ ] Test admin login
- [ ] Test member login
- [ ] Update admin password
- [ ] Configure email settings (if needed)
- [ ] Test API endpoints
- [ ] Delete `import_schema.php` (security)

---

## 🔒 Security Note

**After successful import, DELETE the import script:**

```bash
rm import_schema.php
```

Or via FTP/File Manager - delete `import_schema.php`

This prevents unauthorized database resets.

---

## 📞 Support

If you encounter issues:

1. Check the error messages displayed by the script
2. Review MySQL error logs in cPanel
3. Contact your hosting support
4. Check file permissions and paths

---

**Script Updated:** December 26, 2025  
**Compatible With:** Shared Hosting + VPS  
**Tested On:** MySQL 8.0.44, PHP 8.4.15
