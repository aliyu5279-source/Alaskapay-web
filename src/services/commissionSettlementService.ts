import { supabase } from '@/lib/supabase';
import { COMMISSION_CONFIG } from '@/config/commissionConfig';

export class CommissionSettlementService {
  // Calculate commission based on transaction type and amount
  static calculateCommission(transactionType: string, amount: number): number {
    const rate = COMMISSION_CONFIG.percentages[transactionType as keyof typeof COMMISSION_CONFIG.percentages] || 0;
    return (amount * rate) / 100;
  }

  // Process automatic commission settlement to Taj Bank account
  static async processAutoSettlement() {
    try {
      const { data: pendingCommissions } = await supabase
        .from('commission_balances')
        .select('*')
        .gte('available_balance', COMMISSION_CONFIG.autoSettlement.minimumAmount);

      if (!pendingCommissions || pendingCommissions.length === 0) {
        return { success: true, message: 'No commissions to settle' };
      }

      const results = [];
      for (const commission of pendingCommissions) {
        const result = await this.settleSingleCommission(commission);
        results.push(result);
      }

      return { success: true, settled: results.length, results };
    } catch (error) {
      console.error('Auto settlement error:', error);
      return { success: false, error };
    }
  }

  // Settle commission to Taj Bank account via Paystack
  static async settleSingleCommission(commission: any) {
    const { data, error } = await supabase.functions.invoke('settle-commission-paystack', {
      body: {
        userId: commission.user_id,
        amount: commission.available_balance,
        bankAccount: COMMISSION_CONFIG.company,
      },
    });

    return { userId: commission.user_id, amount: commission.available_balance, success: !error, data, error };
  }
}
