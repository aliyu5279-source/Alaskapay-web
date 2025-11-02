// Alaska Mega Plus Ltd Commission Configuration
export const COMMISSION_CONFIG = {
  // Company Bank Account Details
  company: {
    name: 'Alaska Mega Plus Ltd',
    bankName: 'Taj Bank',
    accountNumber: '0013010127',
    accountName: 'Alaska Mega Plus Ltd',
    bankCode: '000026', // Taj Bank code
  },

  // Commission Percentages by Provider
  percentages: {
    // Bill Payment Providers
    electricity: 2.5, // 2.5% commission on electricity bills
    airtime: 3.0, // 3% commission on airtime
    data: 3.0, // 3% commission on data bundles
    cable_tv: 2.0, // 2% commission on cable TV
    internet: 2.5, // 2.5% commission on internet bills
    
    // Payment Gateway Commissions
    paystack: 1.5, // 1.5% commission on Paystack transactions
    flutterwave: 1.5, // 1.5% commission on Flutterwave transactions
    
    // Transfer Commissions
    bank_transfer: 0.5, // 0.5% on bank transfers
    wallet_transfer: 0.3, // 0.3% on wallet transfers
  },

  // Auto-settlement Configuration
  autoSettlement: {
    enabled: true,
    frequency: 'daily', // 'daily', 'weekly', 'monthly'
    minimumAmount: 1000, // Minimum ₦1,000 before auto-settlement
    time: '23:00', // Settlement time (11 PM daily)
  },

  // Paystack Split Configuration
  paystackSplit: {
    enabled: true,
    type: 'percentage', // 'percentage' or 'flat'
    bearer: 'account', // Who bears Paystack fees
  },
};
