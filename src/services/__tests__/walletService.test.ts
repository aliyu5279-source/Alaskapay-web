import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../lib/supabase';
import { WalletService } from '../walletService';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
    rpc: vi.fn(),
  },
}));

describe('WalletService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBalance', () => {
    it('should fetch wallet balance for a user', async () => {
      const mockBalance = { balance: 10000, currency: 'NGN' };
      const fromMock = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockBalance, error: null }),
      };
      
      vi.mocked(supabase.from).mockReturnValue(fromMock as any);
      
      const result = await WalletService.getBalance('user123');
      
      expect(supabase.from).toHaveBeenCalledWith('wallets');
      expect(fromMock.eq).toHaveBeenCalledWith('user_id', 'user123');
      expect(result).toEqual(mockBalance);
    });

    it('should throw error when balance fetch fails', async () => {
      const fromMock = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Wallet not found' } 
        }),
      };
      
      vi.mocked(supabase.from).mockReturnValue(fromMock as any);
      
      await expect(WalletService.getBalance('user123'))
        .rejects.toThrow('Wallet not found');
    });
  });

  describe('topUp', () => {
    it('should add funds to wallet', async () => {
      const mockTransaction = { 
        id: 'txn123',
        amount: 5000,
        type: 'credit',
        status: 'completed'
      };
      
      vi.mocked(supabase.rpc).mockResolvedValue({ 
        data: mockTransaction, 
        error: null 
      });
      
      const result = await WalletService.topUp('user123', 5000, 'card');
      
      expect(supabase.rpc).toHaveBeenCalledWith('top_up_wallet', {
        p_user_id: 'user123',
        p_amount: 5000,
        p_payment_method: 'card',
      });
      expect(result).toEqual(mockTransaction);
    });

    it('should validate minimum top-up amount', async () => {
      await expect(WalletService.topUp('user123', 50, 'card'))
        .rejects.toThrow('Minimum top-up amount is 100');
    });

    it('should validate maximum top-up amount', async () => {
      await expect(WalletService.topUp('user123', 1000001, 'card'))
        .rejects.toThrow('Maximum top-up amount is 1,000,000');
    });
  });

  describe('transfer', () => {
    it('should transfer funds between wallets', async () => {
      const mockTransfer = {
        id: 'transfer123',
        from_wallet: 'wallet1',
        to_wallet: 'wallet2',
        amount: 2000,
        status: 'completed',
      };
      
      vi.mocked(supabase.rpc).mockResolvedValue({ 
        data: mockTransfer, 
        error: null 
      });
      
      const result = await WalletService.transfer(
        'user123',
        'recipient456',
        2000,
        'Payment for services'
      );
      
      expect(supabase.rpc).toHaveBeenCalledWith('transfer_funds', {
        p_sender_id: 'user123',
        p_recipient_id: 'recipient456',
        p_amount: 2000,
        p_description: 'Payment for services',
      });
      expect(result).toEqual(mockTransfer);
    });

    it('should check sufficient balance before transfer', async () => {
      const fromMock = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: { balance: 1000 }, 
          error: null 
        }),
      };
      
      vi.mocked(supabase.from).mockReturnValue(fromMock as any);
      
      await expect(WalletService.transfer('user123', 'recipient456', 2000))
        .rejects.toThrow('Insufficient balance');
    });
  });

  describe('withdraw', () => {
    it('should process withdrawal request', async () => {
      const mockWithdrawal = {
        id: 'withdrawal123',
        amount: 5000,
        bank_account: 'ACC123',
        status: 'pending',
      };
      
      vi.mocked(supabase.rpc).mockResolvedValue({ 
        data: mockWithdrawal, 
        error: null 
      });
      
      const result = await WalletService.withdraw(
        'user123',
        5000,
        'ACC123'
      );
      
      expect(supabase.rpc).toHaveBeenCalledWith('request_withdrawal', {
        p_user_id: 'user123',
        p_amount: 5000,
        p_bank_account_id: 'ACC123',
      });
      expect(result).toEqual(mockWithdrawal);
    });

    it('should validate minimum withdrawal amount', async () => {
      await expect(WalletService.withdraw('user123', 500, 'ACC123'))
        .rejects.toThrow('Minimum withdrawal amount is 1,000');
    });
  });

  describe('getTransactionHistory', () => {
    it('should fetch paginated transaction history', async () => {
      const mockTransactions = [
        { id: 'txn1', amount: 1000, type: 'credit' },
        { id: 'txn2', amount: 500, type: 'debit' },
      ];
      
      const fromMock = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ 
          data: mockTransactions, 
          error: null 
        }),
      };
      
      vi.mocked(supabase.from).mockReturnValue(fromMock as any);
      
      const result = await WalletService.getTransactionHistory(
        'user123',
        { page: 1, limit: 10 }
      );
      
      expect(fromMock.order).toHaveBeenCalledWith('created_at', { 
        ascending: false 
      });
      expect(fromMock.range).toHaveBeenCalledWith(0, 9);
      expect(result).toEqual(mockTransactions);
    });
  });
});