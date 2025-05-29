
import React, { useState } from 'react';
import { Search, Users, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentContactCard } from './AgentContactCard';

const agents = [
  {
    id: 'executive-eva',
    name: 'Executive Eva',
    role: 'Executive Assistant',
    description: 'Your primary executive assistant who coordinates all business operations, manages permissions, and oversees the entire AI team.',
    avatar: '/placeholder.svg',
    status: 'online' as const,
    specialties: ['Team Coordination', 'Executive Support', 'Permission Management', 'Strategic Oversight'],
    responseTime: 'Instant',
    lastSeen: 'Now'
  },
  {
    id: 'strategy',
    name: 'Alex Strategy',
    role: 'Strategy Director',
    description: 'Strategic business advisor focused on growth, competitive analysis, and long-term planning.',
    avatar: '/placeholder.svg',
    status: 'online' as const,
    specialties: ['Strategic Planning', 'Market Analysis', 'Competitive Intelligence', 'Growth Strategy'],
    responseTime: '< 2 minutes',
    lastSeen: '5 minutes ago'
  },
  {
    id: 'marketing',
    name: 'Maya Creative',
    role: 'Marketing Director',
    description: 'Creative marketing expert specializing in campaigns, brand strategy, and customer engagement.',
    avatar: '/placeholder.svg',
    status: 'busy' as const,
    specialties: ['Campaign Development', 'Brand Strategy', 'Content Creation', 'Social Media'],
    responseTime: '< 5 minutes',
    lastSeen: '1 hour ago'
  },
  {
    id: 'finance',
    name: 'Felix Finance',
    role: 'Finance Director',
    description: 'Precise financial advisor focused on budget optimization, financial analysis, and risk management.',
    avatar: '/placeholder.svg',
    status: 'online' as const,
    specialties: ['Financial Analysis', 'Budget Management', 'Risk Assessment', 'Investment Planning'],
    responseTime: '< 3 minutes',
    lastSeen: 'Now'
  },
  {
    id: 'operations',
    name: 'Oliver Operations',
    role: 'Operations Manager',
    description: 'Systematic operations manager who streamlines processes and improves efficiency.',
    avatar: '/placeholder.svg',
    status: 'away' as const,
    specialties: ['Process Optimization', 'Workflow Management', 'Efficiency Analysis', 'System Integration'],
    responseTime: '< 10 minutes',
    lastSeen: '30 minutes ago'
  },
  {
    id: 'customer',
    name: 'Clara Customer',
    role: 'Customer Success',
    description: 'Empathetic customer experience specialist focused on relationships and satisfaction.',
    avatar: '/placeholder.svg',
    status: 'online' as const,
    specialties: ['Customer Relations', 'Experience Design', 'Support Management', 'Satisfaction Analysis'],
    responseTime: '< 2 minutes',
    lastSeen: 'Now'
  }
];

export const AgentContactsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const favoriteAgents = agents.filter(agent => 
    ['executive-eva', 'strategy', 'finance', 'marketing'].includes(agent.id)
  );

  const onlineAgents = agents.filter(agent => agent.status === 'online');

  const handleMessage = (agentId: string) => {
    console.log(`Opening message thread with ${agentId}`);
    // Implementation for opening message interface
  };

  const handleCall = (agentId: string) => {
    console.log(`Initiating call with ${agentId}`);
    // Implementation for voice call
  };

  const handleVideoCall = (agentId: string) => {
    console.log(`Initiating video call with ${agentId}`);
    // Implementation for video call
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Team Contacts</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-100 border-0 rounded-xl"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="w-full bg-white border-b border-gray-200 rounded-none h-12">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            All ({agents.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Favorites ({favoriteAgents.length})
          </TabsTrigger>
          <TabsTrigger value="online" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Online ({onlineAgents.length})
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <AgentContactCard
                  key={agent.id}
                  agent={agent}
                  onMessage={handleMessage}
                  onCall={handleCall}
                  onVideoCall={handleVideoCall}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteAgents.map((agent) => (
                <AgentContactCard
                  key={agent.id}
                  agent={agent}
                  onMessage={handleMessage}
                  onCall={handleCall}
                  onVideoCall={handleVideoCall}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="online" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {onlineAgents.map((agent) => (
                <AgentContactCard
                  key={agent.id}
                  agent={agent}
                  onMessage={handleMessage}
                  onCall={handleCall}
                  onVideoCall={handleVideoCall}
                />
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
