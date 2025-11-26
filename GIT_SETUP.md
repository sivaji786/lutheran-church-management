# Git Repository Setup Guide
## Lutheran Church Management System

This guide will help you set up a Git repository for the Lutheran Church Management System and prepare it for users to clone and install.

---

## 📋 Prerequisites

Before setting up the Git repository, ensure you have:
- Git installed on your system
- GitHub/GitLab/Bitbucket account (or self-hosted Git server)
- Project files ready in `/home/sivaji/Downloads/Lutheran`

---

## 🚀 Step 1: Create .gitignore File

First, create a `.gitignore` file to exclude unnecessary files from version control.

```bash
cd /home/sivaji/Downloads/Lutheran
nano .gitignore
```

Add the following content:

```gitignore
# Dependencies
node_modules/
backend/vendor/

# Environment files
.env
backend/.env

# Build outputs
dist/
build/
backend/writable/cache/*
backend/writable/logs/*
backend/writable/session/*
backend/writable/uploads/*

# Keep writable directories but ignore contents
!backend/writable/cache/.gitkeep
!backend/writable/logs/.gitkeep
!backend/writable/session/.gitkeep
!backend/writable/uploads/.gitkeep

# Test outputs
playwright-report/
test-results/
coverage/
.nyc_output/

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# OS files
Thumbs.db
.DS_Store

# Temporary files
*.log
*.tmp
*.temp

# Package manager locks (optional - some prefer to commit these)
# package-lock.json
# backend/composer.lock
```

---

## 🔧 Step 2: Create Environment Template Files

Create template environment files that users can copy and configure.

### Frontend Environment Template
```bash
# Create .env.example in root
cat > .env.example << 'EOF'
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:8080
EOF
```

### Backend Environment Template
```bash
# Create .env.example in backend
cat > backend/.env.example << 'EOF'
#--------------------------------------------------------------------
# ENVIRONMENT
#--------------------------------------------------------------------
CI_ENVIRONMENT = development

#--------------------------------------------------------------------
# APP
#--------------------------------------------------------------------
app.baseURL = 'http://localhost:8080'

#--------------------------------------------------------------------
# DATABASE
#--------------------------------------------------------------------
database.default.hostname = localhost
database.default.database = lutheran_church
database.default.username = root
database.default.password = your_password_here
database.default.DBDriver = MySQLi
database.default.DBPrefix =
database.default.port = 3306
database.default.charset = utf8mb4
database.default.DBCollat = utf8mb4_unicode_ci

#--------------------------------------------------------------------
# ENCRYPTION
#--------------------------------------------------------------------
encryption.key = hex2bin('00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff')
JWT_SECRET = 'your-secret-key-here-please-change-in-production'

#--------------------------------------------------------------------
# LOGGER
#--------------------------------------------------------------------
logger.threshold = 4
EOF
```

---

## 📁 Step 3: Create Database Setup Files

Create a `database/` directory with SQL files for easy setup.

```bash
mkdir -p database
```

### Create schema.sql
```bash
cat > database/schema.sql << 'EOF'
-- Lutheran Church Database Schema
-- Run this first to create tables

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Members Table
CREATE TABLE IF NOT EXISTS members (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    member_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    occupation VARCHAR(100),
    aadhar_number VARCHAR(12),
    address TEXT,
    area VARCHAR(100),
    ward VARCHAR(50),
    member_status ENUM('active', 'inactive') DEFAULT 'active',
    confirmation_status ENUM('confirmed', 'not_confirmed') DEFAULT 'not_confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_member_code (member_code),
    INDEX idx_mobile (mobile),
    INDEX idx_area (area),
    INDEX idx_ward (ward)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Offerings Table
CREATE TABLE IF NOT EXISTS offerings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    member_id CHAR(36) NOT NULL,
    member_name VARCHAR(100) NOT NULL,
    member_code VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    offering_type VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_member_id (member_id),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    member_id CHAR(36) NOT NULL,
    member_name VARCHAR(100) NOT NULL,
    member_code VARCHAR(20) NOT NULL,
    category ENUM('Profile Update', 'Suggestion', 'Request', 'Other') NOT NULL,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Open', 'In Progress', 'Updated', 'Done') DEFAULT 'Open',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    admin_notes TEXT,
    assigned_to CHAR(36),
    created_date DATE NOT NULL,
    updated_date DATE NOT NULL,
    resolved_date DATE,
    closed_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_member_id (member_id),
    INDEX idx_status (status),
    INDEX idx_ticket_number (ticket_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stored Procedure for Ticket Number Generation
DELIMITER $$
CREATE PROCEDURE sp_generate_ticket_number(OUT next_ticket VARCHAR(20))
BEGIN
    DECLARE last_num INT;
    SELECT CAST(SUBSTRING(ticket_number, 2) AS UNSIGNED) INTO last_num
    FROM tickets
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF last_num IS NULL THEN
        SET last_num = 0;
    END IF;
    
    SET next_ticket = CONCAT('T', LPAD(last_num + 1, 3, '0'));
END$$
DELIMITER ;
EOF
```

