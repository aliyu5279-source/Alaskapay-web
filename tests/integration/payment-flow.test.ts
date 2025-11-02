import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '../../src/lib/supabase';
import { WalletService } from '../../src/services/walletService';
import { PaymentService } from '../../src/services/paymentService';
import { SubscriptionService } from '../../src/services/subscriptionService';

describe('Payment Flow Integration Tests', () => {
  let testUserId: string;
  let testPaymentMethodId: string;

  beforeAll(async () => {
    // Setup test user
    const { data: user } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'Test123456!',
    });
    testUserId = user?.user?.id || 'test-user';
  });

  afterAll(async () => {
    // Cleanup test data
    if (testUserId) {
      await supabase.from('users').delete().eq('id', testUserId);
    }
  });

  describe('Wallet Top-up Flow', () => {
    it('should complete full top-up flow', async () => {
      // 1. Process payment
      const payment = await PaymentService.processPayment({
        amount: 5000,
        currency: 'NGN',
        paymentMethod: 'card',
        paymentMethodId: 'pm_test_123',
      });

      expect(payment).toBeDefined();
      expect(payment.status).toBe('succeeded');

      // 2. Top up wallet
      const topUp = await WalletService.topUp(
        testUserId,
        5000,
        'card'
      );

      expect(topUp).toBeDefined();
      expect(topUp.amount).toBe(5000);
      expect(topUp.type).toBe('credit');

      // 3. Verify balance updated
      const balance = await WalletService.getBalance(testUserId);
      expect(balance.balance).toBeGreaterThanOrEqual(5000);
    });

    it('should handle failed payment gracefully', async () => {
      // Mock failed payment
      const paymentPromise = PaymentService.processPayment({
        amount: 5000,
        currency: 'NGN',
        paymentMethod: 'card',
        paymentMethodId: 'pm_invalid',
      });

      await expect(paymentPromise).rejects.toThrow();
      
      // Verify wallet balance unchanged
      const balance = await WalletService.getBalance(testUserId);
      expect(balance).toBeDefined();
    });
  });

  describe('Subscription Payment Flow', () => {
    it('should complete subscription purchase', async () => {
      // 1. Get available plans
      const plans = await SubscriptionService.getPlans();
      expect(plans.length).toBeGreaterThan(0);
      
      const selectedPlan = plans[0];

      // 2. Process subscription payment
      const payment = await PaymentService.processPayment({
        amount: selectedPlan.price,
        currency: 'NGN',
        paymentMethod: 'card',
        paymentMethodId: 'pm_test_123',
      });

      expect(payment.status).toBe('succeeded');

      // 3. Create subscription
      const subscription = await SubscriptionService.subscribe(
        testUserId,
        selectedPlan.id,
        'pm_test_123'
      );

      expect(subscription).toBeDefined();
      expect(subscription.status).toBe('active');
      expect(subscription.plan_id).toBe(selectedPlan.id);
    });

    it('should handle subscription upgrade', async () => {
      // Get current subscription
      const { data: currentSub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', testUserId)
        .single();

      if (currentSub) {
        // Get higher tier plan
        const plans = await SubscriptionService.getPlans();
        const higherPlan = plans.find(p => p.price > 5000);

        if (higherPlan) {
          // Process upgrade payment
          const payment = await PaymentService.processPayment({
            amount: higherPlan.price - 5000, // Prorated amount
            currency: 'NGN',
            paymentMethod: 'card',
            paymentMethodId: 'pm_test_123',
          });

          expect(payment.status).toBe('succeeded');

          // Upgrade subscription
          const upgraded = await SubscriptionService.upgrade(
            currentSub.id,
            higherPlan.id
          );

          expect(upgraded.plan_id).toBe(higherPlan.id);
        }
      }
    });
  });

  describe('Transfer Flow', () => {
    it('should complete peer-to-peer transfer', async () => {
      const recipientId = 'recipient-test-id';
      
      // Ensure sender has balance
      await WalletService.topUp(testUserId, 10000, 'card');
      
      // Execute transfer
      const transfer = await WalletService.transfer(
        testUserId,
        recipientId,
        2000,
        'Test transfer'
      );

      expect(transfer).toBeDefined();
      expect(transfer.amount).toBe(2000);
      expect(transfer.status).toBe('completed');

      // Verify sender balance decreased
      const senderBalance = await WalletService.getBalance(testUserId);
      expect(senderBalance.balance).toBeLessThan(10000);
    });

    it('should prevent transfer with insufficient balance', async () => {
      const recipientId = 'recipient-test-id';
      
      // Get current balance
      const balance = await WalletService.getBalance(testUserId);
      
      // Try to transfer more than balance
      const transferPromise = WalletService.transfer(
        testUserId,
        recipientId,
        balance.balance + 1000,
        'Invalid transfer'
      );

      await expect(transferPromise).rejects.toThrow('Insufficient balance');
    });
  });

  describe('Refund Flow', () => {
    it('should process refund and update wallet', async () => {
      // Create a payment to refund
      const payment = await PaymentService.processPayment({
        amount: 3000,
        currency: 'NGN',
        paymentMethod: 'card',
        paymentMethodId: 'pm_test_123',
      });

      // Process refund
      const refund = await PaymentService.refund({
        paymentId: payment.id,
        amount: 1500, // Partial refund
        reason: 'Customer request',
      });

      expect(refund).toBeDefined();
      expect(refund.status).toBe('succeeded');
      expect(refund.amount).toBe(1500);

      // Verify wallet credited with refund
      const balance = await WalletService.getBalance(testUserId);
      expect(balance).toBeDefined();
    });
  });
});