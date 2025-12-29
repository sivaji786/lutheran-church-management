# Optional Triggers Installation Guide

## Overview

The triggers are **optional** and your application works perfectly without them. However, if you want to install them for database-level UUID generation, follow this guide.

## What Triggers Do

### UUID Auto-Generation (9 triggers)
Automatically generate UUIDs when inserting records without an ID:
- `trg_before_insert_admin_users`
- `trg_before_insert_members`
- `trg_before_insert_offerings`
- `trg_before_insert_non_member_offerings`
- `trg_before_insert_tickets`
- `trg_before_insert_ticket_history`
- `trg_before_insert_audit_logs`
- `trg_before_insert_sessions`
- `trg_before_insert_member_login_history`

### Ticket Status Logging (1 trigger)
- `trg_ticket_status_change` - Automatically logs ticket status changes

## Installation Steps

### Step 1: Contact Your Hosting Provider

Send this message to your hosting support:

```
Subject: Enable log_bin_trust_function_creators for MySQL

Hello,

I need to create database triggers for my application. Could you please enable 
the 'log_bin_trust_function_creators' variable for my MySQL database?

The command to run is:
SET GLOBAL log_bin_trust_function_creators = 1;

Database: c30082_018_churchrm
Account: c30082_018_churchrm

Thank you!
```

### Step 2: Wait for Confirmation

Your hosting provider will enable this setting. They may ask you to confirm for security reasons.

### Step 3: Import Triggers

Once enabled, import the triggers using **one of these methods**:

#### Method A: phpMyAdmin (Recommended)
1. Open phpMyAdmin
2. Select database `c30082_018_churchrm`
3. Click **Import** tab
4. Choose file: `triggers_optional.sql`
5. Click **Go**

#### Method B: MySQL Command Line
```bash
mysql -u c30082_018_churchrm -p c30082_018_churchrm < triggers_optional.sql
```

### Step 4: Verify Installation

Run this query in phpMyAdmin:
```sql
SHOW TRIGGERS;
```

You should see 10 triggers listed.

## Do You Need Triggers?

### ✅ Your Application Works WITHOUT Triggers

Your CodeIgniter backend already:
- ✅ Generates UUIDs in PHP code
- ✅ Logs ticket status changes
- ✅ Handles all data operations correctly

### 🎯 When Triggers Are Useful

Triggers provide **extra protection** if:
- Someone inserts data directly via SQL (bypassing your app)
- You want database-level enforcement
- You prefer double-layer data integrity

### 💡 Recommendation

**You can skip triggers entirely!** Your application is designed to work without them. Only install them if you specifically want database-level UUID generation.

## Troubleshooting

### Error: "SUPER privilege required"
- Your hosting provider hasn't enabled `log_bin_trust_function_creators` yet
- Contact them and wait for confirmation

### Error: "Trigger already exists"
- The triggers are already installed
- You can verify with `SHOW TRIGGERS;`

### Hosting Provider Won't Enable It
- **No problem!** Your application works perfectly without triggers
- The PHP backend handles everything the triggers would do

## Files

- `triggers_optional.sql` - Trigger creation script
- `schema.sql` - Main database schema (triggers excluded)
- `import_schema.php` - Automated import script

## Summary

✅ **Triggers are optional**  
✅ **Your app works without them**  
✅ **Only install if you want database-level UUID generation**  
✅ **Requires hosting provider to enable a MySQL setting**
