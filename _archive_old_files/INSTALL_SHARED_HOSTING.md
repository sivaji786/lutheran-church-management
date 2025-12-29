# Installation Guide for Shared Hosting (No Terminal Access)
## Using cPanel File Manager & FTP Only

This guide is for shared hosting environments like GoDaddy, Bluehost, HostGator where you don't have SSH/terminal access.

---

## 📋 What You'll Need

- ✅ cPanel access
- ✅ FTP client (FileZilla - free download)
- ✅ Your local computer with the project files
- ✅ Database access (phpMyAdmin)

---

## 🚀 Step-by-Step Installation

### Step 1: Prepare Files on Your Local Computer

#### 1.1 Build Frontend

On your local computer (where you have Node.js installed):

```bash
cd lutheran-church-management
npm run build
```

This creates a `dist/` folder with all frontend files.

#### 1.2 Prepare Backend

```bash
cd backend
composer install --no-dev --optimize-autoloader
```

#### 1.3 Create Deployment Package

Create a ZIP file containing:
- `backend/` folder (entire folder)
- `dist/` folder contents

**Windows:**
1. Create a new folder called `deployment`
2. Copy `backend` folder into it
3. Create a folder called `app` in deployment
4. Copy all contents from `dist` into `app`
5. Right-click `deployment` folder → Send to → Compressed (zipped) folder

**Mac/Linux:**
```bash
mkdir deployment
cp -r backend deployment/
mkdir deployment/app
cp -r dist/* deployment/app/
zip -r deployment.zip deployment/
```

---

### Step 2: Upload Files Using cPanel File Manager

#### 2.1 Login to cPanel

1. Go to your hosting provider's website
2. Login to cPanel (usually `yourdomain.com/cpanel`)

#### 2.2 Upload ZIP File

1. In cPanel, click **File Manager**
2. Navigate to `public_html`
3. Click **Upload** button (top menu)
4. Select your `deployment.zip` file
5. Wait for upload to complete
6. Go back to File Manager

#### 2.3 Extract Files

1. Find `deployment.zip` in File Manager
2. Right-click → **Extract**
3. Click **Extract Files**
4. After extraction, you'll have a `deployment` folder

#### 2.4 Move Files to Correct Location

1. Open the `deployment` folder
2. Move `backend` folder to `public_html/api`
   - Select `backend` folder
   - Click **Move** button
   - Enter destination: `/public_html/api`
3. Move contents of `app` folder to `public_html/app`
   - Open `app` folder
   - Select all files (Ctrl+A or Cmd+A)
   - Click **Move** button
   - Enter destination: `/public_html/app`

#### 2.5 Clean Up

1. Delete the empty `deployment` folder
2. Delete `deployment.zip`

Your structure should now look like:
```
public_html/
├── api/          (backend files)
│   ├── app/
│   ├── public/
│   ├── vendor/
│   └── env
└── app/          (frontend files)
    ├── assets/
    ├── index.html
    └── ...
```

---

### Step 3: Create MySQL Database

#### 3.1 Create Database

1. In cPanel, go to **MySQL Databases**
2. Under "Create New Database":
   - Database Name: `lutheran_church`
   - Click **Create Database**
3. Note the full database name (e.g., `username_lutheran_church`)

#### 3.2 Create Database User

1. Scroll to "MySQL Users" section
2. Username: `dbuser`
3. Password: Create a strong password (save it!)
4. Click **Create User**
5. Note the full username (e.g., `username_dbuser`)

#### 3.3 Add User to Database

1. Scroll to "Add User To Database"
2. Select your user
3. Select your database
4. Click **Add**
5. Check **ALL PRIVILEGES**
6. Click **Make Changes**

---

### Step 4: Import Database Schema

#### 4.1 Prepare SQL Files

You need to create `schema.sql` and `seed.sql` files. Download them from the repository or create them.

**If you don't have SQL files yet:**

1. Go to your local project
2. Look in `database/` folder
3. If files don't exist, you'll need to export from your local database:
   ```bash
   mysqldump -u root -p lutheran_church > schema.sql
   ```

#### 4.2 Import Using phpMyAdmin

1. In cPanel, click **phpMyAdmin**
2. Select your database from left sidebar (e.g., `username_lutheran_church`)
3. Click **Import** tab
4. Click **Choose File**
5. Select `schema.sql`
6. Scroll down and click **Go**
7. Wait for "Import has been successfully finished"
8. Repeat for `seed.sql` (if you have demo data)

---

### Step 5: Configure Backend Environment

#### 5.1 Rename env to .env

1. In File Manager, navigate to `public_html/api/`
2. Find the file named `env`
3. Right-click → **Rename**
4. Rename to `.env`

#### 5.2 Edit .env File

1. Right-click `.env` → **Edit**
2. Update these values:

```ini
#--------------------------------------------------------------------
# ENVIRONMENT
#--------------------------------------------------------------------
CI_ENVIRONMENT = production

#--------------------------------------------------------------------
# APP
#--------------------------------------------------------------------
app.baseURL = 'https://yourdomain.com/api'
app.forceGlobalSecureRequests = true

#--------------------------------------------------------------------
# DATABASE
#--------------------------------------------------------------------
database.default.hostname = localhost
database.default.database = username_lutheran_church
database.default.username = username_dbuser
database.default.password = your_database_password_here
database.default.DBDriver = MySQLi
database.default.port = 3306

#--------------------------------------------------------------------
# ENCRYPTION
#--------------------------------------------------------------------
JWT_SECRET = 'change-this-to-a-random-32-character-string'
```

