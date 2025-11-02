#!/usr/bin/env node

/**
 * Test script for crash reporting
 * Run with: npm run test:crash
 */

console.log('🧪 Testing Crash Reporting...\n');

console.log('✅ Test 1: Console logging works');
console.log('ℹ️  Info message');
console.warn('⚠️  Warning message');
console.error('❌ Error message');

console.log('\n📝 Instructions for manual testing:');
console.log('1. Start the app: npm run dev');
console.log('2. Open browser console');
console.log('3. Test synchronous error:');
console.log('   throw new Error("Test sync error")');
console.log('4. Test async error:');
console.log('   Promise.reject(new Error("Test async error"))');
console.log('5. Check Firebase Console → Crashlytics after 5-10 minutes');
console.log('6. Verify error appears with context and breadcrumbs\n');

console.log('✅ Crash reporting test script completed');
