import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GripVertical, X, Settings } from 'lucide-react';
import { useState } from 'react';
import { SectionConfig } from './SectionConfig';
import { CommentThread } from './CommentThread';

interface ReportSectionProps {
  section: any;
  onUpdate: (id: string, updates: any) => void;
  onRemove: (id: string) => void;
  reportId: string | null;
}


export function ReportSection({ section, onUpdate, onRemove, reportId }: ReportSectionProps) {

  const [showConfig, setShowConfig] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-4 mb-4">
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <Input
          value={section.title}
          onChange={(e) => onUpdate(section.id, { title: e.target.value })}
          className="flex-1"
          placeholder="Section Title"
        />

        <Select value={section.type} onValueChange={(type) => onUpdate(section.id, { type })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric Card</SelectItem>
            <SelectItem value="line-chart">Line Chart</SelectItem>
            <SelectItem value="bar-chart">Bar Chart</SelectItem>
            <SelectItem value="pie-chart">Pie Chart</SelectItem>
            <SelectItem value="table">Data Table</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={() => setShowConfig(!showConfig)}>
          <Settings className="w-4 h-4" />
        </Button>

        {reportId && <CommentThread reportId={reportId} sectionId={section.id} />}

        <Button variant="ghost" size="icon" onClick={() => onRemove(section.id)}>
          <X className="w-4 h-4" />
        </Button>

      </div>

      {showConfig && (
        <div className="mt-4 pt-4 border-t">
          <SectionConfig section={section} onUpdate={onUpdate} />
        </div>
      )}
    </Card>
  );
}
