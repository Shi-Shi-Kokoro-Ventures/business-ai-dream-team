
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Brain, Send, CheckCircle, AlertCircle, Loader2, 
  MessageSquare, Bot, Zap, Activity 
} from 'lucide-react';
import { realAiService } from '@/services/realAiService';
import { useToast } from '@/hooks/use-toast';

interface TestMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentId: string;
  agentName: string;
  processingTime?: number;
}

interface TestResult {
  agentId: string;
  agentName: string;
  status: 'pending' | 'success' | 'error';
  responseTime: number;
  response?: string;
  error?: string;
}

const AISystemTest = () => {
  const [testMessages, setTestMessages] = useState<TestMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('executive-eva');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const agents = [
    { id: 'executive-eva', name: 'Executive Eva', color: 'from-purple-500 to-pink-500' },
    { id: 'strategy', name: 'Alex Strategy', color: 'from-blue-500 to-indigo-500' },
    { id: 'marketing', name: 'Maya Creative', color: 'from-green-500 to-teal-500' },
    { id: 'finance', name: 'Felix Finance', color: 'from-yellow-500 to-orange-500' },
    { id: 'operations', name: 'Oliver Operations', color: 'from-red-500 to-pink-500' },
    { id: 'customer', name: 'Clara Customer', color: 'from-indigo-500 to-purple-500' }
  ];

  const testPrompts = [
    "Hello! Please introduce yourself and tell me about your capabilities.",
    "What's the most important strategic initiative our company should focus on this quarter?",
    "How can we improve our customer satisfaction metrics?",
    "What are the key financial risks we should be monitoring?",
    "Help me create a marketing campaign for a new product launch.",
    "How can we optimize our operational processes?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [testMessages]);

  const runSingleAgentTest = async (agentId: string, prompt: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const startTime = Date.now();
    
    setTestResults(prev => [...prev, {
      agentId,
      agentName: agent.name,
      status: 'pending',
      responseTime: 0
    }]);

    try {
      console.log(`Testing AI conversation with ${agent.name}...`);
      
      const response = await realAiService.processMessage(agentId, prompt, {
        testMode: true,
        timestamp: new Date().toISOString()
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.log(`✅ ${agent.name} responded in ${responseTime}ms:`, response);

      setTestResults(prev => prev.map(result => 
        result.agentId === agentId ? {
          ...result,
          status: 'success',
          responseTime,
          response
        } : result
      ));

      return { success: true, response, responseTime };
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.error(`❌ ${agent.name} test failed:`, error);

      setTestResults(prev => prev.map(result => 
        result.agentId === agentId ? {
          ...result,
          status: 'error',
          responseTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        } : result
      ));

      return { success: false, error, responseTime };
    }
  };

  const runFullSystemTest = async () => {
    setTestResults([]);
    setTestMessages([]);
    setIsProcessing(true);

    toast({
      title: "AI System Test Started",
      description: "Testing all agents with real AI conversations...",
    });

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      const prompt = testPrompts[i] || testPrompts[0];
      
      await runSingleAgentTest(agent.id, prompt);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsProcessing(false);
    
    const successCount = testResults.filter(r => r.status === 'success').length;
    
    toast({
      title: "AI System Test Complete",
      description: `${successCount}/${agents.length} agents responded successfully`,
      variant: successCount === agents.length ? "default" : "destructive"
    });
  };

  const sendTestMessage = async () => {
    if (!currentInput.trim() || isProcessing) return;

    const agent = agents.find(a => a.id === selectedAgent);
    if (!agent) return;

    const userMessage: TestMessage = {
      id: Date.now().toString(),
      content: currentInput,
      sender: 'user',
      timestamp: new Date(),
      agentId: selectedAgent,
      agentName: agent.name
    };

    setTestMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsProcessing(true);

    try {
      const startTime = Date.now();
      const response = await realAiService.processMessage(selectedAgent, currentInput);
      const endTime = Date.now();
      const processingTime = endTime - startTime;

      const agentMessage: TestMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'agent',
        timestamp: new Date(),
        agentId: selectedAgent,
        agentName: agent.name,
        processingTime
      };

      setTestMessages(prev => [...prev, agentMessage]);

      toast({
        title: "AI Response Received",
        description: `${agent.name} responded in ${processingTime}ms`,
      });
    } catch (error) {
      console.error('AI conversation test failed:', error);
      toast({
        title: "AI Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    }

    setIsProcessing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTestMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI System Test</h1>
              <p className="text-gray-600">Real-time testing of AI agent conversations</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={runFullSystemTest} disabled={isProcessing} className="bg-gradient-to-r from-purple-500 to-pink-500">
              {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
              Run Full System Test
            </Button>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Activity className="w-3 h-3 mr-1" />
              Real AI Testing
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interactive Chat Test */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Interactive AI Chat Test
            </h2>

            {/* Agent Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Agent:</label>
              <select 
                value={selectedAgent} 
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
              {testMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-900 shadow-sm border'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'agent' && <Bot className="w-4 h-4 mt-1 opacity-60" />}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs opacity-75">
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          {message.processingTime && (
                            <span>• {message.processingTime}ms</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white rounded-2xl p-3 shadow-sm border">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-600">AI Processing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message to test AI conversation..."
                disabled={isProcessing}
                className="flex-1"
              />
              <Button 
                onClick={sendTestMessage} 
                disabled={!currentInput.trim() || isProcessing}
                className="bg-gradient-to-r from-blue-500 to-indigo-500"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Test Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              System Test Results
            </h2>

            <div className="space-y-3">
              {testResults.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No test results yet. Run the full system test to see AI responses.
                </p>
              ) : (
                testResults.map((result) => (
                  <div key={result.agentId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.agentName}</span>
                        {result.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {result.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                        {result.status === 'pending' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                      </div>
                      <Badge 
                        variant={result.status === 'success' ? 'default' : result.status === 'error' ? 'destructive' : 'secondary'}
                      >
                        {result.responseTime}ms
                      </Badge>
                    </div>
                    
                    {result.response && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {result.response.substring(0, 150)}...
                      </p>
                    )}
                    
                    {result.error && (
                      <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        Error: {result.error}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Quick Test Prompts */}
            <div className="mt-6">
              <h3 className="font-medium mb-3">Quick Test Prompts:</h3>
              <div className="space-y-2">
                {testPrompts.slice(0, 3).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentInput(prompt)}
                    className="w-full text-left text-sm p-2 bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AISystemTest;
