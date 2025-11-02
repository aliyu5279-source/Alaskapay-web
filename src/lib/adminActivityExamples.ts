import { logAdminActivity } from './adminActivityLogger';

// Example: Log user update
export async function logUserUpdate(userId: string, changes: Record<string, any>) {
  await logAdminActivity({
    actionType: 'user_updated',
    targetResource: 'users',
    targetId: userId,
    changesMade: changes,
    metadata: { timestamp: new Date().toISOString() }
  });
}

// Example: Log transaction approval
export async function logTransactionApproval(transactionId: string) {
  await logAdminActivity({
    actionType: 'transaction_approved',
    targetResource: 'transactions',
    targetId: transactionId,
    status: 'success'
  });
}

// Example: Log KYC approval
export async function logKYCApproval(kycId: string, tier: string) {
  await logAdminActivity({
    actionType: 'kyc_approved',
    targetResource: 'kyc_submissions',
    targetId: kycId,
    metadata: { tier }
  });
}

// Example: Log settings update
export async function logSettingsUpdate(settingKey: string, oldValue: any, newValue: any) {
  await logAdminActivity({
    actionType: 'settings_updated',
    targetResource: 'settings',
    targetId: settingKey,
    changesMade: { old: oldValue, new: newValue }
  });
}

// Example: Log data export
export async function logDataExport(exportType: string, recordCount: number) {
  await logAdminActivity({
    actionType: 'data_exported',
    targetResource: exportType,
    metadata: { recordCount, format: 'CSV' }
  });
}

// Example: Log failed action
export async function logFailedAction(actionType: any, error: string) {
  await logAdminActivity({
    actionType,
    status: 'failed',
    errorMessage: error
  });
}
