#!/usr/bin/env node

/**
 * Create Test Accounts Script
 * Automatically creates test accounts with pre-funded wallets
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const testAccounts = [
  {
    email: 'admin@alaskapay.test',
    password: 'Admin123!@#',
    role: 'admin',
    balance: 100000,
    kyc_tier: 3,
    full_name: 'Admin User'
  },
  {
    email: 'john.doe@alaskapay.test',
    password: 'Test123!@#',
    role: 'user',
    balance: 10000,
    kyc_tier: 2,
    full_name: 'John Doe'
  },
  {
    email: 'jane.smith@alaskapay.test',
    password: 'Test123!@#',
    role: 'user',
    balance: 5000,
    kyc_tier: 1,
    full_name: 'Jane Smith'
  },
  {
    email: 'mike.johnson@alaskapay.test',
    password: 'Test123!@#',
    role: 'user',
    balance: 15000,
    kyc_tier: 3,
    full_name: 'Mike Johnson'
  },
  {
    email: 'sarah.williams@alaskapay.test',
    password: 'Test123!@#',
    role: 'user',
    balance: 2000,
    kyc_tier: 0,
    full_name: 'Sarah Williams'
  }
];

async function createTestAccounts() {
  console.log('🚀 Creating test accounts...\n');

  for (const account of testAccounts) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          full_name: account.full_name,
          role: account.role
        }
      });

      if (authError) {
        console.log(`❌ ${account.email}: ${authError.message}`);
        continue;
      }

      // Create profile
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: account.email,
        full_name: account.full_name,
        role: account.role,
        kyc_tier: account.kyc_tier,
        kyc_status: account.kyc_tier > 0 ? 'approved' : 'pending'
      });

      // Create wallet
      await supabase.from('wallets').upsert({
        user_id: authData.user.id,
        balance: account.balance,
        currency: 'NGN'
      });

      console.log(`✅ ${account.email} (Balance: ₦${account.balance.toLocaleString()})`);
    } catch (error) {
      console.log(`❌ ${account.email}: ${error.message}`);
    }
  }

  console.log('\n✨ Test accounts created successfully!');
  console.log('\n📋 Login Credentials:');
  testAccounts.forEach(acc => {
    console.log(`   ${acc.email} / ${acc.password}`);
  });
}

createTestAccounts().catch(console.error);
