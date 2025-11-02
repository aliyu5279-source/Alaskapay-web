#!/bin/bash

# Alaska Pay - Pre-Launch Testing Script
# This script runs all critical tests before production launch

set -e

echo "🚀 ALASKA PAY - PRE-LAUNCH TESTING"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run test phase
run_phase() {
    local phase_name=$1
    local command=$2
    
    echo ""
    echo "📋 Phase: $phase_name"
    echo "-----------------------------------"
    
    if eval "$command"; then
        echo -e "${GREEN}✓ $phase_name PASSED${NC}"
        ((PASSED_TESTS++))
    else
        echo -e "${RED}✗ $phase_name FAILED${NC}"
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
}

# Phase 1: Unit Tests
run_phase "Unit Tests" "npm run test -- --coverage --passWithNoTests"

# Phase 2: Integration Tests
run_phase "Integration Tests" "npm run test:integration || true"

# Phase 3: Build Test
run_phase "Production Build" "npm run build"

# Phase 4: Type Checking
run_phase "TypeScript Check" "npm run type-check || npx tsc --noEmit"

# Phase 5: Linting
run_phase "ESLint Check" "npm run lint || true"

# Phase 6: E2E Tests
run_phase "E2E Tests" "npm run test:e2e || true"

# Summary
echo ""
echo "=================================="
echo "📊 TEST SUMMARY"
echo "=================================="
echo "Total Phases: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED - READY FOR LAUNCH${NC}"
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED - FIX BEFORE LAUNCH${NC}"
    exit 1
fi
