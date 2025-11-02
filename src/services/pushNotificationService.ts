import { supabase } from '@/lib/supabase';

export type NotificationType = 
  | 'transaction_confirmation'
  | 'low_balance_warning'
  | 'bill_payment_reminder'
  | 'promotional_offer'
  | 'security_alert'
  | 'large_transaction'
  | 'failed_payment';

interface SendNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  icon?: string;
  badge?: string;
  tag?: string;
}

export const pushNotificationService = {
  async sendNotification(params: SendNotificationParams) {
    try {
      // Check user preferences
      const { data: prefs } = await supabase
        .from('push_notification_preferences')
        .select('*')
        .eq('user_id', params.userId)
        .single();

      // Map notification type to preference key
      const prefKey = this.getPreferenceKey(params.type);
      if (prefs && !prefs[prefKey]) {
        console.log(`User has disabled ${params.type} notifications`);
        return;
      }

      // Send via edge function
      const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          userId: params.userId,
          notification: {
            title: params.title,
            body: params.body,
            icon: params.icon || '/icon-192x192.png',
            badge: params.badge || '/icon-192x192.png',
            tag: params.tag || params.type,
            data: {
              type: params.type,
              url: this.getNotificationUrl(params.type),
              ...params.data
            }
          }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  },

  getPreferenceKey(type: NotificationType): string {
    const mapping: Record<NotificationType, string> = {
      transaction_confirmation: 'transaction_confirmations',
      low_balance_warning: 'low_balance_warnings',
      bill_payment_reminder: 'bill_payment_reminders',
      promotional_offer: 'promotional_offers',
      security_alert: 'security_alerts',
      large_transaction: 'large_transactions',
      failed_payment: 'failed_payments'
    };
    return mapping[type];
  },

  getNotificationUrl(type: NotificationType): string {
    const urlMapping: Record<NotificationType, string> = {
      transaction_confirmation: '/dashboard',
      low_balance_warning: '/wallet',
      bill_payment_reminder: '/bills',
      promotional_offer: '/dashboard',
      security_alert: '/settings/security',
      large_transaction: '/dashboard',
      failed_payment: '/dashboard'
    };
    return urlMapping[type];
  },

  // Helper methods for specific notification types
  async sendTransactionConfirmation(userId: string, amount: number, recipient: string) {
    return this.sendNotification({
      userId,
      type: 'transaction_confirmation',
      title: 'Transaction Successful',
      body: `You sent ₦${amount.toLocaleString()} to ${recipient}`,
      data: { amount, recipient }
    });
  },

  async sendLowBalanceWarning(userId: string, balance: number) {
    return this.sendNotification({
      userId,
      type: 'low_balance_warning',
      title: 'Low Balance Alert',
      body: `Your balance is ₦${balance.toLocaleString()}. Top up to continue using AlaskaPay.`,
      data: { balance }
    });
  },

  async sendBillPaymentReminder(userId: string, billerName: string, amount: number, dueDate: string) {
    return this.sendNotification({
      userId,
      type: 'bill_payment_reminder',
      title: 'Bill Payment Due',
      body: `${billerName} payment of ₦${amount.toLocaleString()} is due on ${dueDate}`,
      data: { billerName, amount, dueDate }
    });
  },

  async sendPromotionalOffer(userId: string, offerTitle: string, offerDescription: string) {
    return this.sendNotification({
      userId,
      type: 'promotional_offer',
      title: offerTitle,
      body: offerDescription,
      data: { offerTitle }
    });
  },

  async sendSecurityAlert(userId: string, alertMessage: string, details?: Record<string, any>) {
    return this.sendNotification({
      userId,
      type: 'security_alert',
      title: 'Security Alert',
      body: alertMessage,
      data: details
    });
  },

  async sendLargeTransactionAlert(userId: string, amount: number, recipient: string) {
    return this.sendNotification({
      userId,
      type: 'large_transaction',
      title: 'Large Transaction Alert',
      body: `Large transaction of ₦${amount.toLocaleString()} to ${recipient} was processed`,
      data: { amount, recipient }
    });
  },

  async sendFailedPaymentAlert(userId: string, reason: string) {
    return this.sendNotification({
      userId,
      type: 'failed_payment',
      title: 'Payment Failed',
      body: `Your payment failed: ${reason}`,
      data: { reason }
    });
  }
};
