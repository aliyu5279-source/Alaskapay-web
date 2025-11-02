import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Target, TrendingUp, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SavingsGoals: React.FC = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState([
    { id: 1, name: 'Emergency Fund', target: 500000, current: 320000, deadline: '2025-12-31', icon: '🏥' },
    { id: 2, name: 'New Laptop', target: 800000, current: 450000, deadline: '2025-06-30', icon: '💻' },
    { id: 3, name: 'Vacation', target: 300000, current: 180000, deadline: '2025-08-15', icon: '✈️' },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '', icon: '🎯' });

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target) {
      setGoals([...goals, {
        id: Date.now(),
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        current: 0,
        deadline: newGoal.deadline,
        icon: newGoal.icon
      }]);
      setNewGoal({ name: '', target: '', deadline: '', icon: '🎯' });
      setIsOpen(false);
      toast({ title: 'Goal created!', description: 'Start saving towards your new goal.' });
    }
  };

  const handleAddFunds = (goalId: number, amount: number) => {
    setGoals(goals.map(g => g.id === goalId ? { ...g, current: g.current + amount } : g));
    toast({ title: 'Funds added!', description: `₦${amount.toLocaleString()} added to your goal.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Savings Goals</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />New Goal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Goal name" value={newGoal.name} onChange={(e) => setNewGoal({...newGoal, name: e.target.value})} />
              <Input type="number" placeholder="Target amount" value={newGoal.target} onChange={(e) => setNewGoal({...newGoal, target: e.target.value})} />
              <Input type="date" value={newGoal.deadline} onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})} />
              <Button onClick={handleAddGoal} className="w-full">Create Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{goal.icon}</span>
                  {goal.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>₦{goal.current.toLocaleString()}</span>
                    <span>₦{goal.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{progress.toFixed(1)}% complete</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAddFunds(goal.id, 10000)} className="flex-1">+₦10k</Button>
                  <Button size="sm" onClick={() => handleAddFunds(goal.id, 50000)} className="flex-1">+₦50k</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsGoals;
