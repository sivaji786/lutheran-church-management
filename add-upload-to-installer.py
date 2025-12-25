#!/usr/bin/env python3
import re

# Read the current installer
with open('installer.php', 'r') as f:
    content = f.read()

# Add 'zip' to REQUIRED_EXTENSIONS
content = content.replace(
    "define('REQUIRED_EXTENSIONS', ['mysqli', 'mbstring', 'intl', 'json', 'xml']);",
    "define('REQUIRED_EXTENSIONS', ['mysqli', 'mbstring', 'intl', 'json', 'xml', 'zip']);"
)

# Add isExtracted function after isAlreadyInstalled
is_extracted_func = '''
// Check if files are extracted
function isExtracted() {
    return is_dir(__DIR__ . '/backend') && is_dir(__DIR__ . '/frontend') && is_dir(__DIR__ . '/database');
}

'''

content = content.replace(
    '// Check if already installed\nfunction isAlreadyInstalled()',
    is_extracted_func + '// Check if already installed\nfunction isAlreadyInstalled()'
)

# Add upload handling before checkRequirements
upload_handler = '''
// Handle zip upload and extraction
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'upload_zip') {
    validateCSRF();
    
    if (!isset($_FILES['zip_file']) || $_FILES['zip_file']['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'File upload failed. Check file size limits.';
    } else {
        $zipFile = $_FILES['zip_file'];
        $uploadPath = __DIR__ . '/lutheran-deployment.zip';
        
        if (move_uploaded_file($zipFile['tmp_name'], $uploadPath)) {
            if (!extension_loaded('zip')) {
                $errors[] = 'PHP ZIP extension is not loaded';
                unlink($uploadPath);
            } else {
                $zip = new ZipArchive;
                if ($zip->open($uploadPath) === TRUE) {
                    set_time_limit(300); // 5 minutes for extraction
                    $zip->extractTo(__DIR__);
                    $zip->close();
                    unlink($uploadPath); // Delete zip after extraction
                    $_SESSION['extraction_success'] = true;
                    header('Location: ?step=requirements');
                    exit;
                } else {
                    $errors[] = 'Failed to extract zip file';
                    if (file_exists($uploadPath)) unlink($uploadPath);
                }
            }
        } else {
            $errors[] = 'Failed to save uploaded file';
        }
    }
}

'''

content = content.replace(
    '// System Requirements Check\nfunction checkRequirements()',
    upload_handler + '// System Requirements Check\nfunction checkRequirements()'
)

# Add helper functions before the HTML
helper_funcs = '''
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

'''

content = content.replace(
    '?>\n<!DOCTYPE html>',
    helper_funcs + '?>\n<!DOCTYPE html>'
)

# Write the modified installer
with open('installer.php', 'w') as f:
    f.write(content)

print("Upload functionality added to installer.php")
