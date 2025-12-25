# Security Implementation Guide

## Quick Security Hardening Steps

### 1. Enable CSRF Protection (5 minutes)

**Backend:**
```php
// backend/app/Config/Filters.php
public array $globals = [
    'before' => [
        'cors',
        'csrf',  // Uncomment this line
    ],
];
```

**Frontend:**
```typescript
// src/services/api.ts
// CSRF token will be automatically handled by CodeIgniter's CORS filter
// No changes needed if using same-origin requests
```

### 2. Enable HTTPS in Production (2 minutes)

```php
// backend/app/Config/Filters.php
public array $required = [
    'before' => [
        'forcehttps',  // Uncomment this in production
        'pagecache',
    ],
];
```

### 3. Enable Secure Headers (2 minutes)

```php
// backend/app/Config/Filters.php
public array $globals = [
    'after' => [
        'cors',
        'secureheaders',  // Uncomment this line
    ],
];
```

### 4. Add Rate Limiting (Already Created)

```php
// backend/app/Config/Filters.php
public array $aliases = [
    // ... existing aliases
    'ratelimit' => \App\Filters\RateLimit::class,  // Add this
];

public array $filters = [
    'ratelimit' => [
        'before' => [
            'api/auth/*',
            'api/members/*',
            'api/offerings/*',
        ]
    ],
];
```

### 5. Strengthen Password Requirements

```php
// backend/app/Controllers/Auth.php
// Update validation rules:
$rules = [
    'username' => 'required',
    'password' => 'required|min_length[8]|regex_match[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/]'
];
```

Password must contain:
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character

### 6. Ensure Strong JWT Secret

```env
# backend/.env
# Generate a strong random secret (32+ characters)
JWT_SECRET=your-very-long-random-secret-key-minimum-32-characters-here

# You can generate one using:
# php -r "echo bin2hex(random_bytes(32));"
```

### 7. Add Security Logging

```php
// backend/app/Controllers/Auth.php
// Add to adminLogin() after failed attempt:
if (!password_verify($password, $user['password'])) {
    log_message('security', 'Failed admin login attempt for: ' . $username . ' from IP: ' . $this->request->getIPAddress());
    return $this->fail('Invalid password');
}

// Add to memberLogin() after failed attempt:
if (!password_verify($password, $user['password'])) {
    log_message('security', 'Failed member login attempt for: ' . $identifier . ' from IP: ' . $this->request->getIPAddress());
    return $this->fail('Invalid password');
}
```

### 8. Production Environment Settings

```env
# backend/.env
CI_ENVIRONMENT = production

# Disable debug mode
app.debug = false

# Enable error logging
logger.threshold = 4
```

### 9. Database Security

```sql
-- Create a database user with limited privileges
CREATE USER 'lutheran_app'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON lutheran_church.* TO 'lutheran_app'@'localhost';
FLUSH PRIVILEGES;
```

```env
# backend/.env
database.default.username = lutheran_app
database.default.password = strong_password_here
```

### 10. File Upload Security (If Implemented)

```php
// Add to any file upload handlers:
$validationRules = [
    'file' => [
        'uploaded[file]',
        'max_size[file,2048]',  // 2MB max
        'ext_in[file,jpg,jpeg,png,pdf]',
        'mime_in[file,image/jpg,image/jpeg,image/png,application/pdf]',
    ],
];
```

## Security Checklist for Deployment

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS (forcehttps filter)
- [ ] Enable CSRF protection
- [ ] Enable secure headers
- [ ] Enable rate limiting
- [ ] Set CI_ENVIRONMENT=production
- [ ] Disable debug mode
- [ ] Use limited database user
- [ ] Set up security logging
- [ ] Configure firewall rules
- [ ] Set up SSL certificate
- [ ] Enable database backups
- [ ] Test all security features
- [ ] Review error messages (no sensitive info)
- [ ] Set proper file permissions (755 for dirs, 644 for files)

## Testing Security

### Test CSRF Protection:
```bash
# Should fail without CSRF token
curl -X POST http://your-domain/api/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
```

### Test Rate Limiting:
```bash
# Make 6 rapid requests - 6th should fail
for i in {1..6}; do
  curl http://your-domain/api/auth/admin-login
done
```

### Test HTTPS Redirect:
```bash
# Should redirect to HTTPS
curl -I http://your-domain
```

## Monitoring

### Check Security Logs:
```bash
tail -f backend/writable/logs/log-*.php | grep security
```

### Monitor Failed Logins:
```bash
grep "Failed.*login" backend/writable/logs/log-*.php
```

## Emergency Response

### If Breach Suspected:

1. **Immediately:**
   - Change all passwords
   - Rotate JWT_SECRET
   - Check logs for suspicious activity
   - Disable affected accounts

2. **Investigate:**
   - Review security logs
   - Check database for unauthorized changes
   - Analyze access patterns

3. **Remediate:**
   - Patch vulnerabilities
   - Update all dependencies
   - Strengthen security measures
   - Notify affected users if needed

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CodeIgniter 4 Security](https://codeigniter.com/user_guide/concepts/security.html)
- [PHP Security Best Practices](https://www.php.net/manual/en/security.php)
