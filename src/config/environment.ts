// Environment Configuration with Validation

export const config = {
  // Supabase Configuration (Already Connected!)
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://psafbcbhbidnbzfsccsu.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYWZiY2JoYmlkbmJ6ZnNjY3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTA1MTIsImV4cCI6MjA3NTE2NjUxMn0.RrZpBW6JujulVZ8H74k1EizS7dz3qHIwhyNJmoxwvKI'
  },
  
  // Paystack Configuration (Needs API Keys)
  paystack: {
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
    secretKey: import.meta.env.VITE_PAYSTACK_SECRET_KEY || ''
  },
  
  // App Configuration
  app: {
    name: 'Alaska Pay',
    url: import.meta.env.VITE_APP_URL || 'https://alaskapay-web.vercel.app'
  },
  
  // Feature Flags
  features: {
    subscriptions: true,
    virtualCards: true,
    billPayments: true,
    aiFeatures: true
  }
};

// Validation Helper
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!config.supabase.url) errors.push('Supabase URL missing');
  if (!config.supabase.anonKey) errors.push('Supabase Anon Key missing');
  
  // Paystack is optional for development
  if (!config.paystack.publicKey) {
    console.warn('⚠️ Paystack Public Key not set - payments will not work');
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration errors: ${errors.join(', ')}`);
  }
  
  return true;
};

export default config;
