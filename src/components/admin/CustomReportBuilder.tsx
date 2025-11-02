import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Save, Eye, Palette, Users, History, FileDown, Library, BarChart3, Undo2, Redo2, Zap, Activity, Calendar } from 'lucide-react';

import { ReportSection } from './ReportSection';
import { SectionPalette } from './SectionPalette';
import { BrandingConfig } from './BrandingConfig';
import { ReportPreview } from './ReportPreview';
import { CommentExportModal } from './CommentExportModal';
import { ReportLibrary } from './ReportLibrary';
import { ImportHistoryView } from './ImportHistoryView';
import { ChartConfigPanel } from './ChartConfigPanel';
import { CollaboratorPresence } from './CollaboratorPresence';
import { LiveCursor } from './LiveCursor';
import { BatchHistoryPanel } from './BatchHistoryPanel';
import { ScheduledExportsManager } from './ScheduledExportsManager';

import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useReportCollaboration } from '@/hooks/useReportCollaboration';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
export function CustomReportBuilder() {
  const [showLibrary, setShowLibrary] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState<any[]>([]);
  const [chartConfig, setChartConfig] = useState<any[]>([]);
  const [branding, setBranding] = useState({ primary_color: '#3b82f6', secondary_color: '#8b5cf6', logo_url: '' });
  const [showPalette, setShowPalette] = useState(false);
  const [showBranding, setShowBranding] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showCommentExport, setShowCommentExport] = useState(false);
  const [showBatchHistory, setShowBatchHistory] = useState(false);
  const [showScheduledExports, setShowScheduledExports] = useState(false);


  const [templates, setTemplates] = useState<any[]>([]);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  
  const { collaborators, broadcastEdit, broadcastCursor, updatePresence, liveEdits, createTextOperation, localVersion } = useReportCollaboration(currentReportId);
  
  // Undo/Redo system with batching
  const { 
    pushOperation, 
    trackRemoteOperation, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    flushBatch,
    isBatching,
    pendingOperationCount,
    timeRemaining,
    batchDelay,
    batchHistory
  } = useUndoRedo();

  const fieldStates = useRef<Map<string, string>>(new Map());

  // Handle manual batch flush
  const handleFlushBatch = useCallback(() => {
    flushBatch();
    toast.success('Batch flushed - undo point created');
  }, [flushBatch]);


  // Track remote operations for undo/redo transformation
  useEffect(() => {
    liveEdits.forEach(edit => {
      if (edit.operation) {
        trackRemoteOperation(edit.field, edit.operation);
      }
    });
  }, [liveEdits, trackRemoteOperation]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo]);

  // Track mouse movement for live cursors
  useEffect(() => {
    if (!currentReportId) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      broadcastCursor(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [currentReportId, broadcastCursor]);

  const handleUndo = useCallback(() => {
    const getCurrentText = (field: string) => {
      if (field === 'name') return name;
      if (field === 'description') return description;
      return fieldStates.current.get(field) || '';
    };

    const result = undo(getCurrentText);
    if (result) {
      if (result.field === 'name') setName(result.value);
      else if (result.field === 'description') setDescription(result.value);
      else fieldStates.current.set(result.field, result.value);
      
      broadcastEdit(result.field, result.value, result.operation);
      toast.success('Undo successful');
    }
  }, [undo, name, description, broadcastEdit]);

  const handleRedo = useCallback(() => {
    const getCurrentText = (field: string) => {
      if (field === 'name') return name;
      if (field === 'description') return description;
      return fieldStates.current.get(field) || '';
    };

    const result = redo(getCurrentText);
    if (result) {
      if (result.field === 'name') setName(result.value);
      else if (result.field === 'description') setDescription(result.value);
      else fieldStates.current.set(result.field, result.value);
      
      broadcastEdit(result.field, result.value, result.operation);
      toast.success('Redo successful');
    }
  }, [redo, name, description, broadcastEdit]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const oldValue = name;
    const newValue = e.target.value;
    const operation = createTextOperation(oldValue, newValue, e.target.selectionStart || 0);
    
    if (operation) {
      pushOperation(operation, 'name', oldValue, localVersion);
      broadcastEdit('name', newValue, operation);
    }
    
    setName(newValue);
  }, [name, createTextOperation, pushOperation, broadcastEdit, localVersion]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const oldValue = description;
    const newValue = e.target.value;
    const operation = createTextOperation(oldValue, newValue, e.target.selectionStart || 0);
    
    if (operation) {
      pushOperation(operation, 'description', oldValue, localVersion);
      broadcastEdit('description', newValue, operation);
    }
    
    setDescription(newValue);
  }, [description, createTextOperation, pushOperation, broadcastEdit, localVersion]);






  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const { data } = await supabase.from('custom_report_templates').select('*').order('created_at', { ascending: false });
    if (data) setTemplates(data);
  };


  const addSection = (type: string) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type,
      title: `New ${type} Section`,
      config: {},
    };
    setSections([...sections, newSection]);
    setShowPalette(false);
  };

  const updateSection = (id: string, updates: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const saveTemplate = async () => {
    const { data, error } = await supabase.from('custom_report_templates').insert({
      name, description, template_type: 'custom', branding, sections, chart_config: chartConfig
    }).select().single();
    if (error) toast.error('Failed to save template');
    else { 
      toast.success('Template saved!'); 
      loadTemplates(); 
      if (data) {
        setCurrentReportId(data.id);
        await saveVersion(data.id, 'Initial version');
      }
    }
  };


  const saveVersion = async (reportId: string, versionDescription: string) => {
    const { data: versions } = await supabase.from('report_versions').select('version_number').eq('report_id', reportId).order('version_number', { ascending: false }).limit(1);
    const nextVersion = versions && versions.length > 0 ? versions[0].version_number + 1 : 1;
    await supabase.from('report_versions').insert({
      report_id: reportId,
      version_number: nextVersion,
      name: `Version ${nextVersion}`,
      description: versionDescription,
      configuration: { sections },
      branding
    });
  };

  const loadVersions = async () => {
    if (!currentReportId) return;
    const { data } = await supabase.from('report_versions').select('*').eq('report_id', currentReportId).order('version_number', { ascending: false });
    if (data) setVersions(data);
  };

  const restoreVersion = async (version: any) => {
    setSections(version.configuration.sections);
    setBranding(version.branding || branding);
    toast.success(`Restored to ${version.name}`);
    setShowVersions(false);
  };

  const handleEditReport = (report: any) => {
    setName(report.name);
    setDescription(report.description);
    setSections(report.sections || []);
    setChartConfig(report.chart_config || []);
    setBranding(report.branding || { primary_color: '#3b82f6', secondary_color: '#8b5cf6', logo_url: '' });
    setCurrentReportId(report.id);
    setShowLibrary(false);
  };


  const handleNewReport = () => {
    setName('');
    setDescription('');
    setSections([]);
    setBranding({ primary_color: '#3b82f6', secondary_color: '#8b5cf6', logo_url: '' });
    setCurrentReportId(null);
    setShowLibrary(false);
  };

  if (showLibrary) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Report Library</h2>
          <Button onClick={handleNewReport}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Report
          </Button>
        </div>
        <ReportLibrary onEdit={handleEditReport} />
        <ImportHistoryView />
        <ScheduledExportsManager />
      </div>
    );
  }




  return (
    <>
      <LiveCursor collaborators={collaborators} />
      
      <div className="space-y-6">
        <CollaboratorPresence collaborators={collaborators} />
        
        <div className="flex justify-between items-center mb-4">
          <Button onClick={() => setShowLibrary(true)} variant="outline">
            <Library className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
        </div>


      <div className="flex justify-between items-center">
        <div className="flex-1 space-y-2">
          <Input placeholder="Report Name" value={name} onChange={handleNameChange} />
          <Textarea placeholder="Description" value={description} onChange={handleDescriptionChange} />
        </div>
        <div className="flex gap-2 ml-4 items-center">
          <div className="flex gap-1">
            <Button onClick={handleUndo} disabled={!canUndo} variant="outline" size="icon" title="Undo (Ctrl+Z)">
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button onClick={handleRedo} disabled={!canRedo} variant="outline" size="icon" title="Redo (Ctrl+Y)">
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Batching Indicator */}
          {isBatching && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md animate-pulse">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-amber-900 dark:text-amber-100">Batching...</span>
                <span className="text-[10px] text-amber-700 dark:text-amber-300">
                  {pendingOperationCount} ops • {(timeRemaining / 1000).toFixed(1)}s
                </span>
              </div>
              <Button 
                onClick={handleFlushBatch} 
                size="sm" 
                variant="ghost" 
                className="h-6 px-2 text-xs text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
                title="Create undo point now"
              >
                Flush
              </Button>
            </div>
          )}

          {collaborators.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
              <Users className="w-4 h-4" />
              <div className="flex -space-x-2">
                {collaborators.map((c) => (
                  <Avatar key={c.user_id} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">{c.user_email?.[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Badge variant="secondary">{collaborators.length}</Badge>
            </div>
          )}
          <Button onClick={() => setShowBatchHistory(!showBatchHistory)} variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            Batch History
          </Button>
          <Button onClick={() => setShowCharts(!showCharts)} variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Charts
          </Button>
          <Button onClick={() => setShowCommentExport(true)} variant="outline" disabled={!currentReportId}>
            <FileDown className="w-4 h-4 mr-2" />Export Comments
          </Button>
          <Button onClick={() => { loadVersions(); setShowVersions(true); }} variant="outline"><History className="w-4 h-4 mr-2" />Versions</Button>
          <Button onClick={() => setShowBranding(!showBranding)} variant="outline"><Palette className="w-4 h-4 mr-2" />Branding</Button>
          <Button onClick={() => setShowPreview(true)} variant="outline"><Eye className="w-4 h-4 mr-2" />Preview</Button>
          <Button onClick={saveTemplate}><Save className="w-4 h-4 mr-2" />Save</Button>
        </div>
      </div>

      {showBatchHistory && <BatchHistoryPanel batchHistory={batchHistory} />}

      {showBranding && <BrandingConfig branding={branding} onChange={setBranding} />}
      {showCharts && <ChartConfigPanel charts={chartConfig} onChange={setChartConfig} />}


      <div className="grid grid-cols-4 gap-6">
        <Card className="p-4 col-span-1">
          <Button onClick={() => setShowPalette(!showPalette)} className="w-full"><Plus className="w-4 h-4 mr-2" />Add Section</Button>
          {showPalette && <SectionPalette onAdd={addSection} />}
        </Card>

        <div className="col-span-3 space-y-4">
          {sections.map((section) => (
            <ReportSection key={section.id} section={section} onUpdate={updateSection} onRemove={removeSection} reportId={currentReportId} />
          ))}
        </div>
      </div>


      {showPreview && <ReportPreview sections={sections} branding={branding} onClose={() => setShowPreview(false)} />}
      
      <Dialog open={showVersions} onOpenChange={setShowVersions}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {versions.map((v) => (
              <Card key={v.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{v.name}</h4>
                    <p className="text-sm text-muted-foreground">{v.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(v.created_at).toLocaleString()}</p>
                  </div>
                  <Button onClick={() => restoreVersion(v)} size="sm">Restore</Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {showCommentExport && currentReportId && (
        <CommentExportModal
          open={showCommentExport}
          onOpenChange={setShowCommentExport}
          reportId={currentReportId}
          reportName={name || 'Untitled Report'}
        />
      )}
    </div>
    </>
  );
}
