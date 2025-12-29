<?php
/**
 * Lutheran Church Management System
 * Database Schema Import Script
 * 
 * This script imports the schema.sql file into the database
 * Usage: php import_schema.php
 * Or access via browser: http://localhost/import_schema.php
 */

// Set execution time limit (schema import may take time)
set_time_limit(300);
ini_set('memory_limit', '256M');

// Display errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<!DOCTYPE html>\n";
echo "<html><head><title>Database Schema Import</title>";
echo "<style>
body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
.success { color: green; background: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; }
.error { color: red; background: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0; }
.info { color: blue; background: #d1ecf1; padding: 10px; border-radius: 5px; margin: 10px 0; }
.progress { background: #e9ecef; padding: 5px; margin: 5px 0; }
h1 { color: #333; }
</style></head><body>";

echo "<h1>🗄️ Database Schema Import</h1>";

// Load environment variables from .env file
function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        return false;
    }
    
    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Parse KEY=VALUE
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Remove quotes if present
            $value = trim($value, '"\'');
            
            $env[$key] = $value;
        }
    }
    
    return $env;
}

// Load .env file from backend directory
echo "<div class='info'>📋 Loading configuration from backend/.env file...</div>";
$env = loadEnv(__DIR__ . '/backend/.env');

if (!$env) {
    echo "<div class='error'>❌ Error: backend/.env file not found!</div>";
    echo "</body></html>";
    exit(1);
}

// Extract database configuration
$dbHost = $env['database.default.hostname'] ?? 'localhost';
$dbName = $env['database.default.database'] ?? 'lutheran_church';
$dbUser = $env['database.default.username'] ?? 'root';
$dbPass = $env['database.default.password'] ?? '';
$dbPort = $env['database.default.port'] ?? 3306;

echo "<div class='info'>🔧 Database Configuration:<br>";
echo "Host: {$dbHost}<br>";
echo "Database: {$dbName}<br>";
echo "Username: {$dbUser}<br>";
echo "Port: {$dbPort}</div>";

// Check if schema_production_final.sql exists (preferred for production)
$schemaFile = __DIR__ . '/schema_production_final.sql';
if (!file_exists($schemaFile)) {
    // Fallback to schema.sql if production file not found
    $schemaFile = __DIR__ . '/schema.sql';
    if (!file_exists($schemaFile)) {
        echo "<div class='error'>❌ Error: Neither schema_production_final.sql nor schema.sql file found!</div>";
        echo "</body></html>";
        exit(1);
    }
    echo "<div class='error' style='background: #fff3cd; color: #856404;'>⚠️ Using schema.sql (fallback). For production, use schema_production_final.sql</div>";
} else {
    echo "<div class='success'>✅ Using production schema file (schema_production_final.sql)</div>";
}

echo "<div class='success'>✅ Found schema file (" . number_format(filesize($schemaFile)) . " bytes)</div>";

// Connect to MySQL server (without selecting database first)
echo "<div class='info'>🔌 Connecting to MySQL server...</div>";

