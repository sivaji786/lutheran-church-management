-- Cleanup Script for Lutheran Church Management System
-- Removes Stored Procedures, Triggers, and Events to rely on PHP logic

USE lutheran_church_main;

-- Drop Stored Procedures
DROP PROCEDURE IF EXISTS sp_generate_member_code;
DROP PROCEDURE IF EXISTS sp_generate_ticket_number;
DROP PROCEDURE IF EXISTS sp_non_member_offering_stats;
DROP PROCEDURE IF EXISTS sp_dashboard_stats;
DROP PROCEDURE IF EXISTS sp_member_offering_stats;

-- Drop Triggers
DROP TRIGGER IF EXISTS trg_before_insert_admin_users;
DROP TRIGGER IF EXISTS trg_before_insert_members;
DROP TRIGGER IF EXISTS trg_before_insert_offerings;
DROP TRIGGER IF EXISTS trg_before_insert_tickets;
DROP TRIGGER IF EXISTS trg_before_insert_ticket_history;
DROP TRIGGER IF EXISTS trg_before_insert_sessions;
DROP TRIGGER IF EXISTS trg_before_insert_member_login_history;
DROP TRIGGER IF EXISTS trg_before_insert_audit_logs;
DROP TRIGGER IF EXISTS trg_ticket_status_change;
DROP TRIGGER IF EXISTS trg_before_insert_non_member_offerings;

-- Drop Events
DROP EVENT IF EXISTS evt_cleanup_expired_sessions;

SELECT 'Cleanup Completed Successfully' as Status;
