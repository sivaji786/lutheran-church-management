<?php
/**
 * Lutheran Church Management System - Web Installer
 * 
 * This installer helps you set up the application on shared hosting.
 * 
 * IMPORTANT: Delete this file after successful installation!
 */

// Start session for state management
session_start();

// Configuration
define('MIN_PHP_VERSION', '8.1.0');
define('REQUIRED_EXTENSIONS', ['mysqli', 'mbstring', 'intl', 'json', 'xml', 'zip']);

// Initialize variables
$step = $_GET['step'] ?? 'welcome';
$errors = [];
$success = [];

// CSRF Protection
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

function validateCSRF() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
            die('CSRF validation failed');
        }
    }
}


// Check if files are extracted
function isExtracted() {
    return is_dir(__DIR__ . '/backend') && file_exists(__DIR__ . '/index.html') && is_dir(__DIR__ . '/database');
}

// Check if already installed
function isAlreadyInstalled() {
    return file_exists(__DIR__ . '/backend/.env') && filesize(__DIR__ . '/backend/.env') > 100;
}



// Auto-detect and extract zip file if present
if (!isExtracted() && file_exists(__DIR__ . '/lutheran-deployment.zip')) {
    if (!extension_loaded('zip')) {
        $errors[] = 'PHP ZIP extension is not loaded. Please extract the zip manually.';
    } else {
        $zipPath = __DIR__ . '/lutheran-deployment.zip';
        $zip = new ZipArchive;
        
        if ($zip->open($zipPath) === TRUE) {
            set_time_limit(300); // 5 minutes for extraction
            $zip->extractTo(__DIR__);
            $zip->close();
            unlink($zipPath); // Delete zip after extraction
            $_SESSION['extraction_success'] = true;
            // Refresh page to show extracted files
            header('Location: ?step=welcome');
            exit;
        } else {
            $errors[] = 'Failed to extract zip file. Please extract manually via cPanel.';
        }
    }
}

// System Requirements Check
function checkRequirements() {
    global $errors;
    $checks = [];
    
    // PHP Version
    $phpVersion = phpversion();
    $checks['php_version'] = [
        'name' => 'PHP Version (>= ' . MIN_PHP_VERSION . ')',
        'status' => version_compare($phpVersion, MIN_PHP_VERSION, '>='),
        'value' => $phpVersion
    ];
    
    // PHP Extensions
    foreach (REQUIRED_EXTENSIONS as $ext) {
        $checks['ext_' . $ext] = [
            'name' => "PHP Extension: $ext",
            'status' => extension_loaded($ext),
            'value' => extension_loaded($ext) ? 'Loaded' : 'Not Found'
        ];
    }
    
    // Directory Permissions
    $writableDirs = [
        'backend/writable',
        'backend/writable/cache',
        'backend/writable/logs',
        'backend/writable/session',
        'backend/writable/uploads',
        '.'
    ];
    
    foreach ($writableDirs as $dir) {
        $path = __DIR__ . '/' . $dir;
        $isWritable = is_dir($path) && is_writable($path);
        $checks['dir_' . str_replace('/', '_', $dir)] = [
            'name' => "Writable: $dir",
            'status' => $isWritable,
            'value' => $isWritable ? 'Writable' : 'Not Writable'
        ];
    }
    
    return $checks;
}

// Test database connection
function testDatabaseConnection($host, $user, $pass, $db, $port = 3306) {
    try {
        $conn = new mysqli($host, $user, $pass, $db, $port);
        if ($conn->connect_error) {
            return ['success' => false, 'message' => $conn->connect_error];
        }
        $conn->close();
        return ['success' => true, 'message' => 'Connection successful'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => $e->getMessage()];
    }
}

// Generate random string
function generateRandomString($length = 64) {
    return bin2hex(random_bytes($length / 2));
}

