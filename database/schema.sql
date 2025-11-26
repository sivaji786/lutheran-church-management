-- Lutheran Church Management System
-- Database Schema
-- MySQL 8.0+

-- Create database (run separately if needed)
-- CREATE DATABASE IF NOT EXISTS lutheran_church CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE lutheran_church;

-- ============================================================================
-- Admin Users Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'admin') DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Members Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS `members` (
  `id` CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `member_code` VARCHAR(20) UNIQUE NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `mobile` VARCHAR(15) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `date_of_birth` DATE,
  `occupation` VARCHAR(100),
  `aadhar_number` VARCHAR(12),
  `address` TEXT,
  `area` VARCHAR(100),
  `ward` VARCHAR(50),
  `member_status` ENUM('active', 'inactive') DEFAULT 'active',
  `confirmation_status` ENUM('confirmed', 'not_confirmed') DEFAULT 'not_confirmed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_member_code` (`member_code`),
  INDEX `idx_mobile` (`mobile`),
  INDEX `idx_area` (`area`),
  INDEX `idx_ward` (`ward`),
  INDEX `idx_member_status` (`member_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Offerings Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS `offerings` (
  `id` CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `member_id` CHAR(36) NOT NULL,
  `member_name` VARCHAR(100) NOT NULL,
  `member_code` VARCHAR(20) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `date` DATE NOT NULL,
  `offering_type` VARCHAR(50),
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE,
  INDEX `idx_member_id` (`member_id`),
  INDEX `idx_date` (`date`),
  INDEX `idx_offering_type` (`offering_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Tickets Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `ticket_number` VARCHAR(20) UNIQUE NOT NULL,
  `member_id` CHAR(36) NOT NULL,
  `member_name` VARCHAR(100) NOT NULL,
  `member_code` VARCHAR(20) NOT NULL,
  `category` ENUM('Profile Update', 'Suggestion', 'Request', 'Other') NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('Open', 'In Progress', 'Updated', 'Done') DEFAULT 'Open',
  `priority` ENUM('low', 'medium', 'high') DEFAULT 'medium',
  `admin_notes` TEXT,
  `assigned_to` CHAR(36),
  `created_date` DATE NOT NULL,
  `updated_date` DATE NOT NULL,
  `resolved_date` DATE,
  `closed_date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE,
  INDEX `idx_member_id` (`member_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_priority` (`priority`),
  INDEX `idx_ticket_number` (`ticket_number`),
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Stored Procedure for Ticket Number Generation
-- ============================================================================
DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_generate_ticket_number`$$

CREATE PROCEDURE `sp_generate_ticket_number`(OUT next_ticket VARCHAR(20))
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

-- ============================================================================
-- Trigger to auto-generate ticket number
-- ============================================================================
DELIMITER $$

DROP TRIGGER IF EXISTS `before_ticket_insert`$$

CREATE TRIGGER `before_ticket_insert`
BEFORE INSERT ON `tickets`
FOR EACH ROW
BEGIN
    DECLARE next_num INT;
    
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number, 2) AS UNSIGNED)), 0) + 1 INTO next_num
        FROM tickets;
        
        SET NEW.ticket_number = CONCAT('T', LPAD(next_num, 3, '0'));
    END IF;
    
    IF NEW.created_date IS NULL THEN
        SET NEW.created_date = CURDATE();
    END IF;
    
    IF NEW.updated_date IS NULL THEN
        SET NEW.updated_date = CURDATE();
    END IF;
END$$

DELIMITER ;

-- ============================================================================
-- Schema Complete
-- ============================================================================
