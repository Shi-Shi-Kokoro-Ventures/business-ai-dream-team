
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, RefreshCw, Settings } from 'lucide-react';
import { configService } from '@/services/configService';
import { useToast } from '@/hooks/use-toast';

interface ApiConfig {
  googleClassroom: boolean;
  trello: boolean;
  openai: boolean;
  twilio: boolean;
  email: boolean;
}

export const SystemStatus: React.FC = () => {
  const [config, setConfig] = useState<ApiConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkConfiguration = async () => {
    setLoading(true);
    try {
      const apiConfig = await configService.checkApiConfiguration();
      setConfig(apiConfig);
    } catch (error) {
      toast({
        title: "Configuration Check Failed",
        description: "Unable to verify API configurations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConfiguration();
  }, []);

  const getStatusBadge = (isConfigured: boolean) => {
    return (
      <Badge variant={isConfigured ? "default" : "destructive"} className="ml-2">
        {isConfigured ? (
          <><CheckCircle className="w-3 h-3 mr-1" /> Ready</>
        ) : (
          <><AlertCircle className="w-3 h-3 mr-1" /> Not Configured</>
        )}
      </Badge>
    );
  };

  const apiServices = [
    { name: 'Google Classroom', key: 'googleClassroom' as keyof ApiConfig, description: 'Course and assignment management' },
    { name: 'Trello', key: 'trello' as keyof ApiConfig, description: 'Project and task tracking' },
    { name: 'OpenAI', key: 'openai' as keyof ApiConfig, description: 'AI-powered agent communication' },
    { name: 'Twilio', key: 'twilio' as keyof ApiConfig, description: 'SMS notifications and communication' },
    { name: 'Email Service', key: 'email' as keyof ApiConfig, description: 'Email notifications and communication' }
  ];

  const configuredCount = config ? Object.values(config).filter(Boolean).length : 0;
  const totalServices = apiServices.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Configuration Status</span>
          <Button
            variant="outline"
            size="sm"
            onClick={checkConfiguration}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {configuredCount} of {totalServices} services configured
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apiServices.map((service) => (
            <div key={service.key} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium flex items-center">
                  {service.name}
                  {config && getStatusBadge(config[service.key])}
                </div>
                <div className="text-sm text-muted-foreground">{service.description}</div>
              </div>
            </div>
          ))}
        </div>
        
        {config && configuredCount < totalServices && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <Settings className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-yellow-800">Configuration Required</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Some services need to be configured with API keys. Please add the required secrets in your Supabase project settings.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {config && configuredCount === totalServices && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-green-800">All Systems Ready</h4>
                <p className="text-sm text-green-700 mt-1">
                  All API services are properly configured and ready for production use.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
