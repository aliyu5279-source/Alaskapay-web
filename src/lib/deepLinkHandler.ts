export interface DeepLinkData {
  path: string;
  params: Record<string, string>;
  queryParams: Record<string, string>;
}

class DeepLinkHandler {
  private listeners: ((data: DeepLinkData) => void)[] = [];
  private initialized = false;

  initialize() {
    if (this.initialized) return;
    // Web version - no native deep linking
    this.initialized = true;
  }

  parseDeepLink(url: string): DeepLinkData | null {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const queryParams: Record<string, string> = {};
      
      urlObj.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });

      const pathParts = path.split('/').filter(Boolean);
      const params: Record<string, string> = {};

      // Parse different URL patterns
      if (pathParts[0] === 'pay' && pathParts[1]) {
        params.paymentId = pathParts[1];
      } else if (pathParts[0] === 'cards' && pathParts[1]) {
        params.cardId = pathParts[1];
      } else if (pathParts[0] === 'bills' && pathParts[1]) {
        params.billId = pathParts[1];
      } else if (pathParts[0] === 'referral' && pathParts[1]) {
        params.referralCode = pathParts[1];
      } else if (pathParts[0] === 'transfer') {
        params.recipient = queryParams.to || '';
        params.amount = queryParams.amount || '';
      }

      return { path, params, queryParams };
    } catch (error) {
      console.error('Failed to parse deep link:', error);
      return null;
    }
  }

  addListener(callback: (data: DeepLinkData) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (data: DeepLinkData) => void) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  async openExternalUrl(url: string) {
    window.open(url, '_blank');
  }
}

export const deepLinkHandler = new DeepLinkHandler();