// Create .env file
function createEnvFile($config) {
    $envTemplate = file_get_contents(__DIR__ . '/backend/.env.example');
    
    $replacements = [
        'development' => 'production',
        "'http://localhost:8080'" => "'{$config['app_url']}'",
        'localhost' => $config['db_host'],
        'lutheran_church' => $config['db_name'],
        'root' => $config['db_user'],
        'your_password_here' => $config['db_pass'],
        '3306' => $config['db_port'],
        "'your-secret-key-here-please-change-in-production'" => "'{$config['jwt_secret']}'",
    ];
    
    $envContent = str_replace(array_keys($replacements), array_values($replacements), $envTemplate);
    
    // Add encryption key if not present
    if (strpos($envContent, 'encryption.key') === false) {
        $envContent .= "\nencryption.key = hex2bin('" . $config['encryption_key'] . "')\n";
    } else {
        $envContent = preg_replace(
            '/encryption\.key\s*=\s*.+/',
            "encryption.key = hex2bin('{$config['encryption_key']}')",
            $envContent
        );
    }
    
    return file_put_contents(__DIR__ . '/backend/.env', $envContent);
}

// Create config.js for frontend
function createFrontendConfig($apiUrl) {
    $configContent = "// Auto-generated by installer\n";
    $configContent .= "// This file provides runtime configuration for the frontend\n";
    $configContent .= "window.APP_CONFIG = {\n";
    $configContent .= "  API_BASE_URL: '{$apiUrl}'\n";
    $configContent .= "};\n";
    
    return file_put_contents(__DIR__ . '/config.js', $configContent);
}

