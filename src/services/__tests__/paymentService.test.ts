import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentService } from '../paymentService';

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({
    createPaymentMethod: vi.fn(),
    confirmCardPayment: vi.fn(),
  }),
}));

// Mock Paystack
global.fetch = vi.fn();

describe('PaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('processPayment', () => {
    it('should process card payment successfully', async () => {
      const mockPaymentIntent = {
        id: 'pi_123',
        status: 'succeeded',
        amount: 5000,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockPaymentIntent }),
      });

      const result = await PaymentService.processPayment({
        amount: 5000,
        currency: 'NGN',
        paymentMethod: 'card',
        paymentMethodId: 'pm_123',
      });

      expect(result).toEqual(mockPaymentIntent);
    });

    it('should handle payment failure', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ 
          error: { message: 'Card declined' } 
        }),
      });

      await expect(
        PaymentService.processPayment({
          amount: 5000,
          currency: 'NGN',
          paymentMethod: 'card',
          paymentMethodId: 'pm_123',
        })
      ).rejects.toThrow('Card declined');
    });

    it('should validate minimum payment amount', async () => {
      await expect(
        PaymentService.processPayment({
          amount: 50,
          currency: 'NGN',
          paymentMethod: 'card',
          paymentMethodId: 'pm_123',
        })
      ).rejects.toThrow('Minimum payment amount is 100');
    });
  });

  describe('initiateBankTransfer', () => {
    it('should generate bank transfer details', async () => {
      const mockTransferDetails = {
        reference: 'TRF123456',
        account_number: '1234567890',
        bank_name: 'Test Bank',
        amount: 10000,
        expires_at: '2024-01-01T12:00:00Z',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockTransferDetails }),
      });

      const result = await PaymentService.initiateBankTransfer({
        amount: 10000,
        currency: 'NGN',
        userId: 'user123',
      });

      expect(result).toEqual(mockTransferDetails);
      expect(result.reference).toBeDefined();
      expect(result.account_number).toBeDefined();
    });
  });

  describe('verifyPayment', () => {
    it('should verify successful payment', async () => {
      const mockVerification = {
        status: 'success',
        amount: 5000,
        reference: 'PAY123',
        paid_at: '2024-01-01T10:00:00Z',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockVerification }),
      });

      const result = await PaymentService.verifyPayment('PAY123');

      expect(result.status).toBe('success');
      expect(result.reference).toBe('PAY123');
    });

    it('should handle verification failure', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ 
          data: { status: 'failed' } 
        }),
      });

      const result = await PaymentService.verifyPayment('PAY123');
      expect(result.status).toBe('failed');
    });
  });

  describe('refund', () => {
    it('should process refund successfully', async () => {
      const mockRefund = {
        id: 'refund_123',
        amount: 2000,
        status: 'succeeded',
        reason: 'Customer request',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockRefund }),
      });

      const result = await PaymentService.refund({
        paymentId: 'pi_123',
        amount: 2000,
        reason: 'Customer request',
      });

      expect(result).toEqual(mockRefund);
      expect(result.status).toBe('succeeded');
    });

    it('should validate refund amount', async () => {
      await expect(
        PaymentService.refund({
          paymentId: 'pi_123',
          amount: -100,
          reason: 'Invalid amount',
        })
      ).rejects.toThrow('Invalid refund amount');
    });
  });

  describe('getPaymentMethods', () => {
    it('should fetch user payment methods', async () => {
      const mockMethods = [
        { id: 'pm_1', type: 'card', last4: '4242' },
        { id: 'pm_2', type: 'bank', last4: '6789' },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockMethods }),
      });

      const result = await PaymentService.getPaymentMethods('user123');

      expect(result).toEqual(mockMethods);
      expect(result).toHaveLength(2);
    });
  });

  describe('calculate3DSRequired', () => {
    it('should require 3DS for high-risk transactions', () => {
      const result = PaymentService.calculate3DSRequired({
        amount: 500000, // High amount
        currency: 'NGN',
        userRiskScore: 0.8,
      });

      expect(result).toBe(true);
    });

    it('should not require 3DS for low-risk transactions', () => {
      const result = PaymentService.calculate3DSRequired({
        amount: 1000,
        currency: 'NGN',
        userRiskScore: 0.2,
      });

      expect(result).toBe(false);
    });
  });
});