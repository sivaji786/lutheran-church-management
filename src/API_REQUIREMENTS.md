# API Requirements Documentation
## Lutheran Church Management System

---

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [Member Management](#member-management)
3. [Offering Management](#offering-management)
4. [Ticket Management](#ticket-management)
5. [Dashboard & Analytics](#dashboard--analytics)
6. [Data Models](#data-models)
7. [Error Handling](#error-handling)
8. [Security Considerations](#security-considerations)

---

## Authentication & Authorization

### 1.1 Admin Login
**Endpoint:** `POST /api/auth/admin/login`

**Purpose:** Authenticate admin users with username and password

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "admin_001",
    "username": "admin",
    "role": "admin",
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  }
}
```

**Use Case:** Admin dashboard login functionality

---

### 1.2 Member Login
**Endpoint:** `POST /api/auth/member/login`

**Purpose:** Authenticate church members using mobile number or member code

**Request Body:**
```json
{
  "identifier": "9876543210", // mobile number or member code
  "identifierType": "mobile", // "mobile" or "memberCode"
  "password": "member123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "member_001",
    "memberId": "1",
    "memberCode": "LCH001",
    "name": "John Emmanuel",
    "role": "member",
    "memberStatus": "confirmed",
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  }
}
```

**Use Case:** Member portal login

---

### 1.3 Token Refresh
**Endpoint:** `POST /api/auth/refresh`

**Purpose:** Refresh expired JWT tokens

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "expiresIn": 3600
  }
}
```

---

### 1.4 Logout
**Endpoint:** `POST /api/auth/logout`

**Purpose:** Invalidate user session and tokens

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

### 1.5 Change Password (Member)
**Endpoint:** `POST /api/auth/change-password`

**Purpose:** Allow members to change their own password

**Headers:**
```
Authorization: Bearer member_jwt_token
```

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully. Please login again with your new password."
}
```

**Error Response (Invalid Current Password):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "Current password is incorrect",
    "details": null
  }
}
```

**Validation:**
- Current password must match existing password
- New password must be at least 8 characters
- New password must be different from current password
- Confirm password must match new password

**Use Case:** Member changing their own account password

---

## Member Management

### 2.1 Register New Member
**Endpoint:** `POST /api/members`

**Purpose:** Register a new church member (Admin only)

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Request Body:**
```json
{
  "name": "John Emmanuel",
  "occupation": "Software Engineer",
  "dateOfBirth": "1990-05-15",
  "baptismStatus": true,
  "confirmationStatus": true,
  "maritalStatus": true,
  "residentialStatus": true,
  "aadharNumber": "1234-5678-9012",
  "mobile": "9876543210",
  "address": "123 Main Street",
  "area": "City Center",
  "ward": "Ward 1",
  "remarks": "Active member",
  "password": "initial_password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "memberCode": "LCH001",
    "name": "John Emmanuel",
    "registrationDate": "2024-11-13",
    "memberStatus": "unconfirmed",
    "...": "all other fields"
  },
  "message": "Member registered successfully"
}
```

**Use Case:** Admin registering new members through the registration form

---

### 2.2 Get All Members
**Endpoint:** `GET /api/members`

**Purpose:** Retrieve list of all members with optional filtering and pagination

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Query Parameters:**
```
?page=1
&limit=20
&search=John
&memberStatus=confirmed
&sortBy=registrationDate
&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "1",
        "name": "John Emmanuel",
        "memberCode": "LCH001",
        "mobile": "9876543210",
        "occupation": "Software Engineer",
        "memberStatus": "confirmed",
        "registrationDate": "2024-01-15"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 100,
      "limit": 20
    }
  }
}
```

**Use Case:** Display all members in admin dashboard table

---

### 2.3 Get Member Details
**Endpoint:** `GET /api/members/:memberId`

**Purpose:** Retrieve detailed information about a specific member

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "John Emmanuel",
    "memberCode": "LCH001",
    "occupation": "Software Engineer",
    "dateOfBirth": "1990-05-15",
    "baptismStatus": true,
    "confirmationStatus": true,
    "maritalStatus": true,
    "residentialStatus": true,
    "aadharNumber": "1234-5678-9012",
    "mobile": "9876543210",
    "address": "123 Main Street",
    "area": "City Center",
    "ward": "Ward 1",
    "remarks": "Active member",
    "memberStatus": "confirmed",
    "registrationDate": "2024-01-15"
  }
}
```

**Use Case:** 
- Admin viewing member detail page
- Member viewing their own profile

---

### 2.4 Update Member Status
**Endpoint:** `PATCH /api/members/:memberId/status`

**Purpose:** Update member status (confirm/unconfirm/suspend) - Admin only

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Request Body:**
```json
{
  "memberStatus": "confirmed", // "confirmed" | "unconfirmed" | "suspended"
  "reason": "Verification completed" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "memberCode": "LCH001",
    "name": "John Emmanuel",
    "memberStatus": "confirmed",
    "updatedAt": "2024-11-13T10:30:00Z"
  },
  "message": "Member status updated successfully"
}
```

**Use Case:** Admin confirming, unconfirming, or suspending members

---

### 2.5 Update Member Profile
**Endpoint:** `PUT /api/members/:memberId`

**Purpose:** Update member information

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "occupation": "Senior Software Engineer",
  "mobile": "9876543211",
  "address": "456 New Street",
  "area": "Suburbia",
  "ward": "Ward 2",
  "remarks": "Updated information"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "...": "updated member data"
  },
  "message": "Member profile updated successfully"
}
```

