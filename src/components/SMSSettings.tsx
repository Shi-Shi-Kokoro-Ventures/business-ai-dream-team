
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, Bell, Save, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SMSSettingsProps {
  onSettingsSaved?: (settings: any) => void;
}

const SMSSettings = ({ onSettingsSaved }: SMSSettingsProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [notificationTypes, setNotificationTypes] = useState<string[]>([
    'task_completion',
    'urgent_messages',
    'document_analysis'
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const notificationOptions = [
    { id: 'task_completion', label: 'Task Completions', description: 'When agents complete important tasks' },
    { id: 'urgent_messages', label: 'Urgent Messages', description: 'Critical alerts requiring immediate attention' },
    { id: 'document_analysis', label: 'Document Analysis', description: 'When document processing is complete' },
    { id: 'financial_alerts', label: 'Financial Alerts', description: 'Budget and financial model updates' },
    { id: 'security_alerts', label: 'Security Alerts', description: 'Security-related notifications' },
    { id: 'collaboration_requests', label: 'Collaboration Requests', description: 'When agents need your input' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('sms_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading SMS settings:', error);
        return;
      }

      if (data) {
        setPhoneNumber(data.phone_number);
        setEnabled(data.enabled);
        setNotificationTypes(data.notification_types || []);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to receive SMS notifications.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('sms_settings')
        .upsert({
          user_id: user.id,
          phone_number: phoneNumber,
          enabled,
          notification_types: notificationTypes,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);

      toast({
        title: "Settings Saved",
        description: "Your SMS notification preferences have been updated."
      });

      onSettingsSaved?.(data);

    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Save Failed",
        description: `Failed to save settings: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotificationType = (type: string) => {
    setNotificationTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <Phone className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">SMS Notifications</h3>
          <p className="text-sm text-gray-600">Configure real-time text message alerts from your AI agents</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Phone Number Input */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="(555) 123-4567"
            maxLength={14}
            className="font-mono"
          />
          <p className="text-xs text-gray-500">Enter your US phone number to receive SMS notifications</p>
        </div>

        {/* Enable/Disable SMS */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <div>
              <Label htmlFor="sms-enabled">Enable SMS Notifications</Label>
              <p className="text-xs text-gray-500">Receive text messages from your AI agents</p>
            </div>
          </div>
          <Switch
            id="sms-enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        {/* Notification Types */}
        {enabled && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-500" />
              <Label>Notification Types</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {notificationOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    notificationTypes.includes(option.id)
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleNotificationType(option.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Label className="cursor-pointer">{option.label}</Label>
                    {notificationTypes.includes(option.id) && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Enabled</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          className="w-full"
          onClick={saveSettings}
          disabled={isLoading || isSaved}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : isSaved ? (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Saved
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </span>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default SMSSettings;
