
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Video, Info } from 'lucide-react';

interface AgentContactCardProps {
  agent: {
    id: string;
    name: string;
    role: string;
    description: string;
    avatar: string;
    status: 'online' | 'busy' | 'away' | 'offline';
    specialties: string[];
    lastSeen?: string;
    responseTime: string;
  };
  onMessage: (agentId: string) => void;
  onCall?: (agentId: string) => void;
  onVideoCall?: (agentId: string) => void;
}

export const AgentContactCard: React.FC<AgentContactCardProps> = ({
  agent,
  onMessage,
  onCall,
  onVideoCall
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Available';
      case 'busy': return 'In Meeting';
      case 'away': return 'Away';
      default: return 'Offline';
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-8 text-center">
          <div className="relative inline-block">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={agent.avatar} alt={agent.name} />
              <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                {agent.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div 
              className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-3 border-white ${getStatusColor(agent.status)}`}
            />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-4">{agent.name}</h2>
          <p className="text-sm text-gray-600 font-medium">{agent.role}</p>
          <Badge variant="secondary" className="mt-2 bg-white/70 text-gray-700">
            {getStatusText(agent.status)}
          </Badge>
        </div>

        {/* Info Section */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-1" />
              About
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{agent.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-1">
              {agent.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Response Time: {agent.responseTime}</p>
            {agent.lastSeen && <p>Last Active: {agent.lastSeen}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-3">
            <Button 
              onClick={() => onMessage(agent.id)}
              className="flex flex-col items-center py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              <MessageCircle className="w-5 h-5 mb-1" />
              <span className="text-xs">Message</span>
            </Button>
            
            <Button 
              onClick={() => onCall?.(agent.id)}
              variant="outline"
              className="flex flex-col items-center py-3 rounded-xl border-gray-300"
            >
              <Phone className="w-5 h-5 mb-1" />
              <span className="text-xs">Call</span>
            </Button>
            
            <Button 
              onClick={() => onVideoCall?.(agent.id)}
              variant="outline"
              className="flex flex-col items-center py-3 rounded-xl border-gray-300"
            >
              <Video className="w-5 h-5 mb-1" />
              <span className="text-xs">Video</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