**Use Case:** 
- Admin updating member information
- Member updating their own profile (limited fields)

---

### 2.6 Bulk Import Members
**Endpoint:** `POST /api/members/bulk-import`

**Purpose:** Import multiple members from CSV/Excel file

**Headers:**
```
Authorization: Bearer admin_jwt_token
Content-Type: multipart/form-data
```

**Request Body:**
```
file: members.csv
```

**Response:**
```json
{
  "success": true,
  "data": {
    "imported": 50,
    "failed": 2,
    "errors": [
      {
        "row": 23,
        "error": "Invalid mobile number format"
      }
    ]
  },
  "message": "50 members imported successfully, 2 failed"
}
```

**Use Case:** Admin importing members from CSV file

---

### 2.7 Search Members
**Endpoint:** `GET /api/members/search`

**Purpose:** Search members by name, mobile, or member code

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Query Parameters:**
```
?query=John
&field=name
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "1",
        "name": "John Emmanuel",
        "memberCode": "LCH001",
        "mobile": "9876543210"
      }
    ],
    "count": 1
  }
}
```

**Use Case:** Search functionality in members table

---

### 2.8 Reset Member Password (Admin)
**Endpoint:** `POST /api/members/:memberId/reset-password`

**Purpose:** Admin can reset a member's password to a new value

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Request Body:**
```json
{
  "newPassword": "new_password_123",
  "confirmPassword": "new_password_123",
  "notifyMember": true // optional: send notification to member
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully. Member has been notified.",
  "data": {
    "memberId": "1",
    "memberCode": "LCH001",
    "name": "John Emmanuel",
    "resetAt": "2024-11-13T10:30:00Z",
    "resetBy": "admin_001"
  }
}
```

**Validation:**
- New password must be at least 8 characters
- Confirm password must match new password
- Admin must be authenticated
- Creates audit log entry

**Use Case:** Admin resetting forgotten passwords or setting new passwords for members

---

### 2.9 Update Member Password (Admin)
**Endpoint:** `PATCH /api/members/:memberId/password`

**Purpose:** Admin can change a member's password (force password change)

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Request Body:**
```json
{
  "newPassword": "updated_password_123",
  "confirmPassword": "updated_password_123",
  "forceChangeOnLogin": false // optional: require member to change password on next login
}
```

**Response:**
```json
{
  "success": true,
  "message": "Member password updated successfully",
  "data": {
    "memberId": "1",
    "forceChangeOnLogin": false,
    "updatedAt": "2024-11-13T10:30:00Z",
    "updatedBy": "admin_001"
  }
}
```

**Use Case:** Admin updating member passwords

---

## Offering Management

### 3.1 Record New Offering
**Endpoint:** `POST /api/offerings`

