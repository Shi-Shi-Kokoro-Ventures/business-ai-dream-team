
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Bot, User, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface ChatInterfaceProps {
  agent: {
    name: string;
    role: string;
    color: string;
    icon: React.ReactNode;
  };
  onBack: () => void;
}

const ChatInterface = ({ agent, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm ${agent.name}, your ${agent.role}. I'm here to help you with your business needs. What would you like to discuss today?`,
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

    // Simulate AI response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAgentResponse(inputValue, agent.role),
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAgentResponse = (userInput: string, role: string): string => {
    const responses = {
      'Strategic Planning & Analytics Expert': [
        "Let me analyze your business metrics and provide strategic insights...",
        "Based on market trends, I recommend focusing on these key areas...",
        "Here's a comprehensive analysis of your competitive position..."
      ],
      'Marketing & Content Specialist': [
        "I can help you create compelling marketing campaigns...",
        "Let's develop a content strategy that resonates with your audience...",
        "Here are some innovative marketing ideas for your business..."
      ],
      'Financial Management Advisor': [
        "Let me review your financial data and provide recommendations...",
        "I'll help you optimize your budget and cash flow...",
        "Here's a detailed financial analysis and forecast..."
      ],
      'Operations & Productivity Manager': [
        "I can help streamline your business processes...",
        "Let's identify bottlenecks and optimization opportunities...",
        "Here are some automation solutions for your operations..."
      ],
      'Customer Relations Specialist': [
        "I'll help you enhance customer satisfaction and retention...",
        "Let's develop a comprehensive customer service strategy...",
        "Here are insights from your customer feedback analysis..."
      ],
      'HR & Team Development Coach': [
        "I can assist with team building and development strategies...",
        "Let's work on improving team productivity and morale...",
        "Here are some recommendations for talent management..."
      ]
    };

    const roleResponses = responses[role as keyof typeof responses] || [
      "I'm here to help with your business needs. How can I assist you today?"
    ];
    
    return roleResponses[Math.floor(Math.random() * roleResponses.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.color} text-white`}>
              {agent.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{agent.name}</h1>
              <p className="text-sm text-gray-600">{agent.role}</p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Sparkles className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>
        </div>

        <Card className="h-[600px] flex flex-col border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'agent' && (
                    <div className={`p-2 rounded-full bg-gradient-to-br ${agent.color} text-white shadow-md`}>
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-gray-50 text-gray-900 border border-gray-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 opacity-70 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className={`p-2 rounded-full bg-gradient-to-br ${agent.color} text-white shadow-md`}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-50 text-gray-900 border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-6 border-t bg-white/50">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
