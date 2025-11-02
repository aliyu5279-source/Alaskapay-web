import { createClient } from '@supabase/supabase-js';

// Use hardcoded credentials for seeding
const supabaseUrl = 'https://psafbcbhbidnbzfsccsu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYWZiY2JoYmlkbmJ6ZnNjY3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTA1MTIsImV4cCI6MjA3NTE2NjUxMn0.RrZpBW6JujulVZ8H74k1EizS7dz3qHIwhyNJmoxwvKI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Seeding AlaskaPay database...\n');

  try {
    // 1. Seed currencies
    console.log('💰 Adding currencies...');
    const { error: currError } = await supabase.from('currencies').upsert([
      { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', is_active: true },
      { code: 'USD', name: 'US Dollar', symbol: '$', is_active: true },
      { code: 'EUR', name: 'Euro', symbol: '€', is_active: true },
      { code: 'GBP', name: 'British Pound', symbol: '£', is_active: true }
    ]);
    if (currError) console.log('Note:', currError.message);
    else console.log('✅ Currencies added\n');

    // 2. Seed Nigerian banks
    console.log('🏦 Adding Nigerian banks...');
    const banks = [
      { code: '044', name: 'Access Bank', is_active: true },
      { code: '063', name: 'Access Bank (Diamond)', is_active: true },
      { code: '050', name: 'Ecobank Nigeria', is_active: true },
      { code: '070', name: 'Fidelity Bank', is_active: true },
      { code: '011', name: 'First Bank of Nigeria', is_active: true },
      { code: '214', name: 'First City Monument Bank', is_active: true },
      { code: '058', name: 'Guaranty Trust Bank', is_active: true },
      { code: '030', name: 'Heritage Bank', is_active: true },
      { code: '301', name: 'Jaiz Bank', is_active: true },
      { code: '082', name: 'Keystone Bank', is_active: true },
      { code: '076', name: 'Polaris Bank', is_active: true },
      { code: '221', name: 'Stanbic IBTC Bank', is_active: true },
      { code: '232', name: 'Sterling Bank', is_active: true },
      { code: '000026', name: 'Taj Bank', is_active: true },
      { code: '032', name: 'Union Bank of Nigeria', is_active: true },
      { code: '033', name: 'United Bank For Africa', is_active: true },
      { code: '215', name: 'Unity Bank', is_active: true },
      { code: '035', name: 'Wema Bank', is_active: true },
      { code: '057', name: 'Zenith Bank', is_active: true }
    ];
    const { error: bankError } = await supabase.from('nigerian_banks').upsert(banks);
    if (bankError) console.log('Note:', bankError.message);
    else console.log('✅ Banks added\n');

    // 3. Seed bill payees
    console.log('📱 Adding bill payment providers...');
    const payees = [
      { name: 'EKEDC', category: 'electricity', is_active: true },
      { name: 'IKEDC', category: 'electricity', is_active: true },
      { name: 'MTN', category: 'airtime', is_active: true },
      { name: 'Airtel', category: 'airtime', is_active: true },
      { name: 'Glo', category: 'airtime', is_active: true },
      { name: '9mobile', category: 'airtime', is_active: true },
      { name: 'DStv', category: 'cable', is_active: true },
      { name: 'GOtv', category: 'cable', is_active: true },
      { name: 'Startimes', category: 'cable', is_active: true }
    ];
    const { error: payeeError } = await supabase.from('bill_payees').upsert(payees);
    if (payeeError) console.log('Note:', payeeError.message);
    else console.log('✅ Bill providers added\n');

    console.log('✨ Database seeding complete!\n');
    console.log('Next steps:');
    console.log('1. Deploy edge functions: supabase functions deploy');
    console.log('2. Configure Paystack webhook');
    console.log('3. Test the application');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

seedDatabase();

