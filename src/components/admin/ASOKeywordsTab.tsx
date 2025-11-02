import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, TrendingUp, TrendingDown, Minus, Search } from 'lucide-react';
import { asoService } from '@/lib/asoService';
import { toast } from 'sonner';

export function ASOKeywordsTab({ onUpdate }: { onUpdate: () => void }) {
  const [keywords, setKeywords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    platform: 'both',
    search_volume: 0,
    difficulty_score: 50,
    relevance_score: 50,
    is_primary: false
  });

  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = async () => {
    try {
      const data = await asoService.getKeywords();
      setKeywords(data);
    } catch (error) {
      console.error('Error loading keywords:', error);
    }
  };

  const handleAddKeyword = async () => {
    try {
      await asoService.trackKeyword(newKeyword);
      toast.success('Keyword added successfully');
      setShowAddDialog(false);
      setNewKeyword({ keyword: '', platform: 'both', search_volume: 0, difficulty_score: 50, relevance_score: 50, is_primary: false });
      loadKeywords();
      onUpdate();
    } catch (error) {
      toast.error('Failed to add keyword');
    }
  };

  const getRankChange = (current?: number, previous?: number) => {
    if (!current || !previous) return null;
    const change = previous - current;
    if (change > 0) return <Badge variant="default" className="bg-green-500"><TrendingUp className="h-3 w-3 mr-1" />{change}</Badge>;
    if (change < 0) return <Badge variant="destructive"><TrendingDown className="h-3 w-3 mr-1" />{Math.abs(change)}</Badge>;
    return <Badge variant="secondary"><Minus className="h-3 w-3" /></Badge>;
  };

  const filteredKeywords = keywords.filter(k => 
    k.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Keyword Rankings</CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Keyword</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Track New Keyword</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Keyword</Label>
                    <Input value={newKeyword.keyword} onChange={(e) => setNewKeyword({...newKeyword, keyword: e.target.value})} placeholder="digital wallet" />
                  </div>
                  <div>
                    <Label>Platform</Label>
                    <Select value={newKeyword.platform} onValueChange={(v) => setNewKeyword({...newKeyword, platform: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ios">iOS</SelectItem>
                        <SelectItem value="android">Android</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Search Volume</Label>
                      <Input type="number" value={newKeyword.search_volume} onChange={(e) => setNewKeyword({...newKeyword, search_volume: parseInt(e.target.value)})} />
                    </div>
                    <div>
                      <Label>Relevance (1-100)</Label>
                      <Input type="number" value={newKeyword.relevance_score} onChange={(e) => setNewKeyword({...newKeyword, relevance_score: parseInt(e.target.value)})} />
                    </div>
                  </div>
                  <Button onClick={handleAddKeyword} className="w-full">Add Keyword</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search keywords..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Current Rank</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Search Volume</TableHead>
                <TableHead>Relevance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeywords.map((keyword) => (
                <TableRow key={keyword.id}>
                  <TableCell className="font-medium">{keyword.keyword} {keyword.is_primary && <Badge variant="secondary" className="ml-2">Primary</Badge>}</TableCell>
                  <TableCell><Badge variant="outline">{keyword.platform}</Badge></TableCell>
                  <TableCell>{keyword.current_rank || 'Not ranked'}</TableCell>
                  <TableCell>{getRankChange(keyword.current_rank, keyword.previous_rank)}</TableCell>
                  <TableCell>{keyword.search_volume.toLocaleString()}</TableCell>
                  <TableCell>{keyword.relevance_score}/100</TableCell>
                  <TableCell>{keyword.tracking_enabled ? <Badge variant="default">Tracking</Badge> : <Badge variant="secondary">Paused</Badge>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
