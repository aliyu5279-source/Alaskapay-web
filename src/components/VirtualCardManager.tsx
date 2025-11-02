import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VirtualCardDisplay } from './VirtualCardDisplay';
import { CreateVirtualCardModal } from './CreateVirtualCardModal';
import { FundCardModal } from './FundCardModal';
import { CardFundingHistory } from './CardFundingHistory';
import { supabase } from '@/lib/supabase';
import { Plus, Snowflake, Play, Settings, Trash2, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function VirtualCardManager() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('virtual_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardAction = async (cardId: string, action: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-virtual-card', {
        body: { cardId, action }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Card ${action}d successfully`
      });

      loadCards();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getSpendingPercentage = (card: any) => {
    if (!card.spending_limit_daily) return 0;
    return (card.current_daily_spend / card.spending_limit_daily) * 100;
  };

  if (loading) {
    return <div className="text-center py-8">Loading cards...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Virtual Cards</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Card
        </Button>
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No virtual cards yet</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <Card key={card.id}>
              <Tabs defaultValue="card" className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>{card.card_name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      card.status === 'active' ? 'bg-green-100 text-green-800' :
                      card.status === 'frozen' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {card.status}
                    </span>
                  </CardTitle>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card">Card</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent>
                  <TabsContent value="card" className="space-y-4 mt-0">
                    <VirtualCardDisplay card={card} />
                    
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Card Balance</span>
                        <span className="text-lg font-bold">₦{parseFloat(card.balance || 0).toLocaleString()}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setSelectedCard(card);
                          setShowFundModal(true);
                        }}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Fund Card
                      </Button>
                    </div>
                    
                    {card.spending_limit_daily && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Daily Spending</span>
                          <span>₦{card.current_daily_spend.toLocaleString()} / ₦{card.spending_limit_daily.toLocaleString()}</span>
                        </div>
                        <Progress value={getSpendingPercentage(card)} />
                      </div>
                    )}

                    <div className="flex gap-2">
                      {card.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCardAction(card.id, 'freeze')}
                        >
                          <Snowflake className="mr-2 h-4 w-4" />
                          Freeze
                        </Button>
                      ) : card.status === 'frozen' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCardAction(card.id, 'unfreeze')}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Unfreeze
                        </Button>
                      ) : null}
                      
                      <Button size="sm" variant="outline">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedCard(card);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-0">
                    <CardFundingHistory cardId={card.id} />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          ))}
        </div>
      )}

      <CreateVirtualCardModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadCards}
      />

      {selectedCard && (
        <FundCardModal
          isOpen={showFundModal}
          onClose={() => {
            setShowFundModal(false);
            setSelectedCard(null);
          }}
          card={selectedCard}
          onSuccess={loadCards}
        />
      )}


      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to terminate this card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedCard) {
                  handleCardAction(selectedCard.id, 'terminate');
                  setShowDeleteDialog(false);
                }
              }}
            >
              Terminate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
