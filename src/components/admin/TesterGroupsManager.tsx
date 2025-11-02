import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Users, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function TesterGroupsManager() {
  const [groups, setGroups] = useState<any[]>([]);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    const { data } = await supabase
      .from('beta_testers')
      .select('group')
      .not('group', 'is', null);
    
    if (data) {
      const uniqueGroups = [...new Set(data.map(t => t.group))];
      const groupsWithCounts = await Promise.all(
        uniqueGroups.map(async (group) => {
          const { count } = await supabase
            .from('beta_testers')
            .select('*', { count: 'exact', head: true })
            .eq('group', group);
          return { name: group, count: count || 0 };
        })
      );
      setGroups(groupsWithCounts);
    }
  };

  const createGroup = async () => {
    if (!newGroupName) return;
    toast.success(`Group "${newGroupName}" created`);
    setNewGroupName('');
    loadGroups();
  };

  const notifyGroup = async (groupName: string) => {
    try {
      await supabase.functions.invoke('notify-beta-testers', {
        body: { group: groupName, title: 'Update Available', message: 'Check out the latest build!' }
      });
      toast.success(`Notified ${groupName}`);
    } catch (error) {
      toast.error('Failed to notify group');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Tester Groups</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-2" />New Group</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Tester Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Group name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
                <Button onClick={createGroup} className="w-full">Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {groups.map((group) => (
            <div key={group.name} className="flex justify-between items-center p-3 border rounded">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{group.name}</p>
                  <p className="text-sm text-muted-foreground">{group.count} testers</p>
                </div>
              </div>
              <Button size="sm" onClick={() => notifyGroup(group.name)}>Notify</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
