import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Search, Plus } from 'lucide-react';
import { CreateTicketModal } from './CreateTicketModal';
import { TicketDetailModal } from './TicketDetailModal';

const statusColors: any = {
  open: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  waiting_customer: 'bg-orange-500',
  resolved: 'bg-green-500',
  closed: 'bg-gray-500'
};

const priorityColors: any = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
};

export function TicketList() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, statusFilter]);

  const loadTickets = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('support_tickets')
      .select('*, support_categories(name, icon, color)')
      .order('created_at', { ascending: false });
    
    if (data) {
      setTickets(data);
    }
    setLoading(false);
  };

  const filterTickets = () => {
    let filtered = [...tickets];
    
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.ticket_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    
    setFilteredTickets(filtered);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <div className="space-y-3">
        {filteredTickets.map(ticket => (
          <Card key={ticket.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTicket(ticket)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-sm text-gray-600">{ticket.ticket_number}</span>
                  <Badge className={statusColors[ticket.status]}>{ticket.status.replace('_', ' ')}</Badge>
                  <Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                </div>
                <h3 className="font-semibold mb-1">{ticket.subject}</h3>
                <p className="text-sm text-gray-600">{ticket.support_categories?.name}</p>
              </div>
              <span className="text-sm text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</span>
            </div>
          </Card>
        ))}
      </div>

      <CreateTicketModal open={showCreateModal} onOpenChange={setShowCreateModal} onTicketCreated={loadTickets} />
      {selectedTicket && <TicketDetailModal ticket={selectedTicket} open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)} onUpdate={loadTickets} />}
    </div>
  );
}