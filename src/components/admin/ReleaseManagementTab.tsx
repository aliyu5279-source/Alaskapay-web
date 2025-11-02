import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Rocket, CheckCircle, XCircle, AlertTriangle, Play, Pause } from 'lucide-react';
import { CreateReleaseModal } from './CreateReleaseModal';
import { ReleaseApprovalModal } from './ReleaseApprovalModal';

export function ReleaseManagementTab() {
  const [releases, setReleases] = useState<any[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    loadReleases();
  }, []);

  const loadReleases = async () => {
    const { data } = await supabase
      .from('releases')
      .select('*')
      .order('created_at', { ascending: false });
    setReleases(data || []);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500',
      pending_approval: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      deploying: 'bg-blue-500',
      staged_rollout: 'bg-purple-500',
      completed: 'bg-green-600',
      rolled_back: 'bg-red-600',
      failed: 'bg-red-700'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Release Management</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          <Rocket className="w-4 h-4 mr-2" />
          Create Release
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active Releases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {releases.filter(r => ['deploying', 'staged_rollout'].includes(r.status)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {releases.filter(r => r.status === 'pending_approval').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {releases.filter(r => r.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Rolled Back</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {releases.filter(r => r.status === 'rolled_back').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Releases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {releases.map((release) => (
              <div key={release.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">v{release.version}</h3>
                      <Badge className={getStatusColor(release.status)}>
                        {release.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">{release.platform}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Build #{release.build_number} • Created {new Date(release.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {release.status === 'pending_approval' && (
                      <Button size="sm" onClick={() => {
                        setSelectedRelease(release);
                        setShowApprovalModal(true);
                      }}>
                        Review
                      </Button>
                    )}
                  </div>
                </div>

                {release.status === 'staged_rollout' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rollout Progress</span>
                      <span>{release.rollout_percentage}%</span>
                    </div>
                    <Progress value={release.rollout_percentage} />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Crash Rate: {release.crash_rate?.toFixed(2)}%</span>
                      <span>Threshold: {release.crash_threshold}%</span>
                    </div>
                  </div>
                )}

                {release.rollback_reason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900">Rollback Reason</p>
                        <p className="text-sm text-red-700">{release.rollback_reason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showCreateModal && (
        <CreateReleaseModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadReleases}
        />
      )}

      {showApprovalModal && selectedRelease && (
        <ReleaseApprovalModal
          release={selectedRelease}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedRelease(null);
          }}
          onSuccess={loadReleases}
        />
      )}
    </div>
  );
}
