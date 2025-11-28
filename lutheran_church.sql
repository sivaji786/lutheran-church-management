-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 26, 2025 at 11:23 AM
-- Server version: 8.0.44-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

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

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `sp_dashboard_stats`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_dashboard_stats` ()   BEGIN
  
  SELECT 
    COUNT(*) as total_members,
    SUM(CASE WHEN member_status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_members,
    SUM(CASE WHEN member_status = 'unconfirmed' THEN 1 ELSE 0 END) as unconfirmed_members,
    SUM(CASE WHEN member_status = 'suspended' THEN 1 ELSE 0 END) as suspended_members,
    SUM(CASE WHEN YEAR(registration_date) = YEAR(CURDATE()) AND MONTH(registration_date) = MONTH(CURDATE()) THEN 1 ELSE 0 END) as new_this_month
  FROM members$$

DROP PROCEDURE IF EXISTS `sp_generate_member_code`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_generate_member_code` (OUT `next_code` VARCHAR(20))   BEGIN
  DECLARE last_number INT$$

DROP PROCEDURE IF EXISTS `sp_generate_ticket_number`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_generate_ticket_number` (OUT `next_ticket` VARCHAR(20))   BEGIN
  DECLARE last_number INT$$

DROP PROCEDURE IF EXISTS `sp_member_offering_stats`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_member_offering_stats` (IN `p_member_id` CHAR(36))   BEGIN
  SELECT 
    COUNT(*) as total_offerings,
    SUM(amount) as total_contributions,
    AVG(amount) as average_contribution,
    MIN(date) as first_offering_date,
    MAX(date) as last_offering_date,
    SUM(CASE WHEN YEAR(date) = YEAR(CURDATE()) THEN amount ELSE 0 END) as this_year_total,
    SUM(CASE WHEN YEAR(date) = YEAR(CURDATE()) AND MONTH(date) = MONTH(CURDATE()) THEN amount ELSE 0 END) as this_month_total
  FROM offerings
  WHERE member_id = p_member_id$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE IF NOT EXISTS `admin_users` (
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

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password`, `role`, `name`, `email`, `mobile`, `is_active`, `last_login`, `password_changed_at`, `failed_login_attempts`, `locked_until`, `created_at`, `updated_at`) VALUES
('a83bf033-c9cc-11f0-8918-5c879c7eebc7', 'admin', '$2y$10$eyb6yNDZe/ISh/dt6EOa0egCmy1lj03n.mOn9Koj5VRN/Qoz/pzt2', 'super_admin', 'System Administrator', 'admin@lutheranchurch.org', '9999999999', 1, NULL, NULL, 0, NULL, '2025-11-25 12:32:08', '2025-11-25 12:35:04');

--
-- Triggers `admin_users`
--
DROP TRIGGER IF EXISTS `trg_before_insert_admin_users`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_admin_users` BEFORE INSERT ON `admin_users` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID()$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_type` enum('admin','member') COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'CREATE, UPDATE, DELETE, STATUS_CHANGE, etc.',
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'member, offering, ticket, etc.',
  `entity_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_values` json DEFAULT NULL COMMENT 'Previous values before update',
  `new_values` json DEFAULT NULL COMMENT 'New values after update',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_entity_type` (`entity_type`),
  KEY `idx_entity_id` (`entity_id`),
  KEY `idx_action` (`action`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Audit trail for all system actions';

--
-- Triggers `audit_logs`
--
DROP TRIGGER IF EXISTS `trg_before_insert_audit_logs`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_audit_logs` BEFORE INSERT ON `audit_logs` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID()$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
CREATE TABLE IF NOT EXISTS `members` (
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
  KEY `idx_members_status_registration` (`member_status`,`registration_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Church members database';

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `member_code`, `name`, `occupation`, `date_of_birth`, `baptism_status`, `confirmation_status`, `marital_status`, `residential_status`, `aadhar_number`, `mobile`, `address`, `area`, `ward`, `remarks`, `member_status`, `password`, `registration_date`, `last_login`, `failed_login_attempts`, `locked_until`, `created_by`, `created_at`, `updated_at`) VALUES
('00bfbfcc-c31f-442f-96c0-2cd665c75215', 'LCH010', 'Sync Test 2', 'Tester', '1990-01-01', 0, 0, 0, 1, '100000000002', '9000000002', 'Addr', 'Area', '1', '', 'unconfirmed', '', '2025-11-25', NULL, 0, NULL, NULL, '2025-11-25 14:22:30', '2025-11-25 14:22:30'),
('028bdc65-a213-4921-9af5-2088996fe14d', 'LCH084', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:08:29', '2025-11-26 07:08:29'),
('04cc726c-e9df-4b65-9efd-e5d7feef27e3', 'LCH007', 'Sync Test 1', 'Tester', '1990-01-01', 0, 1, 0, 1, '100000000001', '9000000011', 'Addr', 'Area', '1', '', 'confirmed', '', '2025-11-25', NULL, 0, NULL, NULL, '2025-11-25 14:16:35', '2025-11-25 15:07:10'),
('04f35ddc-ec43-4f6b-80d9-4b43c9641ae1', 'LCH003', 'Nagaraju R', 'Software Engineer', '1980-06-15', 0, 0, 0, 1, '123456789012', '9966365533', 'Mallikarjunapet', 'srinagar', '42', '', 'unconfirmed', '', '2025-11-25', NULL, 0, NULL, NULL, '2025-11-25 12:46:08', '2025-11-25 13:01:06'),
('059469b0-3950-482c-b364-18649f4673e7', 'LCH041', 'Test Member 1764139237115', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:40:37', '2025-11-26 06:40:37'),
('08beb97c-0654-49f6-bbad-c819358433ac', 'LCH044', 'Test Member 1764139455790', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:44:17', '2025-11-26 06:44:17'),
('091185a7-d16a-4d95-81b3-7f7aa49ee98e', 'LCH012', 'Sync Test 4', 'Tester', '1990-01-01', 0, 0, 0, 1, '100000000004', '9000000004', 'Addr', 'Area', '1', '', 'unconfirmed', '', '2025-11-25', NULL, 0, NULL, NULL, '2025-11-25 14:31:51', '2025-11-25 14:31:51'),
('0d1b6681-b384-43d6-be65-c53b23449e73', 'LCH035', 'Test Member 1764138689960', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:31:30', '2025-11-26 06:31:30'),
('0d8a5e2e-b161-4bfb-9d01-517786121b0b', 'LCH046', 'Test Member 1764139559630', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:46:01', '2025-11-26 06:46:01'),
('0e0197f4-5143-49c1-a05f-b6ecf6e384e5', 'LCH043', 'Test Member 1764139371020', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:42:52', '2025-11-26 06:42:52'),
('0f8b990d-459d-44a4-8409-e650526d7763', 'LCH074', 'Test Member 1764140585822', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:03:07', '2025-11-26 07:03:07'),
('1', 'LCH001', 'John Emmanuel', 'Software Engineer', '1990-05-15', 1, 1, 1, 1, '1234-5678-9012', '9876543210', '123 Main Street', 'City Center', 'Ward 1', 'Active member, regular attendee', 'confirmed', '$2y$10$Eb7ZA4bhH/4VWW1IROU6AeSqbAmM6pZI1TlqBZqFnGg8go4qK04n6', '2024-01-15', NULL, 0, NULL, NULL, '2025-11-25 12:32:08', '2025-11-26 13:00:16'),
('1385fe38-d3ba-446b-b2d8-b9ee5a4cc145', 'LCH075', 'Test Member 1764140699487', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:05:00', '2025-11-26 07:05:00'),
('1575b0d3-86ec-4d39-a97c-833037b4f657', 'LCH048', 'Test Member 1764139716957', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:48:37', '2025-11-26 06:48:37'),
('16b21128-c969-4a90-9069-795e584c68b6', 'LCH078', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:05:49', '2025-11-26 07:05:49'),
('184e3eb1-fbe9-41df-bf5b-ea7492bb876d', 'LCH022', 'Test Member 1764137984798', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:19:46', '2025-11-26 06:19:46'),
('19bfa486-a366-4d13-a442-96cd5eca9960', 'LCH024', 'Test Member 1764138096796', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:21:38', '2025-11-26 06:21:38'),
('1a088e13-411a-4ac7-a984-07ff02610d4c', 'LCH054', 'Test Member 1764140046783', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:54:08', '2025-11-26 06:54:08'),
('1a88743c-6275-4e1d-a7b4-cbfe44de5649', 'LCH094', 'Test Member 1764141471151', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:17:52', '2025-11-26 07:17:52'),
('1b88eee3-4c35-4fea-985a-2a12dd8a9b11', 'LCH008', 'Sync Test 1', 'Tester', '1990-01-01', 0, 1, 0, 1, '100000000001', '9000000001', 'Addr', 'Area', '1', '', 'unconfirmed', '', '2025-11-25', NULL, 0, NULL, NULL, '2025-11-25 14:18:28', '2025-11-25 14:18:28'),
('2', 'LCH002', 'Sarah David', 'Teacher', '1985-08-22', 1, 1, 0, 1, '2345-6789-0123', '9876543211', '456 Park Avenue', 'Suburbia', 'Ward 2', 'New member', 'unconfirmed', '$2a$10$YourBcryptHashHere', '2024-10-01', NULL, 0, NULL, NULL, '2025-11-25 12:32:08', '2025-11-25 12:32:08'),
('20690481-f422-4dfd-a5f2-8deca7942ae7', 'LCH087', 'Test Member 1764141012436', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:10:14', '2025-11-26 07:10:14'),
('25ef867a-e282-40c8-8ae6-a59fb054aaa9', 'LCH067', 'Test Member 1764140368368', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:59:30', '2025-11-26 06:59:30'),
('2d875f42-357b-4ee7-b4b0-aef20da20c4c', 'LCH037', 'Test Member 1764138839260', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:34:00', '2025-11-26 06:34:00'),
('3143b888-d91f-4215-a164-e878746e611a', 'LCH063', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:57:31', '2025-11-26 06:57:31'),
('351efd57-fdd1-4572-82f1-d71b9d99ed13', 'LCH092', 'Test Member 1764141245661', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:14:07', '2025-11-26 07:14:07'),
('377f96d7-ba3c-4cf7-946d-1ef84e02efb9', 'LCH031', 'Test Member 1764138488251', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:28:09', '2025-11-26 06:28:09'),
('3951a3a7-baac-4185-b514-29d579981726', 'LCH088', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:10:25', '2025-11-26 07:10:25'),
('3b630e7a-0cc6-4076-8aac-370c96cafa40', 'LCH100', 'Test Member 1764141791420', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:23:13', '2025-11-26 07:23:13'),
('3cbbc288-b90c-4c6b-af1e-b62679625e06', 'LCH066', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:59:06', '2025-11-26 06:59:06'),
('3f5820af-2f23-4566-a704-7e60d8acb54c', 'LCH050', 'Test Member 1764139958248', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:52:40', '2025-11-26 06:52:40'),
('42640efc-75a6-4266-9fbb-c52f0cb08973', 'LCH018', 'Test Member 1764137204111', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:06:45', '2025-11-26 06:06:45'),
('438f85bd-a9f6-49f6-9d99-3ea4336211fe', 'LCH027', 'Test Member 1764138265704', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:24:27', '2025-11-26 06:24:27'),
('4d03c62b-d92a-43ca-9804-7f1c02b8d3e2', 'LCH081', 'Test Member 1764140826762', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:07:08', '2025-11-26 07:07:08'),
('4e6e9745-25bf-4e1e-86f5-5d45562ab30a', 'LCH095', 'Test Member 1764141556199', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:19:17', '2025-11-26 07:19:17'),
('4f3616ec-bb91-44c4-ab9c-bcdb19b309e3', 'LCH083', 'Test Member 1764140897491', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:08:18', '2025-11-26 07:08:18'),
('5084a119-5f5b-4bb7-b564-5e2945fa936d', 'LCH045', 'Test Member 1764139478245', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:44:39', '2025-11-26 06:44:39'),
('518e7ca5-6f6b-4147-88f2-1db2966f2dde', 'LCH052', 'Test Member 1764139996739', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:53:18', '2025-11-26 06:53:18'),
('519a1948-4a46-4ae4-89d4-38bb2bcde243', 'LCH047', 'Test Member 1764139578981', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:46:19', '2025-11-26 06:46:19'),
('526475f1-0a11-479e-ab30-8e7327dc571b', 'LCH080', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:06:49', '2025-11-26 07:06:49'),
('538c8d61-563d-4902-8e4f-3e89da25ebfc', 'LCH036', 'Test Member 1764138820885', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:33:42', '2025-11-26 06:33:42'),
('53900009-70f3-459f-bc0a-6e7fea437ae5', 'LCH006', 'Status Test', 'Tester', '1990-01-01', 0, 1, 0, 1, '112233445566', '9988776655', 'Test Addr', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-25', NULL, 0, NULL, NULL, '2025-11-25 14:12:44', '2025-11-25 14:12:44'),
('57feff53-c228-4342-ad0b-bc8a6819e631', 'LCH017', 'Test Member 1764137159662', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:06:00', '2025-11-26 06:06:00'),
('5aa9b9b3-b50f-454a-9603-6b79ccb3e818', 'LCH076', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:05:10', '2025-11-26 07:05:10'),
('5c74db62-1335-4bf2-8238-750a17691d48', 'LCH023', 'Test Member 1764138041298', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:20:42', '2025-11-26 06:20:42'),
('5ced0ec7-665c-450a-82f0-d7707983d86a', 'LCH040', 'Test Member 1764139225364', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:40:25', '2025-11-26 06:40:25'),
('5f309c29-5e5d-4603-ac1c-6b6eb47aeedd', 'LCH019', 'Test Member 1764137213675', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:06:54', '2025-11-26 06:06:54'),
('608244ea-bec3-44ab-bd64-597c7f37115b', 'LCH079', 'Test Member 1764140798446', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:06:40', '2025-11-26 07:06:40'),
('62aedfb8-1745-4add-974b-dcd6a623e266', 'LCH070', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:00:40', '2025-11-26 07:00:40'),
('662c80b8-37d1-4361-84fa-9ca6dcd9806a', 'LCH042', 'Test Member 1764139347265', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:42:28', '2025-11-26 06:42:28'),
('663c099a-c45b-4bb5-96fc-efbdd4d3a414', 'LCH049', 'Test Member 1764139746059', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:49:07', '2025-11-26 06:49:07'),
('671c59a1-dc9d-4edf-bcd6-a41ae5c2666d', 'LCH071', 'Test Member 1764140456694', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:00:57', '2025-11-26 07:00:57'),
('699080ae-5660-4459-b066-a49d33a33744', 'LCH098', 'Test Member 1764141678396', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:21:19', '2025-11-26 07:21:19'),
('6b24a97b-13e8-4666-8329-d24962e725bf', 'LCH057', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:54:51', '2025-11-26 06:54:51'),
('6c2ac2ef-1696-46fd-a90f-daeedc575c3d', 'LCH020', 'Test Member 1764137875377', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:17:57', '2025-11-26 06:17:57'),
('716b363c-faa6-4621-b099-f867a1fec7d3', 'LCH077', 'Test Member 1764140725515', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:05:27', '2025-11-26 07:05:27'),
('734db591-a6d8-48f6-83f6-36d7cdb324ce', 'LCH086', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:09:11', '2025-11-26 07:09:11'),
('74c7db13-6c33-4732-90f3-41ee6df2e41a', 'LCH039', 'Test Member 1764138952706', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:35:53', '2025-11-26 06:35:53'),
('75d4c059-fb9b-4ea3-a87d-0065908b12cb', 'LCH014', 'Test Member 1764137054030', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:04:15', '2025-11-26 06:04:15'),
('7a3334ee-3a0f-45c6-81e4-0a147b13ca13', 'LCH004', 'Test Member 1', 'Tester', '1990-01-01', 1, 1, 0, 1, '123456789012', '9999999999', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-25', NULL, 0, NULL, NULL, '2025-11-25 12:58:50', '2025-11-25 14:03:48'),
('7b02f0c1-4f8a-428e-8878-246c51c4da2e', 'LCH065', 'Test Member 1764140335423', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:58:56', '2025-11-26 06:58:56'),
('7ed645f8-38eb-47a4-9f09-d5b627f9ca5e', 'LCH093', 'Test Member 1764141439772', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:17:21', '2025-11-26 07:17:21'),
('834993dd-ff66-4487-b5ae-5310107e447f', 'LCH028', 'Test Member 1764138343762', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:25:45', '2025-11-26 06:25:45'),
('85f10d7d-bef2-4878-a643-1b576741aca0', 'LCH097', 'Test Member 1764141652737', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:20:54', '2025-11-26 07:20:54'),
('887af9f5-46bc-4a9d-9c74-c80072208e13', 'LCH062', 'Test Member 1764140241499', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:57:22', '2025-11-26 06:57:22'),
('89a4e42e-de3b-4b3a-ba17-4c479600a0c7', 'LCH082', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:07:30', '2025-11-26 07:07:30'),
('9ee344d0-f6c1-4c58-b99d-cdf725c0fece', 'LCH061', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:56:22', '2025-11-26 06:56:22'),
('9f3ebdf1-3242-4580-8271-f067246a02c0', 'LCH099', 'Test Member 1764141758754', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:22:40', '2025-11-26 07:22:40'),
('a15facb7-138c-4ddf-9860-5f957b4d86b4', 'LCH016', 'Test Member 1764137157091', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:05:58', '2025-11-26 06:05:58'),
('a1d9b4d7-4b3a-4a1c-b473-78c6ff30a55b', 'LCH096', 'Test Member 1764141580787', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:19:42', '2025-11-26 07:19:42'),
('a51033b8-c0e6-498c-a3e7-c9260248614b', 'LCH013', 'Sync Test 5', 'Tester', '1990-01-01', 0, 1, 0, 1, '100000000005', '9000000005', 'Addr', 'Area', '1', '', 'confirmed', '', '2025-11-25', NULL, 0, NULL, NULL, '2025-11-25 14:56:02', '2025-11-25 14:56:02'),
('a751ea6c-4e34-4a2d-8990-ce6c5d771354', 'LCH091', 'Test Member 1764141217300', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:13:38', '2025-11-26 07:13:38'),
('a8ff4eff-d97b-42f1-a91a-02c9441e7d88', 'LCH053', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:53:31', '2025-11-26 06:53:31'),
('b435c1b0-ac1a-4ef3-8f68-bacd97b689c4', 'LCH032', 'Test Member 1764138575268', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:29:37', '2025-11-26 06:29:37'),
('b5777783-2af4-42b0-9f78-586d17a46ec1', 'LCH030', 'Test Member 1764138464467', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:27:45', '2025-11-26 06:27:45'),
('b5de6044-7cd0-4296-957a-b74f7e522ca4', 'LCH026', 'Test Member 1764138205035', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:23:26', '2025-11-26 06:23:26'),
('b613f8b4-2677-41c9-ab07-c89b40e26a85', 'LCH069', 'Test Member 1764140428161', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:00:28', '2025-11-26 07:00:28'),
('b78c89bc-c967-4bac-b8fd-9177d0f7c1d8', 'LCH029', 'Test Member 1764138379086', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:26:20', '2025-11-26 06:26:20'),
('b919876a-df60-4fe9-80df-659fb6696771', 'LCH005', 'Status Test', 'Tester', '1990-01-01', 0, 1, 0, 1, '112233445566', '9988776655', 'Test Addr', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-25', NULL, 0, NULL, NULL, '2025-11-25 14:10:35', '2025-11-25 14:10:35'),
('be79a6e6-f930-4566-8f08-716f34dceb75', 'LCH051', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:52:57', '2025-11-26 06:52:57'),
('c27ed6bd-9164-49c3-86d8-83f69ba86376', 'LCH068', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:59:46', '2025-11-26 06:59:46'),
('c3fd7d4d-1c94-463a-ac0e-5e0142c7b1fe', 'LCH025', 'Test Member 1764138150052', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:22:31', '2025-11-26 06:22:31'),
('c592db9f-3581-4a0c-8e0d-d357dcf2e6ea', 'LCH064', 'Test Member 1764140261017', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:57:41', '2025-11-26 06:57:41'),
('c5e4d26f-7e3b-4d88-9b31-90eacb4b559f', 'LCH056', 'Test Member 1764140075383', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:54:36', '2025-11-26 06:54:36'),
('cd1bff6e-bf6a-4b74-843f-262ea1c350a3', 'LCH011', 'Sync Test 3', 'Tester', '1990-01-01', 0, 1, 0, 1, '100000000003', '9000000003', 'Addr', 'Area', '1', '', 'confirmed', '', '2025-11-25', NULL, 0, NULL, NULL, '2025-11-25 14:28:03', '2025-11-25 14:28:03'),
('cec32729-270f-4983-b953-ab8243dc2d44', 'LCH015', 'Test Member 1764137056036', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:04:16', '2025-11-26 06:04:16'),
('d36a2e01-82a1-4785-b33f-e8f4fc01009b', 'LCH089', 'Test Member 1764141044150', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:10:45', '2025-11-26 07:10:45'),
('d4f37dc8-1798-4cc9-b98e-504a47be7eb5', 'LCH058', 'Test Member 1764140140975', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:55:42', '2025-11-26 06:55:42'),
('d8919e91-f317-4f5e-838f-2de8d44bc7e9', 'LCH033', 'Test Member 1764138598986', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:30:00', '2025-11-26 06:30:00'),
('dbd50307-6207-4caf-96a1-62c73642e4e4', 'LCH060', 'Test Member 1764140163793', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:56:04', '2025-11-26 06:56:04'),
('de504a4e-2a34-4f3b-bb64-f7c84b694ae5', 'LCH059', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:55:52', '2025-11-26 06:55:52'),
('e1cba43e-531e-4c47-b3e3-41a5659d3476', 'LCH072', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:01:13', '2025-11-26 07:01:13'),
('e3fa7047-6aa1-4a57-83e1-2d4bbff3bbe7', 'LCH055', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:54:19', '2025-11-26 06:54:19'),
('e461008e-0803-4fdf-b25d-1816d1859a33', 'LCH085', 'Test Member 1764140925009', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:08:46', '2025-11-26 07:08:46'),
('e5d13c2d-5f8b-48c9-a8a2-7ac255048487', 'LCH009', 'Sync Test 2', 'Tester', '1990-01-01', 0, 0, 0, 1, '100000000002', '9000000002', 'Addr', 'Area', '1', '', 'unconfirmed', '', '2025-11-25', NULL, 0, NULL, NULL, '2025-11-25 14:20:41', '2025-11-25 14:20:41'),
('e7471f84-981c-4263-b81c-38d2b99290e6', 'LCH090', 'Test Member', 'Tester', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', 'Test Address', 'Test Area', 'Test Ward', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:11:12', '2025-11-26 07:11:12'),
('ef3ec00c-b823-46da-96e5-3a3955814a9b', 'LCH034', 'Test Member 1764138663622', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:31:05', '2025-11-26 06:31:05'),
('f5188c18-c00e-4072-9a15-fad7a154d007', 'LCH073', 'Test Member 1764140561370', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 07:02:42', '2025-11-26 07:02:42'),
('fb07fb8a-6eb4-403c-bed6-da3dff020300', 'LCH021', 'Test Member 1764137932124', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:18:53', '2025-11-26 06:18:53'),
('fb230678-16a2-46b9-87e5-7b445a2d2020', 'LCH038', 'Test Member 1764138935471', 'Software Engineer', '1990-01-01', 0, 0, 0, 1, '123456789012', '9876543210', '123 Test St', 'Test Area', '1', '', 'unconfirmed', '', '2025-11-26', NULL, 0, NULL, NULL, '2025-11-26 06:35:37', '2025-11-26 06:35:37');

--
-- Triggers `members`
--
DROP TRIGGER IF EXISTS `trg_before_insert_members`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_members` BEFORE INSERT ON `members` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID()$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `member_login_history`
--

DROP TABLE IF EXISTS `member_login_history`;
CREATE TABLE IF NOT EXISTS `member_login_history` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `identifier` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mobile or Member Code used',
  `identifier_type` enum('mobile','memberCode') COLLATE utf8mb4_unicode_ci NOT NULL,
  `success` tinyint(1) NOT NULL COMMENT '1=Success, 0=Failed',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `failure_reason` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_identifier` (`identifier`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_success` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Member login history and security tracking';

--
-- Triggers `member_login_history`
--
DROP TRIGGER IF EXISTS `trg_before_insert_member_login_history`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_member_login_history` BEFORE INSERT ON `member_login_history` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID()$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `offerings`
--

DROP TABLE IF EXISTS `offerings`;
CREATE TABLE IF NOT EXISTS `offerings` (
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
  KEY `idx_offerings_date_type` (`date`,`offer_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Member offerings and contributions';

--
-- Dumping data for table `offerings`
--

INSERT INTO `offerings` (`id`, `member_id`, `member_name`, `member_code`, `date`, `amount`, `offer_type`, `payment_mode`, `cheque_number`, `transaction_id`, `notes`, `receipt_number`, `recorded_by`, `created_at`, `updated_at`) VALUES
('04ea8f80-4431-484e-a0ae-f2f28af89805', 'b435c1b0-ac1a-4ef3-8f68-bacd97b689c4', 'Test Member 1764138575268', 'LCH032', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126065245', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:52:45', '2025-11-26 06:52:45'),
('07e0b49e-59e9-44c9-bf34-75fbc2d339ad', '7b02f0c1-4f8a-428e-8878-246c51c4da2e', 'Test Member 1764140335423', 'LCH065', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126071757', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:17:57', '2025-11-26 07:17:57'),
('0d71519f-4b62-47a2-a29d-445cd9495bd9', '75d4c059-fb9b-4ea3-a87d-0065908b12cb', 'Test Member 1764137054030', 'LCH014', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126060426', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:04:26', '2025-11-26 06:04:26'),
('0df19a88-3802-44a9-b66f-4fc601376d02', '5f309c29-5e5d-4603-ac1c-6b6eb47aeedd', 'Test Member 1764137213675', 'LCH019', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126061953', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:19:53', '2025-11-26 06:19:53'),
('0e514f79-656e-4ae5-9802-c095b64e7c1f', 'b5777783-2af4-42b0-9f78-586d17a46ec1', 'Test Member 1764138464467', 'LCH030', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126064444', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:44:44', '2025-11-26 06:44:44'),
('104bccac-ddb8-48af-97c7-b984afe0a728', 'b435c1b0-ac1a-4ef3-8f68-bacd97b689c4', 'Test Member 1764138575268', 'LCH032', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126065328', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:53:28', '2025-11-26 06:53:28'),
('11d0d4a1-247c-4ece-810a-08bc5d1f749d', '5c74db62-1335-4bf2-8238-750a17691d48', 'Test Member 1764138041298', 'LCH023', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126062435', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:24:35', '2025-11-26 06:24:35'),
('124d536c-bfc3-4a4e-9c7d-547a009a87d7', 'b613f8b4-2677-41c9-ab07-c89b40e26a85', 'Test Member 1764140428161', 'LCH069', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126070103', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:01:03', '2025-11-26 07:01:03'),
('13f70c6e-eba4-4a21-bb6a-8dbc013059dc', '1', 'John Emmanuel', 'LCH001', '2025-11-25', 1000.00, '', 'Cash', NULL, NULL, NULL, 'REC20251125121910', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-25 12:19:10', '2025-11-25 12:19:10'),
('1b05806c-9092-42be-8713-a57395fd84b6', '5c74db62-1335-4bf2-8238-750a17691d48', 'Test Member 1764138041298', 'LCH023', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126062328', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:23:28', '2025-11-26 06:23:28'),
('1c9bf706-a565-4a12-9cc2-f5221f6f3815', '75d4c059-fb9b-4ea3-a87d-0065908b12cb', 'Test Member 1764137054030', 'LCH014', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126071017', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:10:17', '2025-11-26 07:10:17'),
('26c5b27a-9a1f-46bd-be80-5b5c2a1ccf4a', '5c74db62-1335-4bf2-8238-750a17691d48', 'Test Member 1764138041298', 'LCH023', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126062051', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:20:51', '2025-11-26 06:20:51'),
('29e774a4-641f-4ebf-b93e-9819af503eee', '834993dd-ff66-4487-b5ae-5310107e447f', 'Test Member 1764138343762', 'LCH028', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126070321', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:03:21', '2025-11-26 07:03:21'),
('35a19ea0-cc2d-4e49-871f-84f6ad6177f4', 'b435c1b0-ac1a-4ef3-8f68-bacd97b689c4', 'Test Member 1764138575268', 'LCH032', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126064602', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:46:02', '2025-11-26 06:46:02'),
('4549c123-4160-4045-b7ef-8c1f8463733b', '834993dd-ff66-4487-b5ae-5310107e447f', 'Test Member 1764138343762', 'LCH028', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126070244', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:02:44', '2025-11-26 07:02:44'),
('499c1921-5ed3-41ab-8677-841f421a4bae', '1', 'John Emmanuel', 'LCH001', '2025-11-25', 1500.01, '', 'Cash', NULL, NULL, NULL, 'REC20251125121728', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-25 12:17:28', '2025-11-25 12:17:28'),
('4ebd6148-6bc4-42b9-aab0-bd82677c3d2f', '5f309c29-5e5d-4603-ac1c-6b6eb47aeedd', 'Test Member 1764137213675', 'LCH019', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126063538', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:35:38', '2025-11-26 06:35:38'),
('547eafee-9803-4317-a58a-4ae589b0b5bd', 'b435c1b0-ac1a-4ef3-8f68-bacd97b689c4', 'Test Member 1764138575268', 'LCH032', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126064906', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:49:06', '2025-11-26 06:49:06'),
('55d37e8c-03a5-4f20-99be-c7f4e0f4b4fa', 'b435c1b0-ac1a-4ef3-8f68-bacd97b689c4', 'Test Member 1764138575268', 'LCH032', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126064621', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:46:21', '2025-11-26 06:46:21'),
('5716bf4c-5a30-42ab-815c-abf9f6a97ccf', 'b5777783-2af4-42b0-9f78-586d17a46ec1', 'Test Member 1764138464467', 'LCH030', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126064232', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:42:32', '2025-11-26 06:42:32'),
('57495a70-9855-4eb7-a126-f87553a3c340', '7b02f0c1-4f8a-428e-8878-246c51c4da2e', 'Test Member 1764140335423', 'LCH065', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126070640', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:06:40', '2025-11-26 07:06:40'),
('6581ad36-5d9b-4c3d-9abf-5f65e3573119', 'cec32729-270f-4983-b953-ab8243dc2d44', 'Test Member 1764137056036', 'LCH015', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126060608', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:06:08', '2025-11-26 06:06:08'),
('65aa6c3b-cbd7-45cf-a40d-7acf32a140d1', 'b435c1b0-ac1a-4ef3-8f68-bacd97b689c4', 'Test Member 1764138575268', 'LCH032', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126065410', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:54:10', '2025-11-26 06:54:10'),
('6d0e3a43-c6bf-4ba1-a6b1-93f81ccb63fa', 'b5777783-2af4-42b0-9f78-586d17a46ec1', 'Test Member 1764138464467', 'LCH030', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126064417', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:44:17', '2025-11-26 06:44:17'),
('700deeda-b393-46b2-8c2a-1b03b01ed324', '1', 'John Emmanuel', 'LCH001', '2025-11-25', 10.00, '', 'Cash', NULL, NULL, NULL, 'REC20251125123225', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-25 12:32:25', '2025-11-25 12:32:25'),
('7905fd82-c14a-451f-aa88-fec331562a46', '834993dd-ff66-4487-b5ae-5310107e447f', 'Test Member 1764138343762', 'LCH028', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126070536', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:05:36', '2025-11-26 07:05:36'),
('7a8524f0-400a-432f-b63a-1ed080ed16ee', 'cec32729-270f-4983-b953-ab8243dc2d44', 'Test Member 1764137056036', 'LCH015', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126060658', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:06:58', '2025-11-26 06:06:58'),
('7e811449-fedc-49df-8357-c521adf01a72', '7b02f0c1-4f8a-428e-8878-246c51c4da2e', 'Test Member 1764140335423', 'LCH065', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126071722', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:17:22', '2025-11-26 07:17:22'),
('86d3c135-f537-49d0-8bbb-1781057bc173', '5c74db62-1335-4bf2-8238-750a17691d48', 'Test Member 1764138041298', 'LCH023', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126062547', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:25:47', '2025-11-26 06:25:47'),
('87243b95-f06d-43d4-a849-44752bbc843d', 'b78c89bc-c967-4bac-b8fd-9177d0f7c1d8', 'Test Member 1764138379086', 'LCH029', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126065748', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:57:48', '2025-11-26 06:57:48'),
('8bdb0119-74a5-4354-9acd-afa6e7700af5', '75d4c059-fb9b-4ea3-a87d-0065908b12cb', 'Test Member 1764137054030', 'LCH014', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126060559', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:05:59', '2025-11-26 06:05:59'),
('8c8a0d82-1710-470d-a9e5-f08c348adbf1', 'b5de6044-7cd0-4296-957a-b74f7e522ca4', 'Test Member 1764138205035', 'LCH026', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126064027', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:40:27', '2025-11-26 06:40:27'),
('9780a50f-49f8-4657-bf01-451af40d2f27', '7ed645f8-38eb-47a4-9f09-d5b627f9ca5e', 'Test Member 1764141439772', 'LCH093', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126072320', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:23:20', '2025-11-26 07:23:20'),
('9ae76247-46e6-4dfd-9a69-f52864448f41', '7b02f0c1-4f8a-428e-8878-246c51c4da2e', 'Test Member 1764140335423', 'LCH065', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126071919', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:19:19', '2025-11-26 07:19:19'),
('a222885b-2ce4-471a-b783-5f4df55ae1e2', '5c74db62-1335-4bf2-8238-750a17691d48', 'Test Member 1764138041298', 'LCH023', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126062138', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:21:38', '2025-11-26 06:21:38'),
('a3d6b080-2315-4319-a5c2-eee8c2bfe7ca', '6c2ac2ef-1696-46fd-a90f-daeedc575c3d', 'Test Member 1764137875377', 'LCH020', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126063106', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:31:06', '2025-11-26 06:31:06'),
('a49ed124-82ef-4860-bc5f-8f9fed5d5a77', '5f309c29-5e5d-4603-ac1c-6b6eb47aeedd', 'Test Member 1764137213675', 'LCH019', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126062939', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:29:39', '2025-11-26 06:29:39'),
('a71a83f1-4788-431b-9ae6-a5366e34b16e', '00bfbfcc-c31f-442f-96c0-2cd665c75215', 'Sync Test 2', 'LCH010', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126060415', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:04:15', '2025-11-26 06:04:15'),
('a83faf28-c9cc-11f0-8918-5c879c7eebc7', '1', 'John Emmanuel', 'LCH001', '2024-11-10', 5000.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC001', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-25 12:32:08', '2025-11-25 12:32:08'),
('a83fba5e-c9cc-11f0-8918-5c879c7eebc7', '1', 'John Emmanuel', 'LCH001', '2024-11-03', 2000.00, 'Thanksgiving', 'UPI', NULL, NULL, NULL, 'REC002', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-25 12:32:08', '2025-11-25 12:32:08'),
('a83fc0dc-c9cc-11f0-8918-5c879c7eebc7', '2', 'Sarah David', 'LCH002', '2024-11-10', 3000.00, 'Tithe', 'Bank Transfer', NULL, NULL, NULL, 'REC003', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-25 12:32:08', '2025-11-25 12:32:08'),
('acb820ae-9a65-4055-87ce-6460c4ba2d77', '7b02f0c1-4f8a-428e-8878-246c51c4da2e', 'Test Member 1764140335423', 'LCH065', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126071416', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:14:16', '2025-11-26 07:14:16'),
('ae6e30ec-c21f-4b91-a3fc-04e871ee7af3', 'b5de6044-7cd0-4296-957a-b74f7e522ca4', 'Test Member 1764138205035', 'LCH026', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126063602', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:36:02', '2025-11-26 06:36:02'),
('b08814ed-675c-4f1a-a6b2-ad6e11fafce6', 'b78c89bc-c967-4bac-b8fd-9177d0f7c1d8', 'Test Member 1764138379086', 'LCH029', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126065858', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:58:58', '2025-11-26 06:58:58'),
('b130400b-71af-4d3e-8789-429894a8e037', '6c2ac2ef-1696-46fd-a90f-daeedc575c3d', 'Test Member 1764137875377', 'LCH020', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126063344', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:33:44', '2025-11-26 06:33:44'),
('b2beebcd-2870-4af4-bb1c-7f23313714b2', '74c7db13-6c33-4732-90f3-41ee6df2e41a', 'Test Member 1764138952706', 'LCH039', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126071052', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:10:52', '2025-11-26 07:10:52'),
('b3be877c-df5a-4028-b926-303e52e3a0da', 'b78c89bc-c967-4bac-b8fd-9177d0f7c1d8', 'Test Member 1764138379086', 'LCH029', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126070032', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:00:32', '2025-11-26 07:00:32'),
('b7932519-2913-48ad-a9cb-f80f8cf1741f', 'cec32729-270f-4983-b953-ab8243dc2d44', 'Test Member 1764137056036', 'LCH015', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126061855', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:18:55', '2025-11-26 06:18:55'),
('bcb4d21b-adf8-4c60-83af-8afbd2c23abf', 'b5777783-2af4-42b0-9f78-586d17a46ec1', 'Test Member 1764138464467', 'LCH030', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126065446', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:54:46', '2025-11-26 06:54:46'),
('c629e3d0-a477-4e58-b897-e2d58d185be4', 'cec32729-270f-4983-b953-ab8243dc2d44', 'Test Member 1764137056036', 'LCH015', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126061802', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:18:02', '2025-11-26 06:18:02'),
('c6a9900f-25d7-4d4e-bb72-75eb23ab5006', '75d4c059-fb9b-4ea3-a87d-0065908b12cb', 'Test Member 1764137054030', 'LCH014', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126070854', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:08:54', '2025-11-26 07:08:54'),
('c9ae819e-fb55-4d83-bd41-ae345f8a5001', '75d4c059-fb9b-4ea3-a87d-0065908b12cb', 'Test Member 1764137054030', 'LCH014', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126070820', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:08:20', '2025-11-26 07:08:20'),
('cf58e313-ff3c-4120-a89a-d295dabf6bad', 'b435c1b0-ac1a-4ef3-8f68-bacd97b689c4', 'Test Member 1764138575268', 'LCH032', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126065545', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:55:45', '2025-11-26 06:55:45'),
('d1d93663-b514-4d48-aee3-22336a883394', 'b5de6044-7cd0-4296-957a-b74f7e522ca4', 'Test Member 1764138205035', 'LCH026', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126065610', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:56:10', '2025-11-26 06:56:10'),
('d352de93-a27c-4d2c-a90c-12a5d171fc18', '5f309c29-5e5d-4603-ac1c-6b6eb47aeedd', 'Test Member 1764137213675', 'LCH019', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126062746', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:27:46', '2025-11-26 06:27:46'),
('d7237e46-d366-4676-a8a7-1b0af310ca1d', '75d4c059-fb9b-4ea3-a87d-0065908b12cb', 'Test Member 1764137054030', 'LCH014', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126063135', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:31:35', '2025-11-26 06:31:35'),
('d81efeb6-29ef-4a4a-b3a7-8ff7b74404c4', '5c74db62-1335-4bf2-8238-750a17691d48', 'Test Member 1764138041298', 'LCH023', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126062239', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:22:39', '2025-11-26 06:22:39'),
('d962f5e0-ed83-4114-9a5d-fc35808dd150', 'b5de6044-7cd0-4296-957a-b74f7e522ca4', 'Test Member 1764138205035', 'LCH026', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126065931', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:59:31', '2025-11-26 06:59:31'),
('dc261584-3df7-4dc6-9f4f-9b12727b68fc', '834993dd-ff66-4487-b5ae-5310107e447f', 'Test Member 1764138343762', 'LCH028', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126070502', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:05:02', '2025-11-26 07:05:02'),
('de317f71-bf2e-490d-af46-4483616d514c', '7b02f0c1-4f8a-428e-8878-246c51c4da2e', 'Test Member 1764140335423', 'LCH065', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126072056', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:20:56', '2025-11-26 07:20:56'),
('dfbd4cb6-13c5-4ce5-8591-864babb2c071', 'b5777783-2af4-42b0-9f78-586d17a46ec1', 'Test Member 1764138464467', 'LCH030', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126064042', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:40:42', '2025-11-26 06:40:42'),
('ec9f0bf8-b1d9-4b99-bcfc-9aaf40a6d90c', '2', 'Sarah David', 'LCH002', '2025-11-25', 750.00, 'Building Fund', 'Cheque', NULL, NULL, NULL, 'REC20251125124304', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-25 12:43:04', '2025-11-25 12:43:04'),
('ed5097c3-2b0f-4c9c-93d2-44ef4909261d', '6c2ac2ef-1696-46fd-a90f-daeedc575c3d', 'Test Member 1764137875377', 'LCH020', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126063004', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:30:04', '2025-11-26 06:30:04'),
('ee1d460d-44a5-4ed3-a255-6e0fdfa1ee21', '75d4c059-fb9b-4ea3-a87d-0065908b12cb', 'Test Member 1764137054030', 'LCH014', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126070716', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:07:16', '2025-11-26 07:07:16'),
('ef083a65-843f-4d90-bbc2-8fae539bf264', '7b02f0c1-4f8a-428e-8878-246c51c4da2e', 'Test Member 1764140335423', 'LCH065', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126071956', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:19:56', '2025-11-26 07:19:56'),
('f0a11e44-1f56-4272-b5f4-7d8e33a6a10e', 'b5777783-2af4-42b0-9f78-586d17a46ec1', 'Test Member 1764138464467', 'LCH030', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126064303', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:43:03', '2025-11-26 06:43:03'),
('f2221a2a-6171-43a5-ba67-644287922424', '7b02f0c1-4f8a-428e-8878-246c51c4da2e', 'Test Member 1764140335423', 'LCH065', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126072129', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:21:29', '2025-11-26 07:21:29'),
('f2c1c857-6259-450a-bb13-9cadeceb797c', '6c2ac2ef-1696-46fd-a90f-daeedc575c3d', 'Test Member 1764137875377', 'LCH020', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126063403', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:34:03', '2025-11-26 06:34:03'),
('f39e1ba3-7adb-4576-a970-a6cecd6aef30', 'cec32729-270f-4983-b953-ab8243dc2d44', 'Test Member 1764137056036', 'LCH015', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126060646', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:06:46', '2025-11-26 06:06:46'),
('f3d5f81f-e7e3-4342-88ed-eb2f8521eecd', '75d4c059-fb9b-4ea3-a87d-0065908b12cb', 'Test Member 1764137054030', 'LCH014', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126071340', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:13:40', '2025-11-26 07:13:40'),
('f49e1137-3c15-47af-8fc0-2bca5c2fca2b', '7b02f0c1-4f8a-428e-8878-246c51c4da2e', 'Test Member 1764140335423', 'LCH065', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126072242', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 07:22:42', '2025-11-26 07:22:42'),
('f7a50b59-4e09-471f-861a-b426d17bf143', 'b5de6044-7cd0-4296-957a-b74f7e522ca4', 'Test Member 1764138205035', 'LCH026', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126065724', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:57:24', '2025-11-26 06:57:24'),
('f9b78723-2c6a-4a23-8289-60a36bfa11a3', 'b435c1b0-ac1a-4ef3-8f68-bacd97b689c4', 'Test Member 1764138575268', 'LCH032', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126064839', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:48:39', '2025-11-26 06:48:39'),
('fb7b433d-a0fd-4eb6-a7aa-02bf3162d264', '6c2ac2ef-1696-46fd-a90f-daeedc575c3d', 'Test Member 1764137875377', 'LCH020', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126062813', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:28:13', '2025-11-26 06:28:13'),
('fc688c0c-5787-4932-bbd0-d3856a2d05a8', '5f309c29-5e5d-4603-ac1c-6b6eb47aeedd', 'Test Member 1764137213675', 'LCH019', '2025-11-26', 500.00, 'Tithe', 'Cash', NULL, NULL, NULL, 'REC20251126062626', 'a83bf033-c9cc-11f0-8918-5c879c7eebc7', '2025-11-26 06:26:26', '2025-11-26 06:26:26');

--
-- Triggers `offerings`
--
DROP TRIGGER IF EXISTS `trg_before_insert_offerings`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_offerings` BEFORE INSERT ON `offerings` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID()$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_type` enum('admin','member') COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token_hash` char(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SHA256 hash of refresh token',
  `refresh_token` text COLLATE utf8mb4_unicode_ci COMMENT 'Full refresh token (optional storage)',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `refresh_token_hash` (`refresh_token_hash`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_refresh_token_hash` (`refresh_token_hash`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User sessions and refresh tokens';

--
-- Triggers `sessions`
--
DROP TRIGGER IF EXISTS `trg_before_insert_sessions`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_sessions` BEFORE INSERT ON `sessions` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID()$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE IF NOT EXISTS `tickets` (
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
  KEY `idx_tickets_member_status` (`member_id`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Member support tickets and requests';

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `ticket_number`, `member_id`, `member_name`, `member_code`, `category`, `subject`, `description`, `status`, `priority`, `admin_notes`, `assigned_to`, `created_date`, `updated_date`, `resolved_date`, `closed_date`, `created_at`, `updated_at`) VALUES
('162239bf-1740-485c-84e2-505256dcb621', 'T003', '1', 'John Emmanuel', 'LCH001', '', 'Test Ticket from API', 'Testing ticket creation workflow', 'In Progress', 'medium', NULL, NULL, '2025-11-26', '2025-11-26', NULL, NULL, '2025-11-26 07:34:14', '2025-11-26 07:54:31'),
('a8409b61-c9cc-11f0-8918-5c879c7eebc7', 'T001', '1', 'John Emmanuel', 'LCH001', 'Profile Update', 'Update Address', 'Please update my address to 123 New Street, New City.', 'Open', 'medium', NULL, NULL, '2024-11-01', '2024-11-01', NULL, NULL, '2025-11-25 12:32:08', '2025-11-25 12:32:08'),
('a840a1fd-c9cc-11f0-8918-5c879c7eebc7', 'T002', '2', 'Sarah David', 'LCH002', 'Suggestion', 'New Ministry', 'Suggest starting a new ministry for children.', 'In Progress', 'low', NULL, NULL, '2024-11-03', '2024-11-03', NULL, NULL, '2025-11-25 12:32:08', '2025-11-25 12:32:08'),
('bdacf27f-4516-49e5-b3c1-c1adc0abb125', 'T005', '1', 'John Emmanuel', 'LCH001', 'Suggestion', 'Final Test Ticket', 'Testing priority field', 'Open', 'high', NULL, NULL, '2025-11-26', '2025-11-26', NULL, NULL, '2025-11-26 07:42:27', '2025-11-26 07:42:27'),
('c5757197-512f-4b7a-8609-9ddd9931ae5e', 'T004', '1', 'John Emmanuel', 'LCH001', '', 'Complete Workflow Test', 'Testing full ticket lifecycle', 'In Progress', 'high', NULL, NULL, '2025-11-26', '2025-11-26', NULL, NULL, '2025-11-26 07:41:28', '2025-11-26 07:41:29');

--
-- Triggers `tickets`
--
DROP TRIGGER IF EXISTS `trg_before_insert_tickets`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_tickets` BEFORE INSERT ON `tickets` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID()$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_ticket_status_change`;
DELIMITER $$
CREATE TRIGGER `trg_ticket_status_change` AFTER UPDATE ON `tickets` FOR EACH ROW BEGIN
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
    )$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `ticket_history`
--

DROP TABLE IF EXISTS `ticket_history`;
CREATE TABLE IF NOT EXISTS `ticket_history` (
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
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ticket change history and audit trail';

--
-- Dumping data for table `ticket_history`
--

INSERT INTO `ticket_history` (`id`, `ticket_id`, `action`, `old_status`, `new_status`, `notes`, `performed_by`, `performed_by_type`, `performed_by_name`, `created_at`) VALUES
('247cd166-ca9d-11f0-9c8a-5c879c7eebc7', '162239bf-1740-485c-84e2-505256dcb621', 'Status Changed', 'Open', 'In Progress', NULL, '00000000-0000-0000-0000-000000000000', 'admin', 'System', '2025-11-26 13:24:31'),
('51d53ae9-ca9b-11f0-9c8a-5c879c7eebc7', 'c5757197-512f-4b7a-8609-9ddd9931ae5e', 'Status Changed', 'Open', 'In Progress', NULL, '00000000-0000-0000-0000-000000000000', 'admin', 'System', '2025-11-26 13:11:29');

--
-- Triggers `ticket_history`
--
DROP TRIGGER IF EXISTS `trg_before_insert_ticket_history`;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_ticket_history` BEFORE INSERT ON `ticket_history` FOR EACH ROW BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID()$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_member_summary`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `view_member_summary`;
CREATE TABLE IF NOT EXISTS `view_member_summary` (
`age` bigint
,`average_contribution` decimal(14,6)
,`date_of_birth` date
,`id` char(36)
,`last_offering_date` date
,`member_code` varchar(20)
,`member_status` enum('confirmed','unconfirmed','suspended')
,`mobile` varchar(15)
,`name` varchar(100)
,`occupation` varchar(100)
,`registration_date` date
,`total_contributions` decimal(32,2)
,`total_offerings` bigint
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_monthly_offerings`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `view_monthly_offerings`;
CREATE TABLE IF NOT EXISTS `view_monthly_offerings` (
`average_amount` decimal(14,6)
,`month` varchar(7)
,`offer_type` varchar(50)
,`payment_mode` enum('Cash','UPI','Bank Transfer','Cheque','Card')
,`total_amount` decimal(32,2)
,`total_offerings` bigint
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_ticket_statistics`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `view_ticket_statistics`;
CREATE TABLE IF NOT EXISTS `view_ticket_statistics` (
`avg_resolution_days` decimal(12,4)
,`category` enum('Profile Update','Complaint','Suggestion','Query','Other')
,`count` bigint
,`priority` enum('low','medium','high')
,`status` enum('Open','In Progress','Resolved','Closed')
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_upcoming_birthdays`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `view_upcoming_birthdays`;
CREATE TABLE IF NOT EXISTS `view_upcoming_birthdays` (
`age` bigint
,`birthday` varchar(67)
,`date_of_birth` date
,`days_until_birthday` int
,`id` char(36)
,`member_code` varchar(20)
,`mobile` varchar(15)
,`name` varchar(100)
);

-- --------------------------------------------------------

--
-- Structure for view `view_member_summary`
--
DROP TABLE IF EXISTS `view_member_summary`;

DROP VIEW IF EXISTS `view_member_summary`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_member_summary`  AS SELECT `m`.`id` AS `id`, `m`.`member_code` AS `member_code`, `m`.`name` AS `name`, `m`.`mobile` AS `mobile`, `m`.`occupation` AS `occupation`, `m`.`member_status` AS `member_status`, `m`.`registration_date` AS `registration_date`, `m`.`date_of_birth` AS `date_of_birth`, timestampdiff(YEAR,`m`.`date_of_birth`,curdate()) AS `age`, count(`o`.`id`) AS `total_offerings`, coalesce(sum(`o`.`amount`),0) AS `total_contributions`, coalesce(avg(`o`.`amount`),0) AS `average_contribution`, max(`o`.`date`) AS `last_offering_date` FROM (`members` `m` left join `offerings` `o` on((`m`.`id` = `o`.`member_id`))) GROUP BY `m`.`id`, `m`.`member_code`, `m`.`name`, `m`.`mobile`, `m`.`occupation`, `m`.`member_status`, `m`.`registration_date`, `m`.`date_of_birth` ;

-- --------------------------------------------------------

--
-- Structure for view `view_monthly_offerings`
--
DROP TABLE IF EXISTS `view_monthly_offerings`;

DROP VIEW IF EXISTS `view_monthly_offerings`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_monthly_offerings`  AS SELECT date_format(`offerings`.`date`,'%Y-%m') AS `month`, `offerings`.`offer_type` AS `offer_type`, `offerings`.`payment_mode` AS `payment_mode`, count(0) AS `total_offerings`, sum(`offerings`.`amount`) AS `total_amount`, avg(`offerings`.`amount`) AS `average_amount` FROM `offerings` GROUP BY date_format(`offerings`.`date`,'%Y-%m'), `offerings`.`offer_type`, `offerings`.`payment_mode` ORDER BY `month` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `view_ticket_statistics`
--
DROP TABLE IF EXISTS `view_ticket_statistics`;

DROP VIEW IF EXISTS `view_ticket_statistics`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_ticket_statistics`  AS SELECT `tickets`.`status` AS `status`, `tickets`.`category` AS `category`, `tickets`.`priority` AS `priority`, count(0) AS `count`, avg((to_days(coalesce(`tickets`.`resolved_date`,curdate())) - to_days(`tickets`.`created_date`))) AS `avg_resolution_days` FROM `tickets` GROUP BY `tickets`.`status`, `tickets`.`category`, `tickets`.`priority` ;

-- --------------------------------------------------------

--
-- Structure for view `view_upcoming_birthdays`
--
DROP TABLE IF EXISTS `view_upcoming_birthdays`;

DROP VIEW IF EXISTS `view_upcoming_birthdays`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_upcoming_birthdays`  AS SELECT `members`.`id` AS `id`, `members`.`member_code` AS `member_code`, `members`.`name` AS `name`, `members`.`date_of_birth` AS `date_of_birth`, `members`.`mobile` AS `mobile`, timestampdiff(YEAR,`members`.`date_of_birth`,curdate()) AS `age`, date_format(`members`.`date_of_birth`,'%M %d') AS `birthday`, (to_days((`members`.`date_of_birth` + interval ((year(curdate()) - year(`members`.`date_of_birth`)) + if((dayofyear(`members`.`date_of_birth`) < dayofyear(curdate())),1,0)) year)) - to_days(curdate())) AS `days_until_birthday` FROM `members` WHERE (`members`.`member_status` = 'confirmed') HAVING (`days_until_birthday` between 0 and 30) ORDER BY `days_until_birthday` ASC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `members`
--
ALTER TABLE `members` ADD FULLTEXT KEY `ft_member_search` (`name`,`occupation`,`address`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets` ADD FULLTEXT KEY `ft_ticket_search` (`subject`,`description`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `members`
--
ALTER TABLE `members`
  ADD CONSTRAINT `members_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `member_login_history`
--
ALTER TABLE `member_login_history`
  ADD CONSTRAINT `member_login_history_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `offerings`
--
ALTER TABLE `offerings`
  ADD CONSTRAINT `offerings_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `offerings_ibfk_2` FOREIGN KEY (`recorded_by`) REFERENCES `admin_users` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `ticket_history`
--
ALTER TABLE `ticket_history`
  ADD CONSTRAINT `ticket_history_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE;

DELIMITER $$
--
-- Events
--
DROP EVENT IF EXISTS `evt_cleanup_expired_sessions`$$
CREATE DEFINER=`root`@`localhost` EVENT `evt_cleanup_expired_sessions` ON SCHEDULE EVERY 1 HOUR STARTS '2025-11-25 12:32:08' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
