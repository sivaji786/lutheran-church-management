# AI Code Generation Prompt Documentation
## PHP CodeIgniter 4 REST API for Lutheran Church Management System

---

## 🎯 Purpose

This document provides comprehensive instructions for AI code generation tools (ChatGPT, Claude, GitHub Copilot, etc.) to generate a complete PHP CodeIgniter 4 REST API backend for the Lutheran Church Management System.

---

## 📋 Prerequisites

Before generating code, ensure you have:
1. ✅ `schema.sql` - MySQL database schema
2. ✅ `API_REQUIREMENTS.md` - Complete API specifications
3. ✅ CodeIgniter 4.4+ installed
4. ✅ PHP 8.1+ with required extensions (intl, mbstring, json, mysqlnd)
5. ✅ MySQL 8.0+ database server
6. ✅ Composer for dependency management

---

## 🏗️ Project Structure

Generate the following CodeIgniter 4 project structure:

```
/church-api/
├── app/
│   ├── Config/
│   │   ├── Routes.php                 # API route definitions
│   │   ├── Database.php               # Database configuration
│   │   ├── Filters.php                # Register auth filters
│   │   ├── Cors.php                   # CORS configuration
│   │   └── Validation.php             # Custom validation rules
│   ├── Controllers/
│   │   ├── BaseController.php         # Enhanced base controller
│   │   ├── Auth/
│   │   │   ├── AdminAuthController.php
│   │   │   └── MemberAuthController.php
│   │   ├── Admin/
│   │   │   ├── MemberController.php
│   │   │   ├── OfferingController.php
│   │   │   ├── TicketController.php
│   │   │   └── DashboardController.php
│   │   └── Member/
│   │       ├── ProfileController.php
│   │       ├── OfferingController.php
│   │       └── TicketController.php
│   ├── Models/
│   │   ├── AdminUserModel.php
│   │   ├── MemberModel.php
│   │   ├── OfferingModel.php
│   │   ├── TicketModel.php
│   │   ├── TicketHistoryModel.php
│   │   ├── SessionModel.php
│   │   └── AuditLogModel.php
│   ├── Filters/
│   │   ├── AuthFilter.php             # JWT authentication
│   │   ├── AdminFilter.php            # Admin-only access
│   │   ├── MemberFilter.php           # Member-only access
│   │   ├── CorsFilter.php             # CORS handling
│   │   └── RateLimitFilter.php        # Rate limiting
│   ├── Libraries/
│   │   ├── JwtLibrary.php             # JWT token management
│   │   ├── ResponseFormatter.php      # Standardized API responses
│   │   └── PasswordHasher.php         # Password hashing utilities
│   ├── Validation/
│   │   ├── MemberRules.php            # Custom member validation
│   │   └── OfferingRules.php          # Custom offering validation
│   └── Helpers/
│       ├── api_helper.php             # API utility functions
│       └── audit_helper.php           # Audit logging functions
├── public/
│   └── .htaccess                      # URL rewriting rules
├── writable/
│   └── logs/                          # Application logs
├── .env                               # Environment configuration
├── composer.json                      # Dependencies
└── spark                              # CodeIgniter CLI tool
```

---

## 🔧 Step-by-Step Generation Instructions

### Step 1: Database Configuration

**File:** `app/Config/Database.php`

**Instructions for AI:**
- Configure MySQL database connection using environment variables
- Set charset to `utf8mb4`
- Enable query logging for development
- Set strict mode for data integrity

**Prompt:**
```
Generate a CodeIgniter 4 Database.php configuration file that:
1. Uses environment variables for database credentials
2. Sets default group to 'default'
3. Configures MySQL with utf8mb4 charset
4. Enables DBDebug in development mode
5. Uses MySQLi driver
6. Sets strictOn to true for data integrity
```

**Expected Output Pattern:**
```php
<?php
namespace Config;
use CodeIgniter\Database\Config;

class Database extends Config
{
    public string $defaultGroup = 'default';
    
    public array $default = [
        'DSN'      => '',
        'hostname' => 'localhost',
        'username' => 'root',
        'password' => '',
        'database' => 'lutheran_church',
        'DBDriver' => 'MySQLi',
        'DBPrefix' => '',
        'pConnect' => false,
        'DBDebug'  => true,
        'charset'  => 'utf8mb4',
        'DBCollat' => 'utf8mb4_unicode_ci',
        'swapPre'  => '',
        'encrypt'  => false,
        'compress' => false,
        'strictOn' => true,
        'failover' => [],
        'port'     => 3306,
    ];
}
```

---

### Step 2: JWT Authentication Library

**File:** `app/Libraries/JwtLibrary.php`

**Instructions for AI:**
- Use Firebase JWT library (firebase/php-jwt via Composer)
- Implement token generation with user data payload
- Implement token verification and decoding
- Set expiration time from environment variable
- Handle token refresh logic

**Prompt:**
```
Generate a CodeIgniter 4 JWT Library using Firebase JWT that:
1. Generates access tokens (1 hour expiry)
2. Generates refresh tokens (30 days expiry)
3. Validates and decodes tokens
4. Extracts user data from token payload
5. Handles token expiration errors gracefully
6. Uses HS256 algorithm
7. Secret key from environment variable JWT_SECRET_KEY
```

**Expected Methods:**
```php
class JwtLibrary
{
    public function generateAccessToken(array $userData): string
    public function generateRefreshToken(array $userData): string
    public function validateToken(string $token): object|false
    public function decodeToken(string $token): object|false
    public function getUserFromToken(string $token): array|false
    public function isTokenExpired(object $decoded): bool
}
```

---

### Step 3: Response Formatter Library

