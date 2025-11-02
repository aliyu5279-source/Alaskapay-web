import React, { useState, useMemo } from 'react';
import AnalyticsFilters, { AnalyticsFilters as FilterType } from './AnalyticsFilters';
import { UserGrowthChart } from './UserGrowthChart';
import { RevenueChart } from './RevenueChart';
import { PaymentStatsChart } from './PaymentStatsChart';
import { EmailEngagementChart } from './EmailEngagementChart';
import { ReportExportModal } from './ReportExportModal';
import { ScheduledReportsModal } from './ScheduledReportsModal';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp, Users, DollarSign, Mail, Download, Calendar } from 'lucide-react';
import { subDays, startOfYear } from 'date-fns';
import { useUserStats } from '@/hooks/useAnalytics';
import { useRevenueStats } from '@/hooks/useRevenueAnalytics';
import { useEmailStats } from '@/hooks/useEmailEngagement';


const AnalyticsDashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterType>({
    datePreset: '30d',
    compareEnabled: false,
    userSegments: [],
    paymentTypes: [],
    emailCampaigns: [],
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);


  const dateRange = useMemo(() => {
    const end = new Date();
    let start: Date;
    
    switch (filters.datePreset) {
      case '7d':
        start = subDays(end, 7);
        break;
      case '30d':
        start = subDays(end, 30);
        break;
      case '90d':
        start = subDays(end, 90);
        break;
      case 'ytd':
        start = startOfYear(end);
        break;
      case '1y':
        start = subDays(end, 365);
        break;
      default:
        start = subDays(end, 30);
    }
    
    return { from: start, to: end };
  }, [filters.datePreset]);

  const { data: userStats } = useUserStats(filters.userSegments);
  const { data: revenueStats } = useRevenueStats(filters.paymentTypes);
  const { data: emailStats } = useEmailStats(filters.emailCampaigns);

  const handleExport = () => {
    const csvData = [
      ['Metric', 'Value', 'Change'],
      ['Total Users', userStats?.totalUsers || 0, userStats?.percentChange || '0%'],
      ['Total Revenue', `$${revenueStats?.totalRevenue || 0}`, revenueStats?.percentChange || '0%'],
      ['Avg Transaction', `$${revenueStats?.avgTransactionValue || 0}`, ''],
      ['Email Open Rate', emailStats?.openRate || '0%', emailStats?.percentChange || '0%'],
    ];
    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${Date.now()}.csv`;
    a.click();
  };

  const stats = [
    { 
      label: 'Total Users', 
      value: userStats?.totalUsers.toLocaleString() || '0', 
      icon: Users, 
      change: userStats?.percentChange || '0%' 
    },
    { 
      label: 'Total Revenue', 
      value: `$${(revenueStats?.totalRevenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      change: revenueStats?.percentChange || '0%' 
    },
    { 
      label: 'Avg. Transaction', 
      value: `$${(revenueStats?.avgTransactionValue || 0).toLocaleString()}`, 
      icon: TrendingUp, 
      change: '+8.2%' 
    },
    { 
      label: 'Email Open Rate', 
      value: emailStats?.openRate || '0%', 
      icon: Mail, 
      change: emailStats?.percentChange || '0%' 
    },
  ];

  const exportData = {
    totalUsers: userStats?.totalUsers || 0,
    totalRevenue: revenueStats?.totalRevenue || 0,
    emailsSent: emailStats?.totalSent || 0,
    userGrowth: userStats?.percentChange || '0',
    revenueGrowth: revenueStats?.percentChange || '0',
    emailEngagement: emailStats?.openRate || '0'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowExportModal(true)} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setShowScheduleModal(true)} variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Reports
          </Button>
        </div>
      </div>
      
      <AnalyticsFilters filters={filters} onFiltersChange={setFilters} onExport={handleExport} />


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const isPositive = stat.change.startsWith('+');
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
                <stat.icon className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last period
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UserGrowthChart 
          startDate={dateRange.from} 
          endDate={dateRange.to}
          compareEnabled={filters.compareEnabled}
          userSegments={filters.userSegments}
        />
        <RevenueChart 
          startDate={dateRange.from} 
          endDate={dateRange.to}
          compareEnabled={filters.compareEnabled}
          paymentTypes={filters.paymentTypes}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentStatsChart 
          startDate={dateRange.from} 
          endDate={dateRange.to}
          compareEnabled={filters.compareEnabled}
          paymentTypes={filters.paymentTypes}
        />
        <EmailEngagementChart 
          startDate={dateRange.from} 
          endDate={dateRange.to}
          compareEnabled={filters.compareEnabled}
          emailCampaigns={filters.emailCampaigns}
        />
      </div>

      <ReportExportModal 
        open={showExportModal} 
        onClose={() => setShowExportModal(false)}
        filters={filters}
        data={exportData}
      />
      
      <ScheduledReportsModal 
        open={showScheduleModal} 
        onClose={() => setShowScheduleModal(false)}
      />
    </div>

  );
};

export default AnalyticsDashboard;
