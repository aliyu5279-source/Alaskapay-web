import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../lib/supabase';
import { SubscriptionService } from '../subscriptionService';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

describe('SubscriptionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPlans', () => {
    it('should fetch all active subscription plans', async () => {
      const mockPlans = [
        { id: 'plan1', name: 'Basic', price: 1000, features: [] },
        { id: 'plan2', name: 'Premium', price: 5000, features: [] },
      ];
      
      const fromMock = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ 
          data: mockPlans, 
          error: null 
        }),
      };
      
      vi.mocked(supabase.from).mockReturnValue(fromMock as any);
      
      const result = await SubscriptionService.getPlans();
      
      expect(supabase.from).toHaveBeenCalledWith('subscription_plans');
      expect(fromMock.eq).toHaveBeenCalledWith('active', true);
      expect(result).toEqual(mockPlans);
    });
  });

  describe('subscribe', () => {
    it('should create new subscription', async () => {
      const mockSubscription = {
        id: 'sub123',
        user_id: 'user123',
        plan_id: 'plan1',
        status: 'active',
        current_period_end: '2024-02-01',
      };
      
      vi.mocked(supabase.rpc).mockResolvedValue({ 
        data: mockSubscription, 
        error: null 
      });
      
      const result = await SubscriptionService.subscribe(
        'user123',
        'plan1',
        'pm_123'
      );
      
      expect(supabase.rpc).toHaveBeenCalledWith('create_subscription', {
        p_user_id: 'user123',
        p_plan_id: 'plan1',
        p_payment_method_id: 'pm_123',
      });
      expect(result).toEqual(mockSubscription);
    });

    it('should prevent duplicate active subscriptions', async () => {
      const fromMock = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: { id: 'existing_sub' }, 
          error: null 
        }),
      };
      
      vi.mocked(supabase.from).mockReturnValue(fromMock as any);
      
      await expect(SubscriptionService.subscribe('user123', 'plan1', 'pm_123'))
        .rejects.toThrow('User already has an active subscription');
    });
  });

  describe('cancel', () => {
    it('should cancel subscription at period end', async () => {
      const mockCancellation = {
        id: 'sub123',
        status: 'cancelled',
        cancel_at_period_end: true,
      };
      
      vi.mocked(supabase.rpc).mockResolvedValue({ 
        data: mockCancellation, 
        error: null 
      });
      
      const result = await SubscriptionService.cancel('sub123');
      
      expect(supabase.rpc).toHaveBeenCalledWith('cancel_subscription', {
        p_subscription_id: 'sub123',
        p_immediate: false,
      });
      expect(result).toEqual(mockCancellation);
    });

    it('should support immediate cancellation', async () => {
      const mockCancellation = {
        id: 'sub123',
        status: 'cancelled',
        cancel_at_period_end: false,
      };
      
      vi.mocked(supabase.rpc).mockResolvedValue({ 
        data: mockCancellation, 
        error: null 
      });
      
      const result = await SubscriptionService.cancel('sub123', true);
      
      expect(supabase.rpc).toHaveBeenCalledWith('cancel_subscription', {
        p_subscription_id: 'sub123',
        p_immediate: true,
      });
      expect(result).toEqual(mockCancellation);
    });
  });

  describe('pause', () => {
    it('should pause subscription', async () => {
      const mockPaused = {
        id: 'sub123',
        status: 'paused',
        paused_until: '2024-02-01',
      };
      
      vi.mocked(supabase.rpc).mockResolvedValue({ 
        data: mockPaused, 
        error: null 
      });
      
      const result = await SubscriptionService.pause('sub123', '2024-02-01');
      
      expect(supabase.rpc).toHaveBeenCalledWith('pause_subscription', {
        p_subscription_id: 'sub123',
        p_resume_date: '2024-02-01',
      });
      expect(result).toEqual(mockPaused);
    });
  });

  describe('resume', () => {
    it('should resume paused subscription', async () => {
      const mockResumed = {
        id: 'sub123',
        status: 'active',
        paused_until: null,
      };
      
      vi.mocked(supabase.rpc).mockResolvedValue({ 
        data: mockResumed, 
        error: null 
      });
      
      const result = await SubscriptionService.resume('sub123');
      
      expect(supabase.rpc).toHaveBeenCalledWith('resume_subscription', {
        p_subscription_id: 'sub123',
      });
      expect(result).toEqual(mockResumed);
    });
  });

  describe('upgrade', () => {
    it('should upgrade subscription plan', async () => {
      const mockUpgraded = {
        id: 'sub123',
        plan_id: 'plan2',
        status: 'active',
      };
      
      vi.mocked(supabase.rpc).mockResolvedValue({ 
        data: mockUpgraded, 
        error: null 
      });
      
      const result = await SubscriptionService.upgrade('sub123', 'plan2');
      
      expect(supabase.rpc).toHaveBeenCalledWith('upgrade_subscription', {
        p_subscription_id: 'sub123',
        p_new_plan_id: 'plan2',
        p_prorate: true,
      });
      expect(result).toEqual(mockUpgraded);
    });
  });

  describe('getUsage', () => {
    it('should fetch subscription usage metrics', async () => {
      const mockUsage = {
        api_calls: 1000,
        storage_gb: 5,
        transactions: 500,
      };
      
      const fromMock = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: mockUsage, 
          error: null 
        }),
      };
      
      vi.mocked(supabase.from).mockReturnValue(fromMock as any);
      
      const result = await SubscriptionService.getUsage('sub123');
      
      expect(supabase.from).toHaveBeenCalledWith('subscription_usage');
      expect(fromMock.eq).toHaveBeenCalledWith('subscription_id', 'sub123');
      expect(result).toEqual(mockUsage);
    });
  });
});