**Purpose:** Record a new offering contribution (Admin only)

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Request Body:**
```json
{
  "memberId": "1",
  "date": "2024-11-13",
  "amount": 5000,
  "offerType": "Tithe",
  "paymentMode": "Cash",
  "notes": "Sunday service offering"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "offering_001",
    "memberId": "1",
    "memberName": "John Emmanuel",
    "memberCode": "LCH001",
    "date": "2024-11-13",
    "amount": 5000,
    "offerType": "Tithe",
    "paymentMode": "Cash",
    "notes": "Sunday service offering",
    "recordedBy": "admin_001",
    "recordedAt": "2024-11-13T10:30:00Z"
  },
  "message": "Offering recorded successfully"
}
```

**Use Case:** Admin recording member contributions

---

### 3.2 Get All Offerings
**Endpoint:** `GET /api/offerings`

**Purpose:** Retrieve list of all offerings with filtering

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Query Parameters:**
```
?page=1
&limit=20
&memberId=1
&startDate=2024-01-01
&endDate=2024-12-31
&offerType=Tithe
&paymentMode=Cash
&sortBy=date
&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "offerings": [
      {
        "id": "offering_001",
        "memberId": "1",
        "memberName": "John Emmanuel",
        "memberCode": "LCH001",
        "date": "2024-11-13",
        "amount": 5000,
        "offerType": "Tithe",
        "paymentMode": "Cash"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalRecords": 200,
      "limit": 20
    },
    "summary": {
      "totalAmount": 500000,
      "totalOfferings": 200
    }
  }
}
```

**Use Case:** Display offerings in admin dashboard

---

### 3.3 Get Member Offerings
**Endpoint:** `GET /api/members/:memberId/offerings`

**Purpose:** Retrieve all offerings for a specific member

**Headers:**
```
Authorization: Bearer jwt_token
```

**Query Parameters:**
```
?startDate=2024-01-01
&endDate=2024-12-31
&offerType=Tithe
```

**Response:**
```json
{
  "success": true,
  "data": {
    "offerings": [
      {
        "id": "offering_001",
        "date": "2024-11-13",
        "amount": 5000,
        "offerType": "Tithe",
        "paymentMode": "Cash"
      }
    ],
    "statistics": {
      "totalContributions": 60000,
      "averageContribution": 5000,
      "totalOfferings": 12,
      "thisMonthTotal": 10000,
      "lastOfferingDate": "2024-11-13",
      "offeringsByType": {
        "Tithe": 40000,
        "Thanksgiving": 15000,
        "Building Fund": 5000
      }
    }
  }
}
```

**Use Case:** 
- Member viewing their offering history
- Admin viewing member's offering details

---

### 3.4 Update Offering
**Endpoint:** `PUT /api/offerings/:offeringId`

**Purpose:** Update offering details (Admin only)

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Request Body:**
```json
{
  "amount": 5500,
  "offerType": "Tithe",
  "paymentMode": "Bank Transfer",
  "notes": "Updated amount"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "offering_001",
    "...": "updated offering data"
  },
  "message": "Offering updated successfully"
}
```

**Use Case:** Admin correcting offering entries

---

### 3.5 Delete Offering
**Endpoint:** `DELETE /api/offerings/:offeringId`

**Purpose:** Delete an offering record (Admin only)

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Response:**
```json
{
  "success": true,
  "message": "Offering deleted successfully"
}
```

**Use Case:** Admin removing erroneous entries

---

### 3.6 Get Offering Statistics
**Endpoint:** `GET /api/offerings/statistics`

**Purpose:** Get aggregated offering statistics for dashboard

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Query Parameters:**
```
?startDate=2024-01-01
&endDate=2024-12-31
&groupBy=month // month, week, year
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAmount": 500000,
    "totalOfferings": 200,
    "averageOffering": 2500,
    "byMonth": [
      {
        "month": "2024-01",
        "amount": 45000,
        "count": 18
      }
    ],
    "byType": {
      "Tithe": 300000,
      "Thanksgiving": 150000,
      "Building Fund": 50000
    },
    "byPaymentMode": {
      "Cash": 200000,
      "UPI": 180000,
      "Bank Transfer": 120000
    },
    "topContributors": [
      {
        "memberId": "1",
        "memberName": "John Emmanuel",
        "totalAmount": 60000
      }
    ]
  }
}
```

