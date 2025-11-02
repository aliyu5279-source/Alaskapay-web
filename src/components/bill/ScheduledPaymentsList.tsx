import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Pause, Play } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function ScheduledPaymentsList() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-scheduled-payments', {
        body: { action: 'list' }
      });
      if (error) throw error;
      setSchedules(data.schedules || []);
    } catch (error) {
      toast.error('Failed to load scheduled payments');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (scheduleId, isActive) => {
    try {
      const { error } = await supabase.functions.invoke('manage-scheduled-payments', {
        body: { action: 'update', scheduleId, data: { is_active: !isActive } }
      });
      if (error) throw error;
      toast.success(isActive ? 'Payment paused' : 'Payment resumed');
      loadSchedules();
    } catch (error) {
      toast.error('Failed to update schedule');
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!confirm('Are you sure you want to delete this scheduled payment?')) return;
    try {
      const { error } = await supabase.functions.invoke('manage-scheduled-payments', {
        body: { action: 'delete', scheduleId }
      });
      if (error) throw error;
      toast.success('Scheduled payment deleted');
      loadSchedules();
    } catch (error) {
      toast.error('Failed to delete schedule');
    }
  };

  if (schedules.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No scheduled payments</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <Card key={schedule.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{schedule.saved_biller?.nickname}</CardTitle>
                <p className="text-sm text-muted-foreground">{schedule.saved_biller?.payee?.name}</p>
              </div>
              <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                {schedule.is_active ? 'Active' : 'Paused'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">${schedule.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frequency</span>
                <span>{schedule.frequency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next Payment</span>
                <span>{format(new Date(schedule.next_payment_date), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(schedule.id, schedule.is_active)}
                >
                  {schedule.is_active ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {schedule.is_active ? 'Pause' : 'Resume'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(schedule.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}