
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Phone, Send, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SMSTestingTool = () => {
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('executive-eva');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const { toast } = useToast();

  const agents = [
    { id: 'executive-eva', name: 'Executive Eva', color: 'purple' },
    { id: 'strategy', name: 'Alex Strategy', color: 'blue' },
    { id: 'marketing', name: 'Maya Creative', color: 'pink' },
    { id: 'finance', name: 'Felix Finance', color: 'green' },
    { id: 'operations', name: 'Oliver Operations', color: 'indigo' },
    { id: 'customer', name: 'Clara Customer', color: 'orange' },
  ];

  const exampleMessages = [
    "Schedule a team meeting for next week",
    "Analyze our quarterly sales data",
    "Create a marketing campaign for our new product",
    "Review the budget for Q1",
    "URGENT: Need legal advice on contract",
    "Generate a financial report"
  ];

  const handleSendTestSMS = async () => {
    if (!testPhoneNumber.trim() || !testMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and message",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to test SMS functionality",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          agentId: selectedAgent,
          phoneNumber: testPhoneNumber,
          message: testMessage,
          userId: user.id
        }
      });

      if (error) throw error;

      setLastResponse(data);
      toast({
        title: "SMS Sent Successfully",
        description: `Message sent via ${agents.find(a => a.id === selectedAgent)?.name}`,
      });

      // Clear form
      setTestMessage('');

    } catch (error) {
      console.error('SMS test error:', error);
      toast({
        title: "SMS Test Failed",
        description: error.message || "Failed to send test SMS",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setTestPhoneNumber(formatted);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">SMS Testing Tool</h3>
          <p className="text-sm text-gray-600">Test SMS functionality without using your phone</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Agent Selection */}
        <div className="space-y-2">
          <Label>Select Agent</Label>
          <div className="flex flex-wrap gap-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  selectedAgent === agent.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {agent.name}
              </button>
            ))}
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="test-phone">Test Phone Number</Label>
          <Input
            id="test-phone"
            type="tel"
            value={testPhoneNumber}
            onChange={handlePhoneChange}
            placeholder="(555) 123-4567"
            maxLength={14}
            className="font-mono"
          />
          <p className="text-xs text-gray-500">Enter the phone number to send test SMS to</p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="test-message">Test Message</Label>
          <Textarea
            id="test-message"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Type your test message here..."
            rows={3}
            maxLength={320}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {testMessage.length}/320 characters
            </p>
            <Badge variant="secondary" className="text-xs">
              {testMessage.length > 160 ? '2 SMS' : '1 SMS'}
            </Badge>
          </div>
        </div>

        {/* Example Messages */}
        <div className="space-y-2">
          <Label>Quick Examples</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exampleMessages.map((example, index) => (
              <button
                key={index}
                onClick={() => setTestMessage(example)}
                className="p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded border transition"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendTestSMS}
          disabled={isLoading || !testPhoneNumber.trim() || !testMessage.trim()}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Test SMS
            </span>
          )}
        </Button>

        {/* Last Response */}
        {lastResponse && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              {lastResponse.success ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span className="font-medium text-sm">
                {lastResponse.success ? 'Success' : 'Failed'}
              </span>
              <Badge className={lastResponse.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {lastResponse.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{lastResponse.message}</p>
            {lastResponse.result && (
              <pre className="text-xs mt-2 p-2 bg-white rounded border overflow-x-auto">
                {JSON.stringify(lastResponse.result, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SMSTestingTool;