try {
    $mysqli = new mysqli($dbHost, $dbUser, $dbPass, '', $dbPort);
    
    if ($mysqli->connect_error) {
        throw new Exception("Connection failed: " . $mysqli->connect_error);
    }
    
    echo "<div class='success'>✅ Connected to MySQL server successfully</div>";
    
    // Set character set
    $mysqli->set_charset("utf8mb4");
    
    // Try to create database if it doesn't exist (may fail on shared hosting)
    echo "<div class='info'>🗄️ Checking database '{$dbName}'...</div>";
    
    // Try to create database (will fail on shared hosting, which is OK)
    $createDbQuery = "CREATE DATABASE IF NOT EXISTS `{$dbName}` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    
    $canCreateDb = @$mysqli->query($createDbQuery);
    if ($canCreateDb) {
        echo "<div class='success'>✅ Database '{$dbName}' is ready</div>";
    } else {
        // Database creation failed - likely shared hosting restriction
        echo "<div class='error' style='background: #fff3cd; color: #856404;'>⚠️ Cannot create database (shared hosting restriction). Using existing database '{$dbName}'</div>";
    }
    
    // Select the database
    if (!$mysqli->select_db($dbName)) {
        throw new Exception("Cannot select database '{$dbName}'. Please ensure it exists: " . $mysqli->error);
    }
    
    echo "<div class='success'>✅ Connected to database '{$dbName}'</div>";
    
    // Read the SQL file
    echo "<div class='info'>📖 Reading schema.sql file...</div>";
    $sql = file_get_contents($schemaFile);
    
    if ($sql === false) {
        throw new Exception("Failed to read schema.sql file");
    }
    
    echo "<div class='success'>✅ Schema file loaded successfully</div>";
    
    // Preprocess SQL to handle DELIMITER statements
    echo "<div class='info'>🔧 Preprocessing SQL file...</div>";
    
    // Remove DELIMITER statements and fix stored procedures
    $sql = preg_replace('/DELIMITER\s+\$\$/i', '', $sql);
    $sql = preg_replace('/DELIMITER\s+;/i', '', $sql);
    
    // Replace $$ with ; in procedure definitions
    $sql = str_replace('$$', ';', $sql);
    
    // Remove DEFINER clauses (causes issues on shared hosting)
    $sql = preg_replace('/DEFINER\s*=\s*`[^`]+`@`[^`]+`/i', '', $sql);
    
    echo "<div class='success'>✅ SQL preprocessing complete</div>";
    
    // Split SQL into individual statements
    echo "<div class='info'>⚙️ Executing SQL statements...</div>";
    
    // Disable foreign key checks temporarily
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 0");
    
    // Split by semicolons but be smart about it
    $statements = [];
    $currentStatement = '';
    $inProcedure = false;
    
    $lines = explode("\n", $sql);
    
    foreach ($lines as $line) {
        $trimmedLine = trim($line);
        
        // Skip empty lines and comments
        if (empty($trimmedLine) || strpos($trimmedLine, '--') === 0) {
            continue;
        }
        
        // Check if we're entering a procedure/trigger
        if (preg_match('/CREATE\s+(PROCEDURE|TRIGGER|FUNCTION)/i', $trimmedLine)) {
            $inProcedure = true;
        }
        
        $currentStatement .= $line . "\n";
        
        // Check if statement ends with semicolon
        if (substr(rtrim($trimmedLine), -1) === ';') {
            // If we're in a procedure, check for END; to close it
            if ($inProcedure && preg_match('/END\s*;/i', $trimmedLine)) {
                $inProcedure = false;
                $statements[] = trim($currentStatement);
                $currentStatement = '';
            } elseif (!$inProcedure) {
                $statements[] = trim($currentStatement);
                $currentStatement = '';
            }
        }
    }
    
    // Add any remaining statement
    if (!empty(trim($currentStatement))) {
        $statements[] = trim($currentStatement);
    }
    
    echo "<div class='info'>📊 Found " . count($statements) . " SQL statements to execute</div>";
    
    // Execute statements one by one
    $statementCount = 0;
    $successCount = 0;
    $errorCount = 0;
    $skippedTriggers = 0;
    
    foreach ($statements as $statement) {
        $statementCount++;
        
        if (empty($statement)) {
            continue;
        }
        
        // Check if this is a trigger statement
        $isTrigger = preg_match('/CREATE\s+TRIGGER/i', $statement);
        
        // Execute the statement with error suppression for triggers
        $result = false;
        $error = '';
        
        try {
            // Suppress errors for trigger statements
            if ($isTrigger) {
                $result = @$mysqli->query($statement);
                $error = $mysqli->error;
            } else {
                $result = $mysqli->query($statement);
                $error = $mysqli->error;
            }
        } catch (Exception $e) {
            $error = $e->getMessage();
        }
        
        if ($result) {
            $successCount++;
            
            // Print progress every 10 statements
            if ($statementCount % 10 == 0) {
                echo "<div class='progress'>📊 Processed {$statementCount} statements ({$successCount} successful)...</div>";
                flush();
            }
        } else {
            // Check if it's a trigger privilege error
            if ($isTrigger && (
                strpos($error, 'SUPER privilege') !== false || 
                strpos($error, 'log_bin_trust_function_creators') !== false
            )) {
                $skippedTriggers++;
                // Don't count as error, just skip
                if ($skippedTriggers == 1) {
                    echo "<div class='error' style='background: #fff3cd; color: #856404;'>⚠️ Skipping triggers due to hosting restrictions (SUPER privilege required)</div>";
                }
            } else {
                $errorCount++;
                // Only show first few errors to avoid overwhelming output
                if ($errorCount <= 5) {
                    $shortStatement = substr($statement, 0, 100) . '...';
                    echo "<div class='error'>⚠️ Error on statement {$statementCount}: " . $error . "<br>";
                    echo "Statement: " . htmlspecialchars($shortStatement) . "</div>";
                }
            }
        }
    }
    
    if ($errorCount > 5) {
        echo "<div class='error'>⚠️ ... and " . ($errorCount - 5) . " more errors</div>";
    }
    
    if ($skippedTriggers > 0) {
        echo "<div class='error' style='background: #fff3cd; color: #856404;'>";
        echo "⚠️ Skipped {$skippedTriggers} triggers due to hosting restrictions.<br>";
        echo "This is normal on shared hosting. The application will work fine, but you'll need to manually provide UUIDs when inserting data.<br>";
        echo "Contact your hosting provider to enable 'log_bin_trust_function_creators' if you need triggers.";
        echo "</div>";
    }
    
    echo "<div class='success'>✅ Executed {$successCount} SQL statements successfully";
    if ($errorCount > 0) {
        echo " ({$errorCount} errors)";
    }
    if ($skippedTriggers > 0) {
        echo " ({$skippedTriggers} triggers skipped)";
    }
    echo "</div>";
    
    // Re-enable foreign key checks
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    
    // Verify the import
    echo "<div class='info'>🔍 Verifying database structure...</div>";
    
    // Count tables
    $result = $mysqli->query("SHOW TABLES");
    $tableCount = $result->num_rows;
    echo "<div class='success'>✅ Tables created: {$tableCount}</div>";
    
    // Count stored procedures
    $result = $mysqli->query("SHOW PROCEDURE STATUS WHERE Db = '{$dbName}'");
    $procCount = $result->num_rows;
    echo "<div class='success'>✅ Stored procedures created: {$procCount}</div>";
    
    // Count triggers
    $result = $mysqli->query("SHOW TRIGGERS");
    $triggerCount = $result->num_rows;
    echo "<div class='success'>✅ Triggers created: {$triggerCount}</div>";
    
    // Count views
    $result = $mysqli->query("SHOW FULL TABLES WHERE Table_type = 'VIEW'");
    $viewCount = $result->num_rows;
    echo "<div class='success'>✅ Views created: {$viewCount}</div>";
    
    // Check for admin user
    $result = $mysqli->query("SELECT COUNT(*) as count FROM admin_users");
    $row = $result->fetch_assoc();
    echo "<div class='success'>✅ Admin users: {$row['count']}</div>";
    
    // Check for members
    $result = $mysqli->query("SELECT COUNT(*) as count FROM members");
    $row = $result->fetch_assoc();
    echo "<div class='success'>✅ Members: {$row['count']}</div>";
    
    echo "<div class='success' style='font-size: 18px; font-weight: bold; margin-top: 20px;'>";
    echo "🎉 Database schema imported successfully!</div>";
    
    echo "<div class='info' style='margin-top: 20px;'>";
    echo "<strong>Login Credentials:</strong><br><br>";
    echo "<strong>Admin Portal:</strong><br>";
    echo "Username: <code>admin</code><br>";
    echo "Password: <code>admin123</code><br><br>";
    echo "<strong>Member Portal:</strong><br>";
    echo "Member Code: <code>LCH001</code><br>";
    echo "Password: <code>member123</code>";
    echo "</div>";
    
    // Close connection
    $mysqli->close();
    
} catch (Exception $e) {
    echo "<div class='error'>❌ Error: " . $e->getMessage() . "</div>";
    echo "<div class='error'>Stack trace:<br><pre>" . $e->getTraceAsString() . "</pre></div>";
    
    if (isset($mysqli)) {
        $mysqli->close();
    }
    
    echo "</body></html>";
    exit(1);
}

echo "</body></html>";
?>