**File:** `app/Libraries/ResponseFormatter.php`

**Instructions for AI:**
- Create standardized JSON response format matching API_REQUIREMENTS.md
- Success responses with data
- Error responses with error codes
- Pagination metadata support
- HTTP status code mapping

**Prompt:**
```
Generate a ResponseFormatter library for CodeIgniter 4 that:
1. Creates success responses with format: {success: true, data: {...}, message: "..."}
2. Creates error responses with format: {success: false, error: {code: "...", message: "...", details: {...}}}
3. Supports pagination metadata
4. Maps HTTP status codes (200, 201, 400, 401, 403, 404, 500)
5. Handles validation error formatting
6. Returns proper CodeIgniter Response objects
```

---

### Step 4: Authentication Filters

**File:** `app/Filters/AuthFilter.php`

**Instructions for AI:**
- Extract JWT token from Authorization header (Bearer token)
- Validate token using JwtLibrary
- Store user data in request for controller access
- Return 401 for invalid/missing tokens
- Support both admin and member tokens

**Prompt:**
```
Generate an AuthFilter for CodeIgniter 4 that:
1. Checks for Authorization header (Bearer token)
2. Validates JWT token using JwtLibrary
3. Extracts user data (id, role, userType) from token
4. Stores authenticated user in request attributes
5. Returns 401 Unauthorized for invalid tokens with proper error message
6. Logs authentication failures
7. Implements CodeIgniter\Filters\FilterInterface
```

---

### Step 5: Models Generation

#### MemberModel.php

**Prompt:**
```
Generate a CodeIgniter 4 MemberModel that:
1. Extends CodeIgniter\Model
2. Uses table 'members'
3. Primary key 'id'
4. Return type 'array'
5. Allowed fields: ['member_code', 'name', 'occupation', 'date_of_birth', 'baptism_status', 'confirmation_status', 'marital_status', 'residential_status', 'aadhar_number', 'mobile', 'address', 'area', 'ward', 'remarks', 'member_status', 'password', 'registration_date', 'created_by']
6. Validation rules based on schema.sql:
   - name: required, max 100 characters
   - mobile: required, exact 10 digits, unique
   - date_of_birth: required, valid date
   - member_code: required, unique, format LCH followed by digits
   - password: required, min 8 characters
7. Before insert/update callbacks:
   - Hash password using password_hash()
   - Generate member_code if not provided
   - Set registration_date to current date
8. Custom methods:
   - findByMemberCode(string $code)
   - findByMobile(string $mobile)
   - getMemberWithOfferings(string $memberId)
   - updateMemberStatus(string $memberId, string $status)
   - searchMembers(string $query, array $filters = [])
   - getMemberStatistics()
9. Use soft deletes
10. Use timestamps (created_at, updated_at)
11. Don't return password field in default selects
```

#### OfferingModel.php

**Prompt:**
```
Generate a CodeIgniter 4 OfferingModel that:
1. Extends CodeIgniter\Model
2. Uses table 'offerings'
3. Primary key 'id'
4. Return type 'array'
5. Allowed fields: ['member_id', 'member_name', 'member_code', 'date', 'amount', 'offer_type', 'payment_mode', 'cheque_number', 'transaction_id', 'notes', 'receipt_number', 'recorded_by']
6. Validation rules:
   - member_id: required, valid UUID, exists in members table
   - amount: required, decimal, greater than 0
   - date: required, valid date
   - offer_type: required
   - payment_mode: required, in_list[Cash,UPI,Bank Transfer,Cheque,Card]
7. Before insert callback:
   - Generate receipt_number if not provided (format: REC001, REC002...)
   - Auto-populate member_name and member_code from member_id
   - Set recorded_by to authenticated admin user
8. Custom methods:
   - getMemberOfferings(string $memberId, array $filters = [])
   - getOfferingStatistics(array $filters = [])
   - getMonthlyOfferings(int $year)
   - getOfferingsByType()
   - getOfferingsByPaymentMode()
   - getTopContributors(int $limit = 10)
   - getTotalOfferingsForMember(string $memberId)
9. Use timestamps
10. Join with members table for detailed queries
```

#### TicketModel.php

**Prompt:**
```
Generate a CodeIgniter 4 TicketModel that:
1. Extends CodeIgniter\Model
2. Uses table 'tickets'
3. Primary key 'id'
4. Return type 'array'
5. Allowed fields: ['ticket_number', 'member_id', 'member_name', 'member_code', 'category', 'subject', 'description', 'status', 'priority', 'admin_notes', 'assigned_to', 'created_date', 'updated_date', 'resolved_date', 'closed_date']
6. Validation rules:
   - member_id: required, exists in members
   - category: required, in_list[Profile Update,Complaint,Suggestion,Query,Other]
   - subject: required, max 200 characters
   - description: required
   - status: in_list[Open,In Progress,Resolved,Closed]
   - priority: in_list[low,medium,high]
7. Before insert callback:
   - Generate ticket_number (format: T001, T002...)
   - Auto-populate member_name and member_code
   - Set created_date and updated_date to current date
   - Set default status to 'Open'
   - Set default priority to 'medium'
8. Before update callback:
   - Update updated_date to current date
   - Set resolved_date when status changes to 'Resolved'
   - Set closed_date when status changes to 'Closed'
   - Create ticket history entry on status change
9. Custom methods:
   - getMemberTickets(string $memberId, array $filters = [])
   - getTicketStatistics()
   - getTicketsByStatus(string $status)
   - getTicketsByCategory(string $category)
   - updateTicketStatus(string $ticketId, string $status, string $adminNotes = null)
   - assignTicket(string $ticketId, string $adminId)
10. Use timestamps
```

---

### Step 6: Controllers Generation

