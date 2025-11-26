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

Frontend will run on `http://localhost:5173`

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
- **Frontend:** http://localhost:5173
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

### Build Frontend
```bash
npm run build
```
Output will be in `dist/` directory.

### Deploy Backend
1. Upload `backend/` folder to server
2. Configure `backend/.env` with production credentials
3. Point web server to `backend/public/`
4. Ensure PHP 8.1+ and required extensions are installed

### Deploy Frontend
1. Upload `dist/` contents to web server
2. Configure web server for SPA routing
3. Update API base URL in production environment

### Security Checklist
- ✅ Change default admin password
- ✅ Update JWT_SECRET in production
- ✅ Enable HTTPS
- ✅ Configure CORS properly
- ✅ Set up database backups
- ✅ Enable error logging

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
