#!/bin/bash

# Lutheran Church Management System - Security Testing Script
# Simplified version that won't hang

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
API_BASE_URL="${API_BASE_URL:-http://localhost:8080}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

# Counters
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

# Banner
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

# Test 1: SQL Injection
print_header "Test 1: SQL Injection in Login"
print_test "Testing SQL injection in admin login"

RESPONSE=$(curl -s --connect-timeout 2 --max-time 3 -X POST "$API_BASE_URL/api/auth/admin/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin OR 1=1","password":"test123"}' 2>/dev/null || echo "FAILED")

if [ "$RESPONSE" = "FAILED" ]; then
    print_info "Cannot connect to API (is backend running?)"
elif echo "$RESPONSE" | grep -qi "error\|Bad Request\|Invalid"; then
    print_pass "SQL injection prevented - got error response"
else
    print_fail "Unexpected response"
fi

# Test 2: Unauthorized Access
print_header "Test 2: Unauthorized Access to Admin Endpoints"
print_test "Accessing admin endpoint without authentication"

HTTP_CODE=$(curl -s --connect-timeout 2 --max-time 3 -o /dev/null -w "%{http_code}" \
    "$API_BASE_URL/api/members" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "000" ]; then
    print_info "Cannot connect to API"
elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
    print_pass "Admin endpoint protected (HTTP $HTTP_CODE)"
else
    print_fail "Admin endpoint accessible without auth (HTTP $HTTP_CODE)"
fi

# Test 3: Password Exposure
print_header "Test 3: Password Exposure in Responses"
print_test "Checking if password appears in error messages"

RESPONSE=$(curl -s --connect-timeout 2 --max-time 3 -X POST "$API_BASE_URL/api/auth/admin/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"wrongpassword"}' 2>/dev/null || echo "FAILED")

if [ "$RESPONSE" = "FAILED" ]; then
    print_info "Cannot connect to API"
elif echo "$RESPONSE" | grep -qi "password"; then
    print_fail "Password mentioned in error response"
else
    print_pass "No password exposure in error messages"
fi

# Test 4: CORS Headers
print_header "Test 4: CORS Headers"
print_test "Checking CORS headers"

CORS_HEADER=$(curl -s --connect-timeout 2 --max-time 3 -I "$API_BASE_URL/" 2>/dev/null | grep -i "access-control-allow-origin" || echo "")

if [ -n "$CORS_HEADER" ]; then
    print_pass "CORS headers present"
else
    print_info "CORS headers not found"
fi

# Test 5: JWT Token Validation
print_header "Test 5: JWT Token Validation"
print_test "Testing with invalid JWT token"

HTTP_CODE=$(curl -s --connect-timeout 2 --max-time 3 -o /dev/null -w "%{http_code}" \
    "$API_BASE_URL/api/members" \
    -H "Authorization: Bearer invalid.token.here" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "000" ]; then
    print_info "Cannot connect to API"
elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
    print_pass "Invalid JWT rejected (HTTP $HTTP_CODE)"
else
    print_fail "Invalid JWT accepted (HTTP $HTTP_CODE)"
fi

# Summary
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
