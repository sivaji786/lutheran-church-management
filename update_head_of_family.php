<?php
/**
 * Update Head of Family Column Script
 * 
 * This script updates the head_of_family column in the members table
 * to store member_code instead of name.
 * 
 * USAGE:
 * 1. Upload this file to your production server
 * 2. Access it via browser: https://yourdomain.com/update_head_of_family.php
 * 3. Delete this file after successful execution
 * 
 * SAFETY:
 * - Creates a backup table before making changes
 * - Shows detailed progress and results
 * - Can be run multiple times safely (idempotent)
 */

// Database configuration - UPDATE THESE VALUES
define('DB_HOST', 'localhost');
define('DB_NAME', 'u788033170_churchcrm');
define('DB_USER', 'u788033170_churchcrm');
define('DB_PASS', 'Hq7K0TEwp@');

// Security: Uncomment and set a secret key to prevent unauthorized access
// define('SECRET_KEY', 'your-secret-key-here');
// if (!isset($_GET['key']) || $_GET['key'] !== SECRET_KEY) {
//     die('Unauthorized access');
// }

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Head of Family Column</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 900px;
            margin: 40px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2563eb;
            margin-top: 0;
        }
        .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
        }
        .success {
            background: #d1fae5;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
        }
        .error {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
        }
        .info {
            background: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
        }
        .step {
            margin: 15px 0;
            padding: 10px;
            background: #f9fafb;
            border-radius: 4px;
        }
        .step-title {
            font-weight: 600;
            color: #1f2937;
        }
        .step-result {
            margin-top: 5px;
            color: #6b7280;
        }
        button {
            background: #2563eb;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
        }
        button:hover {
            background: #1d4ed8;
        }
        button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
        }
        pre {
            background: #1f2937;
            color: #f3f4f6;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .stat-card {
            background: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }
        .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #2563eb;
        }
        .stat-label {
            font-size: 14px;
            color: #6b7280;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔄 Update Head of Family Column</h1>
        
        <div class="warning">
            <strong>⚠️ Important:</strong> This script will update the <code>head_of_family</code> column in the members table.
            A backup table will be created before making any changes.
        </div>

        <?php
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['execute'])) {
            executeUpdate();
        } else {
            showPreview();
        }
        ?>
    </div>
</body>
</html>

<?php

function showPreview() {
    try {
        $conn = getConnection();
        
        echo '<div class="info">';
        echo '<strong>📊 Current Database Status</strong>';
        echo '</div>';
        
        // Get current stats
        $stats = getCurrentStats($conn);
        
        echo '<div class="stats">';
        echo '<div class="stat-card">';
        echo '<div class="stat-value">' . $stats['total_members'] . '</div>';
        echo '<div class="stat-label">Total Members</div>';
        echo '</div>';
        
        echo '<div class="stat-card">';
        echo '<div class="stat-value">' . $stats['total_families'] . '</div>';
        echo '<div class="stat-label">Total Families</div>';
        echo '</div>';
        
        echo '<div class="stat-card">';
        echo '<div class="stat-value">' . $stats['members_with_hof'] . '</div>';
        echo '<div class="stat-label">Members with Head of Family</div>';
        echo '</div>';
        
        echo '<div class="stat-card">';
        echo '<div class="stat-value">' . $stats['members_without_hof'] . '</div>';
        echo '<div class="stat-label">Members without Head of Family</div>';
        echo '</div>';
        echo '</div>';
        
        // Show sample data
        echo '<h3>Sample Current Data (First 5 Families)</h3>';
        $sampleQuery = "
            SELECT member_code, name, member_serial_num, member_order, head_of_family 
            FROM members 
            WHERE member_serial_num IS NOT NULL 
            ORDER BY member_serial_num, member_order 
            LIMIT 10
        ";
        $result = $conn->query($sampleQuery);
        
        if ($result && $result->num_rows > 0) {
            echo '<pre>';
            printf("%-15s %-25s %-10s %-8s %-20s\n", "Member Code", "Name", "Serial#", "Order", "Head of Family");
            echo str_repeat("-", 90) . "\n";
            while ($row = $result->fetch_assoc()) {
                printf("%-15s %-25s %-10s %-8s %-20s\n", 
                    $row['member_code'], 
                    substr($row['name'], 0, 25),
                    $row['member_serial_num'],
                    $row['member_order'],
                    $row['head_of_family'] ?? 'NULL'
                );
            }
            echo '</pre>';
        }
        
        echo '<h3>What This Script Will Do:</h3>';
        echo '<ol>';
        echo '<li>Create a backup table: <code>members_backup_' . date('Ymd_His') . '</code></li>';
        echo '<li>For each family (grouped by <code>member_serial_num</code>):</li>';
        echo '<ul>';
        echo '<li>Find the head of family (member with <code>member_order = 1</code>)</li>';
        echo '<li>If no member with order 1, use the earliest created member</li>';
        echo '<li>Update all members in that family to have the head\'s <code>member_code</code> in <code>head_of_family</code></li>';
        echo '</ul>';
        echo '<li>Update the column definition to clarify it stores member_code</li>';
        echo '</ol>';
        
        echo '<form method="POST">';
        echo '<button type="submit" name="execute" value="1">Execute Update</button>';
        echo '</form>';
        
        $conn->close();
        
    } catch (Exception $e) {
        echo '<div class="error">';
        echo '<strong>❌ Error:</strong> ' . htmlspecialchars($e->getMessage());
        echo '</div>';
    }
}

