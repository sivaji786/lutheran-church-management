-- Lutheran Church Management System
-- Seed Data (Demo Data)
-- Run this after schema.sql

-- This file contains minimal seed data for testing
-- The admin user and one demo member

-- ============================================================================
-- Clear existing data (in reverse order of foreign key dependencies)
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `member_login_history`;
TRUNCATE TABLE `sessions`;
TRUNCATE TABLE `audit_logs`;
TRUNCATE TABLE `ticket_history`;
TRUNCATE TABLE `tickets`;
TRUNCATE TABLE `offerings`;
TRUNCATE TABLE `members`;
TRUNCATE TABLE `admin_users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- Insert Default Admin User
-- ============================================================================
-- Username: admin
-- Password: admin123 (hashed with bcrypt)
INSERT INTO `admin_users` (`id`, `username`, `password`, `role`, `name`, `email`, `mobile`, `is_active`) VALUES
('a83bf033-c9cc-11f0-8918-5c879c7eebc7', 'admin', '$2y$10$eyb6yNDZe/ISh/dt6EOa0egCmy1lj03n.mOn9Koj5VRN/Qoz/pzt2', 'super_admin', 'System Administrator', 'admin@lutheranchurch.org', '9999999999', 1);

-- ============================================================================
-- Insert Demo Member
-- ============================================================================
-- Member Code: LCH001
-- Password: member123 (hashed with bcrypt)
INSERT INTO `members` (`id`, `member_code`, `name`, `occupation`, `date_of_birth`, `baptism_status`, `confirmation_status`, `marital_status`, `residential_status`, `aadhar_number`, `mobile`, `address`, `area`, `ward`, `remarks`, `member_status`, `password`, `registration_date`) VALUES
('1', 'LCH001', 'John Emmanuel', 'Software Engineer', '1990-05-15', 1, 1, 1, 1, '1234-5678-9012', '9876543210', '123 Main Street', 'City Center', 'Ward 1', 'Active member, regular attendee', 'confirmed', '$2y$10$Eb7ZA4bhH/4VWW1IROU6AeSqbAmM6pZI1TlqBZqFnGg8go4qK04n6', '2024-01-15');

-- ============================================================================
-- Insert Demo Offerings
-- ============================================================================
INSERT INTO `offerings` (`id`, `member_id`, `member_name`, `member_code`, `date`, `amount`, `offer_type`, `payment_mode`, `receipt_number`, `recorded_by`) VALUES
('a83faf28-c9cc-11f0-8918-5c879c7eebc7', '1', 'John Emmanuel', 'LCH001', '2024-11-10', 5000.00, 'Tithe', 'Cash', 'REC001', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7'),
('a83fba5e-c9cc-11f0-8918-5c879c7eebc7', '1', 'John Emmanuel', 'LCH001', '2024-11-03', 2000.00, 'Thanksgiving', 'UPI', 'REC002', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7');

-- ============================================================================
-- Insert Demo Tickets
-- ============================================================================
INSERT INTO `tickets` (`id`, `ticket_number`, `member_id`, `member_name`, `member_code`, `category`, `subject`, `description`, `status`, `priority`, `created_date`, `updated_date`) VALUES
('a8409b61-c9cc-11f0-8918-5c879c7eebc7', 'T001', '1', 'John Emmanuel', 'LCH001', 'Profile Update', 'Update Address', 'Please update my address to 123 New Street, New City.', 'Open', 'medium', '2024-11-01', '2024-11-01');

-- ============================================================================
-- Seed Data Complete
-- ============================================================================

-- Summary:
-- - 1 Admin user (username: admin, password: admin123)
-- - 1 Demo member (member_code: LCH001, password: member123)
-- - 2 Demo offerings
-- - 1 Demo ticket

-- You can now login with:
-- Admin: username = admin, password = admin123
-- Member: member_code = LCH001, password = member123
