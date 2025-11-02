import { supabase } from './supabase';

export interface ExportFilters {
  startDate: string;
  endDate: string;
  transactionType?: string;
}

export async function exportTransactionsCSV(
  userId: string,
  filters: ExportFilters
): Promise<Blob> {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', filters.startDate)
    .lte('created_at', filters.endDate)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Filter by transaction type if specified
  const filteredTransactions = filters.transactionType && filters.transactionType !== 'all'
    ? transactions?.filter(t => t.type === filters.transactionType)
    : transactions;

  // Generate CSV
  const headers = ['Date', 'Description', 'Type', 'Amount', 'Status', 'Reference'];
  const rows = filteredTransactions?.map(t => [
    new Date(t.created_at).toLocaleString(),
    t.description,
    t.type,
    t.amount,
    t.status,
    t.reference || '',
  ]) || [];

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return new Blob([csv], { type: 'text/csv' });
}

export async function exportTransactionsPDF(
  userId: string,
  filters: ExportFilters
): Promise<Blob> {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', filters.startDate)
    .lte('created_at', filters.endDate)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const filteredTransactions = filters.transactionType && filters.transactionType !== 'all'
    ? transactions?.filter(t => t.type === filters.transactionType)
    : transactions;

  const total = filteredTransactions?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

  const html = generatePDFHTML(filteredTransactions || [], filters, total);
  return new Blob([html], { type: 'text/html' });
}

function generatePDFHTML(transactions: any[], filters: ExportFilters, total: number): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 1200px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; }
    h1 { color: #1e40af; margin-bottom: 10px; }
    .period { color: #666; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 30px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background-color: #1e40af; color: white; font-weight: 600; }
    tr:hover { background-color: #f9fafb; }
    .total-row { font-weight: bold; background-color: #f3f4f6; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>AlaskaPay Transaction History</h1>
    <p class="period">Period: ${new Date(filters.startDate).toLocaleDateString()} to ${new Date(filters.endDate).toLocaleDateString()}</p>
    ${filters.transactionType && filters.transactionType !== 'all' ? `<p class="period">Type: ${filters.transactionType}</p>` : ''}
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Type</th>
        <th>Amount (₦)</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${transactions.map(t => `
        <tr>
          <td>${new Date(t.created_at).toLocaleDateString()}</td>
          <td>${t.description}</td>
          <td>${t.type}</td>
          <td>₦${parseFloat(t.amount).toLocaleString()}</td>
          <td>${t.status}</td>
        </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="3">Total</td>
        <td>₦${total.toLocaleString()}</td>
        <td></td>
      </tr>
    </tbody>
  </table>
  
  <div class="footer">
    <p>Generated on ${new Date().toLocaleString()}</p>
    <p>AlaskaPay - Your Trusted Payment Partner</p>
  </div>
</body>
</html>
  `;
}
