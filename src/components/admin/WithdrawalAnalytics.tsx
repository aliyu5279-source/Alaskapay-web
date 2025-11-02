import React from 'react';
import { Card } from '@/components/ui/card';
import { Withdrawal } from './WithdrawalManagementTab';
import { TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  withdrawals: Withdrawal[];
}

const WithdrawalAnalytics: React.FC<Props> = ({ withdrawals }) => {
  const totalVolume = withdrawals.reduce((sum, w) => sum + w.amount, 0);
  const completedWithdrawals = withdrawals.filter(w => w.status === 'completed');
  const failedWithdrawals = withdrawals.filter(w => w.status === 'failed');
  const successRate = withdrawals.length > 0 
    ? (completedWithdrawals.length / withdrawals.length * 100).toFixed(1)
    : '0';

  const avgProcessingTime = completedWithdrawals.length > 0
    ? completedWithdrawals.reduce((sum, w) => {
        if (!w.processed_at) return sum;
        const diff = new Date(w.processed_at).getTime() - new Date(w.created_at).getTime();
        return sum + diff / 1000 / 60; // minutes
      }, 0) / completedWithdrawals.length
    : 0;

  const stats = [
    {
      title: 'Total Volume',
      value: `₦${totalVolume.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Avg Processing Time',
      value: `${avgProcessingTime.toFixed(0)} min`,
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Failed Withdrawals',
      value: failedWithdrawals.length.toString(),
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.bg} p-3 rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WithdrawalAnalytics;
