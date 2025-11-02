import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Bank {
  id: string;
  bank_name: string;
  bank_code: string;
  nibss_code: string;
  is_active: boolean;
  supports_transfers: boolean;
  supports_verification: boolean;
}

export function BankManagementTab() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [formData, setFormData] = useState({
    bank_name: '',
    bank_code: '',
    nibss_code: '',
    is_active: true,
    supports_transfers: true,
    supports_verification: true
  });

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    try {
      const { data, error } = await supabase
        .from('nigerian_banks')
        .select('*')
        .order('bank_name');
      
      if (error) throw error;
      setBanks(data || []);
    } catch (error: any) {
      toast.error('Failed to load banks');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingBank) {
        const { error } = await supabase
          .from('nigerian_banks')
          .update(formData)
          .eq('id', editingBank.id);
        if (error) throw error;
        toast.success('Bank updated successfully');
      } else {
        const { error } = await supabase
          .from('nigerian_banks')
          .insert([formData]);
        if (error) throw error;
        toast.success('Bank added successfully');
      }
      setShowDialog(false);
      loadBanks();
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bank?')) return;
    try {
      const { error } = await supabase
        .from('nigerian_banks')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Bank deleted');
      loadBanks();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      bank_name: '',
      bank_code: '',
      nibss_code: '',
      is_active: true,
      supports_transfers: true,
      supports_verification: true
    });
    setEditingBank(null);
  };

  const openEditDialog = (bank: Bank) => {
    setEditingBank(bank);
    setFormData({
      bank_name: bank.bank_name,
      bank_code: bank.bank_code,
      nibss_code: bank.nibss_code,
      is_active: bank.is_active,
      supports_transfers: bank.supports_transfers,
      supports_verification: bank.supports_verification
    });
    setShowDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Nigerian Banks</h2>
          <p className="text-muted-foreground">Manage supported banks and payment providers</p>
        </div>
        <Button onClick={() => { resetForm(); setShowDialog(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Bank
        </Button>
      </div>

      <div className="grid gap-4">
        {banks.map((bank) => (
          <Card key={bank.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">{bank.bank_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Code: {bank.bank_code} | NIBSS: {bank.nibss_code}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={bank.is_active ? 'default' : 'secondary'}>
                  {bank.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(bank)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(bank.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBank ? 'Edit Bank' : 'Add Bank'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Bank Name</Label>
              <Input value={formData.bank_name} onChange={(e) => setFormData({...formData, bank_name: e.target.value})} />
            </div>
            <div>
              <Label>Bank Code</Label>
              <Input value={formData.bank_code} onChange={(e) => setFormData({...formData, bank_code: e.target.value})} />
            </div>
            <div>
              <Label>NIBSS Code</Label>
              <Input value={formData.nibss_code} onChange={(e) => setFormData({...formData, nibss_code: e.target.value})} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({...formData, is_active: checked})} />
              <Label>Active</Label>
            </div>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
