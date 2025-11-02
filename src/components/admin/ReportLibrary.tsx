import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calendar, BookTemplate } from 'lucide-react';
import { CustomReportBuilder } from './CustomReportBuilder';
import { ScheduledReportsModal } from './ScheduledReportsModal';
import { ScheduledExportsManager } from './ScheduledExportsManager';
import { ExportTemplateLibrary } from './ExportTemplateLibrary';

export function ReportLibrary() {
  const [showScheduledReports, setShowScheduledReports] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Report Library</h2>
          <p className="text-muted-foreground">Create, schedule, and manage your reports</p>
        </div>
        <Button onClick={() => setShowScheduledReports(true)}>
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="builder">
            <FileText className="w-4 h-4 mr-2" />
            Report Builder
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Calendar className="w-4 h-4 mr-2" />
            Scheduled Exports
          </TabsTrigger>
          <TabsTrigger value="templates">
            <BookTemplate className="w-4 h-4 mr-2" />
            Export Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-6">
          <CustomReportBuilder />
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <ScheduledExportsManager />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <ExportTemplateLibrary />
        </TabsContent>
      </Tabs>

      <ScheduledReportsModal
        open={showScheduledReports}
        onOpenChange={setShowScheduledReports}
      />
    </div>
  );
}