#### Auth/AdminAuthController.php

**Prompt:**
```
Generate a CodeIgniter 4 REST API Controller AdminAuthController that implements:

ENDPOINT: POST /api/auth/admin/login
- Accept JSON input: {username, password}
- Validate input (required fields)
- Find admin user by username using AdminUserModel
- Check if user is_active = true
- Verify password using password_verify()
- Check failed_login_attempts and locked_until
- If valid:
  - Generate access token and refresh token using JwtLibrary
  - Store refresh token in sessions table
  - Update last_login timestamp
  - Reset failed_login_attempts to 0
  - Return success response with tokens and user data (exclude password)
- If invalid:
  - Increment failed_login_attempts
  - Lock account if attempts >= 5 (set locked_until to 30 minutes from now)
  - Return 401 error with appropriate message
- Log all login attempts
- Use ResponseFormatter for all responses
- Handle exceptions gracefully

ENDPOINT: POST /api/auth/refresh
- Accept JSON input: {refreshToken}
- Validate token using JwtLibrary
- Check if token exists in sessions table and not expired
- Generate new access token
- Update last_activity in sessions table
- Return success response with new token
- Return 401 if token invalid/expired

ENDPOINT: POST /api/auth/logout
- Require authentication (use AuthFilter)
- Extract refresh token from request
- Delete session from sessions table
- Return success message

Error responses should use proper HTTP status codes and match API_REQUIREMENTS.md format.
```

#### Auth/MemberAuthController.php

**Prompt:**
```
Generate a CodeIgniter 4 REST API Controller MemberAuthController that implements:

ENDPOINT: POST /api/auth/member/login
- Accept JSON input: {identifier, identifierType, password}
- identifierType can be 'mobile' or 'memberCode'
- Find member by mobile or member_code using MemberModel
- Check if member_status is not 'suspended'
- Verify password
- Check failed_login_attempts and locked_until
- If member_status is 'unconfirmed', allow login but include warning in response
- If valid:
  - Generate access and refresh tokens
  - Store refresh token in sessions table
  - Update last_login
  - Reset failed_login_attempts
  - Log login in member_login_history table (success = true)
  - Return success with tokens and member data
- If invalid:
  - Increment failed_login_attempts
  - Lock if attempts >= 5
  - Log failed attempt in member_login_history (success = false, failure_reason)
  - Return 401 error
- Handle suspended accounts with specific error message
- Use ResponseFormatter

Include refresh and logout endpoints similar to admin.

ENDPOINT: POST /api/auth/change-password
- Require authentication (MemberFilter)
- Accept JSON input: {currentPassword, newPassword, confirmPassword}
- Get authenticated member from request
- Validate inputs:
  - currentPassword is required
  - newPassword is required, min 8 characters
  - confirmPassword must match newPassword
  - newPassword must be different from currentPassword
- Verify currentPassword using password_verify()
- If currentPassword is incorrect:
  - Return 401 error with code "INVALID_PASSWORD"
  - Message: "Current password is incorrect"
- If valid:
  - Hash new password using password_hash()
  - Update member password in database
  - Invalidate all existing sessions for this member
  - Create audit log entry
  - Return success message: "Password changed successfully. Please login again with your new password."
- Use ResponseFormatter
- Handle all errors gracefully
```

#### Admin/MemberController.php

**Prompt:**
```
Generate a CodeIgniter 4 REST API Controller Admin/MemberController with all endpoints from API_REQUIREMENTS.md:

BASE ROUTE: /api/members
FILTERS: AuthFilter, AdminFilter (admin only access)

ENDPOINTS TO IMPLEMENT:

1. POST /api/members (Register Member)
   - Accept all member fields from schema
   - Validate using MemberModel validation rules
   - Check for duplicate mobile/member_code
   - Generate member_code using sp_generate_member_code stored procedure
   - Set created_by to authenticated admin user ID
   - Set member_status to 'unconfirmed' by default
   - Hash password
   - Set registration_date to current date
   - Insert using MemberModel
   - Create audit log entry
   - Return 201 with created member data
   
2. GET /api/members (Get All Members)
   - Support query parameters: page, limit, search, memberStatus, sortBy, sortOrder
   - Use MemberModel with pagination
   - Search across name, mobile, member_code if search param provided
   - Filter by member_status if provided
   - Sort by specified field
   - Return paginated results with pagination metadata
   - Include total count
   
3. GET /api/members/:memberId (Get Member Details)
   - Validate UUID format
   - Find member by ID
   - Return 404 if not found
   - Exclude password from response
   - Optionally include offering statistics
   
4. PATCH /api/members/:memberId/status (Update Member Status)
   - Accept: {memberStatus, reason}
   - Validate memberStatus in ['confirmed', 'unconfirmed', 'suspended']
   - Update member status
   - Create audit log with old and new status
   - Return updated member data
   
5. PUT /api/members/:memberId (Update Member Profile)
   - Accept updatable fields (not member_code, registration_date)
   - Validate input
   - Update member record
   - Create audit log
   - Return updated member
   
6. POST /api/members/bulk-import (Bulk Import)
   - Accept CSV/Excel file upload
   - Parse file (use PhpSpreadsheet)
   - Validate each row
   - Insert valid rows, collect errors for invalid rows
   - Return summary: {imported: count, failed: count, errors: []}
   
7. GET /api/members/search (Search Members)
   - Accept: query, field
   - Search by name, mobile, or member_code
   - Return matching results

8. POST /api/members/:memberId/reset-password (Reset Member Password - Admin)
   - Accept: {newPassword, confirmPassword, notifyMember}
   - Validate inputs:
     - newPassword required, min 8 characters
     - confirmPassword must match newPassword
   - Hash new password using password_hash()
   - Update member password in database
   - Invalidate all existing sessions for this member
   - Create audit log entry with:
     - action: "PASSWORD_RESET"
     - performedBy: authenticated admin ID
     - entityType: "member"
     - entityId: member ID
   - If notifyMember is true, send notification (email/SMS)
   - Return success with member details (exclude password)
   - Response: {success: true, message: "Password reset successfully...", data: {memberId, memberCode, name, resetAt, resetBy}}
   
9. PATCH /api/members/:memberId/password (Update Member Password - Admin)
   - Accept: {newPassword, confirmPassword, forceChangeOnLogin}
   - Validate inputs similar to reset-password
   - Hash new password
   - Update member password
   - If forceChangeOnLogin is true, set a flag requiring password change on next login
   - Invalidate all sessions for this member
   - Create audit log entry
   - Return success with update details
   - Response: {success: true, message: "Member password updated successfully", data: {memberId, forceChangeOnLogin, updatedAt, updatedBy}}

For all endpoints:
- Use try-catch for error handling
- Create audit logs for all modifications
- Use ResponseFormatter
- Return proper HTTP status codes
- Validate user permissions
```

