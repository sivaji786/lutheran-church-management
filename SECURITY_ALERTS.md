# Security Email Notification System

## Overview

The system now automatically sends email alerts to **sivaji@digitalks.in** for various security incidents.

## Monitored Security Events

### 1. **Failed Login Attempts** 🔐
- **Trigger:** 3+ failed login attempts from same IP within 1 hour
- **Alert Includes:**
  - Login type (Admin/Member)
  - Identifier used (username/mobile/member code)
  - IP address
  - Number of failed attempts
  - User agent
  - Timestamp

### 2. **Rate Limit Violations** ⚡
- **Trigger:** Exceeding API request limits
- **Limits:**
  - Auth endpoints: 5 requests per 5 minutes
  - Other endpoints: 10 requests per minute
- **Alert Includes:**
  - Route accessed
  - IP address
  - User agent
  - Timestamp

### 3. **Unauthorized Access Attempts** 🚫
- **Trigger:** Accessing resources without proper authorization
- **Alert Includes:**
  - Resource attempted
  - User ID (if authenticated)
  - IP address
  - Request method
  - User agent

### 4. **SQL Injection Attempts** 💉
- **Trigger:** Suspicious SQL patterns detected in input
- **Alert Includes:**
  - Field name
  - Suspicious input (first 200 chars)
  - IP address
  - Request URI
  - User agent

### 5. **XSS Attack Attempts** 🎭
- **Trigger:** Suspicious script patterns detected
- **Alert Includes:**
  - Field name
  - Suspicious input (first 200 chars)
  - IP address
  - Request URI
  - User agent

### 6. **Password Changes** 🔑
- **Trigger:** Any password change
- **Alert Includes:**
  - User ID
  - User type (Admin/Member)
  - IP address
  - Timestamp

### 7. **Account Lockouts** 🔒
- **Trigger:** Account locked due to failed attempts
- **Alert Includes:**
  - Account identifier
  - Number of failed attempts
  - IP address
  - Timestamp

### 8. **Large Data Exports** 📊
- **Trigger:** Export of 100+ records
- **Alert Includes:**
  - Data type exported
  - Record count
  - User ID
  - IP address
  - Export time

## Email Configuration

### SMTP Setup (Recommended for Production)

Edit `backend/app/Config/Email.php` or `backend/.env`:

```env
# Email Configuration
email.protocol = smtp
email.SMTPHost = smtp.gmail.com
email.SMTPUser = your-email@gmail.com
email.SMTPPass = your-app-password
email.SMTPPort = 587
email.SMTPCrypto = tls
email.fromEmail = noreply@lutheranchurch.org
email.fromName = Lutheran Church Security
```

### Gmail Setup:
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password in `email.SMTPPass`

### Alternative: PHP mail() Function

For shared hosting with mail() support:

```php
// backend/app/Config/Email.php
public string $protocol = 'mail';
```

## Testing Email Alerts

### Test Failed Login Alert:

```bash
# Make 3 failed login attempts
for i in {1..3}; do
  curl -X POST http://localhost:8080/api/auth/admin-login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"wrong"}'
  sleep 1
done
```

### Test Rate Limit Alert:

```bash
# Make 6 rapid requests to trigger rate limit
for i in {1..6}; do
  curl http://localhost:8080/api/auth/admin-login
done
```

## Using SecurityMonitor in Your Code

### Example: Log Suspicious Activity

```php
use App\Libraries\SecurityMonitor;

$security = new SecurityMonitor();

// Log custom suspicious activity
$security->logSuspiciousActivity(
    'User attempted to access deleted member data',
    [
        'User ID' => $userId,
        'Member ID' => $deletedMemberId,
        'Action' => 'View deleted member',
        'Severity' => 'HIGH'
    ]
);
```

### Example: Log Unauthorized Access

```php
$security = new SecurityMonitor();
$security->logUnauthorizedAccess(
    '/api/admin/settings',
    $userId,
    $request->getIPAddress()
);
```

### Example: Log Data Export

```php
$security = new SecurityMonitor();
$security->logDataExport(
    'Members',
    count($exportedMembers),
    $currentUserId
);
```

## Email Alert Severity Levels

| Severity | Color | Description |
|----------|-------|-------------|
| CRITICAL | Red | Immediate action required (SQL injection, etc.) |
| HIGH | Orange | Serious security concern (unauthorized access, account lockout) |
| MEDIUM | Yellow | Moderate concern (rate limit, large export) |
| INFO | Blue | Informational (password change) |

## Alert Email Format

Each alert email includes:

1. **Header Section**
   - Alert title
   - Application name
   - Timestamp

2. **Incident Details Table**
   - All relevant parameters
   - IP address
   - User agent
   - Server information
   - Severity level

3. **Recommended Actions**
   - Review checklist
   - Quick access link to admin dashboard

4. **Footer**
   - Automated message notice
   - Support contact info

## Customization

### Change Alert Email Address

Edit `backend/app/Libraries/SecurityMonitor.php`:

```php
protected $securityEmail = 'your-email@example.com';
```

### Add Multiple Recipients

```php
protected $securityEmail = 'admin1@example.com,admin2@example.com';
```

### Customize Alert Thresholds

```php
// In SecurityMonitor.php, logFailedLogin method
if ($attempts >= 5) {  // Change from 3 to 5
    $this->sendSecurityAlert(...);
}
```

### Customize Email Template

Edit the `buildEmailBody()` method in `SecurityMonitor.php` to customize:
- Colors and styling
- Logo/branding
- Additional sections
- Footer information

## Monitoring and Logs

### View Security Logs

```bash
# View all security logs
tail -f backend/writable/logs/log-*.php | grep security

# View only failed logins
grep "Failed.*login" backend/writable/logs/log-*.php

# View rate limit violations
grep "Rate limit" backend/writable/logs/log-*.php
```

### Log File Location

```
backend/writable/logs/log-YYYY-MM-DD.php
```

## Troubleshooting

### Emails Not Sending

1. **Check Email Configuration:**
```bash
# Test email config
php spark email:test sivaji@digitalks.in
```

2. **Check Logs:**
```bash
tail -f backend/writable/logs/log-*.php | grep email
```

3. **Common Issues:**
   - SMTP credentials incorrect
   - Firewall blocking port 587/465
   - Gmail blocking less secure apps (use app password)
   - PHP mail() not configured on server

### Email Goes to Spam

1. Set up SPF record for your domain
2. Set up DKIM signing
3. Use authenticated SMTP
4. Ensure proper from address

## Production Checklist

- [ ] Configure SMTP settings in `.env`
- [ ] Test email delivery
- [ ] Verify security email address
- [ ] Set appropriate alert thresholds
- [ ] Enable all security filters
- [ ] Test all alert types
- [ ] Set up email monitoring
- [ ] Configure email retention policy
- [ ] Document incident response procedures

## Security Best Practices

1. **Don't Disable Alerts:** Even if you get many emails, investigate the cause
2. **Review Regularly:** Check security logs weekly
3. **Act Quickly:** Respond to HIGH/CRITICAL alerts within 1 hour
4. **Keep Records:** Archive security alert emails
5. **Update Contacts:** Keep security email list current
6. **Test Periodically:** Test alert system monthly

## Support

For issues with the security monitoring system:
1. Check logs in `backend/writable/logs/`
2. Verify email configuration
3. Test with simple email send
4. Review SecurityMonitor.php for errors

---

**Last Updated:** December 24, 2024  
**Version:** 1.0  
**Contact:** sivaji@digitalks.in
