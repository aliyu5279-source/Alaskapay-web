// Environment Variable Sync Service
export interface EnvVariable {
  key: string;
  value?: string;
  required: boolean;
  description: string;
  platform: 'vercel' | 'netlify' | 'both';
  present: boolean;
}

export const REQUIRED_ENV_VARS: Omit<EnvVariable, 'present' | 'value'>[] = [
  { key: 'VITE_SUPABASE_URL', required: true, description: 'Supabase project URL', platform: 'both' },
  { key: 'VITE_SUPABASE_ANON_KEY', required: true, description: 'Supabase anonymous key', platform: 'both' },
  { key: 'VITE_PAYSTACK_PUBLIC_KEY', required: true, description: 'Paystack public key', platform: 'both' },
  { key: 'VITE_STRIPE_PUBLIC_KEY', required: false, description: 'Stripe public key', platform: 'both' },
  { key: 'VITE_GOOGLE_MAPS_API_KEY', required: false, description: 'Google Maps API key', platform: 'both' },
];

export class EnvSyncService {
  async detectMissingVars(platform: 'vercel' | 'netlify'): Promise<EnvVariable[]> {
    const results: EnvVariable[] = [];
    
    for (const envVar of REQUIRED_ENV_VARS) {
      if (envVar.platform === platform || envVar.platform === 'both') {
        const value = import.meta.env[envVar.key];
        results.push({
          ...envVar,
          value: value || undefined,
          present: !!value,
        });
      }
    }
    
    return results;
  }

  async syncToVercel(projectId: string, token: string, vars: Record<string, string>) {
    const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'encrypted',
        key: Object.keys(vars)[0],
        value: Object.values(vars)[0],
        target: ['production', 'preview', 'development'],
      }),
    });
    
    return response.json();
  }

  async syncToNetlify(siteId: string, token: string, vars: Record<string, string>) {
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/env`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vars),
    });
    
    return response.json();
  }

  validateEnvVars(vars: EnvVariable[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const envVar of vars) {
      if (envVar.required && !envVar.present) {
        errors.push(`Missing required variable: ${envVar.key}`);
      }
      if (envVar.value && envVar.key.includes('KEY') && envVar.value.length < 10) {
        errors.push(`${envVar.key} appears to be invalid (too short)`);
      }
    }
    
    return { valid: errors.length === 0, errors };
  }
}

export const envSyncService = new EnvSyncService();
