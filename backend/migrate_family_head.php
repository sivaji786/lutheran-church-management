<?php
/**
 * Standalone Migration Script for Family Head Feature
 * 
 * This script adds the is_head_of_family column and sets default family heads
 * Run this on production server: php migrate_family_head.php
 */

// Database configuration - UPDATE THESE VALUES FOR PRODUCTION
$host = 'localhost';
$database = 'u788033170_churchcrm';
$username = 'u788033170_churchcrm';
$password = 'Hq7K0TEwp@';

// Create database connection
$mysqli = new mysqli($host, $username, $password, $database);

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

echo "Connected to database successfully.\n\n";

// Step 1: Check if column already exists
echo "Step 1: Checking if is_head_of_family column exists...\n";
$result = $mysqli->query("SHOW COLUMNS FROM members LIKE 'is_head_of_family'");
if ($result->num_rows > 0) {
    echo "✓ Column is_head_of_family already exists. Skipping creation.\n\n";
} else {
    echo "Adding is_head_of_family column...\n";
    $sql = "ALTER TABLE members 
            ADD COLUMN is_head_of_family TINYINT(1) NOT NULL DEFAULT 0 
            AFTER member_order";
    
    if ($mysqli->query($sql) === TRUE) {
        echo "✓ Column is_head_of_family added successfully.\n\n";
    } else {
        die("Error adding column: " . $mysqli->error . "\n");
    }
}

// Step 2: Set default family heads based on member_order = 1
echo "Step 2: Setting default family heads...\n";

// First, set all members with member_order = 1 as family heads
$sql1 = "UPDATE members 
         SET is_head_of_family = 1 
         WHERE member_order = 1";

if ($mysqli->query($sql1) === TRUE) {
    $affected1 = $mysqli->affected_rows;
    echo "✓ Set $affected1 members with member_order = 1 as family heads.\n";
} else {
    die("Error setting family heads: " . $mysqli->error . "\n");
}

// Then, ensure all other members are set to false
$sql2 = "UPDATE members 
         SET is_head_of_family = 0 
         WHERE member_order != 1 OR member_order IS NULL";

if ($mysqli->query($sql2) === TRUE) {
    $affected2 = $mysqli->affected_rows;
    echo "✓ Set $affected2 other members as non-heads.\n\n";
} else {
    die("Error updating non-heads: " . $mysqli->error . "\n");
}

// Step 3: Verify the changes
echo "Step 3: Verifying changes...\n";
$verify = $mysqli->query("SELECT 
    COUNT(*) as total_members,
    SUM(is_head_of_family = 1) as family_heads,
    SUM(is_head_of_family = 0) as non_heads
FROM members");

if ($verify) {
    $stats = $verify->fetch_assoc();
    echo "✓ Total members: " . $stats['total_members'] . "\n";
    echo "✓ Family heads: " . $stats['family_heads'] . "\n";
    echo "✓ Non-heads: " . $stats['non_heads'] . "\n\n";
}

// Step 4: Show sample data
echo "Step 4: Sample data (first 5 family heads):\n";
$sample = $mysqli->query("SELECT id, name, member_serial_num, member_order, is_head_of_family 
                          FROM members 
                          WHERE is_head_of_family = 1 
                          ORDER BY member_serial_num 
                          LIMIT 5");

if ($sample && $sample->num_rows > 0) {
    echo str_pad("Name", 30) . str_pad("Serial#", 10) . str_pad("Order", 8) . "IsHead\n";
    echo str_repeat("-", 58) . "\n";
    while ($row = $sample->fetch_assoc()) {
        echo str_pad($row['name'], 30) . 
             str_pad($row['member_serial_num'], 10) . 
             str_pad($row['member_order'], 8) . 
             ($row['is_head_of_family'] ? 'Yes' : 'No') . "\n";
    }
}

echo "\n✅ Migration completed successfully!\n";

// Close connection
$mysqli->close();
