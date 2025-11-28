-- Lutheran Church Management System
-- Complete Database Schema
-- MySQL 8.0+
-- 
-- This is the EXACT schema from the working production database
-- Exported from: lutheran_church database

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lutheran_church`
--
CREATE DATABASE IF NOT EXISTS `lutheran_church` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `lutheran_church`;

-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_dashboard_stats`$$
CREATE PROCEDURE `sp_dashboard_stats` ()
BEGIN
  SELECT 
    COUNT(*) as total_members,
    SUM(CASE WHEN member_status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_members,
    SUM(CASE WHEN member_status = 'unconfirmed' THEN 1 ELSE 0 END) as unconfirmed_members,
    SUM(CASE WHEN member_status = 'suspended' THEN 1 ELSE 0 END) as suspended_members,
    SUM(CASE WHEN YEAR(registration_date) = YEAR(CURDATE()) AND MONTH(registration_date) = MONTH(CURDATE()) THEN 1 ELSE 0 END) as new_this_month
  FROM members;
END$$

DROP PROCEDURE IF EXISTS `sp_member_offering_stats`$$
CREATE PROCEDURE `sp_member_offering_stats` (IN `p_member_id` CHAR(36))
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
END$$

DELIMITER ;

-- ============================================================================
-- TABLE: admin_users
-- ============================================================================

DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Bcrypt hashed password',
  `role` enum('admin','super_admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1=Active, 0=Inactive',
  `last_login` datetime DEFAULT NULL,
  `password_changed_at` datetime DEFAULT NULL,
  `failed_login_attempts` int NOT NULL DEFAULT '0',
  `locked_until` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Admin users with system access';

DROP TRIGGER IF EXISTS `trg_before_insert_admin_users`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_admin_users` BEFORE INSERT ON `admin_users` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- ============================================================================
-- TABLE: members
-- ============================================================================

DROP TABLE IF EXISTS `members`;
CREATE TABLE `members` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Format: LCH001, LCH002, etc.',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `occupation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `baptism_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1=Baptized, 0=Not Baptized',
  `confirmation_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1=Confirmed, 0=Not Confirmed',
  `marital_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1=Married, 0=Unmarried',
  `residential_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1=Resident, 0=Non-Resident',
  `aadhar_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Encrypted in application layer',
  `mobile` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `area` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ward` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `member_status` enum('confirmed','unconfirmed','suspended') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unconfirmed',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Bcrypt hashed password',
  `registration_date` date NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `failed_login_attempts` int NOT NULL DEFAULT '0',
  `locked_until` datetime DEFAULT NULL,
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Admin user ID who created this member',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `member_code` (`member_code`),
  KEY `idx_member_code` (`member_code`),
  KEY `idx_mobile` (`mobile`),
  KEY `idx_name` (`name`),
  KEY `idx_member_status` (`member_status`),
  KEY `idx_registration_date` (`registration_date`),
  KEY `idx_date_of_birth` (`date_of_birth`),
  KEY `idx_area_ward` (`area`,`ward`),
  KEY `created_by` (`created_by`),
  KEY `idx_members_status_registration` (`member_status`,`registration_date`),
  FULLTEXT KEY `ft_member_search` (`name`,`occupation`,`address`),
  CONSTRAINT `members_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Church members database';

DROP TRIGGER IF EXISTS `trg_before_insert_members`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_members` BEFORE INSERT ON `members` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- ============================================================================
-- TABLE: offerings
-- ============================================================================

DROP TABLE IF EXISTS `offerings`;
CREATE TABLE `offerings` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Denormalized for quick access',
  `member_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Denormalized for quick access',
  `date` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `offer_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tithe, Thanksgiving, Building Fund, Mission, etc.',
  `payment_mode` enum('Cash','UPI','Bank Transfer','Cheque','Card') COLLATE utf8mb4_unicode_ci NOT NULL,
  `cheque_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'If payment mode is Cheque',
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'UPI/Bank Transfer reference',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `receipt_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Generated receipt number',
  `recorded_by` char(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Admin user ID who recorded',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `receipt_number` (`receipt_number`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_date` (`date`),
  KEY `idx_offer_type` (`offer_type`),
  KEY `idx_payment_mode` (`payment_mode`),
  KEY `idx_member_date` (`member_id`,`date`),
  KEY `idx_receipt_number` (`receipt_number`),
  KEY `recorded_by` (`recorded_by`),
  KEY `idx_offerings_member_date_amount` (`member_id`,`date`,`amount`),
  KEY `idx_offerings_date_type` (`date`,`offer_type`),
  CONSTRAINT `offerings_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
  CONSTRAINT `offerings_ibfk_2` FOREIGN KEY (`recorded_by`) REFERENCES `admin_users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Member offerings and contributions';

DROP TRIGGER IF EXISTS `trg_before_insert_offerings`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_offerings` BEFORE INSERT ON `offerings` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- ============================================================================
-- TABLE: tickets
-- ============================================================================

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ticket_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Format: T001, T002, etc.',
  `member_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Denormalized',
  `member_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Denormalized',
  `category` enum('Profile Update','Complaint','Suggestion','Query','Other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Open','In Progress','Resolved','Closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Open',
  `priority` enum('low','medium','high') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `assigned_to` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Admin user ID',
  `created_date` date NOT NULL,
  `updated_date` date NOT NULL,
  `resolved_date` date DEFAULT NULL,
  `closed_date` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_number` (`ticket_number`),
  KEY `idx_ticket_number` (`ticket_number`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_status` (`status`),
  KEY `idx_category` (`category`),
  KEY `idx_priority` (`priority`),
  KEY `idx_assigned_to` (`assigned_to`),
  KEY `idx_created_date` (`created_date`),
  KEY `idx_tickets_member_status` (`member_id`,`status`),
  FULLTEXT KEY `ft_ticket_search` (`subject`,`description`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4_unicode_ci COMMENT='Member support tickets and requests';

DROP TRIGGER IF EXISTS `trg_before_insert_tickets`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_tickets` BEFORE INSERT ON `tickets` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- ============================================================================
-- TABLE: ticket_history
-- ============================================================================

DROP TABLE IF EXISTS `ticket_history`;
CREATE TABLE `ticket_history` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ticket_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Created, Status Changed, Updated, etc.',
  `old_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `new_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `performed_by` char(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'User ID (admin or member)',
  `performed_by_type` enum('admin','member') COLLATE utf8mb4_unicode_ci NOT NULL,
  `performed_by_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ticket_id` (`ticket_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `ticket_history_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4_unicode_ci COMMENT='Ticket change history and audit trail';

DROP TRIGGER IF EXISTS `trg_before_insert_ticket_history`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_ticket_history` BEFORE INSERT ON `ticket_history` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS `trg_ticket_status_change`;
DELIMITER $$
CREATE TRIGGER `trg_ticket_status_change` AFTER UPDATE ON `tickets` FOR EACH ROW
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
END$$
DELIMITER ;

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================

COMMIT;
