# Security Testing - Manual Test Guide

## ⚠️ Note on Automated Tests

The automated security test script (`security_tests.sh`) may experience hanging issues due to curl timeout behavior in some environments. If you encounter this, please use the manual testing approach below.

## 🔧 Manual Security Testing

### Prerequisites
1. Start the backend server:
   ```bash
   cd backend
   php spark serve
   ```

2. Keep the backend running in one terminal

### Test 1: SQL Injection in Login

**Test:** Try SQL injection in admin login
```bash
curl -X POST http://localhost:8080/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin OR 1=1","password":"test"}'
```

**Expected:** Should return error (400 or 401), not allow login
**✅ Pass:** Returns error message
**❌ Fail:** Returns success or allows login

### Test 2: Unauthorized Access

**Test:** Access admin endpoint without token
```bash
curl http://localhost:8080/api/members
```

**Expected:** HTTP 401 or 403
**✅ Pass:** Returns 401/403 Unauthorized
**❌ Fail:** Returns member data

### Test 3: Invalid JWT Token

**Test:** Use invalid JWT token
```bash
curl http://localhost:8080/api/members \
  -H "Authorization: Bearer invalid.token.here"
```

**Expected:** HTTP 401 or 403
**✅ Pass:** Returns 401/403
**❌ Fail:** Returns data or 200 OK

### Test 4: Password in Error Messages

**Test:** Wrong password login
```bash
curl -X POST http://localhost:8080/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrongpassword"}'
```

**Expected:** Error message should NOT contain the password
**✅ Pass:** No password in response
**❌ Fail:** Password visible in response

### Test 5: CORS Headers

**Test:** Check CORS configuration
```bash
curl -I http://localhost:8080/
```

**Expected:** Should see `Access-Control-Allow-Origin` header
**✅ Pass:** CORS headers present
**❌ Fail:** No CORS headers

### Test 6: XSS in Member Name

**Test:** Create member with XSS payload (requires admin login first)

1. Login as admin:
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.token')
```

2. Try to create member with XSS:
```bash
curl -X POST http://localhost:8080/api/members \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(\"XSS\")</script>",
    "mobile": "1234567890",
    "memberCode": "TEST001",
    "password": "test123",
    "dateOfBirth": "1990-01-01",
    "registrationDate": "2025-01-01"
  }'
```

**Expected:** Script tags should be escaped or rejected
**✅ Pass:** XSS payload is sanitized
**❌ Fail:** Script executes when viewing member

### Test 7: Brute Force Protection

**Test:** Multiple failed login attempts
```bash
for i in {1..10}; do
  curl -s -X POST http://localhost:8080/api/auth/admin/login \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"admin\",\"password\":\"wrong$i\"}"
  echo ""
done
```

**Expected:** Account should lock after N attempts
**✅ Pass:** Account locks or rate limiting kicks in
**❌ Fail:** Unlimited attempts allowed

## 📊 Security Checklist

- [ ] SQL injection prevented in login
- [ ] Unauthorized access blocked
- [ ] Invalid JWT tokens rejected
- [ ] Passwords not exposed in errors
- [ ] CORS headers configured
- [ ] XSS payloads sanitized
- [ ] Brute force protection active
- [ ] HTTPS enforced (production)
- [ ] Security headers present
- [ ] Dependencies up to date

## 🔐 Production Security Checklist

Before deploying to production:

- [ ] Change default admin password
- [ ] Change default member passwords
- [ ] Update JWT secret to strong random value
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain only
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Set up monitoring and logging
- [ ] Regular security audits scheduled

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Testing Plan](../security_testing_plan.md)
- [SECURITY.md](../../SECURITY.md)

## 🐛 Reporting Security Issues

If you find a security vulnerability, please report it responsibly:
1. Do NOT create a public GitHub issue
2. Email the project maintainer
3. Include steps to reproduce
4. Allow time for a fix before public disclosure
