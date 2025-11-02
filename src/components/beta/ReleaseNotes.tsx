import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Calendar, Download } from 'lucide-react';

export function ReleaseNotes() {
  const [builds, setBuilds] = useState<any[]>([]);

  useEffect(() => {
    loadBuilds();
  }, []);

  const loadBuilds = async () => {
    const { data } = await supabase
      .from('beta_builds')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setBuilds(data);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Release Notes</h2>
      {builds.map((build) => (
        <Card key={build.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Version {build.version} ({build.build_number})</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(build.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge>{build.platform}</Badge>
                <Badge variant="outline">{build.status}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">{build.release_notes}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {build.install_count || 0} installs
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