**Use Case:** Dashboard analytics and charts

---

## Ticket Management

### 4.1 Create Ticket
**Endpoint:** `POST /api/tickets`

**Purpose:** Create a new support/request ticket

**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "category": "Profile Update",
  "subject": "Update Address",
  "description": "Please update my address to 123 New Street, New City.",
  "priority": "medium" // optional: low, medium, high
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ticket_001",
    "ticketNumber": "T001",
    "memberId": "1",
    "memberName": "John Emmanuel",
    "memberCode": "LCH001",
    "category": "Profile Update",
    "subject": "Update Address",
    "description": "Please update my address to 123 New Street, New City.",
    "status": "Open",
    "priority": "medium",
    "createdDate": "2024-11-13",
    "updatedDate": "2024-11-13"
  },
  "message": "Ticket created successfully"
}
```

**Use Case:** Members submitting requests/complaints

---

### 4.2 Get All Tickets
**Endpoint:** `GET /api/tickets`

**Purpose:** Retrieve all tickets (Admin) or user's tickets (Member)

**Headers:**
```
Authorization: Bearer jwt_token
```

**Query Parameters:**
```
?page=1
&limit=20
&status=Open
&category=Profile Update
&memberId=1
&sortBy=createdDate
&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "ticket_001",
        "ticketNumber": "T001",
        "memberId": "1",
        "memberName": "John Emmanuel",
        "memberCode": "LCH001",
        "category": "Profile Update",
        "subject": "Update Address",
        "status": "Open",
        "priority": "medium",
        "createdDate": "2024-11-13",
        "updatedDate": "2024-11-13"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalRecords": 50,
      "limit": 20
    },
    "summary": {
      "open": 15,
      "inProgress": 20,
      "resolved": 10,
      "closed": 5
    }
  }
}
```

**Use Case:** 
- Admin viewing all tickets
- Member viewing their tickets

---

### 4.3 Get Ticket Details
**Endpoint:** `GET /api/tickets/:ticketId`

**Purpose:** Get detailed information about a specific ticket

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ticket_001",
    "ticketNumber": "T001",
    "memberId": "1",
    "memberName": "John Emmanuel",
    "memberCode": "LCH001",
    "mobile": "9876543210",
    "category": "Profile Update",
    "subject": "Update Address",
    "description": "Please update my address to 123 New Street, New City.",
    "status": "Open",
    "priority": "medium",
    "createdDate": "2024-11-13",
    "updatedDate": "2024-11-13",
    "adminNotes": null,
    "history": [
      {
        "action": "Created",
        "performedBy": "John Emmanuel",
        "timestamp": "2024-11-13T10:00:00Z"
      }
    ]
  }
}
```

**Use Case:** Viewing ticket details

---

### 4.4 Update Ticket Status
**Endpoint:** `PATCH /api/tickets/:ticketId`

**Purpose:** Update ticket status and admin notes (Admin only)

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Request Body:**
```json
{
  "status": "In Progress",
  "adminNotes": "Working on address update",
  "priority": "high" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ticket_001",
    "ticketNumber": "T001",
    "status": "In Progress",
    "adminNotes": "Working on address update",
    "updatedDate": "2024-11-13",
    "updatedBy": "admin_001"
  },
  "message": "Ticket updated successfully"
}
```

**Use Case:** Admin updating ticket status

---

### 4.5 Get Ticket Statistics
**Endpoint:** `GET /api/tickets/statistics`