### Create seed.sql
```bash
cat > database/seed.sql << 'EOF'
-- Lutheran Church Database Seed Data
-- Run this after schema.sql to populate initial data

-- Insert default admin user
-- Password: admin123
INSERT INTO admin_users (id, username, password, role) VALUES
('a83bf033-c9cc-11f0-8918-5c879c7eebc7', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin');

-- Insert demo member
-- Password: member123
INSERT INTO members (id, member_code, name, mobile, password, date_of_birth, occupation, address, area, ward, member_status, confirmation_status) VALUES
('1', 'LCH001', 'John Emmanuel', '9876543210', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1990-01-15', 'Teacher', '123 Church Street', 'Central', 'Ward 1', 'active', 'confirmed');
EOF
```

---

## 🔄 Step 4: Initialize Git Repository

```bash
cd /home/sivaji/Downloads/Lutheran

# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Lutheran Church Management System"
```

---

## 🌐 Step 5: Create Remote Repository

### Option A: GitHub
1. Go to https://github.com/new
2. Create a new repository named `lutheran-church-management`
3. **Do NOT** initialize with README, .gitignore, or license
4. Copy the repository URL

### Option B: GitLab
1. Go to https://gitlab.com/projects/new
2. Create a new project named `lutheran-church-management`
3. Choose "Create blank project"
4. Copy the repository URL

### Option C: Bitbucket
1. Go to https://bitbucket.org/repo/create
2. Create a new repository named `lutheran-church-management`
3. Copy the repository URL

---

## 🔗 Step 6: Connect and Push to Remote

```bash
# Add remote origin (replace with your repository URL)
git remote add origin https://github.com/yourusername/lutheran-church-management.git

# Push to remote
git branch -M main
git push -u origin main
```

---

## 📝 Step 7: Add Repository Information to README

Update the README.md with repository-specific information:

```bash
nano README.md
```

Add at the top:
```markdown
# Lutheran Church Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-42%2F42%20passing-brightgreen)](https://github.com/yourusername/lutheran-church-management)

**Repository:** https://github.com/yourusername/lutheran-church-management
```

---

## 👥 Step 8: User Installation Instructions

Users will follow these steps to clone and install:

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/lutheran-church-management.git
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

### 3. Backend Setup
```bash
cd backend

# Install dependencies
composer install

# Copy environment template
cp .env.example .env

# Edit .env with database credentials
nano .env
```

### 4. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE lutheran_church;
exit;

# Import schema and seed data
mysql -u root -p lutheran_church < database/schema.sql
mysql -u root -p lutheran_church < database/seed.sql
```

### 5. Start Servers
```bash
# Terminal 1: Backend
cd backend
php spark serve

# Terminal 2: Frontend
npm run dev
```

### 6. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Admin Login: `admin` / `admin123`
- Member Login: `LCH001` / `member123`

---

## 🔒 Security Checklist Before Publishing

- [ ] Remove all sensitive data from code
- [ ] Use `.env.example` templates (never commit actual `.env` files)
- [ ] Change default passwords in seed data
- [ ] Update JWT_SECRET in `.env.example`
- [ ] Review all committed files for sensitive information
- [ ] Add LICENSE file
- [ ] Add CONTRIBUTING.md if accepting contributions

---

## 📦 Optional: Create Releases

### Tag a Release
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Create GitHub Release
1. Go to repository → Releases
2. Click "Create a new release"
3. Choose tag `v1.0.0`
4. Add release notes
5. Attach any additional files (if needed)

---

## 🔄 Keeping Repository Updated

### For Maintainers
```bash
# Make changes
git add .
git commit -m "Description of changes"
git push origin main
```

### For Users (Pull Updates)
```bash
# Get latest changes
git pull origin main

# Reinstall dependencies if needed
npm install
cd backend && composer install
```

---

## 📚 Additional Files to Create

### LICENSE
```bash
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 Lutheran Church

Permission is hereby granted, free of charge, to any person obtaining a copy...
EOF
```

### CONTRIBUTING.md
```bash
cat > CONTRIBUTING.md << 'EOF'
# Contributing to Lutheran Church Management System

Thank you for your interest in contributing!

## How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Code Style
- Follow existing code patterns
- Write meaningful commit messages
- Add tests for new features
EOF
```

---

## ✅ Verification Checklist

Before sharing the repository, verify:

- [ ] `.gitignore` is properly configured
- [ ] `.env.example` files are created
- [ ] Database SQL files are included
- [ ] README.md has complete instructions
- [ ] All sensitive data is removed
- [ ] Repository is pushed to remote
- [ ] Clone and install works on a fresh system
- [ ] Tests pass after fresh install

---

## 🎯 Quick Command Summary

```bash
# One-time setup
cd /home/sivaji/Downloads/Lutheran
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main

# Regular updates
git add .
git commit -m "Your message"
git push
```

---

**Your repository is now ready for users to clone and install!** 🎉
