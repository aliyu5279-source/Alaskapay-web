import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { PaymentTransaction } from '../types';
import { formatAmount } from '../lib/stripe';
import { format } from 'date-fns';

interface PaymentHistoryTableProps {
  transactions: PaymentTransaction[];
}

const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ transactions }) => {
  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
      succeeded: 'default',
      pending: 'secondary',
      failed: 'destructive',
      canceled: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell>{format(new Date(tx.createdAt), 'MMM dd, yyyy')}</TableCell>
            <TableCell>{tx.description}</TableCell>
            <TableCell>{formatAmount(tx.amount, tx.currency)}</TableCell>
            <TableCell>{getStatusBadge(tx.status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PaymentHistoryTable;