#### Admin/OfferingController.php

**Prompt:**
```
Generate CodeIgniter 4 REST API Controller Admin/OfferingController:

BASE ROUTE: /api/offerings
FILTERS: AuthFilter, AdminFilter

ENDPOINTS:

1. POST /api/offerings (Record Offering)
   - Accept: {memberId, date, amount, offerType, paymentMode, chequeNumber, transactionId, notes}
   - Validate using OfferingModel rules
   - Verify member exists and is not suspended
   - Generate receipt_number
   - Auto-populate member_name and member_code
   - Set recorded_by to authenticated admin
   - Insert offering
   - Create audit log
   - Return 201 with created offering
   
2. GET /api/offerings (Get All Offerings)
   - Query params: page, limit, memberId, startDate, endDate, offerType, paymentMode, sortBy, sortOrder
   - Filter by all provided params
   - Join with members table for member details
   - Paginate results
   - Calculate summary: {totalAmount, totalOfferings}
   - Return offerings with pagination and summary
   
3. GET /api/members/:memberId/offerings (Get Member Offerings)
   - Query params: startDate, endDate, offerType
   - Get all offerings for member
   - Calculate statistics:
     - totalContributions
     - averageContribution
     - totalOfferings
     - thisMonthTotal
     - lastOfferingDate
     - offeringsByType breakdown
   - Return offerings array with statistics object
   
4. PUT /api/offerings/:offeringId (Update Offering)
   - Accept updatable fields
   - Validate input
   - Update offering
   - Create audit log with old and new values
   - Return updated offering
   
5. DELETE /api/offerings/:offeringId (Delete Offering)
   - Soft delete or hard delete based on config
   - Create audit log
   - Return success message
   
6. GET /api/offerings/statistics (Get Statistics)
   - Query params: startDate, endDate, groupBy (month/week/year)
   - Calculate:
     - Total amount, count, average
     - By month/week/year aggregation
     - By type breakdown
     - By payment mode breakdown
     - Top contributors (limit 10)
   - Return comprehensive statistics

Use ResponseFormatter, proper error handling, and audit logging.
```

#### Admin/TicketController.php

**Prompt:**
```
Generate CodeIgniter 4 REST API Controller Admin/TicketController:

BASE ROUTE: /api/tickets
FILTERS: AuthFilter, AdminFilter

ENDPOINTS:

1. GET /api/tickets (Get All Tickets)
   - Query params: page, limit, status, category, memberId, sortBy, sortOrder
   - Filter by all params
   - Join with members for member details
   - Calculate summary by status: {open, inProgress, resolved, closed}
   - Paginate and return with summary
   
2. GET /api/tickets/:ticketId (Get Ticket Details)
   - Get ticket with full details
   - Include ticket history from ticket_history table
   - Include member details
   - Return 404 if not found
   
3. PATCH /api/tickets/:ticketId (Update Ticket)
   - Accept: {status, adminNotes, priority}
   - Update ticket
   - If status changed:
     - Update resolved_date if status = 'Resolved'
     - Update closed_date if status = 'Closed'
     - Create ticket_history entry
   - Set assigned_to to authenticated admin
   - Create audit log
   - Return updated ticket
   
4. GET /api/tickets/statistics (Get Ticket Statistics)
   - Calculate statistics:
     - Total count
     - By status breakdown
     - By category breakdown
     - By priority breakdown
     - Average resolution time
   - Return recent tickets (limit 5)

Error handling and proper responses required.
```

#### Admin/DashboardController.php

**Prompt:**
```
Generate CodeIgniter 4 REST API Controller Admin/DashboardController:

BASE ROUTE: /api/dashboard/admin
FILTERS: AuthFilter, AdminFilter

ENDPOINT: GET /api/dashboard/admin
- Query params: startDate, endDate (optional, default to current year)
- Use stored procedure sp_dashboard_stats() for basic stats
- Calculate comprehensive dashboard data:
  
  SUMMARY SECTION:
  - Total members, active members (confirmed)
  - New members this month
  - Total offerings amount (all time)
  - Total offerings this month
  - Average offering amount
  - Open tickets count
  - Pending confirmations (unconfirmed members)
  
  CHARTS SECTION:
  - Offerings over time (monthly aggregation)
  - Offerings by type (pie chart data)
  - Member growth (monthly member count)
  
  RECENT DATA:
  - Recent members (last 5 registrations)
  - Recent offerings (last 5 offerings)
  
  UPCOMING BIRTHDAYS:
  - Use view_upcoming_birthdays for next 30 days
  
- Return all data in structured format matching API_REQUIREMENTS.md
- Cache results for 5 minutes for performance
- Handle date range filtering
```

