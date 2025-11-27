<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lutheran Church Management System - Installation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 800px;
            width: 100%;
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .header p {
            opacity: 0.9;
            font-size: 16px;
        }

        .content {
            padding: 40px;
        }

        .step-indicator {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            position: relative;
        }

        .step-indicator::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            height: 2px;
            background: #e0e0e0;
            z-index: 0;
        }

        .step {
            flex: 1;
            text-align: center;
            position: relative;
            z-index: 1;
        }

        .step-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #e0e0e0;
            color: #999;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            font-weight: bold;
            transition: all 0.3s;
        }

        .step.active .step-circle {
            background: #667eea;
            color: white;
        }

        .step.completed .step-circle {
            background: #10b981;
            color: white;
        }

        .step-label {
            font-size: 12px;
            color: #666;
        }

        .step.active .step-label {
            color: #667eea;
            font-weight: 600;
        }

        .form-group {
            margin-bottom: 25px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
            font-size: 14px;
        }

        input[type="text"],
        input[type="password"],
        input[type="number"],
        select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        input:focus,
        select:focus {
            outline: none;
            border-color: #667eea;
        }

        .input-hint {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }

        .btn {
            padding: 14px 32px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-block;
            text-decoration: none;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: #e0e0e0;
            color: #333;
        }

        .btn-secondary:hover {
            background: #d0d0d0;
        }

        .btn-group {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }

        .alert {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 25px;
        }

        .alert-success {
            background: #d1fae5;
            color: #065f46;
            border-left: 4px solid #10b981;
        }

        .alert-error {
            background: #fee2e2;
            color: #991b1b;
            border-left: 4px solid #ef4444;
        }

        .alert-warning {
            background: #fef3c7;
            color: #92400e;
            border-left: 4px solid #f59e0b;
        }

        .alert-info {
            background: #dbeafe;
            color: #1e40af;
            border-left: 4px solid #3b82f6;
        }

        .check-item {
            display: flex;
            align-items: center;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 8px;
            background: #f9fafb;
        }

        .check-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 14px;
        }

        .check-icon.success {
            background: #10b981;
            color: white;
        }

        .check-icon.error {
            background: #ef4444;
            color: white;
        }

        .check-icon.warning {
            background: #f59e0b;
            color: white;
        }

        .check-label {
            flex: 1;
            font-size: 14px;
        }

        .check-value {
            font-size: 13px;
            color: #666;
            font-weight: 500;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 20px 0;
        }

        .checkbox-group input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        .checkbox-group label {
            margin: 0;
            cursor: pointer;
            font-weight: normal;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            margin: 20px 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s;
        }

        .code-block {
            background: #1f2937;
            color: #f3f4f6;
            padding: 16px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            overflow-x: auto;
            margin: 15px 0;
        }

        .hidden {
            display: none;
        }

        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        @media (max-width: 768px) {
            .two-column {
                grid-template-columns: 1fr;
            }
        }

        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⛪ Lutheran Church Management System</h1>
            <p>Installation Wizard</p>
        </div>

        <div class="content">
            <?php
            // Start session with proper settings
            if (session_status() === PHP_SESSION_NONE) {
                ini_set('session.gc_maxlifetime', 3600);
                session_start();
            }

            // Check if already installed
            if (file_exists('backend/.env') && file_exists('.env') && !isset($_GET['force'])) {
                echo '<div class="alert alert-warning">';
                echo '<strong>⚠️ Already Installed</strong><br>';
                echo 'The application appears to be already installed. If you want to reinstall, ';
                echo '<a href="?force=1">click here</a> (this will overwrite existing configuration).';
                echo '</div>';
                echo '<div class="btn-group">';
                echo '<a href="backend/public" class="btn btn-primary">Go to Backend</a>';
                echo '<a href="index.html" class="btn btn-secondary">Go to Frontend</a>';
                echo '</div>';
                exit;
            }

            // Initialize session variables
            if (!isset($_SESSION['step'])) {
                $_SESSION['step'] = 1;
            }

            $step = $_SESSION['step'];
            $errors = [];
            $success = [];

            // Handle form submissions
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                if (isset($_POST['action'])) {
                    switch ($_POST['action']) {
                        case 'check_prerequisites':
                            $_SESSION['step'] = 2;
                            $step = 2;
                            break;

                        case 'configure_database':
                            // Validate database configuration
                            $required = ['db_host', 'db_name', 'db_user', 'db_pass', 'db_port'];
                            $valid = true;
                            foreach ($required as $field) {
                                if (empty($_POST[$field]) && $field !== 'db_pass') {
                                    $errors[] = "Please fill in all database fields";
                                    $valid = false;
                                    break;
                                }
                            }

                            if ($valid) {
                                // Test database connection
                                try {
                                    $conn = new mysqli(
                                        $_POST['db_host'],
                                        $_POST['db_user'],
                                        $_POST['db_pass'],
                                        '',
                                        (int)$_POST['db_port']
                                    );

                                    if ($conn->connect_error) {
                                        throw new Exception($conn->connect_error);
                                    }

                                    // Store database config in session
                                    $_SESSION['db_config'] = [
                                        'host' => $_POST['db_host'],
                                        'name' => $_POST['db_name'],
                                        'user' => $_POST['db_user'],
                                        'pass' => $_POST['db_pass'],
                                        'port' => $_POST['db_port']
                                    ];
                                    
                                    // Force session write to ensure data is saved
                                    session_write_close();
                                    session_start();

                                    $conn->close();
                                    $_SESSION['step'] = 3;
                                    $step = 3;
                                } catch (Exception $e) {
                                    $errors[] = "Database connection failed: " . $e->getMessage();
                                }
                            }
                            break;

                        case 'install_database':
                            // Try to get database config from session first, then from POST as fallback
                            if (!isset($_SESSION['db_config']) && isset($_POST['db_host'])) {
                                // Reconstruct from POST data (fallback for session issues)
                                $_SESSION['db_config'] = [
                                    'host' => $_POST['db_host'],
                                    'name' => $_POST['db_name'],
                                    'user' => $_POST['db_user'],
                                    'pass' => $_POST['db_pass'],
                                    'port' => $_POST['db_port']
                                ];
                            }
                            
                            // Validate session has database config
                            if (!isset($_SESSION['db_config'])) {
                                $errors[] = "Database configuration not found in session. Please go back to Step 2 and re-enter your database details.";
                                // Force back to step 2
                                $_SESSION['step'] = 2;
                                $step = 2;
                                break;
                            }
                            
                            $db = $_SESSION['db_config'];
                            
                            // Validate db config has required fields
                            if (empty($db['host']) || empty($db['user']) || empty($db['name'])) {
                                $errors[] = "Invalid database configuration. Missing required fields. Please go back to Step 2.";
                                $_SESSION['step'] = 2;
                                $step = 2;
                                break;
                            }
                            try {
                                // Connect with proper password handling
                                $conn = new mysqli(
                                    $db['host'], 
                                    $db['user'], 
                                    isset($db['pass']) ? $db['pass'] : '', 
                                    '', 
                                    (int)$db['port']
                                );

                                if ($conn->connect_error) {
                                    throw new Exception($conn->connect_error);
                                }

                                // Create database
                                $dbName = $conn->real_escape_string($db['name']);
                                $conn->query("CREATE DATABASE IF NOT EXISTS `$dbName` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci");
                                $conn->select_db($dbName);

                                // Import schema
                                $schema = file_get_contents('database/schema.sql');
                                if ($schema === false) {
                                    throw new Exception("Could not read schema.sql file");
                                }

                                // Execute schema (split by delimiter changes)
                                $conn->multi_query($schema);
                                while ($conn->next_result()) {;}

                                // Import seed data if requested
                                if (isset($_POST['import_seed']) && $_POST['import_seed'] === '1') {
                                    $seed = file_get_contents('database/seed.sql');
                                    if ($seed !== false) {
                                        $conn->multi_query($seed);
                                        while ($conn->next_result()) {;}
                                    }
                                }

                                $conn->close();
                                $_SESSION['step'] = 4;
                                $step = 4;
                            } catch (Exception $e) {
                                $errors[] = "Database installation failed: " . $e->getMessage();
                            }
                            break;

                        case 'configure_app':
                            // Validate app configuration
                            if (empty($_POST['app_url']) || empty($_POST['api_url'])) {
                                $errors[] = "Please fill in all application URLs";
                            } else {
                                $_SESSION['app_config'] = [
                                    'app_url' => rtrim($_POST['app_url'], '/'),
                                    'api_url' => rtrim($_POST['api_url'], '/'),
                                    'environment' => $_POST['environment']
                                ];
                                $_SESSION['step'] = 5;
                                $step = 5;
                            }
                            break;

                        case 'finish_installation':
                            // Generate encryption keys
                            $encryptionKey = bin2hex(random_bytes(32));
                            $jwtSecret = bin2hex(random_bytes(64));

                            $db = $_SESSION['db_config'];
                            $app = $_SESSION['app_config'];

                            // Create backend .env
                            $backendEnv = "CI_ENVIRONMENT = {$app['environment']}

app.baseURL = '{$app['api_url']}'
app.forceGlobalSecureRequests = " . ($app['environment'] === 'production' ? 'true' : 'false') . "

database.default.hostname = {$db['host']}
database.default.database = {$db['name']}
database.default.username = {$db['user']}
database.default.password = {$db['pass']}
database.default.DBDriver = MySQLi
database.default.DBPrefix =
database.default.port = {$db['port']}
database.default.charset = utf8mb4
database.default.DBCollat = utf8mb4_unicode_ci

encryption.key = hex2bin('$encryptionKey')
JWT_SECRET = '$jwtSecret'

logger.threshold = " . ($app['environment'] === 'production' ? '3' : '4') . "
";

                            // Create frontend .env
                            $frontendEnv = "VITE_API_BASE_URL={$app['api_url']}
";

                            // Write .env files
                            if (!file_put_contents('backend/.env', $backendEnv)) {
                                $errors[] = "Could not write backend/.env file. Check permissions.";
                            }
                            if (!file_put_contents('.env', $frontendEnv)) {
                                $errors[] = "Could not write .env file. Check permissions.";
                            }

                            if (empty($errors)) {
                                // Create installation lock file
                                file_put_contents('.installed', date('Y-m-d H:i:s'));
                                $_SESSION['step'] = 6;
                                $step = 6;
                            }
                            break;
                    }
                }
            }

            // Display step indicator
            ?>
            <div class="step-indicator">
                <div class="step <?php echo $step >= 1 ? 'active' : ''; ?> <?php echo $step > 1 ? 'completed' : ''; ?>">
                    <div class="step-circle">1</div>
                    <div class="step-label">Prerequisites</div>
                </div>
                <div class="step <?php echo $step >= 2 ? 'active' : ''; ?> <?php echo $step > 2 ? 'completed' : ''; ?>">
                    <div class="step-circle">2</div>
                    <div class="step-label">Database</div>
                </div>
                <div class="step <?php echo $step >= 3 ? 'active' : ''; ?> <?php echo $step > 3 ? 'completed' : ''; ?>">
                    <div class="step-circle">3</div>
                    <div class="step-label">Import</div>
                </div>
                <div class="step <?php echo $step >= 4 ? 'active' : ''; ?> <?php echo $step > 4 ? 'completed' : ''; ?>">
                    <div class="step-circle">4</div>
                    <div class="step-label">Configure</div>
                </div>
                <div class="step <?php echo $step >= 5 ? 'active' : ''; ?> <?php echo $step > 5 ? 'completed' : ''; ?>">
                    <div class="step-circle">5</div>
                    <div class="step-label">Finalize</div>
                </div>
                <div class="step <?php echo $step >= 6 ? 'active' : ''; ?>">
                    <div class="step-circle">✓</div>
                    <div class="step-label">Complete</div>
                </div>
            </div>

            <?php
            // Display errors
            if (!empty($errors)) {
                echo '<div class="alert alert-error">';
                echo '<strong>❌ Error</strong><br>';
                foreach ($errors as $error) {
                    echo htmlspecialchars($error) . '<br>';
                }
                echo '</div>';
            }

            // Display success messages
            if (!empty($success)) {
                echo '<div class="alert alert-success">';
                foreach ($success as $msg) {
                    echo '✅ ' . htmlspecialchars($msg) . '<br>';
                }
                echo '</div>';
            }

            // Step content
            switch ($step) {
                case 1:
                    // Prerequisites Check
                    echo '<h2 style="margin-bottom: 20px;">System Requirements Check</h2>';
                    
                    $checks = [];
                    
                    // PHP Version
                    $phpVersion = phpversion();
                    $checks[] = [
                        'label' => 'PHP Version',
                        'value' => $phpVersion,
                        'status' => version_compare($phpVersion, '8.1.0', '>=') ? 'success' : 'error',
                        'required' => '8.1.0 or higher'
                    ];

                    // PHP Extensions
                    $requiredExtensions = ['mysqli', 'mbstring', 'json', 'curl', 'intl'];
                    foreach ($requiredExtensions as $ext) {
                        $checks[] = [
                            'label' => "PHP Extension: $ext",
                            'value' => extension_loaded($ext) ? 'Installed' : 'Missing',
                            'status' => extension_loaded($ext) ? 'success' : 'error'
                        ];
                    }

                    // File permissions
                    $writableDirs = ['backend/writable', 'backend/writable/cache', 'backend/writable/logs'];
                    foreach ($writableDirs as $dir) {
                        $writable = is_writable($dir);
                        $checks[] = [
                            'label' => "Writable: $dir",
                            'value' => $writable ? 'Yes' : 'No',
                            'status' => $writable ? 'success' : 'error'
                        ];
                    }

                    // Database files
                    $checks[] = [
                        'label' => 'Schema file',
                        'value' => file_exists('database/schema.sql') ? 'Found' : 'Missing',
                        'status' => file_exists('database/schema.sql') ? 'success' : 'error'
                    ];

                    $checks[] = [
                        'label' => 'Seed file',
                        'value' => file_exists('database/seed.sql') ? 'Found' : 'Missing',
                        'status' => file_exists('database/seed.sql') ? 'success' : 'warning'
                    ];

                    $allPassed = true;
                    foreach ($checks as $check) {
                        echo '<div class="check-item">';
                        echo '<div class="check-icon ' . $check['status'] . '">';
                        echo $check['status'] === 'success' ? '✓' : ($check['status'] === 'warning' ? '!' : '✗');
                        echo '</div>';
                        echo '<div class="check-label">' . htmlspecialchars($check['label']) . '</div>';
                        echo '<div class="check-value">' . htmlspecialchars($check['value']) . '</div>';
                        echo '</div>';

                        if ($check['status'] === 'error') {
                            $allPassed = false;
                        }
                    }

                    if ($allPassed) {
                        echo '<div class="alert alert-success" style="margin-top: 20px;">';
                        echo '✅ All prerequisites met! You can proceed with installation.';
                        echo '</div>';
                        echo '<form method="post">';
                        echo '<input type="hidden" name="action" value="check_prerequisites">';
                        echo '<div class="btn-group">';
                        echo '<button type="submit" class="btn btn-primary">Continue →</button>';
                        echo '</div>';
                        echo '</form>';
                    } else {
                        echo '<div class="alert alert-error" style="margin-top: 20px;">';
                        echo '❌ Some requirements are not met. Please fix the issues above before continuing.';
                        echo '</div>';
                    }
                    break;

                case 2:
                    // Database Configuration
                    echo '<h2 style="margin-bottom: 20px;">Database Configuration</h2>';
                    echo '<p style="margin-bottom: 30px; color: #666;">Enter your MySQL database connection details.</p>';
                    
                    echo '<form method="post">';
                    echo '<input type="hidden" name="action" value="configure_database">';
                    
                    echo '<div class="two-column">';
                    echo '<div class="form-group">';
                    echo '<label>Database Host</label>';
                    echo '<input type="text" name="db_host" value="localhost" required>';
                    echo '<div class="input-hint">Usually "localhost" or "127.0.0.1"</div>';
                    echo '</div>';
                    
                    echo '<div class="form-group">';
                    echo '<label>Database Port</label>';
                    echo '<input type="number" name="db_port" value="3306" required>';
                    echo '<div class="input-hint">Default MySQL port is 3306</div>';
                    echo '</div>';
                    echo '</div>';
                    
                    echo '<div class="form-group">';
                    echo '<label>Database Name</label>';
                    echo '<input type="text" name="db_name" value="lutheran_church" required>';
                    echo '<div class="input-hint">Will be created if it doesn\'t exist</div>';
                    echo '</div>';
                    
                    echo '<div class="two-column">';
                    echo '<div class="form-group">';
                    echo '<label>Database Username</label>';
                    echo '<input type="text" name="db_user" value="root" required>';
                    echo '</div>';
                    
                    echo '<div class="form-group">';
                    echo '<label>Database Password</label>';
                    echo '<input type="password" name="db_pass">';
                    echo '<div class="input-hint">Leave empty if no password</div>';
                    echo '</div>';
                    echo '</div>';
                    
                    echo '<div class="btn-group">';
                    echo '<button type="submit" class="btn btn-primary">Test Connection & Continue →</button>';
                    echo '</div>';
                    echo '</form>';
                    break;

                case 3:
                    // Database Import
                    echo '<h2 style="margin-bottom: 20px;">Database Setup</h2>';
                    echo '<p style="margin-bottom: 30px; color: #666;">Import database schema and optionally seed demo data.</p>';
                    
                    // Get database config from session or show error
                    if (!isset($_SESSION['db_config'])) {
                        echo '<div class="alert alert-error">';
                        echo '<strong>❌ Session Lost</strong><br>';
                        echo 'Database configuration was lost. Please go back to Step 2 and re-enter your details.';
                        echo '</div>';
                        echo '<form method="post">';
                        echo '<input type="hidden" name="action" value="check_prerequisites">';
                        echo '<div class="btn-group">';
                        echo '<button type="submit" class="btn btn-secondary">← Back to Step 2</button>';
                        echo '</div>';
                        echo '</form>';
                        break;
                    }
                    
                    $db = $_SESSION['db_config'];
                    
                    echo '<div class="alert alert-info">';
                    echo '<strong>ℹ️ What will be installed:</strong><br>';
                    echo '• Database schema (8 tables, 4 views, 4 stored procedures)<br>';
                    echo '• Demo data (optional): 1 admin user, 1 member, sample data';
                    echo '</div>';
                    
                    echo '<form method="post">';
                    echo '<input type="hidden" name="action" value="install_database">';
                    
                    // Add hidden fields to preserve database config (fallback for session issues)
                    echo '<input type="hidden" name="db_host" value="' . htmlspecialchars($db['host']) . '">';
                    echo '<input type="hidden" name="db_port" value="' . htmlspecialchars($db['port']) . '">';
                    echo '<input type="hidden" name="db_name" value="' . htmlspecialchars($db['name']) . '">';
                    echo '<input type="hidden" name="db_user" value="' . htmlspecialchars($db['user']) . '">';
                    echo '<input type="hidden" name="db_pass" value="' . htmlspecialchars($db['pass']) . '">';
                    
                    echo '<div class="checkbox-group">';
                    echo '<input type="checkbox" id="import_seed" name="import_seed" value="1" checked>';
                    echo '<label for="import_seed">Import demo data (recommended for testing)</label>';
                    echo '</div>';
                    
                    echo '<div class="alert alert-warning">';
                    echo '<strong>⚠️ Demo Credentials:</strong><br>';
                    echo 'Admin: username = <code>admin</code>, password = <code>admin123</code><br>';
                    echo 'Member: code = <code>LCH001</code>, password = <code>member123</code>';
                    echo '</div>';
                    
                    echo '<div class="btn-group">';
                    echo '<button type="submit" class="btn btn-primary">Install Database →</button>';
                    echo '</div>';
                    echo '</form>';
                    break;

                case 4:
                    // Application Configuration
                    echo '<h2 style="margin-bottom: 20px;">Application Configuration</h2>';
                    echo '<p style="margin-bottom: 30px; color: #666;">Configure your application URLs and environment.</p>';
                    
                    echo '<form method="post">';
                    echo '<input type="hidden" name="action" value="configure_app">';
                    
                    echo '<div class="form-group">';
                    echo '<label>Environment</label>';
                    echo '<select name="environment" required>';
                    echo '<option value="development">Development (shows errors, debug mode)</option>';
                    echo '<option value="production">Production (secure, optimized)</option>';
                    echo '</select>';
                    echo '</div>';
                    
                    echo '<div class="form-group">';
                    echo '<label>Frontend URL</label>';
                    echo '<input type="text" name="app_url" value="http://localhost:3000" required>';
                    echo '<div class="input-hint">Where your frontend will be accessible</div>';
                    echo '</div>';
                    
                    echo '<div class="form-group">';
                    echo '<label>Backend API URL</label>';
                    echo '<input type="text" name="api_url" value="http://localhost:8080" required>';
                    echo '<div class="input-hint">Where your backend API will be accessible</div>';
                    echo '</div>';
                    
                    echo '<div class="alert alert-info">';
                    echo '<strong>💡 Examples:</strong><br>';
                    echo '<strong>Local Development:</strong><br>';
                    echo 'Frontend: http://localhost:3000<br>';
                    echo 'Backend: http://localhost:8080<br><br>';
                    echo '<strong>Production:</strong><br>';
                    echo 'Frontend: https://yourdomain.com<br>';
                    echo 'Backend: https://api.yourdomain.com';
                    echo '</div>';
                    
                    echo '<div class="btn-group">';
                    echo '<button type="submit" class="btn btn-primary">Continue →</button>';
                    echo '</div>';
                    echo '</form>';
                    break;

                case 5:
                    // Finalize Installation
                    echo '<h2 style="margin-bottom: 20px;">Finalize Installation</h2>';
                    echo '<p style="margin-bottom: 30px; color: #666;">Review your configuration and complete the installation.</p>';
                    
                    $db = $_SESSION['db_config'];
                    $app = $_SESSION['app_config'];
                    
                    echo '<div class="alert alert-info">';
                    echo '<strong>📋 Installation Summary:</strong><br><br>';
                    echo '<strong>Database:</strong><br>';
                    echo 'Host: ' . htmlspecialchars($db['host']) . ':' . htmlspecialchars($db['port']) . '<br>';
                    echo 'Database: ' . htmlspecialchars($db['name']) . '<br>';
                    echo 'User: ' . htmlspecialchars($db['user']) . '<br><br>';
                    echo '<strong>Application:</strong><br>';
                    echo 'Environment: ' . htmlspecialchars($app['environment']) . '<br>';
                    echo 'Frontend: ' . htmlspecialchars($app['app_url']) . '<br>';
                    echo 'Backend: ' . htmlspecialchars($app['api_url']) . '<br>';
                    echo '</div>';
                    
                    echo '<div class="alert alert-warning">';
                    echo '<strong>🔐 Security:</strong><br>';
                    echo 'Strong encryption keys will be automatically generated for your installation.';
                    echo '</div>';
                    
                    echo '<form method="post">';
                    echo '<input type="hidden" name="action" value="finish_installation">';
                    echo '<div class="btn-group">';
                    echo '<button type="submit" class="btn btn-primary">Complete Installation ✓</button>';
                    echo '</div>';
                    echo '</form>';
                    break;

                case 6:
                    // Installation Complete
                    echo '<h2 style="margin-bottom: 20px;">🎉 Installation Complete!</h2>';
                    
                    echo '<div class="alert alert-success">';
                    echo '<strong>✅ Successfully Installed</strong><br>';
                    echo 'Your Lutheran Church Management System is now ready to use!';
                    echo '</div>';
                    
                    echo '<div class="alert alert-warning">';
                    echo '<strong>🔒 IMPORTANT SECURITY STEP:</strong><br>';
                    echo 'For security reasons, please delete the <code>install.php</code> file from your server immediately.<br><br>';
                    echo '<div class="code-block">rm install.php</div>';
                    echo 'Or delete it manually via FTP/File Manager.';
                    echo '</div>';
                    
                    echo '<div class="alert alert-info">';
                    echo '<strong>🚀 Next Steps:</strong><br><br>';
                    echo '<strong>1. Start the Backend:</strong><br>';
                    echo '<div class="code-block">cd backend<br>php spark serve</div><br>';
                    echo '<strong>2. Start the Frontend:</strong><br>';
                    echo '<div class="code-block">npm install<br>npm run dev</div><br>';
                    echo '<strong>3. Access Your Application:</strong><br>';
                    echo 'Frontend: <a href="' . htmlspecialchars($_SESSION['app_config']['app_url']) . '" target="_blank">' . htmlspecialchars($_SESSION['app_config']['app_url']) . '</a><br>';
                    echo 'Backend: <a href="' . htmlspecialchars($_SESSION['app_config']['api_url']) . '" target="_blank">' . htmlspecialchars($_SESSION['app_config']['api_url']) . '</a>';
                    echo '</div>';
                    
                    if (isset($_POST['import_seed'])) {
                        echo '<div class="alert alert-info">';
                        echo '<strong>🔑 Demo Login Credentials:</strong><br><br>';
                        echo '<strong>Admin Panel:</strong><br>';
                        echo 'Username: <code>admin</code><br>';
                        echo 'Password: <code>admin123</code><br><br>';
                        echo '<strong>Member Portal:</strong><br>';
                        echo 'Member Code: <code>LCH001</code><br>';
                        echo 'Password: <code>member123</code><br><br>';
                        echo '<strong>⚠️ Change these passwords immediately in production!</strong>';
                        echo '</div>';
                    }
                    
                    echo '<div class="btn-group">';
                    echo '<a href="' . htmlspecialchars($_SESSION['app_config']['app_url']) . '" class="btn btn-primary">Go to Application →</a>';
                    echo '</div>';
                    
                    // Clear session
                    session_destroy();
                    break;
            }
            ?>
        </div>
    </div>
</body>
</html>
