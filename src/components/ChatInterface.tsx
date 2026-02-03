
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Send, Brain, Sparkles, Zap, Bot, MessageSquare,
  Activity, FileText, Phone, PanelRight, PanelRightClose,
  Copy, Download, Trash2, CheckCircle
} from 'lucide-react';
import { Agent } from '@/types/agent';
import { realAiService } from '@/services/realAiService';
import { agentCommunication } from '@/services/agentCommunication';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ChatDocumentsPanel from './ChatDocumentsPanel';
import SMSSettings from './SMSSettings';

interface ChatInterfaceProps {
  agent: Agent;
  onBack: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type?: 'thinking' | 'normal';
}

const ChatInterface = ({ agent, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('documents');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Send initial greeting when chat opens
    const sendInitialGreeting = async () => {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        const greeting = await realAiService.processMessage(agent.id, "Hello! I'm ready to assist you. How can I help you today?");

        const initialMessage: Message = {
          id: Date.now().toString(),
          content: greeting,
          sender: 'agent',
          timestamp: new Date()
        };

        setMessages([initialMessage]);
      } catch (error) {
        console.error('Error getting initial greeting:', error);
        const fallbackMessage: Message = {
          id: Date.now().toString(),
          content: `Hello! I'm ${agent.name}, your ${agent.role}. I'm ready to assist you with my expertise in ${agent.capabilities.slice(0, 3).join(', ')}. How can I help you today?`,
          sender: 'agent',
          timestamp: new Date()
        };
        setMessages([fallbackMessage]);
      }

      setIsTyping(false);
    };

    sendInitialGreeting();
  }, [agent.id, agent.name, agent.role, agent.capabilities]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const thinkingTime = Math.random() * 2000 + 1000;
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    try {
      const response = await realAiService.processMessage(agent.id, userMessage.content, {
        previousMessages: messages.slice(-5),
        agentCapabilities: agent.capabilities,
        userContext: 'chat_interface'
      });

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'agent',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);

      if (response.toLowerCase().includes('urgent') ||
          response.toLowerCase().includes('critical') ||
          response.toLowerCase().includes('important')) {
        sendSMSNotification(response);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing some technical difficulties with my AI processing. Please try again in a moment, or let me help you with a more basic response.",
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);
    inputRef.current?.focus();
  };

  const sendSMSNotification = async (message: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: settings } = await supabase
        .from('sms_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!settings) return;

      const smsContent = `${agent.name}: ${message.substring(0, 120)}${message.length > 120 ? '...' : ''}`;

      await supabase.functions.invoke('send-sms', {
        body: {
          agentId: agent.id,
          phoneNumber: settings.phone_number,
          message: smsContent,
          userId: user.id
        }
      });

      toast({
        title: "SMS Notification Sent",
        description: `Important update sent to your phone`,
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (msg: Message) => {
    navigator.clipboard.writeText(msg.content);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copied to clipboard" });
  };

  const exportConversation = () => {
    const text = messages.map(m => `[${m.timestamp.toLocaleString()}] ${m.sender === 'user' ? 'You' : agent.name}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${agent.name.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Conversation exported" });
  };

  const clearConversation = () => {
    setMessages([]);
    toast({ title: "Conversation cleared" });
  };

  const personality = realAiService.getAgentPersonality(agent.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${agent.color} text-white shadow-lg`}>
            {agent.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{agent.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{agent.role}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700">
              <Activity className="w-3 h-3 mr-1" />
              AI Active
            </Badge>
            <Badge className="bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700">
              <Brain className="w-3 h-3 mr-1" />
              GPT-4 Powered
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={exportConversation}
              className="hidden md:flex dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              title="Export conversation"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearConversation}
              className="hidden md:flex dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={sidebarOpen ? "secondary" : "outline"}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {sidebarOpen ? (
                <PanelRightClose className="w-4 h-4 mr-2" />
              ) : (
                <PanelRight className="w-4 h-4 mr-2" />
              )}
              {sidebarOpen ? 'Hide' : 'Show'} Sidebar
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          <div className={`flex-1 ${sidebarOpen ? 'max-w-[65%]' : 'w-full'}`}>
            {/* Agent Personality Card */}
            {personality && (
              <Card className="mb-6 p-4 bg-gradient-to-r from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-gray-700/90 border-0 shadow-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real AI Personality Profile</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Personality:</strong> {personality.personality}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Communication Style:</strong> {personality.communicationStyle}</p>
                    <div className="flex flex-wrap gap-1">
                      {personality.expertise.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Chat Messages */}
            <Card className="mb-6 h-[calc(100vh-300px)] overflow-hidden border-0 shadow-lg dark:bg-gray-800/80 dark:backdrop-blur-sm">
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
                    >
                      <div className="relative">
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                              : `bg-gradient-to-r ${agent.color} text-white`
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.sender === 'agent' && (
                              <Bot className="w-4 h-4 mt-1 opacity-80 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                              <p className="text-xs opacity-75 mt-2">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Copy button on hover */}
                        <button
                          onClick={() => copyMessage(message)}
                          className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
                          title="Copy message"
                        >
                          {copiedId === message.id ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-300" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className={`bg-gradient-to-r ${agent.color} text-white rounded-2xl p-4`}>
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 animate-pulse" />
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm opacity-80">AI Processing...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white/50 dark:bg-gray-800/50">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={`Chat with ${agent.name}...`}
                      className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 transition-all duration-200"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className={`bg-gradient-to-r ${agent.color} hover:opacity-90 shadow-md transition-all duration-200`}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Zap className="w-3 h-3" />
                    <span>Powered by Real AI - OpenAI GPT-4 - Dynamic Personality Engine</span>
                    <span className="ml-auto">{messages.length} messages</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Agent Capabilities */}
            <Card className="p-4 border-0 shadow-lg dark:bg-gray-800/80">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Real AI Capabilities & Intelligence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {agent.capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{capability}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          {sidebarOpen && (
            <div className="w-[35%] min-w-[300px]">
              <Card className="p-4 border-0 shadow-lg dark:bg-gray-800/80">
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <TabsList className="w-full mb-4 dark:bg-gray-700">
                    <TabsTrigger value="documents" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Documents
                    </TabsTrigger>
                    <TabsTrigger value="sms" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      SMS Settings
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="documents">
                    <ChatDocumentsPanel agentId={agent.id} />
                  </TabsContent>
                  <TabsContent value="sms">
                    <SMSSettings />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
