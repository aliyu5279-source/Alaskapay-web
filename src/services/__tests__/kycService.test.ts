import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../lib/supabase';
import { KYCService } from '../kycService';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    storage: {
      from: vi.fn(),
    },
    rpc: vi.fn(),
  },
}));

describe('KYCService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitKYC', () => {
    it('should submit KYC documents for verification', async () => {
      const mockSubmission = {
        id: 'kyc123',
        user_id: 'user123',
        status: 'pending',
        tier: 1,
        submitted_at: new Date().toISOString(),
      };

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockSubmission,
        error: null,
      });

      const result = await KYCService.submitKYC({
        userId: 'user123',
        documentType: 'passport',
        documentNumber: 'A12345678',
        dateOfBirth: '1990-01-01',
        address: '123 Main St',
        city: 'Lagos',
        country: 'NG',
      });

      expect(result).toEqual(mockSubmission);
      expect(result.status).toBe('pending');
    });

    it('should validate required fields', async () => {
      await expect(
        KYCService.submitKYC({
          userId: 'user123',
          documentType: '',
          documentNumber: '',
          dateOfBirth: '',
          address: '',
          city: '',
          country: '',
        })
      ).rejects.toThrow('All fields are required');
    });
  });

  describe('uploadDocument', () => {
    it('should upload document to storage', async () => {
      const mockFile = new File(['content'], 'passport.jpg', {
        type: 'image/jpeg',
      });

      const storageMock = {
        upload: vi.fn().mockResolvedValue({
          data: { path: 'kyc/user123/passport-front.jpg' },
          error: null,
        }),
      };

      vi.mocked(supabase.storage.from).mockReturnValue(storageMock as any);

      const result = await KYCService.uploadDocument(
        'user123',
        mockFile,
        'passport-front'
      );

      expect(result).toBe('kyc/user123/passport-front.jpg');
      expect(supabase.storage.from).toHaveBeenCalledWith('kyc-documents');
    });

    it('should validate file size', async () => {
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });

      await expect(
        KYCService.uploadDocument('user123', largeFile, 'document')
      ).rejects.toThrow('File size exceeds 10MB limit');
    });

    it('should validate file type', async () => {
      const invalidFile = new File(['content'], 'document.txt', {
        type: 'text/plain',
      });

      await expect(
        KYCService.uploadDocument('user123', invalidFile, 'document')
      ).rejects.toThrow('Invalid file type. Only images and PDFs are allowed');
    });
  });

  describe('performLivenessCheck', () => {
    it('should verify liveness with facial recognition', async () => {
      const mockLiveness = {
        verified: true,
        confidence: 0.95,
        timestamp: new Date().toISOString(),
      };

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockLiveness,
        error: null,
      });

      const result = await KYCService.performLivenessCheck(
        'user123',
        'base64ImageData'
      );

      expect(result.verified).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should reject low confidence liveness', async () => {
      const mockLiveness = {
        verified: false,
        confidence: 0.3,
        timestamp: new Date().toISOString(),
      };

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockLiveness,
        error: null,
      });

      const result = await KYCService.performLivenessCheck(
        'user123',
        'base64ImageData'
      );

      expect(result.verified).toBe(false);
      expect(result.confidence).toBeLessThan(0.5);
    });
  });

  describe('getKYCStatus', () => {
    it('should fetch current KYC status', async () => {
      const mockStatus = {
        id: 'kyc123',
        status: 'approved',
        tier: 2,
        limits: {
          daily_transaction: 1000000,
          monthly_transaction: 10000000,
        },
      };

      const fromMock = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockStatus,
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(fromMock as any);

      const result = await KYCService.getKYCStatus('user123');

      expect(result).toEqual(mockStatus);
      expect(result.tier).toBe(2);
    });
  });

  describe('getTierLimits', () => {
    it('should return limits based on KYC tier', () => {
      const tier0 = KYCService.getTierLimits(0);
      expect(tier0.daily_transaction).toBe(50000);
      expect(tier0.monthly_transaction).toBe(200000);

      const tier1 = KYCService.getTierLimits(1);
      expect(tier1.daily_transaction).toBe(200000);
      expect(tier1.monthly_transaction).toBe(1000000);

      const tier2 = KYCService.getTierLimits(2);
      expect(tier2.daily_transaction).toBe(1000000);
      expect(tier2.monthly_transaction).toBe(10000000);

      const tier3 = KYCService.getTierLimits(3);
      expect(tier3.daily_transaction).toBe(Number.MAX_SAFE_INTEGER);
      expect(tier3.monthly_transaction).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('checkTransactionLimit', () => {
    it('should allow transaction within limits', async () => {
      const mockStatus = {
        tier: 1,
        daily_spent: 50000,
        monthly_spent: 200000,
      };

      const fromMock = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockStatus,
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(fromMock as any);

      const result = await KYCService.checkTransactionLimit('user123', 100000);

      expect(result.allowed).toBe(true);
      expect(result.remaining_daily).toBe(50000);
    });

    it('should reject transaction exceeding limits', async () => {
      const mockStatus = {
        tier: 1,
        daily_spent: 180000,
        monthly_spent: 900000,
      };

      const fromMock = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockStatus,
          error: null,
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(fromMock as any);

      const result = await KYCService.checkTransactionLimit('user123', 50000);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('daily limit');
    });
  });
});