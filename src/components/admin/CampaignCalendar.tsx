import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';

interface CampaignCalendarProps {
  campaigns: any[];
  onViewDetails: (campaign: any) => void;
}

export default function CampaignCalendar({ campaigns, onViewDetails }: CampaignCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getCampaignsForDay = (day: Date) => {
    return campaigns.filter(campaign => 
      campaign.scheduled_at && isSameDay(new Date(campaign.scheduled_at), day)
    );
  };

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-sm p-2">
            {day}
          </div>
        ))}
        
        {daysInMonth.map(day => {
          const dayCampaigns = getCampaignsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          
          return (
            <div
              key={day.toISOString()}
              className={`min-h-24 p-2 border rounded-lg ${
                isCurrentMonth ? 'bg-background' : 'bg-muted/50'
              }`}
            >
              <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
              <div className="space-y-1">
                {dayCampaigns.map(campaign => (
                  <div
                    key={campaign.id}
                    onClick={() => onViewDetails(campaign)}
                    className="text-xs p-1 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer truncate"
                  >
                    {campaign.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
