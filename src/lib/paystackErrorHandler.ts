export interface PaystackError {
  code: string;
  message: string;
  userMessage: string;
}

export const paystackErrorCodes: Record<string, PaystackError> = {
  'invalid_key': {
    code: 'invalid_key',
    message: 'Invalid API key provided',
    userMessage: 'Payment configuration error. Please contact support.'
  },
  'insufficient_funds': {
    code: 'insufficient_funds',
    message: 'Insufficient funds in account',
    userMessage: 'Insufficient funds. Please fund your account and try again.'
  },
  'invalid_account': {
    code: 'invalid_account',
    message: 'Invalid account details',
    userMessage: 'Invalid bank account. Please verify your details.'
  },
  'transaction_not_found': {
    code: 'transaction_not_found',
    message: 'Transaction not found',
    userMessage: 'Transaction not found. Please try again.'
  },
  'declined': {
    code: 'declined',
    message: 'Transaction declined',
    userMessage: 'Payment declined. Please try a different card or payment method.'
  },
  'expired_card': {
    code: 'expired_card',
    message: 'Card has expired',
    userMessage: 'Your card has expired. Please use a different card.'
  },
  'network_error': {
    code: 'network_error',
    message: 'Network connection error',
    userMessage: 'Network error. Please check your connection and try again.'
  }
};

export function handlePaystackError(error: any): PaystackError {
  const errorCode = error?.code || error?.message?.toLowerCase() || 'unknown';
  
  // Check for known error codes
  for (const [key, value] of Object.entries(paystackErrorCodes)) {
    if (errorCode.includes(key)) {
      return value;
    }
  }

  // Default error
  return {
    code: 'unknown',
    message: error?.message || 'An unknown error occurred',
    userMessage: 'Something went wrong. Please try again or contact support.'
  };
}

export function isRetryableError(error: PaystackError): boolean {
  const retryableCodes = ['network_error', 'timeout', 'server_error'];
  return retryableCodes.includes(error.code);
}

export async function retryPaystackRequest<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const paystackError = handlePaystackError(error);
      
      if (!isRetryableError(paystackError) || i === maxRetries - 1) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw lastError;
}
