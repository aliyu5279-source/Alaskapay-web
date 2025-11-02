import React, { useState, useEffect } from 'react';
import WalletCard from './WalletCard';
import TransactionList from './TransactionList';
import NotificationPreferences from './NotificationPreferences';
import { EmailVerificationBanner } from './EmailVerificationBanner';
import { TransactionLimitCard } from './TransactionLimitCard';
import { LimitUpgradeModal } from './LimitUpgradeModal';
import { KYCVerificationBadge } from './kyc/KYCVerificationBadge';
import { KYCVerificationFlow } from './kyc/KYCVerificationFlow';
import { BeneficiaryManagement } from './BeneficiaryManagement';
import { VirtualCardManager } from './VirtualCardManager';
import { WalletDashboard } from './WalletDashboard';
import { SupportDashboard } from './SupportDashboard';
import PreDisputeAlerts from './chargeback/PreDisputeAlerts';
import SpendingInsights from './analytics/SpendingInsights';
import SavingsGoals from './savings/SavingsGoals';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';






const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [limitData, setLimitData] = useState({
    kycLevel: 'basic' as 'none' | 'basic' | 'enhanced' | 'full',
    dailyLimit: 50000,
    currentUsage: 0
  });
  const [showKYCFlow, setShowKYCFlow] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);


  useEffect(() => {
    if (user) {
      fetchLimitData();
    }
  }, [user]);

  const fetchLimitData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-tier-limits');

      if (!error && data) {
        setLimitData({
          kycLevel: data.kycLevel,
          dailyLimit: data.dailyLimit,
          currentUsage: data.currentUsage
        });
      }
    } catch (error) {
      console.error('Error fetching limit data:', error);
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleStartKYC = () => {
    setShowUpgradeModal(false);
    setShowKYCFlow(true);
  };


  return (
    <>
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmailVerificationBanner />
          <PreDisputeAlerts />
          
          <div className="mb-6">
            <Button 
              onClick={() => navigate('/transaction-testing')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <TestTube className="mr-2 h-4 w-4" />
              Test Transactions
            </Button>
          </div>

          <div className="flex items-center justify-between mb-8 mt-6">
            <h2 className="text-3xl font-bold text-gray-900">My Dashboard</h2>
            <KYCVerificationBadge 
              level={limitData.kycLevel}
              status="approved"
              onClick={handleUpgradeClick}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <WalletCard />
              
              <div className="mt-6">
                <TransactionLimitCard
                  kycLevel={limitData.kycLevel}
                  dailyLimit={limitData.dailyLimit}
                  currentUsage={limitData.currentUsage}
                  onUpgradeClick={handleUpgradeClick}
                />
              </div>
              
              <div className="mt-6 bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-100 transition-colors font-semibold">
                    💳 Buy Data
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-green-50 text-green-900 rounded-lg hover:bg-green-100 transition-colors font-semibold">
                    📱 Buy Airtime
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-purple-50 text-purple-900 rounded-lg hover:bg-purple-100 transition-colors font-semibold">
                    📺 Pay Cable TV
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-yellow-50 text-yellow-900 rounded-lg hover:bg-yellow-100 transition-colors font-semibold">
                    ⚡ Pay Electricity
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <Tabs defaultValue="transactions" className="w-full">
                <TabsList className="grid w-full grid-cols-8">
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="savings">Savings</TabsTrigger>
                  <TabsTrigger value="wallet">Wallet</TabsTrigger>
                  <TabsTrigger value="cards">Cards</TabsTrigger>
                  <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="transactions">
                  <TransactionList />
                </TabsContent>
                <TabsContent value="insights">
                  <SpendingInsights />
                </TabsContent>
                <TabsContent value="savings">
                  <SavingsGoals />
                </TabsContent>
                <TabsContent value="wallet">
                  <WalletDashboard />
                </TabsContent>
                <TabsContent value="cards">
                  <VirtualCardManager />
                </TabsContent>
                <TabsContent value="beneficiaries">
                  <BeneficiaryManagement />
                </TabsContent>
                <TabsContent value="support">
                  <SupportDashboard />
                </TabsContent>
                <TabsContent value="notifications">
                  <NotificationPreferences />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>


      <LimitUpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={limitData.kycLevel}
        onUpgrade={handleStartKYC}
      />

      {showKYCFlow && (
        <KYCVerificationFlow onClose={() => setShowKYCFlow(false)} />
      )}
    </>

  );
};

export default Dashboard;
