#!/usr/bin/env python3
import re

with open('installer.php', 'r') as f:
    content = f.read()

# Make admin creation section optional in the HTML
# Find the admin user section and add a note about seed.sql
admin_section_note = '''                        <div class="alert alert-info mb-3">
                            <i class="bi bi-info-circle"></i>
                            <strong>Note:</strong> If you imported <code>seed.sql</code>, an admin user already exists:
                            <ul class="mb-0 mt-2">
                                <li>Username: <code>admin</code></li>
                                <li>Password: <code>admin123</code></li>
                            </ul>
                            You can skip this section or create an additional admin user.
                        </div>
                        
'''

# Insert the note before the admin user heading
content = content.replace(
    '<h5 class="mb-3"><i class="bi bi-person-badge"></i> Admin User</h5>',
    admin_section_note + '<h5 class="mb-3"><i class="bi bi-person-badge"></i> Admin User (Optional)</h5>'
)

# Make admin fields optional in validation
content = content.replace(
    "if (empty($config['admin_username'])) $errors[] = 'Admin username is required';",
    "// Admin user creation is optional if seed.sql was imported"
)

content = content.replace(
    "if (empty($config['admin_password'])) $errors[] = 'Admin password is required';",
    ""
)

content = content.replace(
    "if (strlen($config['admin_password']) < 8) $errors[] = 'Admin password must be at least 8 characters';",
    ""
)

content = content.replace(
    "if (empty($config['admin_email'])) $errors[] = 'Admin email is required';",
    ""
)

content = content.replace(
    "if (!filter_var($config['admin_email'], FILTER_VALIDATE_EMAIL)) $errors[] = 'Invalid admin email';",
    ""
)

# Modify admin creation to only run if username is provided
admin_creation_check = '''            // Create admin user only if username is provided
            if (!empty($config['admin_username']) && !empty($config['admin_password'])) {
                $adminResult = createAdminUser($config);
                if (!$adminResult['success']) {
                    $errors[] = $adminResult['message'];
                }
            }'''

content = re.sub(
    r"// Create admin user\s+\$adminResult = createAdminUser\(\$config\);\s+if \(!\$adminResult\['success'\]\) \{\s+\$errors\[\] = \$adminResult\['message'\];\s+\}",
    admin_creation_check,
    content
)

with open('installer.php', 'w') as f:
    f.write(content)

print("Admin user creation is now optional")