#### Member/ProfileController.php

**Prompt:**
```
Generate CodeIgniter 4 REST API Controller Member/ProfileController:

BASE ROUTE: /api/dashboard/member
FILTERS: AuthFilter, MemberFilter (member only)

ENDPOINTS:

1. GET /api/dashboard/member (Get Member Dashboard)
   - Get authenticated member ID from request
   - Get member profile data
   - Get offering summary using sp_member_offering_stats
   - Get member tickets with status counts
   - Get recent offerings (last 5)
   - Get recent tickets (last 3)
   - Return structured dashboard data
   
2. GET /api/members/me (Get Own Profile)
   - Get authenticated member details
   - Exclude password
   - Return profile data
   
3. PUT /api/members/me (Update Own Profile)
   - Accept limited fields: {mobile, address, area, ward, remarks}
   - Cannot update: name, member_code, member_status, etc.
   - Validate input
   - Update profile
   - Return updated profile

Members can only access their own data.
```

#### Member/OfferingController.php

**Prompt:**
```
Generate CodeIgniter 4 REST API Controller Member/OfferingController:

BASE ROUTE: /api/members/me/offerings
FILTERS: AuthFilter, MemberFilter

ENDPOINTS:

1. GET /api/members/me/offerings (Get Own Offerings)
   - Get authenticated member ID
   - Query params: startDate, endDate, offerType
   - Get offerings for this member only
   - Calculate statistics
   - Return offerings with statistics
   
2. GET /api/members/me/offerings/statistics (Get Own Statistics)
   - Get comprehensive offering statistics for member
   - Return statistics only

Members cannot create/edit/delete offerings (admin only).
```

#### Member/TicketController.php

**Prompt:**
```
Generate CodeIgniter 4 REST API Controller Member/TicketController:

BASE ROUTE: /api/members/me/tickets
FILTERS: AuthFilter, MemberFilter

ENDPOINTS:

1. POST /api/tickets (Create Ticket)
   - Accept: {category, subject, description, priority}
   - Auto-populate member_id from authenticated user
   - Generate ticket_number
   - Set status to 'Open'
   - Create ticket
   - Log in ticket_history
   - Return 201 with created ticket
   
2. GET /api/members/me/tickets (Get Own Tickets)
   - Get authenticated member's tickets only
   - Query params: status, category, sortBy, sortOrder
   - Return filtered tickets
   
3. GET /tickets/:ticketId (Get Ticket Details)
   - Verify ticket belongs to authenticated member
   - Return 403 if not owner
   - Return ticket with history

Members cannot update ticket status (admin only).
```

---

### Step 7: API Routes Configuration

**File:** `app/Config/Routes.php`

**Prompt:**
```
Generate CodeIgniter 4 Routes.php with RESTful API routes:

Configure routes group '/api' with:
- CORS filter applied to all routes
- JSON content type
- API rate limiting filter

AUTHENTICATION ROUTES (no auth required):
- POST /api/auth/admin/login -> Auth\AdminAuthController::login
- POST /api/auth/member/login -> Auth\MemberAuthController::login
- POST /api/auth/refresh -> Auth\AdminAuthController::refresh
- POST /api/auth/logout -> Auth\AdminAuthController::logout (with AuthFilter)
- POST /api/auth/change-password -> Auth\MemberAuthController::changePassword (with MemberFilter)

ADMIN ROUTES (require AuthFilter + AdminFilter):
Group '/api/members' -> Admin\MemberController
- POST / -> create
- GET / -> index
- GET /search -> search
- GET /(:segment) -> show/$1
- PUT /(:segment) -> update/$1
- PATCH /(:segment)/status -> updateStatus/$1
- POST /(:segment)/reset-password -> resetPassword/$1
- PATCH /(:segment)/password -> updatePassword/$1
- POST /bulk-import -> bulkImport

Group '/api/offerings' -> Admin\OfferingController
- POST / -> create
- GET / -> index
- GET /statistics -> statistics
- GET /(:segment) -> show/$1
- PUT /(:segment) -> update/$1
- DELETE /(:segment) -> delete/$1

Group '/api/tickets' (admin) -> Admin\TicketController
- GET / -> index
- GET /statistics -> statistics
- GET /(:segment) -> show/$1
- PATCH /(:segment) -> update/$1

Group '/api/dashboard' -> Admin\DashboardController
- GET /admin -> index

MEMBER ROUTES (require AuthFilter + MemberFilter):
Group '/api/members/me'
- GET / -> Member\ProfileController::show
- PUT / -> Member\ProfileController::update
- GET /offerings -> Member\OfferingController::index
- GET /offerings/statistics -> Member\OfferingController::statistics
- GET /tickets -> Member\TicketController::index
- POST /tickets -> Member\TicketController::create
- GET /tickets/(:segment) -> Member\TicketController::show/$1

Group '/api/dashboard'
- GET /member -> Member\ProfileController::dashboard

Use RESTful resource routing where appropriate.
Set default namespace to 'App\Controllers'.
```

---

### Step 8: Validation Rules

**File:** `app/Validation/MemberRules.php`

**Prompt:**
```
Generate custom CodeIgniter 4 validation rules for members:

1. valid_member_code: Validates format LCH followed by 3 digits
2. unique_mobile: Checks mobile number is unique (exclude current member on update)
3. valid_aadhar: Validates Aadhar number format (12 digits with optional hyphens)
4. valid_date_of_birth: Age must be at least 1 year old
5. member_exists: Validates member_id exists in database
6. member_not_suspended: Checks member is not suspended

Each rule should:
- Implement ValidationInterface
- Return boolean
- Set error message
- Accept parameters for flexible validation
```

