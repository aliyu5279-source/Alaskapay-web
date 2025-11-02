import { supabase } from '../lib/supabase';

export interface KYCSubmission {
  userId: string;
  documentType: string;
  documentNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
}

export interface KYCStatus {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  tier: number;
  limits: TransactionLimits;
}

export interface TransactionLimits {
  daily_transaction: number;
  monthly_transaction: number;
}

export class KYCService {
  static async submitKYC(submission: KYCSubmission): Promise<any> {
    // Validate required fields
    if (!submission.documentType || !submission.documentNumber || 
        !submission.dateOfBirth || !submission.address || 
        !submission.city || !submission.country) {
      throw new Error('All fields are required');
    }

    const { data, error } = await supabase.rpc('submit_kyc', {
      p_user_id: submission.userId,
      p_document_type: submission.documentType,
      p_document_number: submission.documentNumber,
      p_date_of_birth: submission.dateOfBirth,
      p_address: submission.address,
      p_city: submission.city,
      p_country: submission.country,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  static async uploadDocument(
    userId: string,
    file: File,
    documentType: string
  ): Promise<string> {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only images and PDFs are allowed');
    }

    const fileName = `kyc/${userId}/${documentType}.${file.name.split('.').pop()}`;
    
    const { data, error } = await supabase.storage
      .from('kyc-documents')
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) throw new Error(error.message);
    return data.path;
  }

  static async performLivenessCheck(
    userId: string,
    imageData: string
  ): Promise<any> {
    const { data, error } = await supabase.rpc('verify_liveness', {
      p_user_id: userId,
      p_image_data: imageData,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  static async getKYCStatus(userId: string): Promise<KYCStatus> {
    const { data, error } = await supabase
      .from('kyc_verifications')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static getTierLimits(tier: number): TransactionLimits {
    const limits: Record<number, TransactionLimits> = {
      0: {
        daily_transaction: 50000,
        monthly_transaction: 200000,
      },
      1: {
        daily_transaction: 200000,
        monthly_transaction: 1000000,
      },
      2: {
        daily_transaction: 1000000,
        monthly_transaction: 10000000,
      },
      3: {
        daily_transaction: Number.MAX_SAFE_INTEGER,
        monthly_transaction: Number.MAX_SAFE_INTEGER,
      },
    };

    return limits[tier] || limits[0];
  }

  static async checkTransactionLimit(
    userId: string,
    amount: number
  ): Promise<any> {
    const { data, error } = await supabase
      .from('kyc_verifications')
      .select('tier, daily_spent, monthly_spent')
      .eq('user_id', userId)
      .single();

    if (error) throw new Error(error.message);

    const limits = this.getTierLimits(data.tier);
    const remaining_daily = limits.daily_transaction - data.daily_spent;
    const remaining_monthly = limits.monthly_transaction - data.monthly_spent;

    if (amount > remaining_daily) {
      return {
        allowed: false,
        reason: `Transaction exceeds daily limit. Remaining: ${remaining_daily}`,
        remaining_daily,
        remaining_monthly,
      };
    }

    if (amount > remaining_monthly) {
      return {
        allowed: false,
        reason: `Transaction exceeds monthly limit. Remaining: ${remaining_monthly}`,
        remaining_daily,
        remaining_monthly,
      };
    }

    return {
      allowed: true,
      remaining_daily: remaining_daily - amount,
      remaining_monthly: remaining_monthly - amount,
    };
  }
}