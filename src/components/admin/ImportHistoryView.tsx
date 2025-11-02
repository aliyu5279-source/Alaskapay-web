import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileJson, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function ImportHistoryView() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const { data } = await supabase
      .from('import_history')
      .select('*, profiles(email)')
      .order('import_date', { ascending: false })
      .limit(50);
    if (data) setHistory(data);
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Import History</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Imported By</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Successful</TableHead>
              <TableHead>Failed</TableHead>
              <TableHead>Conflicts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-sm">
                  {new Date(item.import_date).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{item.file_name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {item.profiles?.email || 'Unknown'}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.reports_count}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{item.successful_imports}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm">{item.failed_imports}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm">{item.conflicts_resolved}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}