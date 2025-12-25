# Deployment Workflow - Final Version

## Your Deployment Process

### Step 1: Create Deployment Package (Local)
```bash
./create-deployment-package.sh
```
This creates: `lutheran-deployment.zip` (113MB)

### Step 2: Upload via FileZilla FTP
Upload these 2 files to your shared hosting:
1. `lutheran-deployment.zip` (the package)
2. `installer.php` (the installer script)

### Step 3: Run Installer in Browser
Navigate to: `https://yourdomain.com/installer.php`

**What the installer does automatically:**
1. ✅ **Detects** `lutheran-deployment.zip` in the same directory
2. ✅ **Extracts** all files automatically (backend, frontend, database)
3. ✅ **Deletes** the zip file after extraction
4. ✅ **Checks** system requirements (PHP 8.1+, extensions, permissions)
5. ✅ **Creates** `.env` configuration file
6. ✅ **Creates** `config.js` for frontend
7. ✅ **Creates** admin user in database

**What YOU do manually:**
- Import `database/schema.sql` via phpMyAdmin (BEFORE running installer)
- Fill in the configuration form (database credentials, admin info)
- Delete `installer.php` after installation

### Step 4: Secure Installation
```bash
# Via FTP or cPanel File Manager
Delete: installer.php
```

## File Structure After Upload

```
your-domain.com/
├── lutheran-deployment.zip    # Upload this
├── installer.php              # Upload this
```

## File Structure After Installer Runs

```
your-domain.com/
├── installer.php              # DELETE THIS!
├── backend/                   # Extracted
│   ├── .env                  # Created by installer
│   └── ...
├── frontend/                  # Extracted
│   ├── config.js             # Created by installer
│   └── ...
└── database/                  # Extracted
    ├── schema.sql            # Import via phpMyAdmin
    └── ...
```

## Key Points

✅ **No upload form** - Just upload zip via FTP
✅ **Auto-extraction** - Installer detects and extracts zip automatically
✅ **No migrations** - You import schema.sql manually via phpMyAdmin
✅ **Simple workflow** - Upload 2 files, run installer, done!

## Troubleshooting

**"ZIP extension not loaded"**
- Contact hosting support to enable PHP ZIP extension
- Or extract manually via cPanel File Manager

**"Failed to extract"**
- Extract manually via cPanel File Manager
- Then run installer (it will skip extraction)

**"Files already extracted"**
- Installer will skip extraction and proceed to configuration
- This is normal if you extracted manually

---

**Ready to deploy!** 🚀
