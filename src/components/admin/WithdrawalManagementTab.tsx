import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { logAdminAction } from '@/lib/auditLogger';
import WithdrawalAnalytics from './WithdrawalAnalytics';
import WithdrawalFilters from './WithdrawalFilters';
import WithdrawalTable from './WithdrawalTable';
import BatchWithdrawalModal from './BatchWithdrawalModal';
import WithdrawalDetailsModal from './WithdrawalDetailsModal';
import { Button } from '@/components/ui/button';

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  fee: number;
  status: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  reference: string;
  paystack_transfer_code?: string;
  failure_reason?: string;
  created_at: string;
  processed_at?: string;
  user_email?: string;
  user_phone?: string;
}

const WithdrawalManagementTab: React.FC = () => {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    search: ''
  });

  useEffect(() => {
    fetchWithdrawals();
  }, [filters]);

  const fetchWithdrawals = async () => {
    setLoading(true);
    let query = supabase
      .from('withdrawal_requests')
      .select(`
        *,
        profiles:user_id(email, phone_number)
      `)
      .order('created_at', { ascending: false });

    if (filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setWithdrawals(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Withdrawal Management</h2>
        <div className="flex gap-3">
          <Button onClick={() => setShowBatchModal(true)} disabled={selectedIds.length === 0}>
            Process Batch ({selectedIds.length})
          </Button>
          <Button variant="outline" onClick={fetchWithdrawals}>Refresh</Button>
        </div>
      </div>

      <WithdrawalAnalytics withdrawals={withdrawals} />
      <WithdrawalFilters filters={filters} setFilters={setFilters} />
      <WithdrawalTable 
        withdrawals={withdrawals}
        loading={loading}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onViewDetails={setSelectedWithdrawal}
        onRefresh={fetchWithdrawals}
      />

      {showBatchModal && (
        <BatchWithdrawalModal
          selectedIds={selectedIds}
          onClose={() => setShowBatchModal(false)}
          onSuccess={() => {
            setShowBatchModal(false);
            setSelectedIds([]);
            fetchWithdrawals();
          }}
        />
      )}

      {selectedWithdrawal && (
        <WithdrawalDetailsModal
          withdrawal={selectedWithdrawal}
          onClose={() => setSelectedWithdrawal(null)}
          onSuccess={fetchWithdrawals}
        />
      )}
    </div>
  );
};

export default WithdrawalManagementTab;
