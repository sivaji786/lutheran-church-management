-- ============================================================================
-- Lutheran Church Management System
-- Optional Triggers for Production Environment
-- 
-- IMPORTANT: These triggers require your hosting provider to enable
-- 'log_bin_trust_function_creators' variable.
-- 
-- Contact your hosting support and ask them to run:
-- SET GLOBAL log_bin_trust_function_creators = 1;
-- 
-- After they enable it, you can run this file via phpMyAdmin or MySQL CLI
-- ============================================================================

-- Use your database
USE `c30082_018_churchrm`;

-- ============================================================================
-- UUID Auto-Generation Triggers
-- ============================================================================

-- Drop existing triggers if any
DROP TRIGGER IF EXISTS `trg_before_insert_admin_users`;
DROP TRIGGER IF EXISTS `trg_before_insert_members`;
DROP TRIGGER IF EXISTS `trg_before_insert_offerings`;
DROP TRIGGER IF EXISTS `trg_before_insert_non_member_offerings`;
DROP TRIGGER IF EXISTS `trg_before_insert_tickets`;
DROP TRIGGER IF EXISTS `trg_before_insert_ticket_history`;
DROP TRIGGER IF EXISTS `trg_before_insert_audit_logs`;
DROP TRIGGER IF EXISTS `trg_before_insert_sessions`;
DROP TRIGGER IF EXISTS `trg_before_insert_member_login_history`;
DROP TRIGGER IF EXISTS `trg_ticket_status_change`;

-- Admin Users Trigger
DELIMITER $$
CREATE TRIGGER `trg_before_insert_admin_users` 
BEFORE INSERT ON `admin_users` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- Members Trigger
DELIMITER $$
CREATE TRIGGER `trg_before_insert_members` 
BEFORE INSERT ON `members` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- Offerings Trigger
DELIMITER $$
CREATE TRIGGER `trg_before_insert_offerings` 
BEFORE INSERT ON `offerings` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- Non-Member Offerings Trigger
DELIMITER $$
CREATE TRIGGER `trg_before_insert_non_member_offerings` 
BEFORE INSERT ON `non_member_offerings` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- Tickets Trigger
DELIMITER $$
CREATE TRIGGER `trg_before_insert_tickets` 
BEFORE INSERT ON `tickets` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- Ticket History Trigger
DELIMITER $$
CREATE TRIGGER `trg_before_insert_ticket_history` 
BEFORE INSERT ON `ticket_history` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- Audit Logs Trigger
DELIMITER $$
CREATE TRIGGER `trg_before_insert_audit_logs` 
BEFORE INSERT ON `audit_logs` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- Sessions Trigger
DELIMITER $$
CREATE TRIGGER `trg_before_insert_sessions` 
BEFORE INSERT ON `sessions` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- Member Login History Trigger
DELIMITER $$
CREATE TRIGGER `trg_before_insert_member_login_history` 
BEFORE INSERT ON `member_login_history` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END$$
DELIMITER ;

-- ============================================================================
-- Ticket Status Change Trigger
-- ============================================================================

DELIMITER $$
CREATE TRIGGER `trg_ticket_status_change` 
AFTER UPDATE ON `tickets` FOR EACH ROW
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
-- TRIGGERS CREATED SUCCESSFULLY
-- ============================================================================
-- Total: 10 triggers
-- - 9 UUID auto-generation triggers
-- - 1 ticket status change logging trigger
-- ============================================================================
