import React from 'react';
import { X } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, isMobile = false, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analytics', label: 'Analytics Dashboard', icon: '📈' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'services', label: 'Service Management', icon: '⚙️' },
    { id: 'vtu', label: 'VTU Management', icon: '📱' },
    { id: 'pricing', label: 'Pricing & Discounts', icon: '💰' },
    { id: 'providers', label: 'Service Providers', icon: '🔌' },
    { id: 'notifications', label: 'Send Notifications', icon: '🔔' },
    { id: 'roles', label: 'Roles & Permissions', icon: '🔐' },
    { id: 'audit', label: 'Audit Logs', icon: '📋' },
    { id: 'digest-analytics', label: 'Digest Analytics', icon: '📈' },
    { id: 'bounce-management', label: 'Bounce Management', icon: '📧' },
    { id: 'suppression-list', label: 'Suppression List', icon: '🚫' },
    { id: 'email-templates', label: 'Email Templates', icon: '📝' },
    { id: 'template-analytics', label: 'Template Analytics', icon: '📊' },
    { id: 'ab-testing', label: 'A/B Testing', icon: '🧪' },
    { id: 'campaign-scheduler', label: 'Email Campaigns', icon: '📅' },
    { id: 'automation-rules', label: 'Automation Rules', icon: '🤖' },
    { id: 'segments', label: 'User Segments', icon: '👥' },
    { id: 'segment-analytics', label: 'Segment Analytics', icon: '📊' },
    { id: 'revenue-attribution', label: 'Revenue Attribution', icon: '💵' },
    { id: 'custom-reports', label: 'Custom Reports', icon: '📑' },
    { id: 'deliverability', label: 'Email Deliverability', icon: '📬' },
    { id: 'push-settings', label: 'Push Notifications', icon: '🔔' },
    { id: 'push-history', label: 'Notification History', icon: '📜' },
    { id: 'kyc-review', label: 'KYC Verification', icon: '🛡️' },
    { id: 'fraud-detection', label: 'Fraud Detection', icon: '🚨' },
    { id: 'webhooks', label: 'Webhooks', icon: '🔗' },
    { id: 'webhook-analytics', label: 'Webhook Analytics', icon: '📊' },
    { id: 'referrals', label: 'Referral Program', icon: '🎁' },
    { id: 'bill-payments', label: 'Bill Payments', icon: '💵' },
    { id: 'currencies', label: 'Currency Management', icon: '💱' },
    { id: 'banks', label: 'Bank Management', icon: '🏦' },
    { id: 'system-health', label: 'System Health', icon: '💚' },


    { id: 'commission-rules', label: 'Commission Rules', icon: '💎' },
    { id: 'commission-settlement', label: 'Commission Settlement', icon: '💸' },
    { id: 'withdrawal-management', label: 'Withdrawal Management', icon: '🏧' },

    { id: 'compliance', label: 'Compliance', icon: '🛡️' },


    { id: 'disputes', label: 'Disputes', icon: '⚖️' },
    { id: 'chargeback-prevention', label: 'Chargeback Prevention', icon: '🛡️' },
    { id: '3ds-config', label: '3DS Configuration', icon: '🔒' },
    { id: '3ds-analytics', label: '3DS Analytics', icon: '📊' },
    { id: 'subscriptions', label: 'Subscriptions', icon: '🔄' },
    { id: 'subscription-webhooks', label: 'Subscription Webhooks', icon: '🔗' },

    { id: 'release-management', label: 'Release Management', icon: '🚀' },
    { id: 'beta-testing', label: 'Beta Testing', icon: '🧪' },
    { id: 'load-testing', label: 'Load Testing', icon: '⚡' },
    { id: 'aso', label: 'App Store Optimization', icon: '📱' },
    { id: 'custom-domains', label: 'Custom Domains', icon: '🌐' },
    { id: 'email-domain-auth', label: 'Email Domain Auth', icon: '📧' },
    { id: 'domain-health', label: 'Domain Health Monitor', icon: '🏥' },
    { id: 'ai-features', label: 'AI Features', icon: '🤖' },
    { id: 'activity-logs', label: 'Activity Logs', icon: '📜' },
    { id: 'secrets-management', label: 'Environment Secrets', icon: '🔑' },
    { id: 'backup-recovery', label: 'Backup & Recovery', icon: '💾' },
    { id: 'env-sync', label: 'Environment Sync', icon: '🔄' },


    { id: 'developer-portal', label: 'Developer Portal', icon: '👨‍💻' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' },


















  ];

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={`bg-gray-900 text-white ${isMobile ? 'w-full' : 'w-64 min-h-screen'} p-4`}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-teal-400">Alaska Pay</h2>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>
        {isMobile && onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="space-y-2 pb-20 md:pb-0">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
              activeTab === item.id
                ? 'bg-teal-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
