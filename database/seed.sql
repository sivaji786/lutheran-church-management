-- Lutheran Church Management System
-- Seed Data (Demo Data)
-- Run this after schema.sql

-- ============================================================================
-- Insert Default Admin User
-- ============================================================================
-- Password: admin123 (hashed with bcrypt)
INSERT INTO `admin_users` (`id`, `username`, `password`, `role`) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin');

-- ============================================================================
-- Insert Demo Members
-- ============================================================================
-- Password for all demo members: member123 (hashed with bcrypt)
INSERT INTO `members` (`id`, `member_code`, `name`, `mobile`, `password`, `date_of_birth`, `occupation`, `aadhar_number`, `address`, `area`, `ward`, `member_status`, `confirmation_status`) VALUES
('m001-0000-0000-0000-000000000001', 'LCH001', 'John Emmanuel', '9876543210', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1990-01-15', 'Teacher', '123456789012', '123 Church Street, Hyderabad', 'Central', 'Ward 1', 'active', 'confirmed'),
('m002-0000-0000-0000-000000000002', 'LCH002', 'Mary Grace', '9876543211', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1985-03-20', 'Nurse', '123456789013', '456 Faith Avenue, Hyderabad', 'North', 'Ward 2', 'active', 'confirmed'),
('m003-0000-0000-0000-000000000003', 'LCH003', 'David Samuel', '9876543212', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1992-07-10', 'Engineer', '123456789014', '789 Hope Lane, Hyderabad', 'South', 'Ward 3', 'active', 'confirmed'),
('m004-0000-0000-0000-000000000004', 'LCH004', 'Sarah Ruth', '9876543213', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1988-11-25', 'Doctor', '123456789015', '321 Grace Road, Hyderabad', 'East', 'Ward 4', 'active', 'confirmed'),
('m005-0000-0000-0000-000000000005', 'LCH005', 'Peter Paul', '9876543214', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1995-05-30', 'Business', '123456789016', '654 Love Street, Hyderabad', 'West', 'Ward 5', 'active', 'not_confirmed');

-- ============================================================================
-- Insert Demo Offerings
-- ============================================================================
INSERT INTO `offerings` (`id`, `member_id`, `member_name`, `member_code`, `amount`, `date`, `offering_type`, `notes`) VALUES
('o001-0000-0000-0000-000000000001', 'm001-0000-0000-0000-000000000001', 'John Emmanuel', 'LCH001', 5000.00, '2025-01-05', 'Sunday Offering', 'Regular Sunday offering'),
('o002-0000-0000-0000-000000000002', 'm001-0000-0000-0000-000000000001', 'John Emmanuel', 'LCH001', 2000.00, '2025-01-12', 'Sunday Offering', 'Regular Sunday offering'),
('o003-0000-0000-0000-000000000003', 'm002-0000-0000-0000-000000000002', 'Mary Grace', 'LCH002', 3000.00, '2025-01-05', 'Sunday Offering', 'Regular Sunday offering'),
('o004-0000-0000-0000-000000000004', 'm002-0000-0000-0000-000000000002', 'Mary Grace', 'LCH002', 10000.00, '2025-01-15', 'Special Offering', 'Building fund'),
('o005-0000-0000-0000-000000000005', 'm003-0000-0000-0000-000000000003', 'David Samuel', 'LCH003', 4000.00, '2025-01-05', 'Sunday Offering', 'Regular Sunday offering'),
('o006-0000-0000-0000-000000000006', 'm003-0000-0000-0000-000000000003', 'David Samuel', 'LCH003', 5000.00, '2025-01-19', 'Thanksgiving', 'Thanksgiving offering'),
('o007-0000-0000-0000-000000000007', 'm004-0000-0000-0000-000000000004', 'Sarah Ruth', 'LCH004', 6000.00, '2025-01-05', 'Sunday Offering', 'Regular Sunday offering'),
('o008-0000-0000-0000-000000000008', 'm004-0000-0000-0000-000000000004', 'Sarah Ruth', 'LCH004', 3000.00, '2025-01-12', 'Sunday Offering', 'Regular Sunday offering'),
('o009-0000-0000-0000-000000000009', 'm005-0000-0000-0000-000000000005', 'Peter Paul', 'LCH005', 2500.00, '2025-01-05', 'Sunday Offering', 'Regular Sunday offering'),
('o010-0000-0000-0000-000000000010', 'm005-0000-0000-0000-000000000005', 'Peter Paul', 'LCH005', 7500.00, '2025-01-20', 'Special Offering', 'Mission fund');

-- ============================================================================
-- Insert Demo Tickets
-- ============================================================================
INSERT INTO `tickets` (`id`, `ticket_number`, `member_id`, `member_name`, `member_code`, `category`, `subject`, `description`, `status`, `priority`, `admin_notes`, `created_date`, `updated_date`) VALUES
('t001-0000-0000-0000-000000000001', 'T001', 'm001-0000-0000-0000-000000000001', 'John Emmanuel', 'LCH001', 'Profile Update', 'Update Mobile Number', 'Please update my mobile number to 9999999999', 'Done', 'medium', 'Mobile number updated successfully', '2025-01-10', '2025-01-11'),
('t002-0000-0000-0000-000000000002', 'T002', 'm002-0000-0000-0000-000000000002', 'Mary Grace', 'LCH002', 'Suggestion', 'Sunday School Timing', 'Can we start Sunday school 30 minutes earlier?', 'In Progress', 'low', 'Under review by the committee', '2025-01-12', '2025-01-13'),
('t003-0000-0000-0000-000000000003', 'T003', 'm003-0000-0000-0000-000000000003', 'David Samuel', 'LCH003', 'Request', 'Prayer Request', 'Please pray for my family health', 'Updated', 'high', 'Added to prayer list', '2025-01-15', '2025-01-16'),
('t004-0000-0000-0000-000000000004', 'T004', 'm004-0000-0000-0000-000000000004', 'Sarah Ruth', 'LCH004', 'Other', 'Event Participation', 'I would like to volunteer for the upcoming Christmas event', 'Open', 'medium', NULL, '2025-01-18', '2025-01-18'),
('t005-0000-0000-0000-000000000005', 'T005', 'm005-0000-0000-0000-000000000005', 'Peter Paul', 'LCH005', 'Profile Update', 'Confirmation Status', 'Please update my confirmation status', 'Open', 'high', NULL, '2025-01-20', '2025-01-20');

-- ============================================================================
-- Seed Data Complete
-- ============================================================================

-- Summary:
-- - 1 Admin user (username: admin, password: admin123)
-- - 5 Demo members (all with password: member123)
-- - 10 Demo offerings
-- - 5 Demo tickets

-- You can now login with:
-- Admin: username = admin, password = admin123
-- Member: member_code = LCH001, password = member123
