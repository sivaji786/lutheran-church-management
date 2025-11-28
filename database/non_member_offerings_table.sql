-- Non-Member Offerings Table
-- Lutheran Church Management System
-- Created: 2025-11-28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ============================================================================
-- TABLE: non_member_offerings
-- ============================================================================

CREATE TABLE IF NOT EXISTS `non_member_offerings` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `donor_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name of the non-member donor',
  `donor_mobile` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Contact number',
  `donor_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Email address',
  `donor_address` text COLLATE utf8mb4_unicode_ci COMMENT 'Address details',
  `date` date NOT NULL COMMENT 'Offering date',
  `amount` decimal(10,2) NOT NULL COMMENT 'Offering amount',
  `offer_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tithe, Thanksgiving, Building Fund, Mission, etc.',
  `payment_mode` enum('Cash','UPI','Bank Transfer','Cheque','Card') COLLATE utf8mb4_unicode_ci NOT NULL,
  `cheque_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'If payment mode is Cheque',
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'UPI/Bank Transfer reference',
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Additional notes',
  `receipt_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Generated receipt number',
  `recorded_by` char(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Admin user ID who recorded',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `receipt_number` (`receipt_number`),
  KEY `idx_donor_name` (`donor_name`),
  KEY `idx_donor_mobile` (`donor_mobile`),
  KEY `idx_date` (`date`),
  KEY `idx_offer_type` (`offer_type`),
  KEY `idx_payment_mode` (`payment_mode`),
  KEY `idx_date_type` (`date`,`offer_type`),
  KEY `recorded_by` (`recorded_by`),
  CONSTRAINT `non_member_offerings_ibfk_1` FOREIGN KEY (`recorded_by`) REFERENCES `admin_users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Non-member offerings and contributions';

-- ============================================================================
-- TRIGGER: Auto-generate UUID for new records
-- ============================================================================

DROP TRIGGER IF EXISTS `trg_before_insert_non_member_offerings`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_non_member_offerings` BEFORE INSERT ON `non_member_offerings` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- ============================================================================
-- STORED PROCEDURE: Non-Member Offering Statistics
-- ============================================================================

DROP PROCEDURE IF EXISTS `sp_non_member_offering_stats`;
DELIMITER $$
CREATE PROCEDURE `sp_non_member_offering_stats` ()
BEGIN
  -- Overall statistics
  SELECT 
    COUNT(*) as total_offerings,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount,
    SUM(CASE WHEN YEAR(date) = YEAR(CURDATE()) THEN amount ELSE 0 END) as this_year_total,
    SUM(CASE WHEN YEAR(date) = YEAR(CURDATE()) AND MONTH(date) = MONTH(CURDATE()) THEN amount ELSE 0 END) as this_month_total,
    MIN(date) as first_offering_date,
    MAX(date) as last_offering_date
  FROM non_member_offerings;
  
  -- Breakdown by offer type
  SELECT 
    offer_type,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount
  FROM non_member_offerings
  GROUP BY offer_type
  ORDER BY total_amount DESC;
  
  -- Breakdown by payment mode
  SELECT 
    payment_mode,
    COUNT(*) as count,
    SUM(amount) as total_amount
  FROM non_member_offerings
  GROUP BY payment_mode
  ORDER BY total_amount DESC;
END$$
DELIMITER ;