**Purpose:** Get ticket statistics for dashboard (Admin only)

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "byStatus": {
      "Open": 15,
      "In Progress": 20,
      "Resolved": 10,
      "Closed": 5
    },
    "byCategory": {
      "Profile Update": 20,
      "Complaint": 10,
      "Suggestion": 15,
      "Query": 5
    },
    "byPriority": {
      "low": 20,
      "medium": 25,
      "high": 5
    },
    "averageResolutionTime": "2.5 days",
    "recentTickets": []
  }
}
```

**Use Case:** Admin dashboard ticket analytics

---

## Dashboard & Analytics

### 5.1 Get Admin Dashboard Data
**Endpoint:** `GET /api/dashboard/admin`

**Purpose:** Get comprehensive dashboard data for admin

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Query Parameters:**
```
?startDate=2024-01-01
&endDate=2024-12-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalMembers": 150,
      "activeMembers": 120,
      "newMembersThisMonth": 5,
      "totalOfferings": 500000,
      "totalOfferingsThisMonth": 45000,
      "averageOffering": 2500,
      "openTickets": 15,
      "pendingConfirmations": 3
    },
    "charts": {
      "offeringsOverTime": [
        {
          "date": "2024-01",
          "amount": 45000,
          "count": 18
        }
      ],
      "offeringsByType": {
        "Tithe": 300000,
        "Thanksgiving": 150000,
        "Building Fund": 50000
      },
      "memberGrowth": [
        {
          "month": "2024-01",
          "count": 145
        }
      ]
    },
    "recentMembers": [
      {
        "id": "5",
        "name": "New Member",
        "memberCode": "LCH005",
        "registrationDate": "2024-11-13",
        "memberStatus": "unconfirmed"
      }
    ],
    "recentOfferings": [],
    "upcomingBirthdays": [
      {
        "memberId": "1",
        "name": "John Emmanuel",
        "dateOfBirth": "1990-05-15",
        "upcomingDate": "2024-05-15",
        "age": 35
      }
    ]
  }
}
```

**Use Case:** Admin dashboard overview

---

### 5.2 Get Member Dashboard Data
**Endpoint:** `GET /api/dashboard/member`

**Purpose:** Get dashboard data for logged-in member

**Headers:**
```
Authorization: Bearer member_jwt_token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "1",
      "name": "John Emmanuel",
      "memberCode": "LCH001",
      "memberStatus": "confirmed"
    },
    "offeringSummary": {
      "totalContributions": 60000,
      "thisYearTotal": 50000,
      "thisMonthTotal": 5000,
      "lastOffering": {
        "date": "2024-11-13",
        "amount": 5000,
        "type": "Tithe"
      }
    },
    "tickets": {
      "total": 5,
      "open": 2,
      "resolved": 3
    },
    "recentOfferings": [],
    "recentTickets": []
  }
}
```

**Use Case:** Member dashboard overview

---

### 5.3 Export Reports
**Endpoint:** `POST /api/reports/export`

**Purpose:** Export data as CSV/PDF (Admin only)

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Request Body:**
```json
{
  "type": "offerings", // "members", "offerings", "tickets"
  "format": "csv", // "csv", "pdf", "excel"
  "filters": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "memberStatus": "confirmed"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileUrl": "https://api.church.com/exports/offerings_2024.csv",
    "expiresAt": "2024-11-14T10:00:00Z"
  },
  "message": "Report generated successfully"
}
```

**Use Case:** Admin exporting reports

---

## Data Models

### Member Model
```typescript
{
  id: string;
  name: string;
  occupation: string;
  dateOfBirth: string; // ISO date format
  baptismStatus: boolean;
  confirmationStatus: boolean;
  maritalStatus: boolean; // true = Married, false = Unmarried
  residentialStatus: boolean; // true = Resident, false = Non-Resident
  aadharNumber: string;
  mobile: string;
  address: string;
  area: string;
  ward: string;
  remarks: string;
  memberCode: string; // LCH001, LCH002, etc.
  registrationDate: string; // ISO date format
  memberStatus: 'confirmed' | 'unconfirmed' | 'suspended';
  password: string; // hashed
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  createdBy: string; // admin user id
}
```

### Offering Model
```typescript
{
  id: string;
  memberId: string;
  memberName: string; // denormalized for quick access
  memberCode: string; // denormalized
  date: string; // ISO date format
  amount: number;
  offerType: string; // Tithe, Thanksgiving, Building Fund, etc.
  paymentMode: string; // Cash, UPI, Bank Transfer, Cheque
  notes?: string;
  recordedBy: string; // admin user id
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
```

### Ticket Model
```typescript
{
  id: string;
  ticketNumber: string; // T001, T002, etc.
  memberId: string;
  memberName: string; // denormalized
  memberCode: string; // denormalized
  category: string; // Profile Update, Complaint, Suggestion, Query
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority?: 'low' | 'medium' | 'high';
  adminNotes?: string;
  createdDate: string; // ISO date format
  updatedDate: string; // ISO date format
  resolvedDate?: string; // ISO date format
  closedDate?: string; // ISO date format
  assignedTo?: string; // admin user id
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
```

### User Model (Admin)
```typescript
{
  id: string;
  username: string;
  password: string; // hashed
  role: 'admin' | 'super_admin';
  name: string;
  email?: string;
  mobile?: string;
  isActive: boolean;
  lastLogin: string; // ISO datetime
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid username or password",
    "details": {
      "field": "password",
      "reason": "Incorrect password"
    }
  }
}
```

### Common Error Codes
- `INVALID_CREDENTIALS` - Invalid login credentials
- `UNAUTHORIZED` - Missing or invalid token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Request validation failed
- `DUPLICATE_ENTRY` - Duplicate record (e.g., mobile number already exists)
- `MEMBER_SUSPENDED` - Member account is suspended
- `SERVER_ERROR` - Internal server error

---

## Security Considerations

### 1. Authentication
- Use JWT tokens with short expiration (1 hour)
- Implement refresh tokens for session management
- Store tokens securely (httpOnly cookies or secure storage)
- Implement rate limiting on login endpoints

### 2. Authorization
- Role-based access control (Admin vs Member)
- Members can only access their own data
- Admins have full access with audit logging
- Validate permissions on every API call

### 3. Data Protection
- Hash passwords using bcrypt (minimum 10 rounds)
- Encrypt sensitive data (Aadhar numbers)
- Implement HTTPS/TLS for all communications
- Sanitize all user inputs to prevent SQL injection/XSS

### 4. API Security
- Implement rate limiting (e.g., 100 requests per minute)
- Use CORS policies to restrict access
- Validate all request parameters and bodies
- Log all admin actions for audit trail

### 5. Data Privacy
- **Important:** This system is NOT designed for collecting PII or securing highly sensitive data
- Comply with data protection regulations
- Implement data retention policies
- Allow members to request data deletion (Right to be forgotten)
- Regular security audits and vulnerability assessments

### 6. Audit Logging
- Log all administrative actions
- Track who created/modified/deleted records
- Monitor suspicious activities
- Retain logs for compliance purposes

---

## API Versioning

All APIs should be versioned using URL path:
```
/api/v1/members
/api/v2/members
```

This allows backward compatibility when making breaking changes.

---

## Rate Limiting

Recommended rate limits:
- Authentication endpoints: 5 requests per minute per IP
- General APIs: 100 requests per minute per user
- Export/Report endpoints: 5 requests per hour per user

---

## Pagination Standards

All list endpoints should support pagination:
```
?page=1&limit=20
```

Response should include:
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalRecords": 200,
    "limit": 20,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## Additional API Endpoints (Future Enhancements)

### Church Events Management
- `POST /api/events` - Create event
- `GET /api/events` - List events
- `GET /api/events/:id` - Event details
- `POST /api/events/:id/register` - Register for event
- `GET /api/events/:id/attendees` - Event attendees

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/send` - Send notification (Admin)
- `PATCH /api/notifications/:id/read` - Mark as read

### SMS/Email Integration
- `POST /api/communications/sms` - Send SMS
- `POST /api/communications/email` - Send email
- `GET /api/communications/templates` - Get message templates

### Financial Reports
- `GET /api/reports/financial/monthly` - Monthly financial report
- `GET /api/reports/financial/yearly` - Yearly financial report
- `GET /api/reports/tax-receipts/:memberId` - Tax receipt for member

### User Management
- `POST /api/users/admin` - Create admin user
- `GET /api/users/admin` - List admin users
- `PATCH /api/users/admin/:id` - Update admin user
- `DELETE /api/users/admin/:id` - Delete admin user

---

## Conclusion

This document provides a comprehensive overview of all API requirements for the Lutheran Church Management System. Each endpoint is designed to support the frontend functionality while maintaining security, scalability, and ease of integration.

**Note:** All APIs should return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

For implementation, consider using:
- **Backend:** Node.js with Express/NestJS, or Python with FastAPI/Django
- **Database:** PostgreSQL or MongoDB
- **Authentication:** JWT with refresh tokens
- **File Storage:** AWS S3 or similar for exports/uploads
- **API Documentation:** Swagger/OpenAPI specification