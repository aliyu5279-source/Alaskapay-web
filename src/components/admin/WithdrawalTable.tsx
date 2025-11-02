import React from 'react';
import { Withdrawal } from './WithdrawalManagementTab';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  withdrawals: Withdrawal[];
  loading: boolean;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  onViewDetails: (withdrawal: Withdrawal) => void;
  onRefresh: () => void;
}

const WithdrawalTable: React.FC<Props> = ({ 
  withdrawals, 
  loading, 
  selectedIds, 
  setSelectedIds,
  onViewDetails,
  onRefresh
}) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(withdrawals.filter(w => w.status === 'pending').map(w => w.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }
  };

  const exportToCSV = () => {
    const headers = ['Reference', 'Amount', 'Fee', 'Bank', 'Account', 'Status', 'Date'];
    const rows = withdrawals.map(w => [
      w.reference,
      w.amount,
      w.fee,
      w.bank_name,
      w.account_number,
      w.status,
      format(new Date(w.created_at), 'yyyy-MM-dd HH:mm')
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `withdrawals_${Date.now()}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: 'default',
      processing: 'secondary',
      completed: 'default',
      failed: 'destructive'
    };
    
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Withdrawal Requests ({withdrawals.length})</h3>
        <Button variant="outline" size="sm" onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedIds.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Bank Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.map((withdrawal) => (
            <TableRow key={withdrawal.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedIds.includes(withdrawal.id)}
                  onCheckedChange={(checked) => handleSelectOne(withdrawal.id, checked as boolean)}
                  disabled={withdrawal.status !== 'pending'}
                />
              </TableCell>
              <TableCell className="font-mono text-sm">{withdrawal.reference}</TableCell>
              <TableCell className="font-semibold">₦{withdrawal.amount.toLocaleString()}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">{withdrawal.bank_name}</div>
                  <div className="text-gray-500">{withdrawal.account_number}</div>
                  <div className="text-gray-500">{withdrawal.account_name}</div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
              <TableCell className="text-sm text-gray-600">
                {format(new Date(withdrawal.created_at), 'MMM dd, yyyy HH:mm')}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onViewDetails(withdrawal)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WithdrawalTable;
