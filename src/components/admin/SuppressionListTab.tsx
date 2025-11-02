import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, Upload, Trash2, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SuppressionEntry {
  id: string;
  email: string;
  reason: string;
  suppression_type: string;
  added_at: string;
  expires_at: string | null;
  notes: string | null;
}

export default function SuppressionListTab() {
  const [suppressionList, setSuppressionList] = useState<SuppressionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [reason, setReason] = useState('manual');
  const [suppressionType, setSuppressionType] = useState('permanent');
  const [notes, setNotes] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    loadSuppressionList();
  }, []);

  const loadSuppressionList = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('manage-suppression-list', {
        body: { action: 'list' }
      });

      if (error) throw error;
      setSuppressionList(data.suppressionList || []);
    } catch (error) {
      console.error('Error loading suppression list:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToSuppressionList = async () => {
    try {
      const emails = bulkEmails ? bulkEmails.split('\n').map(e => e.trim()).filter(Boolean) : [newEmail];
      
      const { error } = await supabase.functions.invoke('manage-suppression-list', {
        body: {
          action: 'add',
          emails,
          reason,
          suppressionType,
          expiresAt: suppressionType === 'temporary' && expiresAt ? expiresAt : null,
          notes
        }
      });

      if (error) throw error;

      setShowAddForm(false);
      setNewEmail('');
      setBulkEmails('');
      setNotes('');
      setExpiresAt('');
      loadSuppressionList();
    } catch (error) {
      console.error('Error adding to suppression list:', error);
    }
  };

  const removeFromSuppressionList = async (email: string) => {
    if (!confirm(`Remove ${email} from suppression list?`)) return;

    try {
      const { error } = await supabase.functions.invoke('manage-suppression-list', {
        body: { action: 'remove', email }
      });

      if (error) throw error;
      loadSuppressionList();
    } catch (error) {
      console.error('Error removing from suppression list:', error);
    }
  };

  const exportSuppressionList = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-suppression-list', {
        body: { action: 'export' }
      });

      if (error) throw error;

      const csv = [
        ['Email', 'Reason', 'Type', 'Added At', 'Expires At', 'Notes'].join(','),
        ...data.data.map((row: any) => [
          row.email,
          row.reason,
          row.suppression_type,
          row.added_at,
          row.expires_at || '',
          row.notes || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `suppression-list-${new Date().toISOString()}.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting suppression list:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Emails on this list will be automatically blocked from receiving any emails from the system.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Suppression List</CardTitle>
              <CardDescription>
                {suppressionList.length} suppressed email{suppressionList.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportSuppressionList}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Email
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddForm && (
            <div className="p-4 border rounded-lg space-y-4">
              <h3 className="font-semibold">Add to Suppression List</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Single Email</label>
                <Input
                  placeholder="email@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Or Bulk Add (one per line)</label>
                <Textarea
                  placeholder="email1@example.com&#10;email2@example.com"
                  value={bulkEmails}
                  onChange={(e) => setBulkEmails(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason</label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="bounced">Bounced</SelectItem>
                      <SelectItem value="spam_complaint">Spam Complaint</SelectItem>
                      <SelectItem value="unsubscribe">Unsubscribe</SelectItem>
                      <SelectItem value="invalid">Invalid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={suppressionType} onValueChange={setSuppressionType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {suppressionType === 'temporary' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expires At</label>
                  <Input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="Optional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={addToSuppressionList}>Add to List</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppressionList.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.reason}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={entry.suppression_type === 'permanent' ? 'destructive' : 'default'}>
                      {entry.suppression_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(entry.added_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {entry.expires_at ? new Date(entry.expires_at).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromSuppressionList(entry.email)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
