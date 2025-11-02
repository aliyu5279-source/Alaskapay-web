import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Zap, TrendingUp, AlertCircle } from 'lucide-react';

export function RateLimitsSection() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-yellow-600" />
          <h3 className="text-xl font-semibold">Rate Limits</h3>
        </div>
        <p className="text-gray-600 mb-6">
          API requests are rate-limited to ensure fair usage and system stability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Test Mode</span>
              <Badge variant="outline">Free</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">100</p>
            <p className="text-sm text-gray-600">requests/minute</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Standard</span>
              <Badge>Live</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">1,000</p>
            <p className="text-sm text-gray-600">requests/minute</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Enterprise</span>
              <Badge className="bg-purple-600">Pro</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">10,000</p>
            <p className="text-sm text-gray-600">requests/minute</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-semibold">Current Usage</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Requests this minute</span>
              <span className="text-sm font-medium">47 / 1,000</span>
            </div>
            <Progress value={4.7} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Daily quota</span>
              <span className="text-sm font-medium">12,450 / 100,000</span>
            </div>
            <Progress value={12.45} className="h-2" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <h3 className="text-xl font-semibold">Rate Limit Headers</h3>
        </div>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm space-y-1">
          <div><span className="text-blue-400">X-RateLimit-Limit:</span> 1000</div>
          <div><span className="text-blue-400">X-RateLimit-Remaining:</span> 953</div>
          <div><span className="text-blue-400">X-RateLimit-Reset:</span> 1640995200</div>
        </div>
      </Card>

      <Card className="p-6 border-orange-200 bg-orange-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600 mt-1" />
          <div>
            <h4 className="font-semibold text-orange-900 mb-2">Rate Limit Exceeded</h4>
            <p className="text-sm text-orange-800 mb-2">
              When rate limit is exceeded, you'll receive a 429 status code with retry information.
            </p>
            <code className="text-xs bg-orange-100 px-2 py-1 rounded">Retry-After: 60</code>
          </div>
        </div>
      </Card>
    </div>
  );
}
