import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Trash2, CheckCircle, Star } from 'lucide-react';
import { getLinkedBankAccounts } from '@/services/bankService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { LinkedBankAccount } from '@/services/bankService';

interface LinkedBanksManagerProps {
  onAddNew: () => void;
}

export function LinkedBanksManager({ onAddNew }: LinkedBanksManagerProps) {
  const [accounts, setAccounts] = useState<LinkedBankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    const data = await getLinkedBankAccounts();
    setAccounts(data);
    setLoading(false);
  };

  const setPrimary = async (id: string) => {
    const { error } = await supabase
      .from('linked_bank_accounts')
      .update({ is_primary: false })
      .neq('id', id);

    await supabase
      .from('linked_bank_accounts')
      .update({ is_primary: true })
      .eq('id', id);

    if (!error) {
      toast.success('Primary account updated');
      loadAccounts();
    }
  };

  const removeAccount = async (id: string) => {
    const { error } = await supabase
      .from('linked_bank_accounts')
      .delete()
      .eq('id', id);

    if (!error) {
      toast.success('Account removed');
      loadAccounts();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Linked Bank Accounts</h3>
        <Button onClick={onAddNew} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <Card className="p-8 text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No linked accounts yet</p>
          <Button onClick={onAddNew}>Link Your First Account</Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {accounts.map((account) => (
            <Card key={account.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold">{account.bank_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {account.account_number} • {account.account_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {account.is_primary ? (
                    <Badge><Star className="h-3 w-3 mr-1" /> Primary</Badge>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setPrimary(account.id)}>
                      Set Primary
                    </Button>
                  )}
                  {account.is_verified && (
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => removeAccount(account.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
