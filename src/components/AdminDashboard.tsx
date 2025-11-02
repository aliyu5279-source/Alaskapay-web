import React, { useState, Suspense } from 'react';
import AdminSidebar from './AdminSidebar';
import MobileAdminNav from './MobileAdminNav';
import AdminNotificationBell from './admin/AdminNotificationBell';
import { FraudAlertPanel } from './admin/FraudAlertPanel';
import DashboardTab from './admin/DashboardTab';
import TransactionsTab from './admin/TransactionsTab';
import UsersTab from './admin/UsersTab';
import ServicesTab from './admin/ServicesTab';
import RolesTab from './admin/RolesTab';
import AuditLogsTab from './admin/AuditLogsTab';
import DigestAnalyticsTab from './admin/DigestAnalyticsTab';
import BounceManagementTab from './admin/BounceManagementTab';
import SuppressionListTab from './admin/SuppressionListTab';
import { TemplateManagementTab } from './admin/TemplateManagementTab';
import { TemplateAnalyticsTab } from './admin/TemplateAnalyticsTab';
import { ABTestingTab } from './admin/ABTestingTab';
import CampaignSchedulerTab from './admin/CampaignSchedulerTab';
import { AutomationRulesTab } from './admin/AutomationRulesTab';
import { SegmentsTab } from './admin/SegmentsTab';
import { SegmentAnalyticsTab } from './admin/SegmentAnalyticsTab';
import RevenueAttributionTab from './admin/RevenueAttributionTab';
import AnalyticsDashboard from './admin/AnalyticsDashboard';
import { CustomReportBuilder } from './admin/CustomReportBuilder';
import DeliverabilityDashboard from './admin/DeliverabilityDashboard';
import { PushNotificationSettings } from './admin/PushNotificationSettings';
import { PushNotificationHistory } from './admin/PushNotificationHistory';
import { KYCReviewTab } from './admin/KYCReviewTab';
import { FraudDetectionTab } from './admin/FraudDetectionTab';
import { WebhookManagementTab } from './admin/WebhookManagementTab';
import { WebhookAnalyticsDashboard } from './admin/WebhookAnalyticsDashboard';
import ReferralManagementTab from './admin/ReferralManagementTab';
import { BillPaymentsTab } from './admin/BillPaymentsTab';
import { CurrencyManagementTab } from './admin/CurrencyManagementTab';
import { BankManagementTab } from './admin/BankManagementTab';
import { SystemHealthDashboard } from './admin/SystemHealthDashboard';
import { CommissionRulesManager } from './admin/CommissionRulesManager';
import ComplianceDashboard from './admin/ComplianceDashboard';
import { ReleaseManagementTab } from './admin/ReleaseManagementTab';
import { BetaTestingTab } from './admin/BetaTestingTab';
import { DisputeManagementTab } from './admin/DisputeManagementTab';
import ChargebackPreventionTab from './admin/ChargebackPreventionTab';
import { ThreeDSConfigTab } from './admin/ThreeDSConfigTab';
import { ThreeDSAnalyticsTab } from './admin/ThreeDSAnalyticsTab';
import SubscriptionManagementTab from './admin/SubscriptionManagementTab';
import SubscriptionWebhooksTab from './admin/SubscriptionWebhooksTab';
import DeveloperPortal from './developer/DeveloperPortal';
import ActivityLogViewer from './admin/ActivityLogViewer';
import { LoadTestingDashboard } from './admin/LoadTestingDashboard';
import { ASODashboard } from './admin/ASODashboard';
import { CustomDomainTab } from './admin/CustomDomainTab';
import { EmailDomainAuthTab } from './admin/EmailDomainAuthTab';
import { AIAdminDashboard } from './ai/AIAdminDashboard';
import { SecretsManagementTab } from './admin/SecretsManagementTab';
import { DomainHealthMonitoringTab } from './admin/DomainHealthMonitoringTab';
import { BackupDashboard } from './admin/BackupDashboard';
import { EnvSyncDashboard } from './admin/EnvSyncDashboard';
import { CommissionSettlementTab } from './admin/CommissionSettlementTab';
import WithdrawalManagementTab from './admin/WithdrawalManagementTab';
import { Sheet, SheetContent } from './ui/sheet';
import { ErrorBoundary } from './ErrorBoundary';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
  </div>
);

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    try {
      switch (activeTab) {
        case 'dashboard': return <DashboardTab />;
        case 'analytics': return <AnalyticsDashboard />;
        case 'transactions': return <TransactionsTab />;
        case 'users': return <UsersTab />;
        case 'services': return <ServicesTab />;
        case 'roles': return <RolesTab />;
        case 'audit': return <AuditLogsTab />;
        case 'digest-analytics': return <DigestAnalyticsTab />;
        case 'bounce-management': return <BounceManagementTab />;
        case 'suppression-list': return <SuppressionListTab />;
        case 'email-templates': return <TemplateManagementTab />;
        case 'template-analytics': return <TemplateAnalyticsTab />;
        case 'ab-testing': return <ABTestingTab />;
        case 'campaign-scheduler': return <CampaignSchedulerTab />;
        case 'automation-rules': return <AutomationRulesTab />;
        case 'segments': return <SegmentsTab />;
        case 'segment-analytics': return <SegmentAnalyticsTab />;
        case 'revenue-attribution': return <RevenueAttributionTab />;
        case 'custom-reports': return <CustomReportBuilder />;
        case 'deliverability': return <DeliverabilityDashboard />;
        case 'push-settings': return <PushNotificationSettings />;
        case 'push-history': return <PushNotificationHistory />;
        case 'kyc-review': return <KYCReviewTab />;
        case 'fraud-detection': return <FraudDetectionTab />;
        case 'webhooks': return <WebhookManagementTab />;
        case 'webhook-analytics': return <WebhookAnalyticsDashboard />;
        case 'referrals': return <ReferralManagementTab />;
        case 'bill-payments': return <BillPaymentsTab />;
        case 'currencies': return <CurrencyManagementTab />;
        case 'banks': return <BankManagementTab />;
        case 'system-health': return <SystemHealthDashboard />;
        case 'commission-rules': return <CommissionRulesManager />;
        case 'compliance': return <ComplianceDashboard />;
        case 'release-management': return <ReleaseManagementTab />;
        case 'beta-testing': return <BetaTestingTab />;
        case 'disputes': return <DisputeManagementTab />;
        case 'chargeback-prevention': return <ChargebackPreventionTab />;
        case '3ds-config': return <ThreeDSConfigTab />;
        case '3ds-analytics': return <ThreeDSAnalyticsTab />;
        case 'developer-portal': return <DeveloperPortal />;
        case 'subscriptions': return <SubscriptionManagementTab />;
        case 'subscription-webhooks': return <SubscriptionWebhooksTab />;
        case 'load-testing': return <LoadTestingDashboard />;
        case 'aso': return <ASODashboard />;
        case 'custom-domains': return <CustomDomainTab />;
        case 'email-domain-auth': return <EmailDomainAuthTab />;
        case 'ai-features': return <AIAdminDashboard />;
        case 'activity-logs': return <ActivityLogViewer />;
        case 'secrets-management': return <SecretsManagementTab />;
        case 'domain-health': return <DomainHealthMonitoringTab />;
        case 'backup-recovery': return <BackupDashboard />;
        case 'env-sync': return <EnvSyncDashboard />;
        case 'commission-settlement': return <CommissionSettlementTab />;
        case 'withdrawal-management': return <WithdrawalManagementTab />;
        default:
          return (
            <div className="bg-white rounded-xl p-8 shadow-md text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{activeTab.toUpperCase()}</h3>
              <p className="text-gray-600">This module is under development</p>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering tab:', error);
      return (
        <div className="bg-red-50 rounded-xl p-8 shadow-md text-center">
          <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Tab</h3>
          <p className="text-red-600">Please refresh the page or try another tab</p>
        </div>
      );
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gray-100">
        <div className="hidden md:block">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-80">
            <AdminSidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              isMobile={true}
              onClose={() => setMobileMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          <div className="flex justify-end gap-2 mb-4">
            <ErrorBoundary fallback={<div />}>
              <FraudAlertPanel />
            </ErrorBoundary>
            <ErrorBoundary fallback={<div />}>
              <AdminNotificationBell />
            </ErrorBoundary>
          </div>
          <Suspense fallback={<LoadingFallback />}>
            <ErrorBoundary>
              {renderContent()}
            </ErrorBoundary>
          </Suspense>
        </div>

        <MobileAdminNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;
