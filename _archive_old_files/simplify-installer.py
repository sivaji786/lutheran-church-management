#!/usr/bin/env python3
import re

# Read the current installer
with open('installer.php', 'r') as f:
    content = f.read()

# Remove the upload form handling code and replace with auto-detection
upload_handler = '''
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

'''

# Find and replace the upload handling section
pattern = r'// Handle zip upload and extraction.*?(?=// System Requirements Check)'
content = re.sub(pattern, upload_handler, content, flags=re.DOTALL)

# Write the modified installer
with open('installer.php', 'w') as f:
    f.write(content)

print("Installer simplified - now auto-detects and extracts zip file")
