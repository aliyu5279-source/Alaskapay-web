import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Lock, AlertTriangle } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

export function AuthenticationGuide() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-semibold">Authentication</h3>
        </div>
        <p className="text-gray-600 mb-4">
          All API requests require authentication using API keys. Include your API key in the Authorization header.
        </p>
        <CodeBlock code={`Authorization: Bearer ak_test_your_api_key_here`} />
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-5 w-5 text-green-600" />
          <h3 className="text-xl font-semibold">API Key Types</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-1">Test</Badge>
            <div>
              <p className="font-medium">Test Keys (ak_test_...)</p>
              <p className="text-sm text-gray-600">Use in development. No real transactions.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="mt-1">Live</Badge>
            <div>
              <p className="font-medium">Live Keys (ak_live_...)</p>
              <p className="text-sm text-gray-600">Use in production. Real transactions only.</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-purple-600" />
          <h3 className="text-xl font-semibold">Security Best Practices</h3>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Store API keys securely in environment variables</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Never expose API keys in client-side code</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Rotate keys regularly and after any suspected breach</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Use HTTPS for all API requests</span>
          </li>
        </ul>
      </Card>

      <Card className="p-6 border-orange-200 bg-orange-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 mt-1" />
          <div>
            <h4 className="font-semibold text-orange-900 mb-2">Important</h4>
            <p className="text-sm text-orange-800">
              Never commit API keys to version control. Use .env files and add them to .gitignore.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
