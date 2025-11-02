import { supabase } from '@/lib/supabase';

export interface ReloadlyOperator {
  operatorId: number;
  name: string;
  bundle: boolean;
  data: boolean;
  pin: boolean;
  supportsLocalAmounts: boolean;
  denominationType: string;
  senderCurrencyCode: string;
  senderCurrencySymbol: string;
  destinationCurrencyCode: string;
  destinationCurrencySymbol: string;
  commission: number;
  internationalDiscount: number;
  localDiscount: number;
  mostPopularAmount: number;
  minAmount: number;
  maxAmount: number;
  localMinAmount: number;
  localMaxAmount: number;
  country: {
    isoName: string;
    name: string;
  };
  fx: {
    rate: number;
    currencyCode: string;
  };
  logoUrls: string[];
  fixedAmounts: number[];
  fixedAmountsDescriptions: any;
  localFixedAmounts: number[];
  localFixedAmountsDescriptions: any;
  suggestedAmounts: number[];
  suggestedAmountsMap: any;
}

export interface TopupResult {
  transactionId: number;
  operatorTransactionId: string;
  customIdentifier: string;
  recipientPhone: string;
  recipientEmail: string | null;
  senderPhone: string;
  countryCode: string;
  operatorId: number;
  operatorName: string;
  discount: number;
  discountCurrencyCode: string;
  requestedAmount: number;
  requestedAmountCurrencyCode: string;
  deliveredAmount: number;
  deliveredAmountCurrencyCode: string;
  transactionDate: string;
  balanceInfo: {
    oldBalance: number;
    newBalance: number;
    currencyCode: string;
    currencyName: string;
    updatedAt: string;
  };
}

export const reloadlyService = {
  async getOperators(): Promise<ReloadlyOperator[]> {
    const { data, error } = await supabase.functions.invoke('reloadly-airtime-topup', {
      body: { action: 'getOperators' }
    });

    if (error) throw error;
    return data.operators || [];
  },

  async topupAirtime(
    operatorId: number,
    phoneNumber: string,
    amount: number,
    userId: string
  ): Promise<TopupResult> {
    const { data, error } = await supabase.functions.invoke('reloadly-airtime-topup', {
      body: {
        action: 'topup',
        operatorId,
        phoneNumber,
        amount,
        userId
      }
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);
    
    return data;
  }
};
