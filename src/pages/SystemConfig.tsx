
import React from 'react';
import { SystemStatus } from '@/components/SystemStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Key, Database, Shield } from 'lucide-react';

const SystemConfig = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Configuration</h1>
        <p className="text-muted-foreground">
          Manage your system settings and API configurations for production readiness.
        </p>
      </div>

      <div className="grid gap-6">
        <SystemStatus />
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                API Keys & Secrets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure API keys for external services in your Supabase project settings.
              </p>
              <div className="space-y-2 text-sm">
                <div>• GOOGLE_API_KEY - For Google Classroom integration</div>
                <div>• GOOGLE_ACCESS_TOKEN - Google OAuth token</div>
                <div>• TRELLO_API_KEY - For Trello board management</div>
                <div>• TRELLO_TOKEN - Trello authorization token</div>
                <div>• OPENAI_API_KEY - For AI agent capabilities</div>
                <div>• TWILIO_* - For SMS communications</div>
              </div>
              <Button className="mt-4" variant="outline" asChild>
                <a 
                  href="https://supabase.com/dashboard/project/cowjsrngyhpofjvbwsov/settings/functions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Configure Secrets
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Database & Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Review and configure your database tables and Row Level Security policies.
              </p>
              <div className="space-y-2 text-sm">
                <div>• Documents table - File storage and management</div>
                <div>• SMS Messages - Communication tracking</div>
                <div>• SMS Settings - User preferences</div>
                <div>• Authentication - User management</div>
              </div>
              <Button className="mt-4" variant="outline" asChild>
                <a 
                  href="https://supabase.com/dashboard/project/cowjsrngyhpofjvbwsov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Database Dashboard
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Authentication & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure authentication providers and security settings.
              </p>
              <div className="space-y-2 text-sm">
                <div>• Enable email/password authentication</div>
                <div>• Configure redirect URLs</div>
                <div>• Set up Row Level Security</div>
                <div>• Configure CORS settings</div>
              </div>
              <Button className="mt-4" variant="outline" asChild>
                <a 
                  href="https://supabase.com/dashboard/project/cowjsrngyhpofjvbwsov/auth/providers" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Auth Settings
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Production Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="api-keys" className="rounded" />
                  <label htmlFor="api-keys" className="text-sm">Configure all required API keys</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auth" className="rounded" />
                  <label htmlFor="auth" className="text-sm">Set up user authentication</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="rls" className="rounded" />
                  <label htmlFor="rls" className="text-sm">Configure Row Level Security</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="domain" className="rounded" />
                  <label htmlFor="domain" className="text-sm">Set up custom domain</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="monitoring" className="rounded" />
                  <label htmlFor="monitoring" className="text-sm">Enable monitoring & logging</label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;
