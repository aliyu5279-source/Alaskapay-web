import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { UserPlus, Trash2, Edit, Send, Clock } from 'lucide-react';

interface Beneficiary {
  id: string;
  nickname: string;
  account_number: string;
  account_name: string;
  bank_id: string;
  bank_name: string;
  bank_code: string;
  is_verified: boolean;
  last_transfer_at: string | null;
  transfer_count: number;
}

interface Bank {
  id: string;
  name: string;
  code: string;
}

export function BeneficiaryManagement() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null);
  const [formData, setFormData] = useState({
    nickname: '',
    account_number: '',
    account_name: '',
    bank_id: '',
    bank_name: '',
    bank_code: ''
  });

  useEffect(() => {
    loadBeneficiaries();
    loadBanks();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke('manage-beneficiaries', {
        body: { action: 'list' }
      });

      if (error) throw error;
      setBeneficiaries(data.beneficiaries || []);
    } catch (error: any) {
      toast.error('Failed to load beneficiaries');
    }
  };

  const loadBanks = async () => {
    try {
      const { data, error } = await supabase
        .from('nigerian_banks')
        .select('id, name, code')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setBanks(data || []);
    } catch (error: any) {
      toast.error('Failed to load banks');
    }
  };

  const verifyAccount = async () => {
    if (!formData.account_number || !formData.bank_code) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-bank-account', {
        body: {
          account_number: formData.account_number,
          bank_code: formData.bank_code
        }
      });

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        account_name: data.account_name
      }));
      toast.success('Account verified successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify account');
    } finally {
      setLoading(false);
    }
  };

  const handleBankChange = (bankId: string) => {
    const bank = banks.find(b => b.id === bankId);
    if (bank) {
      setFormData(prev => ({
        ...prev,
        bank_id: bankId,
        bank_name: bank.name,
        bank_code: bank.code,
        account_name: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const action = editingBeneficiary ? 'update' : 'add';
      const { data, error } = await supabase.functions.invoke('manage-beneficiaries', {
        body: {
          action,
          beneficiaryId: editingBeneficiary?.id,
          beneficiary: {
            nickname: formData.nickname,
            account_number: formData.account_number,
            account_name: formData.account_name,
            bank_id: formData.bank_id,
            bank_name: formData.bank_name,
            bank_code: formData.bank_code,
            is_verified: !!formData.account_name
          }
        }
      });

      if (error) throw error;

      toast.success(editingBeneficiary ? 'Beneficiary updated' : 'Beneficiary added');
      setIsAddDialogOpen(false);
      setEditingBeneficiary(null);
      resetForm();
      loadBeneficiaries();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.functions.invoke('manage-beneficiaries', {
        body: { action: 'delete', beneficiaryId: id }
      });

      if (error) throw error;
      toast.success('Beneficiary deleted');
      loadBeneficiaries();
    } catch (error: any) {
      toast.error('Failed to delete beneficiary');
    }
  };

  const resetForm = () => {
    setFormData({
      nickname: '',
      account_number: '',
      account_name: '',
      bank_id: '',
      bank_name: '',
      bank_code: ''
    });
  };

  const recentBeneficiaries = beneficiaries.filter(b => b.last_transfer_at).slice(0, 5);
  const allBeneficiaries = beneficiaries;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saved Beneficiaries</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingBeneficiary(null); }}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Beneficiary
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBeneficiary ? 'Edit' : 'Add'} Beneficiary</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nickname</Label>
                <Input
                  value={formData.nickname}
                  onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                  placeholder="e.g., Mom, John Doe"
                  required
                />
              </div>
              <div>
                <Label>Bank</Label>
                <Select value={formData.bank_id} onValueChange={handleBankChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map(bank => (
                      <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Account Number</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.account_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
                    placeholder="0123456789"
                    maxLength={10}
                    required
                  />
                  <Button type="button" onClick={verifyAccount} disabled={loading || !formData.bank_code}>
                    Verify
                  </Button>
                </div>
              </div>
              {formData.account_name && (
                <div>
                  <Label>Account Name</Label>
                  <Input value={formData.account_name} disabled />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading || !formData.account_name}>
                {loading ? 'Saving...' : editingBeneficiary ? 'Update' : 'Add'} Beneficiary
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {recentBeneficiaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Transfers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentBeneficiaries.map(beneficiary => (
                <BeneficiaryCard
                  key={beneficiary.id}
                  beneficiary={beneficiary}
                  onEdit={() => {
                    setEditingBeneficiary(beneficiary);
                    setFormData({
                      nickname: beneficiary.nickname,
                      account_number: beneficiary.account_number,
                      account_name: beneficiary.account_name,
                      bank_id: beneficiary.bank_id,
                      bank_name: beneficiary.bank_name,
                      bank_code: beneficiary.bank_code
                    });
                    setIsAddDialogOpen(true);
                  }}
                  onDelete={handleDelete}
                  showQuickTransfer
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Beneficiaries ({allBeneficiaries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {allBeneficiaries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No saved beneficiaries yet</p>
          ) : (
            <div className="space-y-2">
              {allBeneficiaries.map(beneficiary => (
                <BeneficiaryCard
                  key={beneficiary.id}
                  beneficiary={beneficiary}
                  onEdit={() => {
                    setEditingBeneficiary(beneficiary);
                    setFormData({
                      nickname: beneficiary.nickname,
                      account_number: beneficiary.account_number,
                      account_name: beneficiary.account_name,
                      bank_id: beneficiary.bank_id,
                      bank_name: beneficiary.bank_name,
                      bank_code: beneficiary.bank_code
                    });
                    setIsAddDialogOpen(true);
                  }}
                  onDelete={handleDelete}
                  showQuickTransfer
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BeneficiaryCard({ 
  beneficiary, 
  onEdit, 
  onDelete, 
  showQuickTransfer 
}: { 
  beneficiary: Beneficiary; 
  onEdit: () => void; 
  onDelete: (id: string) => void;
  showQuickTransfer?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
      <div className="flex-1">
        <h4 className="font-semibold">{beneficiary.nickname}</h4>
        <p className="text-sm text-muted-foreground">{beneficiary.account_name}</p>
        <p className="text-sm text-muted-foreground">
          {beneficiary.bank_name} • {beneficiary.account_number}
        </p>
        {beneficiary.transfer_count > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {beneficiary.transfer_count} transfer{beneficiary.transfer_count > 1 ? 's' : ''}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        {showQuickTransfer && (
          <Button size="sm" variant="default">
            <Send className="h-4 w-4 mr-1" />
            Send
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Beneficiary</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {beneficiary.nickname}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(beneficiary.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
