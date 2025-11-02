import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Save, X, Plus } from 'lucide-react';

interface TemplateEditorProps {
  template: any;
  onSave: () => void;
  onCancel: () => void;
}

export function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [subject, setSubject] = useState(template?.subject || '');
  const [htmlContent, setHtmlContent] = useState(template?.html_content || '');
  const [textContent, setTextContent] = useState(template?.text_content || '');
  const [category, setCategory] = useState(template?.category || 'general');
  const [status, setStatus] = useState(template?.status || 'draft');
  const [variables, setVariables] = useState<string[]>(template?.variables || []);
  const [newVariable, setNewVariable] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleAddVariable = () => {
    if (newVariable && !variables.includes(newVariable)) {
      setVariables([...variables, newVariable]);
      setNewVariable('');
    }
  };

  const handleRemoveVariable = (variable: string) => {
    setVariables(variables.filter(v => v !== variable));
  };

  const handleSave = async () => {
    if (!name || !subject || !htmlContent) {
      toast({
        title: 'Validation Error',
        description: 'Name, subject, and HTML content are required',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const action = template ? 'update' : 'create';
      const { error } = await supabase.functions.invoke('manage-email-templates', {
        body: {
          action,
          template: {
            id: template?.id,
            name,
            description,
            subject,
            html_content: htmlContent,
            text_content: textContent,
            variables,
            category,
            status
          }
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Template ${action === 'create' ? 'created' : 'updated'} successfully`
      });
      onSave();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{template ? 'Edit Template' : 'New Template'}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Welcome Email" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Sent to new users after signup" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newVariable}
                onChange={(e) => setNewVariable(e.target.value)}
                placeholder="user_name"
                onKeyPress={(e) => e.key === 'Enter' && handleAddVariable()}
              />
              <Button onClick={handleAddVariable}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {variables.map((variable) => (
                <Badge key={variable} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveVariable(variable)}>
                  {`{{${variable}}}`} ×
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Welcome to Alaska Pay, {{user_name}}!" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HTML Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="<html><body><h1>Welcome {{user_name}}</h1></body></html>"
              rows={15}
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plain Text Content (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Welcome {{user_name}}!"
              rows={8}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
