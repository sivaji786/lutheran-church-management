#!/usr/bin/env python3
import re

with open('installer.php', 'r') as f:
    content = f.read()

# Remove 'required' attribute from all admin fields
content = re.sub(
    r'(<input[^>]*id="admin_username"[^>]*)\s+required',
    r'\1',
    content
)

content = re.sub(
    r'(<input[^>]*id="admin_password"[^>]*)\s+required',
    r'\1',
    content
)

content = re.sub(
    r'(<input[^>]*id="admin_email"[^>]*)\s+required',
    r'\1',
    content
)

content = re.sub(
    r'(<input[^>]*id="admin_name"[^>]*)\s+required',
    r'\1',
    content
)

# Also remove minlength from password
content = re.sub(
    r'(<input[^>]*id="admin_password"[^>]*)\s+minlength="8"',
    r'\1',
    content
)

# Fix the validation logic - only validate if admin_username is provided
validation_fix = '''    // Validation - admin fields are optional
    if (empty($config['db_name'])) $errors[] = 'Database name is required';
    if (empty($config['db_user'])) $errors[] = 'Database username is required';
    if (empty($config['app_url'])) $errors[] = 'Application URL is required';
    
    // Admin user validation - only if creating new admin
    if (!empty($config['admin_username'])) {
        if (empty($config['admin_password'])) $errors[] = 'Admin password is required when creating admin user';
        if (!empty($config['admin_password']) && strlen($config['admin_password']) < 8) {
            $errors[] = 'Admin password must be at least 8 characters';
        }
        if (empty($config['admin_email'])) $errors[] = 'Admin email is required when creating admin user';
        if (!empty($config['admin_email']) && !filter_var($config['admin_email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Invalid admin email';
        }
    }'''

# Find and replace the validation section
pattern = r'// Validation.*?if \(!filter_var\(\$config\[\'admin_email\'\], FILTER_VALIDATE_EMAIL\)\) \$errors\[\] = \'Invalid admin email\';'
content = re.sub(pattern, validation_fix, content, flags=re.DOTALL)

with open('installer.php', 'w') as f:
    f.write(content)

print("Admin fields are now truly optional")
