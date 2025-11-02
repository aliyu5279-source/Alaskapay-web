import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Star, TrendingUp, Download } from 'lucide-react';
import { asoService } from '@/lib/asoService';
import { toast } from 'sonner';

export function ASOCompetitorsTab() {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({
    app_name: '',
    app_id: '',
    platform: 'ios'
  });

  useEffect(() => {
    loadCompetitors();
  }, []);

  const loadCompetitors = async () => {
    try {
      const data = await asoService.getCompetitors();
      setCompetitors(data);
    } catch (error) {
      console.error('Error loading competitors:', error);
    }
  };

  const handleAddCompetitor = async () => {
    try {
      await asoService.getCompetitors();
      toast.success('Competitor added successfully');
      setShowAddDialog(false);
      setNewCompetitor({ app_name: '', app_id: '', platform: 'ios' });
      loadCompetitors();
    } catch (error) {
      toast.error('Failed to add competitor');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Competitor Analysis</CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Competitor</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Track Competitor App</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>App Name</Label>
                    <Input value={newCompetitor.app_name} onChange={(e) => setNewCompetitor({...newCompetitor, app_name: e.target.value})} placeholder="Competitor App" />
                  </div>
                  <div>
                    <Label>App ID / Bundle ID</Label>
                    <Input value={newCompetitor.app_id} onChange={(e) => setNewCompetitor({...newCompetitor, app_id: e.target.value})} placeholder="com.example.app" />
                  </div>
                  <div>
                    <Label>Platform</Label>
                    <Select value={newCompetitor.platform} onValueChange={(v) => setNewCompetitor({...newCompetitor, platform: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ios">iOS App Store</SelectItem>
                        <SelectItem value="android">Google Play Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddCompetitor} className="w-full">Add Competitor</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>App Name</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Est. Downloads</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitors.map((comp) => (
                <TableRow key={comp.id}>
                  <TableCell className="font-medium">{comp.app_name}</TableCell>
                  <TableCell><Badge variant="outline">{comp.platform}</Badge></TableCell>
                  <TableCell>{comp.current_rank ? `#${comp.current_rank}` : 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {comp.rating?.toFixed(1) || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>{comp.review_count?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      {comp.download_estimate?.toLocaleString() || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>{comp.last_updated ? new Date(comp.last_updated).toLocaleDateString() : 'N/A'}</TableCell>
                </TableRow>
              ))}
              {competitors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">No competitors tracked yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
