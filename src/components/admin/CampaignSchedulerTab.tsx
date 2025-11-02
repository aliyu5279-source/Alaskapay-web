import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, List, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import CampaignList from './CampaignList';
import CampaignCalendar from './CampaignCalendar';
import CampaignCreator from './CampaignCreator';
import CampaignDetails from './CampaignDetails';

export default function CampaignSchedulerTab() {
  const [view, setView] = useState<'list' | 'calendar' | 'create' | 'details'>('list');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('manage-campaigns', {
      body: { action: 'list' }
    });
    if (!error && data?.campaigns) {
      setCampaigns(data.campaigns);
    }
    setLoading(false);
  };

  const handleViewDetails = (campaign: any) => {
    setSelectedCampaign(campaign);
    setView('details');
  };

  const handleBack = () => {
    setView('list');
    setSelectedCampaign(null);
    loadCampaigns();
  };

  if (view === 'create') {
    return <CampaignCreator onBack={handleBack} onSuccess={handleBack} />;
  }

  if (view === 'details' && selectedCampaign) {
    return <CampaignDetails campaign={selectedCampaign} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Email Campaigns</h2>
          <p className="text-muted-foreground">Schedule and manage bulk email campaigns</p>
        </div>
        <Button onClick={() => setView('create')}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
        <TabsList>
          <TabsTrigger value="list">
            <List className="w-4 h-4 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <CampaignList 
            campaigns={campaigns} 
            loading={loading}
            onViewDetails={handleViewDetails}
            onRefresh={loadCampaigns}
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <CampaignCalendar 
            campaigns={campaigns}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
