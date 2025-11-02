import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Trash2, Edit, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function SavedBillersList({ billers, onPayBill, onRefresh }) {
  const handleToggleFavorite = async (billerId, isFavorite) => {
    try {
      const { error } = await supabase.functions.invoke('manage-saved-billers', {
        body: { action: 'update', billerId, data: { is_favorite: !isFavorite } }
      });
      if (error) throw error;
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
      onRefresh();
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const handleDelete = async (billerId) => {
    if (!confirm('Are you sure you want to delete this biller?')) return;
    try {
      const { error } = await supabase.functions.invoke('manage-saved-billers', {
        body: { action: 'delete', billerId }
      });
      if (error) throw error;
      toast.success('Biller deleted');
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete biller');
    }
  };

  if (billers.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No saved billers yet. Add one to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {billers.map((biller) => (
        <Card key={biller.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{biller.nickname}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{biller.payee?.name}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToggleFavorite(biller.id, biller.is_favorite)}
              >
                <Star className={`h-4 w-4 ${biller.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Account</span>
              <span className="font-mono">***{biller.account_number.slice(-4)}</span>
            </div>
            {biller.auto_pay_enabled && (
              <Badge variant="secondary">Auto-pay ${biller.auto_pay_amount}</Badge>
            )}
            <div className="flex gap-2 pt-2">
              <Button onClick={() => onPayBill(biller)} className="flex-1">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Bill
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDelete(biller.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}