---

### Step 9: Filters Configuration

**File:** `app/Config/Filters.php`

**Prompt:**
```
Generate CodeIgniter 4 Filters.php configuration that:
1. Registers AuthFilter, AdminFilter, MemberFilter, CorsFilter, RateLimitFilter
2. Applies CORS to all API routes globally
3. Sets up filter aliases
4. Configures before/after filters appropriately

Register aliases:
- 'auth' => AuthFilter
- 'admin' => AdminFilter  
- 'member' => MemberFilter
- 'cors' => CorsFilter
- 'throttle' => RateLimitFilter

Apply globally:
- 'cors' before all routes
```

---

### Step 10: Environment Configuration

**File:** `.env`

**Prompt:**
```
Generate .env file with all required configuration:

# Database
database.default.hostname = localhost
database.default.database = lutheran_church
database.default.username = root
database.default.password = 
database.default.DBDriver = MySQLi
database.default.DBPrefix =
database.default.port = 3306

# JWT Configuration
JWT_SECRET_KEY = your-secret-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRY = 3600
JWT_REFRESH_TOKEN_EXPIRY = 2592000

# App Configuration
CI_ENVIRONMENT = development
app.baseURL = http://localhost:8080
app.indexPage = ''

# CORS Configuration
CORS_ALLOWED_ORIGINS = http://localhost:3000,http://localhost:5173
CORS_ALLOWED_HEADERS = Content-Type,Authorization
CORS_ALLOWED_METHODS = GET,POST,PUT,PATCH,DELETE,OPTIONS

# Rate Limiting
RATE_LIMIT_AUTH = 5
RATE_LIMIT_API = 100
RATE_LIMIT_EXPORT = 5

# Email Configuration (for future use)
EMAIL_FROM = noreply@lutheranchurch.org
EMAIL_NAME = Lutheran Church

# File Upload
UPLOAD_MAX_SIZE = 5242880

# Logging
LOG_THRESHOLD = 4
```

---

### Step 11: Composer Dependencies

**File:** `composer.json`

**Prompt:**
```
Generate composer.json with required dependencies:

Required packages:
- codeigniter4/framework: ^4.4
- firebase/php-jwt: ^6.0 (JWT authentication)
- phpoffice/phpspreadsheet: ^1.29 (Excel import/export)
- predis/predis: ^2.0 (Redis for caching, optional)

Require-dev:
- fakerphp/faker: ^1.23 (testing data)
- phpunit/phpunit: ^10.0 (testing)

Set minimum PHP version to 8.1
Configure autoload PSR-4 for App namespace
```

---

### Step 12: Helper Functions

**File:** `app/Helpers/api_helper.php`

**Prompt:**
```
Generate API helper functions:

1. get_authenticated_user(): Get current authenticated user from request
2. get_user_id(): Get current user ID
3. get_user_type(): Get user type (admin/member)
4. is_admin(): Check if current user is admin
5. is_member(): Check if current user is member
6. format_date(): Format date for API response
7. generate_uuid(): Generate UUID v4
8. paginate(): Helper for pagination parameters
9. filter_query(): Build query filters from request
10. validate_uuid(): Validate UUID format
```

**File:** `app/Helpers/audit_helper.php`

**Prompt:**
```
Generate audit logging helper functions:

1. log_audit(string $action, string $entityType, string $entityId, array $oldValues = null, array $newValues = null): Create audit log entry
2. get_client_ip(): Get user's IP address
3. get_user_agent(): Get user agent string
4. get_current_admin_id(): Get authenticated admin ID
5. log_member_login_attempt(string $identifier, string $identifierType, bool $success, string $reason = null): Log member login
```

---

### Step 13: CORS Filter

**File:** `app/Filters/CorsFilter.php`

**Prompt:**
```
Generate CorsFilter that:
1. Handles preflight OPTIONS requests
2. Sets CORS headers:
   - Access-Control-Allow-Origin (from .env)
   - Access-Control-Allow-Methods
   - Access-Control-Allow-Headers
   - Access-Control-Max-Age: 3600
3. Returns 200 for OPTIONS requests
4. Passes other requests through
5. Supports multiple origins from config
```

---

### Step 14: Rate Limit Filter

**File:** `app/Filters/RateLimitFilter.php`

**Prompt:**
```
Generate RateLimitFilter that:
1. Tracks requests per IP address per minute
2. Uses cache (file-based or Redis) to store counts
3. Different limits for different route groups:
   - /api/auth/* : 5 requests per minute
   - /api/* : 100 requests per minute
   - /api/reports/export : 5 requests per hour
4. Returns 429 Too Many Requests when limit exceeded
5. Includes headers:
   - X-RateLimit-Limit
   - X-RateLimit-Remaining
   - X-RateLimit-Reset
6. Resets counter after time window
```

---

### Step 15: Admin Filter

**File:** `app/Filters/AdminFilter.php`

**Prompt:**
```
Generate AdminFilter that:
1. Assumes AuthFilter has already run
2. Gets authenticated user from request
3. Checks if user_type === 'admin'
4. Returns 403 Forbidden if not admin
5. Logs unauthorized access attempts
6. Uses ResponseFormatter for error response
```

---

### Step 16: Member Filter

**File:** `app/Filters/MemberFilter.php`

**Prompt:**
```
Generate MemberFilter that:
1. Assumes AuthFilter has already run
2. Gets authenticated user from request
3. Checks if user_type === 'member'
4. Checks if member_status !== 'suspended'
5. Returns 403 if suspended with message "Your account has been suspended"
6. Returns 403 if not member
7. Logs unauthorized attempts
```

