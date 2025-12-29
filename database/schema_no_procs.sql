SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- ============================================================
-- Table: admin_users
-- Description: Stores admin user accounts who manage the system
-- ============================================================
DROP TABLE IF EXISTS admin_users;
CREATE TABLE admin_users (
  id CHAR(36) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
  role ENUM('admin', 'super_admin') NOT NULL DEFAULT 'admin',
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  mobile VARCHAR(15),
  is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=Active, 0=Inactive',
  last_login DATETIME NULL,
  password_changed_at DATETIME NULL,
  failed_login_attempts INT NOT NULL DEFAULT 0,
  locked_until DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Admin users with system access';

-- ============================================================
-- Table: members
-- Description: Church members information
-- ============================================================
DROP TABLE IF EXISTS members;
CREATE TABLE members (
  id CHAR(36) PRIMARY KEY,
  member_code VARCHAR(20) NOT NULL UNIQUE COMMENT 'Format: LCH001, LCH002, etc.',
  name VARCHAR(100) NOT NULL,
  occupation VARCHAR(100),
  date_of_birth DATE NOT NULL,
  baptism_status TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1=Baptized, 0=Not Baptized',
  confirmation_status TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1=Confirmed, 0=Not Confirmed',
  marital_status TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1=Married, 0=Unmarried',
  residential_status TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=Resident, 0=Non-Resident',
  aadhar_number VARCHAR(20) COMMENT 'Encrypted in application layer',
  mobile VARCHAR(15) NOT NULL,
  address TEXT,
  area VARCHAR(100),
  ward VARCHAR(50),
  remarks TEXT,
  member_status ENUM('confirmed', 'unconfirmed', 'suspended') NOT NULL DEFAULT 'unconfirmed',
  password VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
  registration_date DATE NOT NULL,
  last_login DATETIME NULL,
  failed_login_attempts INT NOT NULL DEFAULT 0,
  locked_until DATETIME NULL,
  created_by CHAR(36) COMMENT 'Admin user ID who created this member',
  family_id VARCHAR(50) NULL COMMENT 'Family Identifier',
  member_serial_num INT NULL COMMENT 'Serial Number part of Code',
  member_order INT NULL COMMENT 'Order in family',
  head_of_family TINYINT(1) DEFAULT 0 COMMENT 'Is head of family',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_member_code (member_code),
  INDEX idx_mobile (mobile),
  INDEX idx_name (name),
  INDEX idx_member_status (member_status),
  INDEX idx_registration_date (registration_date),
  INDEX idx_date_of_birth (date_of_birth),
  INDEX idx_area_ward (area, ward),
  
  FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Church members database';

-- ============================================================
-- Table: offerings
-- Description: Member offerings and contributions
-- ============================================================
DROP TABLE IF EXISTS offerings;
CREATE TABLE offerings (
  id CHAR(36) PRIMARY KEY,
  member_id CHAR(36) NOT NULL,
  member_name VARCHAR(100) NOT NULL COMMENT 'Denormalized for quick access',
  member_code VARCHAR(20) NOT NULL COMMENT 'Denormalized for quick access',
  date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  offer_type VARCHAR(50) NOT NULL COMMENT 'Tithe, Thanksgiving, Building Fund, Mission, etc.',
  payment_mode ENUM('Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card') NOT NULL,
  cheque_number VARCHAR(50) NULL COMMENT 'If payment mode is Cheque',
  transaction_id VARCHAR(100) NULL COMMENT 'UPI/Bank Transfer reference',
  notes TEXT,
  receipt_number VARCHAR(50) UNIQUE COMMENT 'Generated receipt number',
  recorded_by CHAR(36) NOT NULL COMMENT 'Admin user ID who recorded',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_member_id (member_id),
  INDEX idx_date (date),
  INDEX idx_offer_type (offer_type),
  INDEX idx_payment_mode (payment_mode),
  INDEX idx_member_date (member_id, date),
  INDEX idx_receipt_number (receipt_number),
  INDEX idx_offerings_member_date_amount (member_id, date, amount),
  INDEX idx_offerings_date_type (date, offer_type),
  
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES admin_users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Member offerings and contributions';

-- ============================================================
-- Table: non_member_offerings
-- Description: Non-Member offerings and contributions
-- ============================================================
DROP TABLE IF EXISTS non_member_offerings;
CREATE TABLE non_member_offerings (
  id char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  donor_name varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name of the non-member donor',
  donor_mobile varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Contact number',
  donor_email varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Email address',
  donor_address text COLLATE utf8mb4_unicode_ci COMMENT 'Address details',
  date date NOT NULL COMMENT 'Offering date',
  amount decimal(10,2) NOT NULL COMMENT 'Offering amount',
  offer_type varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tithe, Thanksgiving, Building Fund, Mission, etc.',
  payment_mode enum('Cash','UPI','Bank Transfer','Cheque','Card') COLLATE utf8mb4_unicode_ci NOT NULL,
  cheque_number varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'If payment mode is Cheque',
  transaction_id varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'UPI/Bank Transfer reference',
  notes text COLLATE utf8mb4_unicode_ci COMMENT 'Additional notes',
  receipt_number varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Generated receipt number',
  recorded_by char(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Admin user ID who recorded',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY receipt_number (receipt_number),
  KEY idx_donor_name (donor_name),
  KEY idx_donor_mobile (donor_mobile),
  KEY idx_date (date),
  KEY idx_offer_type (offer_type),
  KEY idx_payment_mode (payment_mode),
  KEY idx_date_type (date,offer_type),
  KEY recorded_by (recorded_by),
  CONSTRAINT non_member_offerings_ibfk_1 FOREIGN KEY (recorded_by) REFERENCES admin_users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Non-member offerings and contributions';

-- ============================================================
-- Table: tickets
-- Description: Member support tickets/requests
-- ============================================================
DROP TABLE IF EXISTS tickets;
CREATE TABLE tickets (
  id CHAR(36) PRIMARY KEY,
  ticket_number VARCHAR(20) NOT NULL UNIQUE COMMENT 'Format: T001, T002, etc.',
  member_id CHAR(36) NOT NULL,
  member_name VARCHAR(100) NOT NULL COMMENT 'Denormalized',
  member_code VARCHAR(20) NOT NULL COMMENT 'Denormalized',
  category ENUM('Profile Update', 'Complaint', 'Suggestion', 'Query', 'Other') NOT NULL,
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('Open', 'In Progress', 'Resolved', 'Closed') NOT NULL DEFAULT 'Open',
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  admin_notes TEXT NULL,
  assigned_to CHAR(36) NULL COMMENT 'Admin user ID',
  created_date DATE NOT NULL,
  updated_date DATE NOT NULL,
  resolved_date DATE NULL,
  closed_date DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_ticket_number (ticket_number),
  INDEX idx_member_id (member_id),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_priority (priority),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_created_date (created_date),
  INDEX idx_tickets_member_status (member_id, status),
  
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Member support tickets and requests';

-- ============================================================
-- Table: ticket_history
-- Description: Audit trail for ticket changes
-- ============================================================
DROP TABLE IF EXISTS ticket_history;
CREATE TABLE ticket_history (
  id CHAR(36) PRIMARY KEY,
  ticket_id CHAR(36) NOT NULL,
  action VARCHAR(100) NOT NULL COMMENT 'Created, Status Changed, Updated, etc.',
  old_status VARCHAR(50) NULL,
  new_status VARCHAR(50) NULL,
  notes TEXT NULL,
  performed_by CHAR(36) NOT NULL COMMENT 'User ID (admin or member)',
  performed_by_type ENUM('admin', 'member') NOT NULL,
  performed_by_name VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_ticket_id (ticket_id),
  INDEX idx_created_at (created_at),
  
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Ticket change history and audit trail';

-- ============================================================
-- Table: sessions
-- Description: User session management for JWT refresh tokens
-- ============================================================
DROP TABLE IF EXISTS sessions;
CREATE TABLE sessions (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  user_type ENUM('admin', 'member') NOT NULL,
  refresh_token_hash CHAR(64) NOT NULL UNIQUE COMMENT 'SHA256 hash of refresh token',
  refresh_token TEXT COMMENT 'Full refresh token (optional storage)',
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_activity DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_refresh_token_hash (refresh_token_hash),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User sessions and refresh tokens';

-- ============================================================
-- Table: member_login_history
-- Description: Track member login attempts
-- ============================================================
DROP TABLE IF EXISTS member_login_history;
CREATE TABLE member_login_history (
  id CHAR(36) PRIMARY KEY,
  member_id CHAR(36) NULL,
  identifier VARCHAR(100) NOT NULL COMMENT 'Mobile or Member Code used',
  identifier_type ENUM('mobile', 'memberCode') NOT NULL,
  success TINYINT(1) NOT NULL COMMENT '1=Success, 0=Failed',
  ip_address VARCHAR(45),
  user_agent TEXT,
  failure_reason VARCHAR(200) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_member_id (member_id),
  INDEX idx_identifier (identifier),
  INDEX idx_created_at (created_at),
  INDEX idx_success (success),
  
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Member login history and security tracking';

-- ============================================================
-- Table: audit_logs
-- Description: Comprehensive audit trail for all admin actions
-- ============================================================
DROP TABLE IF EXISTS audit_logs;
CREATE TABLE audit_logs (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  user_type ENUM('admin', 'member') NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL COMMENT 'CREATE, UPDATE, DELETE, STATUS_CHANGE, etc.',
  entity_type VARCHAR(50) NOT NULL COMMENT 'member, offering, ticket, etc.',
  entity_id CHAR(36) NULL,
  entity_name VARCHAR(200) NULL,
  old_values JSON NULL COMMENT 'Previous values before update',
  new_values JSON NULL COMMENT 'New values after update',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_entity_type (entity_type),
  INDEX idx_entity_id (entity_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Audit trail for all system actions';

-- ============================================================
-- Views for Common Queries
-- ============================================================

-- View: Member Summary with offering statistics
CREATE OR REPLACE VIEW view_member_summary AS
SELECT 
  m.id,
  m.member_code,
  m.name,
  m.mobile,
  m.occupation,
  m.member_status,
  m.registration_date,
  m.date_of_birth,
  TIMESTAMPDIFF(YEAR, m.date_of_birth, CURDATE()) as age,
  COUNT(o.id) as total_offerings,
  COALESCE(SUM(o.amount), 0) as total_contributions,
  COALESCE(AVG(o.amount), 0) as average_contribution,
  MAX(o.date) as last_offering_date
FROM members m
LEFT JOIN offerings o ON m.id = o.member_id
GROUP BY m.id, m.member_code, m.name, m.mobile, m.occupation, 
         m.member_status, m.registration_date, m.date_of_birth;

-- View: Monthly Offering Summary
CREATE OR REPLACE VIEW view_monthly_offerings AS
SELECT 
  DATE_FORMAT(date, '%Y-%m') as month,
  offer_type,
  payment_mode,
  COUNT(*) as total_offerings,
  SUM(amount) as total_amount,
  AVG(amount) as average_amount
FROM offerings
GROUP BY DATE_FORMAT(date, '%Y-%m'), offer_type, payment_mode
ORDER BY month DESC;

-- View: Ticket Statistics
CREATE OR REPLACE VIEW view_ticket_statistics AS
SELECT 
  status,
  category,
  priority,
  COUNT(*) as count,
  AVG(DATEDIFF(COALESCE(resolved_date, CURDATE()), created_date)) as avg_resolution_days
FROM tickets
GROUP BY status, category, priority;

-- View: Upcoming Birthdays (next 30 days)
CREATE OR REPLACE VIEW view_upcoming_birthdays AS
SELECT 
  id,
  member_code,
  name,
  date_of_birth,
  mobile,
  TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) as age,
  DATE_FORMAT(date_of_birth, '%M %d') as birthday,
  DATEDIFF(
    DATE_ADD(date_of_birth, INTERVAL (YEAR(CURDATE()) - YEAR(date_of_birth) + 
    IF(DAYOFYEAR(date_of_birth) < DAYOFYEAR(CURDATE()), 1, 0)) YEAR),
    CURDATE()
  ) as days_until_birthday
FROM members
WHERE member_status = 'confirmed'
HAVING days_until_birthday BETWEEN 0 AND 30
ORDER BY days_until_birthday;

-- ============================================================
-- Insert Default Admin User
-- Username: admin
-- Password: admin123 (hashed)
-- ============================================================
INSERT INTO admin_users (
  id,
  username,
  password,
  role,
  name,
  email,
  mobile,
  is_active
) VALUES (
  'a83bf033-c9cc-11f0-8918-5c879c7eebc7', -- Fixed UUID
  'admin',
  '$2y$10$YourBcryptHashHere', -- Replace with actual bcrypt hash of 'admin123'
  'super_admin',
  'System Administrator',
  'admin@lutheranchurch.org',
  '9999999999',
  1
);
