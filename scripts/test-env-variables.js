#!/usr/bin/env node

/**
 * Test Environment Variables Script
 * Run this to verify all required environment variables are set correctly
 * Usage: node scripts/test-env-variables.js
 */

const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_PAYSTACK_PUBLIC_KEY'
];

const optionalVars = [
  'VITE_STRIPE_PUBLIC_KEY',
  'VITE_GOOGLE_MAPS_API_KEY',
  'VITE_APP_NAME',
  'VITE_APP_URL',
  'VITE_ENABLE_SUBSCRIPTIONS',
  'VITE_ENABLE_VIRTUAL_CARDS',
  'VITE_ENABLE_BILL_PAYMENTS',
  'VITE_ENABLE_AI_FEATURES'
];

console.log('\n🔍 Testing Environment Variables...\n');

let hasErrors = false;

// Check required variables
console.log('✅ Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`   ❌ ${varName}: MISSING`);
    hasErrors = true;
  } else {
    const preview = value.length > 20 ? value.substring(0, 20) + '...' : value;
    console.log(`   ✓ ${varName}: ${preview}`);
  }
});

// Check optional variables
console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const preview = value.length > 20 ? value.substring(0, 20) + '...' : value;
    console.log(`   ✓ ${varName}: ${preview}`);
  } else {
    console.log(`   ⚠ ${varName}: Not set (optional)`);
  }
});

// Validate formats
console.log('\n🔎 Validating Formats:');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl) {
  if (supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co')) {
    console.log('   ✓ Supabase URL format is correct');
  } else {
    console.log('   ❌ Supabase URL format invalid (should be https://xxx.supabase.co)');
    hasErrors = true;
  }
}

const paystackKey = process.env.VITE_PAYSTACK_PUBLIC_KEY;
if (paystackKey) {
  if (paystackKey.startsWith('pk_test_') || paystackKey.startsWith('pk_live_')) {
    console.log('   ✓ Paystack key format is correct');
  } else {
    console.log('   ❌ Paystack key format invalid (should start with pk_test_ or pk_live_)');
    hasErrors = true;
  }
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Environment setup has errors!');
  console.log('\n📖 See VERCEL_ENV_SETUP_GUIDE.md for help');
  process.exit(1);
} else {
  console.log('✅ All environment variables are set correctly!');
  console.log('🚀 Your app is ready to deploy!');
  process.exit(0);
}
