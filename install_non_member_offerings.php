<?php
/**
 * Non-Member Offerings Table Installation Script
 * Lutheran Church Management System
 * 
 * This script installs the non_member_offerings table into your database
 * Run this script from the command line: php install_non_member_offerings.php
 */

// Load environment variables from backend/.env
$envFile = __DIR__ . '/backend/.env';

if (!file_exists($envFile)) {
    die("Error: .env file not found at {$envFile}\n");
}

// Parse .env file manually (CodeIgniter format)
$envVars = [];
$lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

foreach ($lines as $line) {
    $line = trim($line);
    
    // Skip comments and empty lines
    if (empty($line) || strpos($line, '#') === 0) {
        continue;
    }
    
    // Parse key = value
    if (strpos($line, '=') !== false) {
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        
        // Remove quotes if present
        if ((substr($value, 0, 1) === '"' && substr($value, -1) === '"') ||
            (substr($value, 0, 1) === "'" && substr($value, -1) === "'")) {
            $value = substr($value, 1, -1);
        }
        
        $envVars[$key] = $value;
    }
}

// Extract database credentials
$dbHost = $envVars['database.default.hostname'] ?? 'localhost';
$dbName = $envVars['database.default.database'] ?? '';
$dbUser = $envVars['database.default.username'] ?? 'root';
$dbPass = $envVars['database.default.password'] ?? '';
$dbPort = $envVars['database.default.port'] ?? 3306;

if (empty($dbName)) {
    die("Error: Database name not found in .env file\n");
}

echo "=================================================\n";
echo "Non-Member Offerings Table Installation\n";
echo "=================================================\n\n";
echo "Database: {$dbName}\n";
echo "Host: {$dbHost}:{$dbPort}\n";
echo "User: {$dbUser}\n\n";

try {
    // Connect to database
    $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    echo "✓ Connected to database successfully\n\n";
    
    // Read SQL file
    $sqlFile = __DIR__ . '/database/non_member_offerings_table.sql';
    
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL file not found: {$sqlFile}");
    }
    
    $sql = file_get_contents($sqlFile);
    
    if ($sql === false) {
        throw new Exception("Could not read SQL file");
    }
    
    echo "✓ SQL file loaded successfully\n\n";
    echo "Installing non_member_offerings table...\n";
    
    // Execute SQL (split by delimiter changes and statements)
    $statements = [];
    $currentStatement = '';
    $delimiter = ';';
    
    $lines = explode("\n", $sql);
    
    foreach ($lines as $line) {
        $line = trim($line);
        
        // Skip comments and empty lines
        if (empty($line) || strpos($line, '--') === 0 || strpos($line, '/*') === 0) {
            continue;
        }
        
        // Check for delimiter change
        if (stripos($line, 'DELIMITER') === 0) {
            if (!empty($currentStatement)) {
                $statements[] = $currentStatement;
                $currentStatement = '';
            }
            
            // Extract new delimiter
            $parts = preg_split('/\s+/', $line);
            if (isset($parts[1])) {
                $delimiter = $parts[1];
            }
            continue;
        }
        
        $currentStatement .= $line . "\n";
        
        // Check if statement is complete
        if (substr(rtrim($line), -strlen($delimiter)) === $delimiter) {
            // Remove delimiter from end
            $currentStatement = substr($currentStatement, 0, -strlen($delimiter) - 1);
            
            if (!empty(trim($currentStatement))) {
                $statements[] = trim($currentStatement);
            }
            
            $currentStatement = '';
        }
    }
    
    // Add any remaining statement
    if (!empty(trim($currentStatement))) {
        $statements[] = trim($currentStatement);
    }
    
    // Execute each statement
    $executedCount = 0;
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (empty($statement)) {
            continue;
        }
        
        try {
            $pdo->exec($statement);
            $executedCount++;
        } catch (PDOException $e) {
            // Ignore "already exists" errors for idempotency
            if (strpos($e->getMessage(), 'already exists') === false) {
                throw $e;
            }
        }
    }
    
    echo "✓ Executed {$executedCount} SQL statements\n\n";
    
    // Verify table was created
    $stmt = $pdo->query("SHOW TABLES LIKE 'non_member_offerings'");
    $tableExists = $stmt->fetch();
    
    if ($tableExists) {
        echo "✓ Table 'non_member_offerings' created successfully\n";
        
        // Show table structure
        $stmt = $pdo->query("DESCRIBE non_member_offerings");
        $columns = $stmt->fetchAll();
        
        echo "\nTable Structure:\n";
        echo str_repeat("-", 80) . "\n";
        printf("%-20s %-30s %-10s %-10s\n", "Field", "Type", "Null", "Key");
        echo str_repeat("-", 80) . "\n";
        
        foreach ($columns as $column) {
            printf(
                "%-20s %-30s %-10s %-10s\n",
                $column['Field'],
                $column['Type'],
                $column['Null'],
                $column['Key']
            );
        }
        
        echo str_repeat("-", 80) . "\n\n";
        
        // Verify stored procedure
        $stmt = $pdo->query("SHOW PROCEDURE STATUS WHERE Name = 'sp_non_member_offering_stats'");
        $procExists = $stmt->fetch();
        
        if ($procExists) {
            echo "✓ Stored procedure 'sp_non_member_offering_stats' created successfully\n";
        }
        
        // Verify trigger
        $stmt = $pdo->query("SHOW TRIGGERS WHERE `Trigger` = 'trg_before_insert_non_member_offerings'");
        $triggerExists = $stmt->fetch();
        
        if ($triggerExists) {
            echo "✓ Trigger 'trg_before_insert_non_member_offerings' created successfully\n";
        }
        
        echo "\n=================================================\n";
        echo "Installation completed successfully!\n";
        echo "=================================================\n";
        
    } else {
        throw new Exception("Table creation verification failed");
    }
    
} catch (PDOException $e) {
    echo "\n✗ Database Error: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "\n✗ Error: " . $e->getMessage() . "\n";
    exit(1);
}
