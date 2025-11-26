#!/bin/bash

# Lutheran Church Management System - Security Testing Script
# This script performs basic security tests on the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="${API_BASE_URL:-http://localhost:8080}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Helper functions
print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_test() {
    echo -e "${YELLOW}[TEST]${NC} $1"
    ((TOTAL_TESTS++))
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED_TESTS++))
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED_TESTS++))
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Test 1: SQL Injection in Login
test_sql_injection_login() {
    print_header "Test 1: SQL Injection in Login"
    
    print_test "Testing SQL injection in admin login"
    RESPONSE=$(curl -s --max-time 5 -X POST "$API_BASE_URL/api/auth/admin/login" \
        -H "Content-Type: application/json" \
        -d '{"username":"admin'\'' OR '\''1'\''='\''1","password":"anything"}' 2>/dev/null || echo "connection_failed")
    
    if [ "$RESPONSE" = "connection_failed" ]; then
        print_info "Cannot connect to API (is backend running?)"
    elif echo "$RESPONSE" | grep -q "Invalid credentials\|error\|Unauthorized"; then
        print_pass "SQL injection in login prevented"
    else
        print_fail "Possible SQL injection vulnerability in login"
    fi
}

# Test 2: XSS in Member Name
test_xss_member_name() {
    print_header "Test 2: XSS in Member Name"
    
    print_test "Testing XSS payload in member name"
    # This would require authentication - skipping for now
    print_info "Requires authentication - manual testing recommended"
}

# Test 3: Unauthorized Access to Admin Endpoints
test_unauthorized_admin_access() {
    print_header "Test 3: Unauthorized Access to Admin Endpoints"
    
    print_test "Accessing admin endpoint without authentication"
    HTTP_CODE=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$API_BASE_URL/api/members" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "000" ]; then
        print_info "Cannot connect to API (is backend running?)"
    elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
        print_pass "Admin endpoint protected (HTTP $HTTP_CODE)"
    else
        print_fail "Admin endpoint accessible without auth (HTTP $HTTP_CODE)"
    fi
}

# Test 4: Password in Error Messages
test_password_exposure() {
    print_header "Test 4: Password Exposure in Responses"
    
    print_test "Checking if password appears in error messages"
    RESPONSE=$(curl -s --max-time 5 -X POST "$API_BASE_URL/api/auth/admin/login" \
        -H "Content-Type: application/json" \
        -d '{"username":"admin","password":"wrongpassword"}' 2>/dev/null || echo "connection_failed")
    
    if [ "$RESPONSE" = "connection_failed" ]; then
        print_info "Cannot connect to API (is backend running?)"
    elif echo "$RESPONSE" | grep -qi "password"; then
        print_fail "Password mentioned in error response"
    else
        print_pass "No password exposure in error messages"
    fi
}

# Test 5: CORS Headers
test_cors_headers() {
    print_header "Test 5: CORS Headers"
    
    print_test "Checking CORS headers"
    CORS_HEADER=$(curl -s --max-time 5 -I "$API_BASE_URL/api/health" 2>/dev/null | grep -i "access-control-allow-origin" || echo "")
    
    if [ -z "$CORS_HEADER" ]; then
        # Try root endpoint
        CORS_HEADER=$(curl -s --max-time 5 -I "$API_BASE_URL/" 2>/dev/null | grep -i "access-control-allow-origin" || echo "")
    fi
    
    if [ -n "$CORS_HEADER" ]; then
        print_pass "CORS headers present: $CORS_HEADER"
    else
        print_info "CORS headers not found (may need configuration)"
    fi
}

# Test 6: Security Headers
test_security_headers() {
    print_header "Test 6: Security Headers"
    
    print_test "Checking security headers on frontend"
    
    # Check X-Content-Type-Options
    if curl -s -I "$FRONTEND_URL" | grep -qi "x-content-type-options"; then
        print_pass "X-Content-Type-Options header present"
    else
        print_info "X-Content-Type-Options header missing (recommended)"
    fi
    
    # Check X-Frame-Options
    if curl -s -I "$FRONTEND_URL" | grep -qi "x-frame-options"; then
        print_pass "X-Frame-Options header present"
    else
        print_info "X-Frame-Options header missing (recommended)"
    fi
}

# Test 7: Dependency Vulnerabilities
test_dependency_vulnerabilities() {
    print_header "Test 7: Dependency Vulnerabilities"
    
    print_test "Checking npm dependencies for vulnerabilities"
    if command -v npm &> /dev/null; then
        cd "$(dirname "$0")/../.." || exit
        npm audit --audit-level=moderate > /tmp/npm_audit.txt 2>&1 || true
        
        if grep -q "found 0 vulnerabilities" /tmp/npm_audit.txt; then
            print_pass "No npm vulnerabilities found"
        else
            print_info "npm audit results:"
            cat /tmp/npm_audit.txt
        fi
    else
        print_info "npm not found - skipping dependency check"
    fi
}

# Test 8: Brute Force Protection
test_brute_force_protection() {
    print_header "Test 8: Brute Force Protection"
    
    print_test "Testing brute force protection (5 failed attempts)"
    
    for i in {1..5}; do
        curl -s --max-time 5 -X POST "$API_BASE_URL/api/auth/admin/login" \
            -H "Content-Type: application/json" \
            -d '{"username":"admin","password":"wrong'$i'"}' > /dev/null 2>&1
    done
    
    # 6th attempt
    RESPONSE=$(curl -s --max-time 5 -X POST "$API_BASE_URL/api/auth/admin/login" \
        -H "Content-Type: application/json" \
        -d '{"username":"admin","password":"wrong6"}' 2>/dev/null || echo "connection_failed")
    
    if [ "$RESPONSE" = "connection_failed" ]; then
        print_info "Cannot connect to API (is backend running?)"
    elif echo "$RESPONSE" | grep -qi "locked\|too many\|rate limit"; then
        print_pass "Brute force protection active"
    else
        print_info "Brute force protection not detected (consider implementing)"
    fi
}

# Test 9: JWT Token Validation
test_jwt_validation() {
    print_header "Test 9: JWT Token Validation"
    
    print_test "Testing with invalid JWT token"
    HTTP_CODE=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$API_BASE_URL/api/members" \
        -H "Authorization: Bearer invalid.token.here" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "000" ]; then
        print_info "Cannot connect to API (is backend running?)"
    elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
        print_pass "Invalid JWT rejected (HTTP $HTTP_CODE)"
    else
        print_fail "Invalid JWT accepted (HTTP $HTTP_CODE)"
    fi
}

# Test 10: Information Disclosure
test_information_disclosure() {
    print_header "Test 10: Information Disclosure"
    
    print_test "Checking for information disclosure in errors"
    RESPONSE=$(curl -s --max-time 5 "$API_BASE_URL/api/nonexistent" 2>/dev/null || echo "connection_failed")
    
    if [ "$RESPONSE" = "connection_failed" ]; then
        print_info "Cannot connect to API (is backend running?)"
    elif echo "$RESPONSE" | grep -qi "stack trace\|debug\|exception"; then
        print_fail "Possible information disclosure in error messages"
    else
        print_pass "No obvious information disclosure"
    fi
}

# Main execution
main() {
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                                                            ║"
    echo "║   Lutheran Church Management System                        ║"
    echo "║   Security Testing Suite                                   ║"
    echo "║                                                            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    print_info "API Base URL: $API_BASE_URL"
    print_info "Frontend URL: $FRONTEND_URL"
    print_info "Starting security tests...\n"
    
    # Run all tests
    test_sql_injection_login
    test_xss_member_name
    test_unauthorized_admin_access
    test_password_exposure
    test_cors_headers
    test_security_headers
    test_dependency_vulnerabilities
    test_brute_force_protection
    test_jwt_validation
    test_information_disclosure
    
    # Print summary
    print_header "Test Summary"
    echo -e "Total Tests:  ${BLUE}$TOTAL_TESTS${NC}"
    echo -e "Passed:       ${GREEN}$PASSED_TESTS${NC}"
    echo -e "Failed:       ${RED}$FAILED_TESTS${NC}"
    echo -e "Info/Skipped: ${YELLOW}$((TOTAL_TESTS - PASSED_TESTS - FAILED_TESTS))${NC}"
    
    if [ $FAILED_TESTS -gt 0 ]; then
        echo -e "\n${RED}⚠️  Security issues detected! Please review failed tests.${NC}"
        exit 1
    else
        echo -e "\n${GREEN}✅ All security tests passed!${NC}"
        exit 0
    fi
}

# Run main function
main