**To generate JWT_SECRET:**
- Visit: https://www.random.org/strings/
- Generate a 32-character random string
- Or use: `abcdef1234567890abcdef1234567890`

3. Click **Save Changes**

---

### Step 6: Configure Frontend

#### 6.1 Update API URL in Built Files

Since the frontend is already built, you need to rebuild it locally with the production API URL:

**On your local computer:**

1. Edit `.env` file in project root:
   ```
   VITE_API_BASE_URL=https://yourdomain.com/api
   ```

2. Rebuild:
   ```bash
   npm run build
   ```

3. Re-upload the `dist/` contents to `public_html/app/` using File Manager or FTP

---

### Step 7: Set File Permissions

#### 7.1 Set Writable Permissions

1. In File Manager, navigate to `public_html/api/writable/`
2. Select the `writable` folder
3. Click **Permissions** button (top menu)
4. Set to `755` or check all boxes except "Execute" for "Others"
5. Check **Recurse into subdirectories**
6. Click **Change Permissions**

Repeat for these folders:
- `public_html/api/writable/cache/`
- `public_html/api/writable/logs/`
- `public_html/api/writable/session/`
- `public_html/api/writable/uploads/`

---

### Step 8: Create .htaccess Files

#### 8.1 Frontend .htaccess

1. Navigate to `public_html/app/`
2. Click **+ File** button
3. Name: `.htaccess`
4. Right-click → **Edit**
5. Paste this content:

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

6. Save

#### 8.2 Backend .htaccess

The backend already has `.htaccess` in `public_html/api/public/` - verify it exists.

#### 8.3 Force HTTPS (Optional but Recommended)

1. Navigate to `public_html/`
2. Edit `.htaccess` (or create if it doesn't exist)
3. Add at the top:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

### Step 9: Enable SSL/HTTPS

#### 9.1 Using cPanel AutoSSL

1. In cPanel, go to **SSL/TLS Status**
2. Find your domain
3. Click **Run AutoSSL**
4. Wait for certificate installation

#### 9.2 Alternative: Let's Encrypt

1. In cPanel, look for **Let's Encrypt** or **SSL/TLS**
2. Select your domain
3. Click **Install**

---

### Step 10: Test Your Installation

#### 10.1 Test Backend API

Open in browser:
```
https://yourdomain.com/api/
```

You should see a CodeIgniter welcome page or API response.

#### 10.2 Test Frontend

Open in browser:
```
https://yourdomain.com/app/
```

You should see the login page.

#### 10.3 Test Login

Try logging in:
- **Admin:** username: `admin`, password: `admin123`
- **Member:** code: `LCH001`, password: `member123`

---

## 🔧 Alternative: Using FTP (FileZilla)

If cPanel File Manager is slow or you prefer FTP:

### Install FileZilla

1. Download from: https://filezilla-project.org/
2. Install on your computer

### Connect to Your Server

1. Open FileZilla
2. Get FTP credentials from cPanel (look for "FTP Accounts")
3. Enter in FileZilla:
   - Host: `ftp.yourdomain.com`
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: `21`
4. Click **Quickconnect**

### Upload Files

1. Left side: Navigate to your local `deployment` folder
2. Right side: Navigate to `public_html`
3. Drag and drop:
   - `backend` folder → `public_html/api`
   - Contents of `app` folder → `public_html/app`

---

## ❌ Troubleshooting

### Issue: 500 Internal Server Error

**Solution:**
1. Check `public_html/api/writable/logs/` for error details
2. Verify `.htaccess` exists in `public_html/api/public/`
3. Check file permissions (should be 755 for folders, 644 for files)

### Issue: "Database connection failed"

**Solution:**
1. Verify database credentials in `public_html/api/.env`
2. Make sure database name includes your username prefix
3. Check if database user has ALL PRIVILEGES

### Issue: API returns 404

**Solution:**
1. Verify mod_rewrite is enabled (contact hosting support)
2. Check `.htaccess` file exists
3. Verify `app.baseURL` in `.env` is correct

### Issue: Frontend shows blank page

**Solution:**
1. Check browser console for errors (F12)
2. Verify API URL is correct
3. Rebuild frontend with correct `VITE_API_BASE_URL`

### Issue: CORS errors

**Solution:**
1. Edit `backend/app/Config/Filters.php`
2. Add your domain to allowed origins
3. Or contact support to enable CORS

---

## 📞 Getting Help

If you're stuck:

1. **Check Error Logs:**
   - cPanel → Errors
   - `public_html/api/writable/logs/`

2. **Contact Hosting Support:**
   - Ask them to enable mod_rewrite
   - Ask about PHP version (needs 8.1+)
   - Ask about file permissions

3. **Common Hosting Providers:**
   - **GoDaddy:** Usually has PHP 8.1+, mod_rewrite enabled
   - **Bluehost:** May need to enable PHP 8.1 in cPanel
   - **HostGator:** Usually ready to go

---

## ✅ Post-Installation Checklist

- [ ] Backend accessible at `https://yourdomain.com/api/`
- [ ] Frontend accessible at `https://yourdomain.com/app/`
- [ ] Can login as admin
- [ ] Can login as member
- [ ] HTTPS/SSL is working
- [ ] Changed default passwords
- [ ] Database is populated
- [ ] File permissions are correct

---

## 🎉 Success!

Your Lutheran Church Management System is now live on shared hosting!

Access it at: **https://yourdomain.com/app/**

**Next Steps:**
1. Change default admin password
2. Add real members
3. Configure email settings (if needed)
4. Set up regular backups in cPanel
