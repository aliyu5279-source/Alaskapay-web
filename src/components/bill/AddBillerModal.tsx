import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function AddBillerModal({ open, onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [payees, setPayees] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPayee, setSelectedPayee] = useState('');
  const [nickname, setNickname] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) loadCategories();
  }, [open]);

  useEffect(() => {
    if (selectedCategory) loadPayees(selectedCategory);
  }, [selectedCategory]);

  const loadCategories = async () => {
    const { data } = await supabase.functions.invoke('manage-bill-payees', {
      body: { action: 'getCategories' }
    });
    setCategories(data?.categories || []);
  };

  const loadPayees = async (categoryId) => {
    const { data } = await supabase.functions.invoke('manage-bill-payees', {
      body: { action: 'getPayees', categoryId }
    });
    setPayees(data?.payees || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('manage-saved-billers', {
        body: {
          action: 'add',
          data: {
            payee_id: selectedPayee,
            nickname,
            account_number: accountNumber
          }
        }
      });
      if (error) throw error;
      toast.success('Biller added successfully');
      onSuccess();
      onClose();
      setNickname('');
      setAccountNumber('');
      setSelectedCategory('');
      setSelectedPayee('');
    } catch (error) {
      toast.error('Failed to add biller');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Biller</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Biller</Label>
            <Select value={selectedPayee} onValueChange={setSelectedPayee} disabled={!selectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select biller" />
              </SelectTrigger>
              <SelectContent>
                {payees.map((payee) => (
                  <SelectItem key={payee.id} value={payee.id}>{payee.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Nickname</Label>
            <Input value={nickname} onChange={(e) => setNickname(e.target.value)} required />
          </div>
          <div>
            <Label>Account Number</Label>
            <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Biller'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}