// Create admin user
function createAdminUser($config) {
    try {
        $conn = new mysqli(
            $config['db_host'],
            $config['db_user'],
            $config['db_pass'],
            $config['db_name'],
            $config['db_port']
        );
        
        if ($conn->connect_error) {
            return ['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error];
        }
        
        // Check if admin already exists
        $stmt = $conn->prepare("SELECT id FROM admin_users WHERE username = ?");
        $stmt->bind_param("s", $config['admin_username']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $stmt->close();
            $conn->close();
            return ['success' => false, 'message' => 'Admin user already exists'];
        }
        $stmt->close();
        
        // Create admin user
        $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
        
        $hashedPassword = password_hash($config['admin_password'], PASSWORD_BCRYPT);
        
        $stmt = $conn->prepare(
            "INSERT INTO admin_users (id, username, password, role, name, email, is_active, created_at, updated_at) 
             VALUES (?, ?, ?, 'super_admin', ?, ?, 1, NOW(), NOW())"
        );
        
        $stmt->bind_param(
            "sssss",
            $id,
            $config['admin_username'],
            $hashedPassword,
            $config['admin_name'],
            $config['admin_email']
        );
        
        if ($stmt->execute()) {
            $stmt->close();
            $conn->close();
            return ['success' => true, 'message' => 'Admin user created successfully'];
        } else {
            $error = $stmt->error;
            $stmt->close();
            $conn->close();
            return ['success' => false, 'message' => 'Failed to create admin user: ' . $error];
        }
        
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

// Handle installation process
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'install') {
    validateCSRF();
    
    $config = [
        'db_host' => trim($_POST['db_host'] ?? 'localhost'),
        'db_name' => trim($_POST['db_name'] ?? ''),
        'db_user' => trim($_POST['db_user'] ?? ''),
        'db_pass' => $_POST['db_pass'] ?? '',
        'db_port' => trim($_POST['db_port'] ?? '3306'),
        'app_url' => rtrim(trim($_POST['app_url'] ?? ''), '/'),
        'admin_username' => trim($_POST['admin_username'] ?? ''),
        'admin_password' => $_POST['admin_password'] ?? '',
        'admin_name' => trim($_POST['admin_name'] ?? ''),
        'admin_email' => trim($_POST['admin_email'] ?? ''),
        'jwt_secret' => $_POST['jwt_secret'] ?? generateRandomString(64),
        'encryption_key' => $_POST['encryption_key'] ?? generateRandomString(64),
    ];
    
    // Validation
    if (empty($config['db_name'])) $errors[] = 'Database name is required';
    if (empty($config['db_user'])) $errors[] = 'Database username is required';
    if (empty($config['app_url'])) $errors[] = 'Application URL is required';
    // Admin user creation is optional if seed.sql was imported
    
    
    
    
    
    if (empty($errors)) {
        // Test database connection
        $dbTest = testDatabaseConnection(
            $config['db_host'],
            $config['db_user'],
            $config['db_pass'],
            $config['db_name'],
            $config['db_port']
        );
        
        if (!$dbTest['success']) {
            $errors[] = 'Database connection failed: ' . $dbTest['message'];
        } else {
            // Create .env file
            if (!createEnvFile($config)) {
                $errors[] = 'Failed to create .env file. Check permissions.';
            }
            
            // Create frontend config
            if (!createFrontendConfig($config['app_url'])) {
                $errors[] = 'Failed to create frontend config.js. Check permissions.';
            }
            
                        // Create admin user only if username is provided
            if (!empty($config['admin_username']) && !empty($config['admin_password'])) {
                $adminResult = createAdminUser($config);
                if (!$adminResult['success']) {
                    $errors[] = $adminResult['message'];
                }
            }
            
            if (empty($errors)) {
                $_SESSION['install_success'] = true;
                $_SESSION['admin_username'] = $config['admin_username'];
                $_SESSION['app_url'] = $config['app_url'];
                header('Location: ?step=complete');
                exit;
            }
        }
    }
}

// Handle AJAX database test
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'test_db') {
    validateCSRF();
    header('Content-Type: application/json');
    
    $result = testDatabaseConnection(
        $_POST['db_host'] ?? 'localhost',
        $_POST['db_user'] ?? '',
        $_POST['db_pass'] ?? '',
        $_POST['db_name'] ?? '',
        $_POST['db_port'] ?? 3306
    );
    
    echo json_encode($result);
    exit;
}


// Get max upload size from PHP settings
function getMaxUploadSize() {
    $maxUpload = ini_get('upload_max_filesize');
    $maxPost = ini_get('post_max_size');
    
    $convertToBytes = function($value) {
        $value = trim($value);
        $last = strtolower($value[strlen($value)-1]);
        $value = (int)$value;
        
        switch($last) {
            case 'g': $value *= 1024;
            case 'm': $value *= 1024;
            case 'k': $value *= 1024;
        }
        
        return $value;
    };
    
    return min($convertToBytes($maxUpload), $convertToBytes($maxPost));
}

function formatBytes($bytes) {
    if ($bytes >= 1073741824) {
        return number_format($bytes / 1073741824, 2) . ' GB';
    } elseif ($bytes >= 1048576) {
        return number_format($bytes / 1048576, 2) . ' MB';
    } elseif ($bytes >= 1024) {
        return number_format($bytes / 1024, 2) . ' KB';
    }
    return $bytes . ' bytes';
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lutheran Church Management - Installer</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem 0;
        }
        .installer-container {
            max-width: 800px;
            margin: 0 auto;
        }
        .card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .card-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 15px 15px 0 0 !important;
            padding: 1.5rem;
        }
        .check-item {
            padding: 0.75rem;
            margin: 0.5rem 0;
            border-radius: 8px;
            background: #f8f9fa;
        }
        .check-item.success {
            background: #d4edda;
            border-left: 4px solid #28a745;
        }
        .check-item.error {
            background: #f8d7da;
            border-left: 4px solid #dc3545;
        }
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
        }
        .btn-primary:hover {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
        .alert-danger {
            border-left: 4px solid #dc3545;
        }
        .alert-success {
            border-left: 4px solid #28a745;
        }
        .form-label {
            font-weight: 600;
            color: #495057;
        }
        .password-strength {
            height: 5px;
            border-radius: 3px;
            margin-top: 5px;
            transition: all 0.3s;
        }
        .strength-weak { background: #dc3545; width: 33%; }
        .strength-medium { background: #ffc107; width: 66%; }
        .strength-strong { background: #28a745; width: 100%; }
    </style>
</head>
<body>
    <div class="installer-container">
        
        <?php if ($step === 'welcome'): ?>
            <!-- Welcome Step -->
            <div class="card">
                <div class="card-header">
                    <h3 class="mb-0"><i class="bi bi-box-seam"></i> Lutheran Church Management System</h3>
                    <p class="mb-0 mt-2">Installation Wizard</p>
                </div>
                <div class="card-body p-4">
                    <?php if (isAlreadyInstalled()): ?>
                        <div class="alert alert-warning">
                            <i class="bi bi-exclamation-triangle"></i>
                            <strong>Already Installed!</strong>
                            <p class="mb-0">The system appears to be already installed. If you want to reinstall, please delete the <code>backend/.env</code> file first.</p>
                        </div>
                        <a href="index.html" class="btn btn-primary">Go to Application</a>
                    <?php else: ?>
                        <h4>Welcome!</h4>
                        <p>This wizard will help you install the Lutheran Church Management System on your server.</p>
                        
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle"></i>
                            <strong>Before you begin:</strong>
                            <ul class="mb-0 mt-2">
                                <li>Make sure you have created a MySQL database</li>
                                <li>Import <code>database/schema.sql</code> via phpMyAdmin</li>
                                <li>Have your database credentials ready</li>
                            </ul>
                        </div>
                        
                        <div class="d-grid gap-2">
                            <a href="?step=requirements" class="btn btn-primary btn-lg">
                                <i class="bi bi-arrow-right"></i> Start Installation
                            </a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
            
        <?php elseif ($step === 'requirements'): ?>
            <!-- Requirements Check Step -->
            <div class="card">
                <div class="card-header">
                    <h3 class="mb-0"><i class="bi bi-check-circle"></i> System Requirements</h3>
                </div>
                <div class="card-body p-4">
                    <?php
                    $checks = checkRequirements();
                    $allPassed = true;
                    foreach ($checks as $check) {
                        if (!$check['status']) $allPassed = false;
                    }
                    ?>
                    
                    <?php foreach ($checks as $check): ?>
                        <div class="check-item <?php echo $check['status'] ? 'success' : 'error'; ?>">
                            <div class="d-flex justify-content-between align-items-center">
                                <span>
                                    <?php if ($check['status']): ?>
                                        <i class="bi bi-check-circle-fill text-success"></i>
                                    <?php else: ?>
                                        <i class="bi bi-x-circle-fill text-danger"></i>
                                    <?php endif; ?>
                                    <?php echo htmlspecialchars($check['name']); ?>
                                </span>
                                <span class="badge bg-secondary"><?php echo htmlspecialchars($check['value']); ?></span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                    
                    <div class="mt-4 d-flex gap-2">
                        <a href="?step=welcome" class="btn btn-secondary">
                            <i class="bi bi-arrow-left"></i> Back
                        </a>
                        <?php if ($allPassed): ?>
                            <a href="?step=configure" class="btn btn-primary">
                                <i class="bi bi-arrow-right"></i> Continue
                            </a>
                        <?php else: ?>
                            <button class="btn btn-danger" disabled>
                                <i class="bi bi-exclamation-triangle"></i> Fix Requirements First
                            </button>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            
        <?php elseif ($step === 'configure'): ?>
            <!-- Configuration Step -->
            <div class="card">
                <div class="card-header">
                    <h3 class="mb-0"><i class="bi bi-gear"></i> Configuration</h3>
                </div>
                <div class="card-body p-4">
                    <?php if (!empty($errors)): ?>
                        <div class="alert alert-danger">
                            <i class="bi bi-exclamation-triangle"></i>
                            <strong>Errors:</strong>
                            <ul class="mb-0">
                                <?php foreach ($errors as $error): ?>
                                    <li><?php echo htmlspecialchars($error); ?></li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    <?php endif; ?>
                    
                    <form method="POST" id="installForm">
                        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                        <input type="hidden" name="action" value="install">
                        
                        <!-- Database Configuration -->
                        <h5 class="mb-3"><i class="bi bi-database"></i> Database Configuration</h5>
                        
                        <div class="row">
                            <div class="col-md-8 mb-3">
                                <label for="db_host" class="form-label">Database Host</label>
                                <input type="text" class="form-control" id="db_host" name="db_host" value="localhost" required>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="db_port" class="form-label">Port</label>
                                <input type="number" class="form-control" id="db_port" name="db_port" value="3306" required>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="db_name" class="form-label">Database Name</label>
                            <input type="text" class="form-control" id="db_name" name="db_name" required>
                            <small class="text-muted">The database where you imported schema.sql</small>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="db_user" class="form-label">Database Username</label>
                                <input type="text" class="form-control" id="db_user" name="db_user" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="db_pass" class="form-label">Database Password</label>
                                <input type="password" class="form-control" id="db_pass" name="db_pass">
                            </div>
                        </div>
                        
                        <button type="button" class="btn btn-outline-primary mb-4" id="testDbBtn">
                            <i class="bi bi-plug"></i> Test Database Connection
                        </button>
                        <div id="dbTestResult"></div>
                        
                        <hr class="my-4">
                        
                        <!-- Application Configuration -->
                        <h5 class="mb-3"><i class="bi bi-globe"></i> Application Configuration</h5>
                        
                        <div class="mb-3">
                            <label for="app_url" class="form-label">Application URL</label>
                            <input type="url" class="form-control" id="app_url" name="app_url" 
                                   value="<?php echo (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']); ?>" required>
                            <small class="text-muted">The URL where your backend API is accessible (without trailing slash)</small>
                        </div>
                        
                        <hr class="my-4">
                        
                        <!-- Admin User Configuration -->
                                                <div class="alert alert-info mb-3">
                            <i class="bi bi-info-circle"></i>
                            <strong>Note:</strong> If you imported <code>seed.sql</code>, an admin user already exists:
                            <ul class="mb-0 mt-2">
                                <li>Username: <code>admin</code></li>
                                <li>Password: <code>admin123</code></li>
                            </ul>
                            You can skip this section or create an additional admin user.
                        </div>
                        
<h5 class="mb-3"><i class="bi bi-person-badge"></i> Admin User (Optional)</h5>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="admin_username" class="form-label">Admin Username</label>
                                <input type="text" class="form-control" id="admin_username" name="admin_username" value="admin">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="admin_name" class="form-label">Admin Name</label>
                                <input type="text" class="form-control" id="admin_name" name="admin_name" value="Administrator">
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="admin_email" class="form-label">Admin Email</label>
                            <input type="email" class="form-control" id="admin_email" name="admin_email">
                        </div>
                        
                        <div class="mb-3">
                            <label for="admin_password" class="form-label">Admin Password</label>
                            <input type="password" class="form-control" id="admin_password" name="admin_password">
                            <div class="password-strength" id="passwordStrength"></div>
                            <small class="text-muted">Minimum 8 characters</small>
                        </div>
                        
                        <hr class="my-4">
                        
                        <!-- Security Configuration -->
                        <h5 class="mb-3"><i class="bi bi-shield-lock"></i> Security</h5>
                        
                        <div class="mb-3">
                            <label for="jwt_secret" class="form-label">JWT Secret</label>
                            <input type="text" class="form-control" id="jwt_secret" name="jwt_secret" value="<?php echo generateRandomString(64); ?>" required>
                            <small class="text-muted">Auto-generated. You can change this if needed.</small>
                        </div>
                        
                        <input type="hidden" name="encryption_key" value="<?php echo generateRandomString(64); ?>">
                        
                        <div class="mt-4 d-flex gap-2">
                            <a href="?step=requirements" class="btn btn-secondary">
                                <i class="bi bi-arrow-left"></i> Back
                            </a>
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-download"></i> Install Now
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
        <?php elseif ($step === 'complete'): ?>
            <!-- Completion Step -->
            <div class="card">
                <div class="card-header bg-success text-white">
                    <h3 class="mb-0"><i class="bi bi-check-circle"></i> Installation Complete!</h3>
                </div>
                <div class="card-body p-4">
                    <div class="alert alert-success">
                        <i class="bi bi-check-circle-fill"></i>
                        <strong>Success!</strong> The Lutheran Church Management System has been installed successfully.
                    </div>
                    
                    <h5>Installation Details:</h5>
                    <ul>
                        <li><strong>Admin Username:</strong> <?php echo htmlspecialchars($_SESSION['admin_username'] ?? 'admin'); ?></li>
                        <li><strong>Application URL:</strong> <a href="<?php echo htmlspecialchars($_SESSION['app_url'] ?? ''); ?>" target="_blank"><?php echo htmlspecialchars($_SESSION['app_url'] ?? ''); ?></a></li>
                        <li><strong>Frontend:</strong> <a href="index.html" target="_blank">Open Application</a></li>
                    </ul>
                    
                    <div class="alert alert-danger mt-4">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                        <strong>IMPORTANT SECURITY NOTICE:</strong>
                        <p class="mb-2">For security reasons, you MUST delete this installer file immediately!</p>
                        <p class="mb-0">Delete the file: <code><?php echo __FILE__; ?></code></p>
                    </div>
                    
                    <h5 class="mt-4">Next Steps:</h5>
                    <ol>
                        <li><strong>Delete installer.php</strong> (this file) from your server</li>
                        <li>Login to the application with your admin credentials</li>
                        <li>Change your admin password from the default</li>
                        <li>Configure email settings if needed</li>
                        <li>Start adding members and managing your church</li>
                    </ol>
                    
                    <div class="d-grid gap-2 mt-4">
                        <a href="index.html" class="btn btn-success btn-lg">
                            <i class="bi bi-box-arrow-in-right"></i> Go to Application
                        </a>
                    </div>
                </div>
            </div>
        <?php endif; ?>
        
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Test database connection
        document.getElementById('testDbBtn')?.addEventListener('click', async function() {
            const btn = this;
            const result = document.getElementById('dbTestResult');
            
            btn.disabled = true;
            btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Testing...';
            
            const formData = new FormData();
            formData.append('action', 'test_db');
            formData.append('csrf_token', '<?php echo $_SESSION['csrf_token']; ?>');
            formData.append('db_host', document.getElementById('db_host').value);
            formData.append('db_port', document.getElementById('db_port').value);
            formData.append('db_name', document.getElementById('db_name').value);
            formData.append('db_user', document.getElementById('db_user').value);
            formData.append('db_pass', document.getElementById('db_pass').value);
            
            try {
                const response = await fetch('', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    result.innerHTML = '<div class="alert alert-success"><i class="bi bi-check-circle"></i> ' + data.message + '</div>';
                } else {
                    result.innerHTML = '<div class="alert alert-danger"><i class="bi bi-x-circle"></i> ' + data.message + '</div>';
                }
            } catch (error) {
                result.innerHTML = '<div class="alert alert-danger"><i class="bi bi-x-circle"></i> Connection test failed</div>';
            }
            
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-plug"></i> Test Database Connection';
        });
        
        // Password strength indicator
        document.getElementById('admin_password')?.addEventListener('input', function() {
            const password = this.value;
            const strength = document.getElementById('passwordStrength');
            
            if (password.length === 0) {
                strength.className = 'password-strength';
                return;
            }
            
            let score = 0;
            if (password.length >= 8) score++;
            if (password.length >= 12) score++;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
            if (/\d/.test(password)) score++;
            if (/[^a-zA-Z\d]/.test(password)) score++;
            
            if (score <= 2) {
                strength.className = 'password-strength strength-weak';
            } else if (score <= 4) {
                strength.className = 'password-strength strength-medium';
            } else {
                strength.className = 'password-strength strength-strong';
            }
        });
    </script>
</body>
</html>