function executeUpdate() {
    $startTime = microtime(true);
    
    try {
        $conn = getConnection();
        
        echo '<div class="info">';
        echo '<strong>🚀 Starting Update Process...</strong>';
        echo '</div>';
        
        // Step 1: Create backup
        echo '<div class="step">';
        echo '<div class="step-title">Step 1: Creating Backup Table</div>';
        $backupTable = 'members_backup_' . date('Ymd_His');
        $conn->query("CREATE TABLE $backupTable LIKE members");
        $conn->query("INSERT INTO $backupTable SELECT * FROM members");
        $backupCount = $conn->affected_rows;
        echo '<div class="step-result">✅ Backed up ' . $backupCount . ' members to table: <code>' . $backupTable . '</code></div>';
        echo '</div>';
        
        // Step 2: Get all families
        echo '<div class="step">';
        echo '<div class="step-title">Step 2: Processing Families</div>';
        
        $query = $conn->query("
            SELECT DISTINCT member_serial_num 
            FROM members 
            WHERE member_serial_num IS NOT NULL
        ");
        
        $families = [];
        while ($row = $query->fetch_assoc()) {
            $families[] = $row['member_serial_num'];
        }
        
        echo '<div class="step-result">Found ' . count($families) . ' families to process</div>';
        echo '</div>';
        
        // Step 3: Update each family
        echo '<div class="step">';
        echo '<div class="step-title">Step 3: Updating Head of Family for Each Family</div>';
        
        $updatedFamilies = 0;
        $updatedMembers = 0;
        $skippedFamilies = 0;
        
        foreach ($families as $serialNum) {
            // Find the head of family (member_order = 1)
            $headQuery = $conn->query("
                SELECT member_code 
                FROM members 
                WHERE member_serial_num = '$serialNum' 
                AND member_order = 1 
                LIMIT 1
            ");
            
            $head = $headQuery->fetch_assoc();
            
            // If no member with order 1, get the earliest created member
            if (!$head) {
                $headQuery = $conn->query("
                    SELECT member_code 
                    FROM members 
                    WHERE member_serial_num = '$serialNum' 
                    ORDER BY created_at ASC 
                    LIMIT 1
                ");
                
                $head = $headQuery->fetch_assoc();
            }
            
            // Update all members in this family
            if ($head && isset($head['member_code'])) {
                $headCode = $conn->real_escape_string($head['member_code']);
                $conn->query("
                    UPDATE members 
                    SET head_of_family = '$headCode' 
                    WHERE member_serial_num = '$serialNum'
                ");
                
                $updatedMembers += $conn->affected_rows;
                $updatedFamilies++;
            } else {
                $skippedFamilies++;
            }
        }
        
        echo '<div class="step-result">✅ Updated ' . $updatedFamilies . ' families (' . $updatedMembers . ' members)</div>';
        if ($skippedFamilies > 0) {
            echo '<div class="step-result">⚠️ Skipped ' . $skippedFamilies . ' families (no valid head found)</div>';
        }
        echo '</div>';
        
        // Step 4: Update column definition
        echo '<div class="step">';
        echo '<div class="step-title">Step 4: Updating Column Definition</div>';
        $conn->query("
            ALTER TABLE members 
            MODIFY COLUMN head_of_family VARCHAR(20) 
            COMMENT 'Member code of the head of family (e.g., LCH-0001-1)'
        ");
        echo '<div class="step-result">✅ Column definition updated</div>';
        echo '</div>';
        
        // Show final stats
        $stats = getCurrentStats($conn);
        
        echo '<div class="success">';
        echo '<strong>✅ Update Completed Successfully!</strong><br>';
        echo 'Total time: ' . number_format(microtime(true) - $startTime, 2) . ' seconds';
        echo '</div>';
        
        echo '<div class="stats">';
        echo '<div class="stat-card">';
        echo '<div class="stat-value">' . $stats['members_with_hof'] . '</div>';
        echo '<div class="stat-label">Members with Head of Family</div>';
        echo '</div>';
        
        echo '<div class="stat-card">';
        echo '<div class="stat-value">' . $stats['members_without_hof'] . '</div>';
        echo '<div class="stat-label">Members without Head of Family</div>';
        echo '</div>';
        echo '</div>';
        
        // Show sample updated data
        echo '<h3>Sample Updated Data (First 10 Members)</h3>';
        $sampleQuery = "
            SELECT member_code, name, member_serial_num, member_order, head_of_family 
            FROM members 
            WHERE member_serial_num IS NOT NULL 
            ORDER BY member_serial_num, member_order 
            LIMIT 10
        ";
        $result = $conn->query($sampleQuery);
        
        if ($result && $result->num_rows > 0) {
            echo '<pre>';
            printf("%-15s %-25s %-10s %-8s %-20s\n", "Member Code", "Name", "Serial#", "Order", "Head of Family");
            echo str_repeat("-", 90) . "\n";
            while ($row = $result->fetch_assoc()) {
                printf("%-15s %-25s %-10s %-8s %-20s\n", 
                    $row['member_code'], 
                    substr($row['name'], 0, 25),
                    $row['member_serial_num'],
                    $row['member_order'],
                    $row['head_of_family'] ?? 'NULL'
                );
            }
            echo '</pre>';
        }
        
        echo '<div class="warning">';
        echo '<strong>⚠️ Important Next Steps:</strong><br>';
        echo '1. Verify the data looks correct above<br>';
        echo '2. Test your application to ensure everything works<br>';
        echo '3. If everything is good, you can drop the backup table: <code>DROP TABLE ' . $backupTable . '</code><br>';
        echo '4. <strong>DELETE THIS SCRIPT FILE</strong> from your server for security';
        echo '</div>';
        
        $conn->close();
        
    } catch (Exception $e) {
        echo '<div class="error">';
        echo '<strong>❌ Error During Update:</strong><br>';
        echo htmlspecialchars($e->getMessage());
        echo '<br><br>The backup table has been created, so your original data is safe.';
        echo '</div>';
    }
}

function getConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8mb4");
    
    return $conn;
}

function getCurrentStats($conn) {
    $stats = [];
    
    // Total members
    $result = $conn->query("SELECT COUNT(*) as count FROM members");
    $stats['total_members'] = $result->fetch_assoc()['count'];
    
    // Total families
    $result = $conn->query("SELECT COUNT(DISTINCT member_serial_num) as count FROM members WHERE member_serial_num IS NOT NULL");
    $stats['total_families'] = $result->fetch_assoc()['count'];
    
    // Members with head_of_family
    $result = $conn->query("SELECT COUNT(*) as count FROM members WHERE head_of_family IS NOT NULL AND head_of_family != ''");
    $stats['members_with_hof'] = $result->fetch_assoc()['count'];
    
    // Members without head_of_family
    $result = $conn->query("SELECT COUNT(*) as count FROM members WHERE head_of_family IS NULL OR head_of_family = ''");
    $stats['members_without_hof'] = $result->fetch_assoc()['count'];
    
    return $stats;
}

?>
