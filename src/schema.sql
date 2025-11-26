-- ============================================================
-- Lutheran Church Management System - MySQL Database Schema
-- Version: 1.1 (MySQL Compatible)
-- Database: MySQL 5.7+ / MySQL 8.0+
-- Requirements:
--   - InnoDB engine with FULLTEXT support (MySQL 5.6+)
--   - Event Scheduler enabled: SET GLOBAL event_scheduler = ON;
--   - User must have TRIGGER, EVENT, and CREATE ROUTINE privileges
-- ============================================================

-- Set SQL mode for compatibility
SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- Drop existing objects if they exist (in reverse order of dependencies)
DROP EVENT IF EXISTS evt_cleanup_expired_sessions;
DROP TRIGGER IF EXISTS trg_ticket_status_change;
DROP TRIGGER IF EXISTS trg_before_insert_audit_logs;
DROP TRIGGER IF EXISTS trg_before_insert_member_login_history;
DROP TRIGGER IF EXISTS trg_before_insert_sessions;
DROP TRIGGER IF EXISTS trg_before_insert_ticket_history;
DROP TRIGGER IF EXISTS trg_before_insert_tickets;
DROP TRIGGER IF EXISTS trg_before_insert_offerings;
DROP TRIGGER IF EXISTS trg_before_insert_members;
DROP TRIGGER IF EXISTS trg_before_insert_admin_users;

DROP PROCEDURE IF EXISTS sp_dashboard_stats;
DROP PROCEDURE IF EXISTS sp_member_offering_stats;
DROP PROCEDURE IF EXISTS sp_generate_ticket_number;
DROP PROCEDURE IF EXISTS sp_generate_member_code;

DROP VIEW IF EXISTS view_upcoming_birthdays;
DROP VIEW IF EXISTS view_ticket_statistics;
DROP VIEW IF EXISTS view_monthly_offerings;
DROP VIEW IF EXISTS view_member_summary;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS ticket_history;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS offerings;
DROP TABLE IF EXISTS member_login_history;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS admin_users;

-- ============================================================
-- Table: admin_users
-- Description: Stores admin user accounts who manage the system
-- ============================================================
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
-- Note: age is removed as generated column (computed in views instead)
-- ============================================================
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
  
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES admin_users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Member offerings and contributions';

-- ============================================================
-- Table: tickets
-- Description: Member support tickets/requests
-- ============================================================
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
  
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Member support tickets and requests';

-- ============================================================
-- Table: ticket_history
-- Description: Audit trail for ticket changes
-- ============================================================
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
-- Note: Using hash-based approach for long tokens
-- ============================================================
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
-- UUID Generation Triggers
-- Description: Auto-generate UUIDs for all tables before insert
-- ============================================================

DELIMITER //

CREATE TRIGGER trg_before_insert_admin_users
BEFORE INSERT ON admin_users
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//

CREATE TRIGGER trg_before_insert_members
BEFORE INSERT ON members
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//

CREATE TRIGGER trg_before_insert_offerings
BEFORE INSERT ON offerings
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//

CREATE TRIGGER trg_before_insert_tickets
BEFORE INSERT ON tickets
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//

CREATE TRIGGER trg_before_insert_ticket_history
BEFORE INSERT ON ticket_history
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//

CREATE TRIGGER trg_before_insert_sessions
BEFORE INSERT ON sessions
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//

CREATE TRIGGER trg_before_insert_member_login_history
BEFORE INSERT ON member_login_history
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//

CREATE TRIGGER trg_before_insert_audit_logs
BEFORE INSERT ON audit_logs
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//

DELIMITER ;

-- ============================================================
-- Insert Default Admin User
-- Username: admin
-- Password: admin123 (bcrypt hash below)
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
  UUID(),
  'admin',
  '$2a$10$YourBcryptHashHere', -- Replace with actual bcrypt hash of 'admin123'
  'super_admin',
  'System Administrator',
  'admin@lutheranchurch.org',
  '9999999999',
  1
);

-- ============================================================
-- Insert Sample Members
-- Password for all: member123 (hash: $2a$10$YourBcryptHashHere)
-- ============================================================
INSERT INTO members (
  id,
  member_code,
  name,
  occupation,
  date_of_birth,
  baptism_status,
  confirmation_status,
  marital_status,
  residential_status,
  aadhar_number,
  mobile,
  address,
  area,
  ward,
  remarks,
  member_status,
  password,
  registration_date
) VALUES 
(
  '1',
  'LCH001',
  'John Emmanuel',
  'Software Engineer',
  '1990-05-15',
  1,
  1,
  1,
  1,
  '1234-5678-9012',
  '9876543210',
  '123 Main Street',
  'City Center',
  'Ward 1',
  'Active member, regular attendee',
  'confirmed',
  '$2a$10$YourBcryptHashHere', -- Replace with actual hash
  '2024-01-15'
),
(
  '2',
  'LCH002',
  'Sarah David',
  'Teacher',
  '1985-08-22',
  1,
  1,
  0,
  1,
  '2345-6789-0123',
  '9876543211',
  '456 Park Avenue',
  'Suburbia',
  'Ward 2',
  'New member',
  'unconfirmed',
  '$2a$10$YourBcryptHashHere', -- Replace with actual hash
  '2024-10-01'
);