---

## 🔒 Security Best Practices

When generating code, ensure:

1. **Password Security**
   - Use `password_hash()` with PASSWORD_BCRYPT
   - Minimum 10 cost factor
   - Never return passwords in API responses

2. **SQL Injection Prevention**
   - Use CodeIgniter Query Builder exclusively
   - Never concatenate user input in SQL
   - Use parameter binding for raw queries

3. **XSS Prevention**
   - Use `esc()` for output
   - Validate and sanitize all inputs
   - Set proper Content-Type headers

4. **CSRF Protection**
   - Disable for API (using JWT instead)
   - Enable for any web forms

5. **Input Validation**
   - Validate all inputs server-side
   - Use CodeIgniter validation library
   - Return detailed validation errors

6. **Authentication**
   - JWT tokens with short expiry
   - Secure token storage
   - Implement token refresh mechanism
   - Account lockout after failed attempts

7. **Authorization**
   - Check permissions on every request
   - Verify resource ownership
   - Use filters for role-based access

8. **Audit Logging**
   - Log all admin actions
   - Log authentication attempts
   - Store IP addresses and user agents
   - Keep logs for compliance

---

## 📝 Code Quality Standards

Generate code following these standards:

1. **PSR-12 Coding Standard**
   - Proper indentation (4 spaces)
   - Proper bracing style
   - Type declarations
   - Return type hints

2. **Documentation**
   - PHPDoc blocks for all classes and methods
   - Describe parameters and return types
   - Include usage examples

3. **Error Handling**
   - Try-catch blocks for database operations
   - Log errors appropriately
   - Return user-friendly error messages
   - Never expose stack traces in production

4. **Code Organization**
   - Single Responsibility Principle
   - DRY (Don't Repeat Yourself)
   - Meaningful variable and method names
   - Constants for magic values

5. **Performance**
   - Use indexes for database queries
   - Implement caching where appropriate
   - Optimize N+1 queries
   - Use pagination for large datasets

---

## 🧪 Testing Requirements

Generate test cases for:

1. **Unit Tests**
   - Model validation rules
   - Library methods (JWT, ResponseFormatter)
   - Helper functions

2. **Integration Tests**
   - API endpoints with mock data
   - Authentication flow
   - Authorization checks
   - Database operations

3. **Test Structure**
```php
<?php
namespace Tests\Feature;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;

class MemberApiTest extends CIUnitTestCase
{
    use DatabaseTestTrait, FeatureTestTrait;
    
    protected function setUp(): void
    {
        parent::setUp();
        // Setup test data
    }
    
    public function testCreateMember()
    {
        // Test implementation
    }
}
```

---

## 📚 Additional Features to Generate

### 1. Export Functionality

**File:** `app/Controllers/Admin/ReportController.php`

**Prompt:**
```
Generate ReportController for exporting data:
1. Export members to CSV/Excel
2. Export offerings to CSV/Excel with date range
3. Export tickets to CSV
4. Generate PDF reports using TCPDF/mPDF
5. Return download URLs with expiry
6. Implement background job for large exports
7. Rate limit: 5 exports per hour
```

### 2. Bulk Operations

**Prompt:**
```
Add bulk operations to MemberController:
1. Bulk update member status
2. Bulk delete members
3. Bulk send notifications
4. Return summary of successful/failed operations
```

### 3. Search Enhancement

**Prompt:**
```
Implement advanced search:
1. Full-text search across multiple fields
2. Filter combinations (AND/OR)
3. Date range filters
4. Numeric range filters (age, amount)
5. Sorting by multiple columns
6. Export search results
```

### 4. Email Notifications

**File:** `app/Libraries/EmailService.php`

**Prompt:**
```
Generate EmailService library:
1. Send welcome email on member registration
2. Send offering receipt via email
3. Send ticket status update notifications
4. Send birthday wishes
5. Use email templates
6. Queue emails for bulk sending
7. Use CodeIgniter Email library
```

### 5. SMS Integration

**File:** `app/Libraries/SmsService.php`

**Prompt:**
```
Generate SmsService library:
1. Send OTP for verification
2. Send offering confirmation
3. Send ticket updates
4. Integrate with SMS gateway (Twilio/MSG91)
5. Log all SMS in database
6. Handle failures and retries
```

---

## 🚀 Deployment Instructions

Generate deployment documentation covering:

1. **Server Requirements**
   - PHP 8.1+
   - MySQL 8.0+
   - Apache/Nginx with mod_rewrite
   - SSL certificate

2. **Installation Steps**
   ```bash
   # Clone repository
   git clone [repo-url]
   cd church-api
   
   # Install dependencies
   composer install --no-dev
   
   # Configure environment
   cp env .env
   # Edit .env with production values
   
   # Set permissions
   chmod -R 755 writable/
   
   # Import database
   mysql -u root -p lutheran_church < schema.sql
   
   # Run migrations (if any)
   php spark migrate
   
   # Start application
   php spark serve --host=0.0.0.0 --port=8080
   ```

3. **Apache Configuration**
   ```apache
   <VirtualHost *:80>
       ServerName api.church.com
       DocumentRoot /var/www/church-api/public
       
       <Directory /var/www/church-api/public>
           Options -Indexes +FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>
       
       ErrorLog ${APACHE_LOG_DIR}/church-api-error.log
       CustomLog ${APACHE_LOG_DIR}/church-api-access.log combined
   </VirtualHost>
   ```

4. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name api.church.com;
       root /var/www/church-api/public;
       index index.php;
       
       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }
       
       location ~ \.php$ {
           fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
           fastcgi_index index.php;
           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
           include fastcgi_params;
       }
   }
   ```

5. **Production Optimizations**
   - Enable OPcache
   - Set CI_ENVIRONMENT=production
   - Disable display_errors
   - Enable error logging
   - Use Redis for caching
   - Set up log rotation
   - Configure backup cron jobs

---

## 📖 API Documentation

Generate Swagger/OpenAPI documentation:

**File:** `public/swagger.json`

**Prompt:**
```
Generate OpenAPI 3.0 specification (swagger.json) that documents all API endpoints from API_REQUIREMENTS.md including:
1. All routes with methods
2. Request body schemas
3. Response schemas
4. Authentication requirements (Bearer token)
5. Error responses
6. Examples for each endpoint
7. Models/schemas for Member, Offering, Ticket
8. Security definitions

