export interface ValidationResult {
  isValid: boolean;
  message: string;
  responseTime?: number;
}

export const credentialValidators = {
  async validateNetlifyToken(token: string): Promise<ValidationResult> {
    const start = Date.now();
    try {
      const response = await fetch('https://api.netlify.com/api/v1/sites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const responseTime = Date.now() - start;
      
      if (response.ok) {
        return {
          isValid: true,
          message: 'Netlify token is valid',
          responseTime
        };
      }
      
      return {
        isValid: false,
        message: 'Invalid Netlify token',
        responseTime
      };
    } catch (error) {
      return {
        isValid: false,
        message: `Validation error: ${error.message}`
      };
    }
  },

  async validateNetlifySiteId(siteId: string, token: string): Promise<ValidationResult> {
    const start = Date.now();
    try {
      const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const responseTime = Date.now() - start;
      
      if (response.ok) {
        const data = await response.json();
        return {
          isValid: true,
          message: `Site found: ${data.name}`,
          responseTime
        };
      }
      
      return {
        isValid: false,
        message: 'Invalid site ID or no access',
        responseTime
      };
    } catch (error) {
      return {
        isValid: false,
        message: `Validation error: ${error.message}`
      };
    }
  },

  async validateSupabaseUrl(url: string): Promise<ValidationResult> {
    const start = Date.now();
    try {
      if (!url.includes('supabase.co')) {
        return {
          isValid: false,
          message: 'URL must be a Supabase URL'
        };
      }

      const response = await fetch(`${url}/rest/v1/`, {
        method: 'HEAD'
      });
      
      const responseTime = Date.now() - start;
      
      return {
        isValid: response.status === 401 || response.status === 200,
        message: response.status === 401 || response.status === 200 
          ? 'Supabase URL is reachable' 
          : 'Cannot reach Supabase URL',
        responseTime
      };
    } catch (error) {
      return {
        isValid: false,
        message: `Validation error: ${error.message}`
      };
    }
  },

  async validateSupabaseKey(url: string, key: string): Promise<ValidationResult> {
    const start = Date.now();
    try {
      const response = await fetch(`${url}/rest/v1/`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      
      const responseTime = Date.now() - start;
      
      if (response.ok || response.status === 404) {
        return {
          isValid: true,
          message: 'Supabase key is valid',
          responseTime
        };
      }
      
      return {
        isValid: false,
        message: 'Invalid Supabase key',
        responseTime
      };
    } catch (error) {
      return {
        isValid: false,
        message: `Validation error: ${error.message}`
      };
    }
  },

  async validateStripeKey(key: string): Promise<ValidationResult> {
    const start = Date.now();
    try {
      const response = await fetch('https://api.stripe.com/v1/balance', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      
      const responseTime = Date.now() - start;
      
      if (response.ok) {
        return {
          isValid: true,
          message: 'Stripe key is valid',
          responseTime
        };
      }
      
      return {
        isValid: false,
        message: 'Invalid Stripe key',
        responseTime
      };
    } catch (error) {
      return {
        isValid: false,
        message: `Validation error: ${error.message}`
      };
    }
  },

  async validateSendGridKey(key: string): Promise<ValidationResult> {
    const start = Date.now();
    try {
      const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      
      const responseTime = Date.now() - start;
      
      if (response.ok) {
        return {
          isValid: true,
          message: 'SendGrid key is valid',
          responseTime
        };
      }
      
      return {
        isValid: false,
        message: 'Invalid SendGrid key',
        responseTime
      };
    } catch (error) {
      return {
        isValid: false,
        message: `Validation error: ${error.message}`
      };
    }
  }
};