-- ============================================================
-- Insert Sample Offerings
-- ============================================================
INSERT INTO offerings (
  id,
  member_id,
  member_name,
  member_code,
  date,
  amount,
  offer_type,
  payment_mode,
  receipt_number,
  recorded_by
) VALUES 
(
  UUID(),
  '1',
  'John Emmanuel',
  'LCH001',
  '2024-11-10',
  5000.00,
  'Tithe',
  'Cash',
  'REC001',
  (SELECT id FROM admin_users WHERE username = 'admin' LIMIT 1)
),
(
  UUID(),
  '1',
  'John Emmanuel',
  'LCH001',
  '2024-11-03',
  2000.00,
  'Thanksgiving',
  'UPI',
  'REC002',
  (SELECT id FROM admin_users WHERE username = 'admin' LIMIT 1)
),
(
  UUID(),
  '2',
  'Sarah David',
  'LCH002',
  '2024-11-10',
  3000.00,
  'Tithe',
  'Bank Transfer',
  'REC003',
  (SELECT id FROM admin_users WHERE username = 'admin' LIMIT 1)
);

-- ============================================================
-- Insert Sample Tickets
-- ============================================================
INSERT INTO tickets (
  id,
  ticket_number,
  member_id,
  member_name,
  member_code,
  category,
  subject,
  description,
  status,
  priority,
  created_date,
  updated_date
) VALUES 
(
  UUID(),
  'T001',
  '1',
  'John Emmanuel',
  'LCH001',
  'Profile Update',
  'Update Address',
  'Please update my address to 123 New Street, New City.',
  'Open',
  'medium',
  '2024-11-01',
  '2024-11-01'
),
(
  UUID(),
  'T002',
  '2',
  'Sarah David',
  'LCH002',
  'Suggestion',
  'New Ministry',
  'Suggest starting a new ministry for children.',
  'In Progress',
  'low',
  '2024-11-03',
  '2024-11-03'
);

-- ============================================================
-- Views for Common Queries
-- Note: Age computed dynamically using TIMESTAMPDIFF
-- ============================================================

-- View: Member Summary with offering statistics
-- Note: All non-aggregated columns included in GROUP BY for ONLY_FULL_GROUP_BY compatibility
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
-- Stored Procedures
-- ============================================================

-- Procedure: Generate next member code
DELIMITER //
CREATE PROCEDURE sp_generate_member_code(OUT next_code VARCHAR(20))
BEGIN
  DECLARE last_number INT;
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(member_code, 4) AS UNSIGNED)), 0) INTO last_number
  FROM members
  WHERE member_code LIKE 'LCH%';
  
  SET last_number = last_number + 1;
  SET next_code = CONCAT('LCH', LPAD(last_number, 3, '0'));
END //
DELIMITER ;

-- Procedure: Generate next ticket number
DELIMITER //
CREATE PROCEDURE sp_generate_ticket_number(OUT next_ticket VARCHAR(20))
BEGIN
  DECLARE last_number INT;
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number, 2) AS UNSIGNED)), 0) INTO last_number
  FROM tickets
  WHERE ticket_number LIKE 'T%';
  
  SET last_number = last_number + 1;
  SET next_ticket = CONCAT('T', LPAD(last_number, 3, '0'));
END //
DELIMITER ;

-- Procedure: Get member offering statistics
DELIMITER //
CREATE PROCEDURE sp_member_offering_stats(IN p_member_id CHAR(36))
BEGIN
  SELECT 
    COUNT(*) as total_offerings,
    SUM(amount) as total_contributions,
    AVG(amount) as average_contribution,
    MIN(date) as first_offering_date,
    MAX(date) as last_offering_date,
    SUM(CASE WHEN YEAR(date) = YEAR(CURDATE()) THEN amount ELSE 0 END) as this_year_total,
    SUM(CASE WHEN YEAR(date) = YEAR(CURDATE()) AND MONTH(date) = MONTH(CURDATE()) THEN amount ELSE 0 END) as this_month_total
  FROM offerings
  WHERE member_id = p_member_id;
  
  -- Offering by type breakdown
  SELECT 
    offer_type,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount
  FROM offerings
  WHERE member_id = p_member_id
  GROUP BY offer_type;
END //
DELIMITER ;

