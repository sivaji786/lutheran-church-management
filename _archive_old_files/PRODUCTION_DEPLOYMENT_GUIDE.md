# 🚀 Production Database Deployment Guide

## ✅ Server Compatibility Check

Based on your shared server configuration:

| Requirement | Your Server | Status |
|------------|-------------|--------|
| MySQL Version | 8.0.44-0ubuntu0.24.04.2 | ✅ Compatible |
| Character Set | UTF-8 Unicode (utf8mb4) | ✅ Compatible |
| phpMyAdmin | 5.2.3 | ✅ Compatible |
| PHP Version | 8.4.15 | ✅ Compatible |

**Result:** Your `schema.sql` file is **100% compatible** with your shared server!

---

## 📁 Files Available

You have **TWO** versions of the schema file:

### 1. **`schema.sql`** (Original - For localhost/VPS)
- Contains: `DROP DATABASE` and `CREATE DATABASE` commands
- Use for: Local development, VPS servers with full database permissions
- Size: 558 KB

### 2. **`schema_production_clean.sql`** (Production - For shared hosting) ⭐
- Contains: Only table structures and data (no database creation)
- Use for: Shared hosting environments (like yours)
- Size: 558 KB
- **RECOMMENDED for your production server**

---

## 🎯 Step-by-Step Import Instructions

### Method 1: Using phpMyAdmin (Recommended)

#### Step 1: Login to phpMyAdmin
1. Go to your hosting control panel (cPanel/Plesk)
2. Open **phpMyAdmin**
3. Login with your credentials

#### Step 2: Select Your Database
1. In the left sidebar, click on your database: **`c30082_018_churchrm`**
2. Make sure it's highlighted/selected

#### Step 3: Import the Schema
1. Click on the **"Import"** tab at the top
2. Click **"Choose File"** button
3. Select: **`schema_production_clean.sql`** ⭐
4. Scroll down and click **"Go"** button
5. Wait for the import to complete (may take 1-2 minutes)

#### Step 4: Verify Import
1. Click on the database name in the left sidebar
2. You should see **9 tables**:
   - `admin_users`
   - `audit_logs`
   - `member_login_history`
   - `members` (with 1,206 records)
   - `offering_categories`
   - `offerings`
   - `ticket_history`
   - `tickets`
   - `user_sessions`

---

### Method 2: Using MySQL Command Line (Alternative)

If you have SSH access:

```bash
# Upload the file to your server first, then:
mysql -u c30082_018_churchrm -p c30082_018_churchrm < schema_production_clean.sql
```

---

## ⚠️ Important Notes

### Before Import:
1. ✅ **Backup existing data** (if any) before importing
2. ✅ Make sure you're using **`schema_production_clean.sql`** for shared hosting
3. ✅ Verify you have selected the correct database

### File Size Limits:
- Your file is **558 KB** - well within typical limits
- Most shared hosts allow **50-100 MB** uploads
- If you face upload limits, contact your hosting support

### Character Set:
- The schema uses **utf8mb4** (full Unicode support)
- Your server supports this ✅
- No modifications needed

---

## 🔍 Post-Import Verification

After importing, run these checks in phpMyAdmin:

### 1. Check Member Count
```sql
SELECT COUNT(*) as total_members FROM members;
```
**Expected Result:** 1,206 members

### 2. Check Admin User
```sql
SELECT username, name, role FROM admin_users;
```
**Expected Result:** At least 1 admin user

### 3. Check All Tables
```sql
SHOW TABLES;
```
**Expected Result:** 9 tables listed

---

## 🛠️ Troubleshooting

### Issue: "Access denied for user"
**Solution:** Make sure you're using the correct database user credentials

### Issue: "Table already exists"
**Solution:** The schema file includes `DROP TABLE IF EXISTS` - it will automatically replace existing tables

### Issue: "Upload file too large"
**Solution:** 
1. Increase PHP upload limits in php.ini, OR
2. Use MySQL command line import, OR
3. Split the file (contact support if needed)

### Issue: "Lost connection to MySQL server"
**Solution:** The import is too large for one transaction. Try:
1. Increase `max_allowed_packet` in MySQL settings, OR
2. Import via command line instead of phpMyAdmin

---

## 📊 What Gets Imported

| Item | Count | Description |
|------|-------|-------------|
| Tables | 9 | All database tables |
| Members | 1,206 | Complete member records |
| Admin Users | 1+ | System administrators |
| Triggers | Yes | Database triggers (if any) |
| Procedures | Yes | Stored procedures (if any) |
| Views | Yes | Database views (if any) |

---

## 🔐 Security Checklist

After import:

- [ ] Change default admin password
- [ ] Verify database user permissions
- [ ] Update `.env` file with production database credentials
- [ ] Test login functionality
- [ ] Verify member data is accessible

---

## 📞 Need Help?

If you encounter any issues:

1. **Check phpMyAdmin error messages** - they usually indicate the exact problem
2. **Contact your hosting support** - they can help with server-specific issues
3. **Check MySQL error logs** - available in your hosting control panel

---

## ✨ Quick Reference

**File to use:** `schema_production_clean.sql`  
**Database name:** `c30082_018_churchrm`  
**Import method:** phpMyAdmin → Import tab  
**Expected time:** 1-2 minutes  
**Expected tables:** 9  
**Expected members:** 1,206  

---

**Last Updated:** December 26, 2025  
**Schema Version:** Exported from lutheran_church_main (localhost)
