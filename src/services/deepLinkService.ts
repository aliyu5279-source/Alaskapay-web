import { supabase } from '@/lib/supabase';

export interface DeepLinkData {
  type: 'payment' | 'referral' | 'transfer' | 'bill' | 'card' | 'promo' | 'kyc' | 'support';
  action: string;
  params: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface DeepLinkAnalytics {
  link_id: string;
  user_id?: string;
  device_type: string;
  app_installed: boolean;
  converted: boolean;
  timestamp: string;
}

class DeepLinkService {
  private baseUrl = 'https://alaskapay.com';
  private appScheme = 'alaskapay://';

  // Generate universal deep link
  generateLink(data: DeepLinkData): string {
    const { type, action, params } = data;
    let path = '';

    switch (type) {
      case 'payment':
        path = `/pay/${action}`;
        break;
      case 'referral':
        path = `/referral/${params.code}`;
        break;
      case 'transfer':
        path = `/transfer`;
        break;
      case 'bill':
        path = `/bills/${action}`;
        break;
      case 'card':
        path = `/cards/${action}`;
        break;
      case 'promo':
        path = `/promo/${params.campaign}`;
        break;
      case 'kyc':
        path = `/kyc/verify`;
        break;
      case 'support':
        path = `/support/${action}`;
        break;
    }

    const queryParams = new URLSearchParams(params);
    return `${this.baseUrl}${path}?${queryParams}`;
  }

  // Parse incoming deep link
  parseLink(url: string): DeepLinkData | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      const params: Record<string, string> = {};
      
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      if (pathParts[0] === 'pay') {
        return {
          type: 'payment',
          action: pathParts[1] || 'default',
          params
        };
      } else if (pathParts[0] === 'referral') {
        return {
          type: 'referral',
          action: 'apply',
          params: { code: pathParts[1], ...params }
        };
      } else if (pathParts[0] === 'transfer') {
        return {
          type: 'transfer',
          action: 'send',
          params
        };
      } else if (pathParts[0] === 'bills') {
        return {
          type: 'bill',
          action: pathParts[1] || 'list',
          params
        };
      } else if (pathParts[0] === 'cards') {
        return {
          type: 'card',
          action: pathParts[1] || 'list',
          params
        };
      } else if (pathParts[0] === 'promo') {
        return {
          type: 'promo',
          action: 'view',
          params: { campaign: pathParts[1], ...params }
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to parse deep link:', error);
      return null;
    }
  }

  // Track deep link analytics
  async trackLink(linkData: DeepLinkAnalytics) {
    try {
      await supabase.from('deep_link_analytics').insert(linkData);
    } catch (error) {
      console.error('Failed to track deep link:', error);
    }
  }
}

export const deepLinkService = new DeepLinkService();
