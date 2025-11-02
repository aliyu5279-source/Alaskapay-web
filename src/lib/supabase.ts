import { createClient } from '@supabase/supabase-js';
import { config } from '@/config/environment';

// Initialize Supabase client with environment config
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.anonKey;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration. Check your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
