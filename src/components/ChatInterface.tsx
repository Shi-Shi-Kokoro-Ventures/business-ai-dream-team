
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Send, Brain, Sparkles, Zap, Bot, MessageSquare,
  Activity, FileText, Phone, PanelRight, PanelRightClose,
  Copy, Download, Trash2, CheckCircle, Loader2, ChevronDown,
  ChevronRight, Target, GitBranch, Package, AlertCircle
} from 'lucide-react';
import { Agent } from '@/types/agent';
import { realAiService } from '@/services/realAiService';
import { agentBrain, ThoughtStep, AgentPlan, Deliverable } from '@/services/agentBrain';
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
  type?: 'thinking' | 'normal' | 'deliverable';
  thoughts?: ThoughtStep[];
  plan?: AgentPlan;
  deliverables?: Deliverable[];
}

const ThinkingPanel = ({ thoughts, plan }: { thoughts: ThoughtStep[]; plan?: AgentPlan }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-gray-900/90 dark:bg-gray-950/90 backdrop-blur-sm rounded-xl p-3 mb-2 border border-gray-700/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left mb-2"
      >
        {expanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
        <Brain className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-xs font-semibold text-gray-300">Agent Reasoning</span>
        <span className="text-[10px] text-gray-500 ml-auto">{thoughts.length} steps</span>
      </button>

      {expanded && (
        <div className="space-y-1.5 ml-4">
          {thoughts.map((step) => (
            <div key={step.id} className="flex items-start gap-2">
              <div className="mt-1.5 flex-shrink-0">
                {step.status === 'thinking' ? (
                  <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                ) : step.status === 'complete' ? (
                  <CheckCircle className="w-3 h-3 text-green-400" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${
                    step.type === 'analysis' ? 'text-blue-400' :
                    step.type === 'planning' ? 'text-purple-400' :
                    step.type === 'execution' ? 'text-green-400' :
                    step.type === 'delegation' ? 'text-yellow-400' :
                    step.type === 'synthesis' ? 'text-cyan-400' :
                    'text-gray-400'
                  }`}>{step.type}</span>
                  {step.duration != null && (
                    <span className="text-[10px] text-gray-500">{(step.duration / 1000).toFixed(1)}s</span>
                  )}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{step.content}</p>
                {step.result && (
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">{step.result}</p>
                )}
              </div>
            </div>
          ))}

          {plan && (
            <div className="mt-2 pt-2 border-t border-gray-700/50">
              <div className="flex items-center gap-1.5 mb-1">
                <GitBranch className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">Execution Plan</span>
              </div>
              <div className="space-y-1">
                {plan.steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2 text-[11px]">
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                    ) : step.status === 'running' ? (
                      <Loader2 className="w-3 h-3 text-blue-400 animate-spin flex-shrink-0" />
                    ) : step.status === 'failed' ? (
                      <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-gray-600 flex-shrink-0" />
                    )}
                    <span className={step.status === 'completed' ? 'text-gray-400' : step.status === 'running' ? 'text-blue-300' : 'text-gray-500'}>
                      {step.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DeliverableCard = ({ deliverable }: { deliverable: Deliverable }) => {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  const downloadDeliverable = () => {
    const blob = new Blob([deliverable.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deliverable.title.replace(/[^a-z0-9]/gi, '-').substring(0, 50)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Deliverable downloaded" });
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/30 dark:to-cyan-900/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700/50 my-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">{deliverable.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Badge className="bg-emerald-100 dark:bg-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-[10px] border-emerald-200 dark:border-emerald-700">
            {deliverable.type}
          </Badge>
          <Button size="sm" variant="ghost" onClick={downloadDeliverable} className="h-6 w-6 p-0">
            <Download className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </Button>
        </div>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 flex items-center gap-1"
      >
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        {expanded ? 'Collapse' : 'View deliverable'}
      </button>
      {expanded && (
        <div className="mt-3 bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto font-mono">
          {deliverable.content}
        </div>
      )}
    </div>
  );
};

const ChatInterface = ({ agent, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('documents');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [liveThoughts, setLiveThoughts] = useState<ThoughtStep[]>([]);
  const [livePlan, setLivePlan] = useState<AgentPlan | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, liveThoughts]);

  // Subscribe to real-time agent thoughts
  useEffect(() => {
    const unsubscribe = agentBrain.subscribe((thought) => {
      if (thought.agentId === agent.id) {
        setLiveThoughts([...thought.thoughts]);
        setLivePlan(thought.plan);
      }
    });
    return unsubscribe;
  }, [agent.id]);

  useEffect(() => {
    const sendInitialGreeting = async () => {
      setIsTyping(true);
      try {
        const greeting = await realAiService.processMessage(agent.id, "Hello! I'm ready to assist you. How can I help you today?");
        setMessages([{
          id: Date.now().toString(),
          content: greeting,
          sender: 'agent',
          timestamp: new Date()
        }]);
      } catch {
        setMessages([{
          id: Date.now().toString(),
          content: `Hello! I'm ${agent.name}, your ${agent.role}. I'm fully operational with real AI reasoning capabilities. I can analyze problems, create plans, execute tasks, and produce deliverables. How can I help you today?`,
          sender: 'agent',
          timestamp: new Date()
        }]);
      }
      setIsTyping(false);
    };
    sendInitialGreeting();
  }, [agent.id, agent.name, agent.role, agent.capabilities]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userInput = inputValue.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setLiveThoughts([]);
    setLivePlan(undefined);

    try {
      // Use the AgentBrain for real reasoning and task execution
      const result = await agentBrain.processRequest(agent.id, userInput, {
        previousMessages: messages.slice(-5),
      });

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.response,
        sender: 'agent',
        timestamp: new Date(),
        type: 'normal',
        thoughts: result.thoughts,
        plan: result.plan,
        deliverables: result.deliverables
      };

      setMessages(prev => [...prev, agentMessage]);
      setLiveThoughts([]);
      setLivePlan(undefined);

      if (result.response.toLowerCase().includes('urgent') ||
          result.response.toLowerCase().includes('critical')) {
        sendSMSNotification(result.response);
      }
    } catch (error) {
      console.error('Error in agent processing:', error);

      // Fallback: use realAiService directly
      try {
        const fallback = await realAiService.processMessage(agent.id, userInput, {
          previousMessages: messages.slice(-5),
          agentCapabilities: agent.capabilities,
          userContext: 'chat_interface'
        });
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: fallback,
          sender: 'agent',
          timestamp: new Date()
        }]);
      } catch {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: `I understand your request. Let me work on this.\n\nMy reasoning pipeline hit an issue, but I can still help. Try asking me something specific about ${agent.capabilities.slice(0, 3).join(', ')}.`,
          sender: 'agent',
          timestamp: new Date()
        }]);
      }
    }

    setIsTyping(false);
    inputRef.current?.focus();
  };

  const sendSMSNotification = async (message: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: settings } = await supabase.from('sms_settings').select('*').eq('user_id', user.id).single();
      if (!settings) return;
      await supabase.functions.invoke('send-sms', {
        body: { agentId: agent.id, phoneNumber: settings.phone_number, message: `${agent.name}: ${message.substring(0, 120)}`, userId: user.id }
      });
      toast({ title: "SMS Notification Sent", description: "Important update sent to your phone" });
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const copyMessage = (msg: Message) => {
    navigator.clipboard.writeText(msg.content);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copied to clipboard" });
  };

  const exportConversation = () => {
    const text = messages.map(m => {
      let entry = `[${m.timestamp.toLocaleString()}] ${m.sender === 'user' ? 'You' : agent.name}: ${m.content}`;
      if (m.deliverables && m.deliverables.length > 0) {
        entry += '\n\n--- DELIVERABLES ---\n';
        m.deliverables.forEach(d => { entry += `\n[${d.type}] ${d.title}\n${d.content}\n`; });
      }
      return entry;
    }).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${agent.name.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Conversation exported" });
  };

  const clearConversation = () => { setMessages([]); toast({ title: "Conversation cleared" }); };

  const personality = realAiService.getAgentPersonality(agent.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <Button onClick={onBack} variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${agent.color} text-white shadow-lg`}>{agent.icon}</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{agent.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{agent.role}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700">
              <Activity className="w-3 h-3 mr-1" />AI Active
            </Badge>
            <Badge className="bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700">
              <Brain className="w-3 h-3 mr-1" />Reasoning Engine
            </Badge>
            <Button size="sm" variant="outline" onClick={exportConversation} className="hidden md:flex dark:border-gray-600 dark:text-gray-300" title="Export"><Download className="w-4 h-4" /></Button>
            <Button size="sm" variant="outline" onClick={clearConversation} className="hidden md:flex dark:border-gray-600 dark:text-gray-300" title="Clear"><Trash2 className="w-4 h-4" /></Button>
            <Button size="sm" variant={sidebarOpen ? "secondary" : "outline"} onClick={() => setSidebarOpen(!sidebarOpen)} className="dark:border-gray-600 dark:text-gray-300">
              {sidebarOpen ? <PanelRightClose className="w-4 h-4 mr-2" /> : <PanelRight className="w-4 h-4 mr-2" />}
              <span className="hidden sm:inline">{sidebarOpen ? 'Hide' : 'Show'} Panel</span>
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          <div className={`flex-1 min-w-0 ${sidebarOpen ? 'max-w-[65%]' : 'w-full'}`}>
            {personality && (
              <Card className="mb-4 p-4 bg-gradient-to-r from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-gray-700/90 border-0 shadow-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Personality Profile</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1"><strong>Style:</strong> {personality.communicationStyle}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {personality.expertise.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Chat Messages */}
            <Card className="mb-4 h-[calc(100vh-320px)] overflow-hidden border-0 shadow-lg dark:bg-gray-800/80">
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {message.sender === 'agent' && message.thoughts && message.thoughts.length > 0 && (
                        <div className="mb-2 ml-6">
                          <ThinkingPanel thoughts={message.thoughts} plan={message.plan} />
                        </div>
                      )}

                      <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}>
                        <div className="relative max-w-[85%]">
                          <div className={`rounded-2xl p-4 ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                              : 'bg-white dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 shadow-sm'
                          }`}>
                            <div className="flex items-start gap-2">
                              {message.sender === 'agent' && (
                                <Bot className="w-4 h-4 mt-1 text-purple-500 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                <p className={`text-xs mt-2 ${message.sender === 'user' ? 'opacity-75' : 'text-gray-400 dark:text-gray-500'}`}>
                                  {message.timestamp.toLocaleTimeString()}
                                  {message.thoughts && message.thoughts.length > 0 && (
                                    <span className="ml-2">
                                      <Brain className="w-3 h-3 inline mr-0.5" />
                                      {message.thoughts.length} reasoning steps
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => copyMessage(message)}
                            className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white dark:bg-gray-700 rounded-lg shadow-md"
                            title="Copy"
                          >
                            {copiedId === message.id ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-300" />}
                          </button>
                        </div>
                      </div>

                      {message.deliverables && message.deliverables.length > 0 && (
                        <div className="ml-6 mt-2">
                          {message.deliverables.map(d => <DeliverableCard key={d.id} deliverable={d} />)}
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div>
                      {liveThoughts.length > 0 && (
                        <div className="mb-2 ml-6">
                          <ThinkingPanel thoughts={liveThoughts} plan={livePlan} />
                        </div>
                      )}
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-500 animate-pulse" />
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {liveThoughts.length > 0 ? liveThoughts[liveThoughts.length - 1].content : 'Thinking...'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white/50 dark:bg-gray-800/50">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={`Ask ${agent.name} to analyze, plan, or execute a task...`}
                      className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 transition-all"
                      disabled={isTyping}
                    />
                    <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 shadow-md">
                      {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Brain className="w-3 h-3 text-purple-400" />
                    <span>AI Reasoning Engine - Analyzes, Plans, Executes, Delivers</span>
                    <span className="ml-auto">{messages.length} messages</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-0 shadow-lg dark:bg-gray-800/80">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-500" />
                What this agent can do
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {agent.capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Sparkles className="w-3 h-3 text-purple-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{capability}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {sidebarOpen && (
            <div className="w-[35%] min-w-[280px]">
              <Card className="p-4 border-0 shadow-lg dark:bg-gray-800/80">
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <TabsList className="w-full mb-4 dark:bg-gray-700">
                    <TabsTrigger value="documents" className="flex-1"><FileText className="w-4 h-4 mr-2" />Docs</TabsTrigger>
                    <TabsTrigger value="sms" className="flex-1"><Phone className="w-4 h-4 mr-2" />SMS</TabsTrigger>
                  </TabsList>
                  <TabsContent value="documents"><ChatDocumentsPanel agentId={agent.id} /></TabsContent>
                  <TabsContent value="sms"><SMSSettings /></TabsContent>
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
