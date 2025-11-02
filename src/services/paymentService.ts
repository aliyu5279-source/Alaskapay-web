export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentMethodId?: string;
  userId?: string;
}

export interface RefundRequest {
  paymentId: string;
  amount: number;
  reason: string;
}

export class PaymentService {
  static async processPayment(request: PaymentRequest): Promise<any> {
    // Validate amount
    if (request.amount < 100) {
      throw new Error('Minimum payment amount is 100');
    }

    const response = await fetch('/api/payments/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Payment failed');
    }

    return data.data;
  }

  static async initiateBankTransfer(request: {
    amount: number;
    currency: string;
    userId: string;
  }): Promise<any> {
    const response = await fetch('/api/payments/bank-transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to initiate transfer');
    }

    return data.data;
  }

  static async verifyPayment(reference: string): Promise<any> {
    const response = await fetch(`/api/payments/verify/${reference}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return data.data;
  }

  static async refund(request: RefundRequest): Promise<any> {
    // Validate refund amount
    if (request.amount <= 0) {
      throw new Error('Invalid refund amount');
    }

    const response = await fetch('/api/payments/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Refund failed');
    }

    return data.data;
  }

  static async getPaymentMethods(userId: string): Promise<any[]> {
    const response = await fetch(`/api/payments/methods/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch payment methods');
    }

    return data.data;
  }

  static calculate3DSRequired(params: {
    amount: number;
    currency: string;
    userRiskScore: number;
  }): boolean {
    // Require 3DS for high amounts or high risk scores
    const HIGH_AMOUNT_THRESHOLD = 100000;
    const HIGH_RISK_THRESHOLD = 0.7;

    return (
      params.amount >= HIGH_AMOUNT_THRESHOLD ||
      params.userRiskScore >= HIGH_RISK_THRESHOLD
    );
  }
}