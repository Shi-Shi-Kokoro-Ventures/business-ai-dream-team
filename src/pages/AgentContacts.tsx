
import React, { useState } from 'react';
import { AgentContactsList } from '@/components/AgentContactsList';
import { IOSMessageInterface } from '@/components/iOSMessageInterface';

// Mock data for demonstration
const mockMessages = [
  {
    id: '1',
    content: 'Hi! How can I help you with your business today?',
    sender: 'agent' as const,
    timestamp: new Date(Date.now() - 300000),
    status: 'read' as const
  },
  {
    id: '2',
    content: 'I need to schedule a marketing meeting for tomorrow',
    sender: 'user' as const,
    timestamp: new Date(Date.now() - 240000),
    status: 'read' as const
  },
  {
    id: '3',
    content: 'Perfect! Let me check the calendar and coordinate with Maya Creative from our marketing team. What time works best for you?',
    sender: 'agent' as const,
    timestamp: new Date(Date.now() - 180000),
    status: 'read' as const
  }
];

const mockAgent = {
  id: 'executive-eva',
  name: 'Executive Eva',
  role: 'Executive Assistant',
  avatar: '/placeholder.svg',
  status: 'online' as const,
  isTyping: false
};

// Define proper message type
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export const AgentContacts: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSelectAgent = (agentId: string) => {
    console.log('Selecting agent:', agentId);
    setSelectedAgent(agentId);
    // Load messages for selected agent
  };

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand! I'm working on that right now and will coordinate with the team. I'll update you shortly.",
        sender: 'agent',
        timestamp: new Date(),
        status: 'read'
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 2000);
  };

  const handleBack = () => {
    console.log('Going back to contacts list');
    setSelectedAgent(null);
  };

  if (selectedAgent) {
    return (
      <IOSMessageInterface
        agent={mockAgent}
        messages={messages}
        onSendMessage={handleSendMessage}
        onBack={handleBack}
      />
    );
  }

  return <AgentContactsList onSelectAgent={handleSelectAgent} />;
};