Use Swagger UI to serve interactive documentation at /api/docs
```

---

## 🔍 Monitoring & Logging

Generate logging configuration:

**File:** `app/Config/Logger.php`

**Prompt:**
```
Configure comprehensive logging:
1. Separate log files:
   - error.log - Application errors
   - auth.log - Authentication attempts
   - audit.log - Admin actions
   - api.log - API requests/responses
2. Log rotation (daily)
3. Different log levels (DEBUG, INFO, WARNING, ERROR)
4. Include context (user ID, IP, timestamp)
5. Use Monolog for advanced logging
```

---

## 🎯 Usage Example for AI

To generate a complete controller, use this prompt template:

```
Using the Lutheran Church Management System schema.sql and API_REQUIREMENTS.md:

Generate a complete CodeIgniter 4 REST API Controller for [CONTROLLER_NAME] that:
1. Implements all endpoints specified in API_REQUIREMENTS.md for [MODULE_NAME]
2. Uses [MODEL_NAME] for database operations
3. Implements proper authentication and authorization using AuthFilter and [AdminFilter/MemberFilter]
4. Validates all inputs using CodeIgniter validation
5. Returns standardized responses using ResponseFormatter
6. Creates audit logs for all modifications
7. Handles errors gracefully with try-catch
8. Implements pagination for list endpoints
9. Follows PSR-12 coding standards
10. Includes PHPDoc comments

Requirements:
- Return proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Use query builder, no raw SQL
- Exclude passwords from responses
- Log all admin actions
- Support filtering, sorting, and pagination
- Implement rate limiting considerations

Reference the following from schema.sql:
- Table: [TABLE_NAME]
- Fields: [LIST_FIELDS]
- Relationships: [DESCRIBE_RELATIONSHIPS]

Follow the API response format from API_REQUIREMENTS.md.
```

---

## ✅ Checklist for Complete API

Before considering the API complete, verify:

- [ ] All 25+ endpoints from API_REQUIREMENTS.md implemented
- [ ] Authentication (admin and member login) working
- [ ] JWT token generation and validation
- [ ] Token refresh mechanism
- [ ] All CRUD operations for members, offerings, tickets
- [ ] Role-based access control (admin vs member)
- [ ] Input validation on all endpoints
- [ ] Pagination on all list endpoints
- [ ] Search and filtering functionality
- [ ] Audit logging for admin actions
- [ ] Error handling and proper HTTP status codes
- [ ] CORS configuration for frontend
- [ ] Rate limiting on sensitive endpoints
- [ ] Password hashing and security
- [ ] Database relationships and foreign keys
- [ ] Stored procedures integration
- [ ] Views integration for statistics
- [ ] API documentation (Swagger)
- [ ] Unit tests for critical functions
- [ ] Integration tests for key flows
- [ ] .env configuration template
- [ ] Deployment documentation
- [ ] Code follows PSR-12 standards
- [ ] All security best practices implemented

---

## 🆘 Troubleshooting Guide

Common issues and solutions:

1. **CORS Errors**
   - Verify CORS_ALLOWED_ORIGINS in .env
   - Check CorsFilter is registered globally
   - Ensure OPTIONS requests return 200

2. **JWT Token Issues**
   - Verify JWT_SECRET_KEY is set
   - Check token expiry settings
   - Validate token format (Bearer token)
   - Check Authorization header is sent

3. **Database Connection**
   - Verify credentials in .env
   - Check MySQL is running
   - Verify database exists
   - Check user has proper permissions

4. **Validation Errors**
   - Check validation rules in models
   - Verify input field names match
   - Review validation error messages

5. **404 Errors**
   - Check Routes.php configuration
   - Verify controller namespace
   - Check .htaccess rewrite rules

---

## 📞 Support

For issues with generated code:
1. Check error logs in `writable/logs/`
2. Enable CI_ENVIRONMENT=development for detailed errors
3. Review database queries in debug toolbar
4. Verify all dependencies installed via composer
5. Check PHP version and extensions

---

## 🔄 Versioning

API Version: 1.0
Generated Code Version: 1.0
Last Updated: 2024-11-13

When updating the API:
1. Version all breaking changes
2. Use URL versioning (/api/v1/, /api/v2/)
3. Maintain backward compatibility
4. Document all changes in CHANGELOG.md

---

## 📝 Final Notes

This documentation provides comprehensive instructions for AI code generation tools to create a complete, production-ready PHP CodeIgniter 4 REST API. 

**Key Principles:**
- Security first
- Follow RESTful conventions
- Comprehensive error handling
- Proper validation
- Audit everything
- Performance optimization
- Clean, maintainable code

**Next Steps After Generation:**
1. Review generated code
2. Run tests
3. Update security keys
4. Deploy to staging
5. Test all endpoints
6. Generate API documentation
7. Deploy to production

---

**Generated API should be ready to integrate with the Lutheran Church Management System frontend built with React.**