-- Procedure: Get dashboard statistics
DELIMITER //
CREATE PROCEDURE sp_dashboard_stats()
BEGIN
  -- Member statistics
  SELECT 
    COUNT(*) as total_members,
    SUM(CASE WHEN member_status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_members,
    SUM(CASE WHEN member_status = 'unconfirmed' THEN 1 ELSE 0 END) as unconfirmed_members,
    SUM(CASE WHEN member_status = 'suspended' THEN 1 ELSE 0 END) as suspended_members,
    SUM(CASE WHEN YEAR(registration_date) = YEAR(CURDATE()) AND MONTH(registration_date) = MONTH(CURDATE()) THEN 1 ELSE 0 END) as new_this_month
  FROM members;
  
  -- Offering statistics
  SELECT 
    COUNT(*) as total_offerings,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount,
    SUM(CASE WHEN YEAR(date) = YEAR(CURDATE()) THEN amount ELSE 0 END) as this_year_total,
    SUM(CASE WHEN YEAR(date) = YEAR(CURDATE()) AND MONTH(date) = MONTH(CURDATE()) THEN amount ELSE 0 END) as this_month_total
  FROM offerings;
  
  -- Ticket statistics
  SELECT 
    COUNT(*) as total_tickets,
    SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open_tickets,
    SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tickets,
    SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved_tickets,
    SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) as closed_tickets
  FROM tickets;
END //
DELIMITER ;

-- ============================================================
-- Triggers for Business Logic
-- ============================================================

-- Trigger: Auto-update ticket history on status change
DELIMITER //
CREATE TRIGGER trg_ticket_status_change
AFTER UPDATE ON tickets
FOR EACH ROW
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO ticket_history (
      id,
      ticket_id,
      action,
      old_status,
      new_status,
      performed_by,
      performed_by_type,
      performed_by_name
    ) VALUES (
      UUID(),
      NEW.id,
      'Status Changed',
      OLD.status,
      NEW.status,
      COALESCE(NEW.assigned_to, '00000000-0000-0000-0000-000000000000'),
      'admin',
      'System'
    );
  END IF;
END //
DELIMITER ;

-- ============================================================
-- Scheduled Events
-- Description: Cleanup expired sessions hourly
-- Requirement: Event scheduler must be enabled
--   SET GLOBAL event_scheduler = ON;
-- ============================================================
DELIMITER //
CREATE EVENT evt_cleanup_expired_sessions
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
END //
DELIMITER ;

-- ============================================================
-- Indexes for Performance Optimization
-- ============================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_offerings_member_date_amount ON offerings(member_id, date, amount);
CREATE INDEX idx_offerings_date_type ON offerings(date, offer_type);
CREATE INDEX idx_tickets_member_status ON tickets(member_id, status);
CREATE INDEX idx_members_status_registration ON members(member_status, registration_date);

-- Full-text search indexes (Requires MySQL 5.6+ with InnoDB)
ALTER TABLE members ADD FULLTEXT INDEX ft_member_search (name, occupation, address);
ALTER TABLE tickets ADD FULLTEXT INDEX ft_ticket_search (subject, description);

-- ============================================================
-- Grant Permissions (Adjust as needed)
-- ============================================================
-- Example user creation and permissions:
-- CREATE USER 'church_app'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON lutheran_church.* TO 'church_app'@'localhost';
-- GRANT TRIGGER, CREATE ROUTINE, ALTER ROUTINE, EXECUTE ON lutheran_church.* TO 'church_app'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================================
-- Database Information
-- ============================================================
SELECT 'Lutheran Church Management System Database Created Successfully!' as Status;
SELECT VERSION() as MySQL_Version;
SELECT COUNT(*) as admin_users_count FROM admin_users;
SELECT COUNT(*) as members_count FROM members;
SELECT COUNT(*) as offerings_count FROM offerings;
SELECT COUNT(*) as tickets_count FROM tickets;

-- ============================================================
-- Important Notes:
-- ============================================================
-- 1. UUID Generation: All tables use CHAR(36) for IDs with BEFORE INSERT triggers
-- 2. BOOLEAN: All boolean fields changed to TINYINT(1) with 0/1 values
-- 3. Age Calculation: Removed generated column, computed in views using TIMESTAMPDIFF
-- 4. Refresh Token: Using SHA256 hash (refresh_token_hash) for indexing, full token stored as TEXT
-- 5. Views: All GROUP BY clauses comply with ONLY_FULL_GROUP_BY mode
-- 6. Foreign Keys: All use CHAR(36) for consistency
-- 7. Event Scheduler: Must be enabled manually with: SET GLOBAL event_scheduler = ON;
-- 8. Fulltext Indexes: Requires MySQL 5.6+ with InnoDB support
-- 9. Replace '$2a$10$YourBcryptHashHere' with actual bcrypt hashes before production use
-- 10. Application layer should hash refresh tokens using SHA256 before storage/lookup
-- ============================================================
