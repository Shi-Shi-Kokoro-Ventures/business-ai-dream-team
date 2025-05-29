
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles } from 'lucide-react';

interface AgentCardProps {
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const AgentCard = ({ name, role, description, capabilities, icon, color, onClick }: AgentCardProps) => {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50" onClick={onClick}>
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className="relative p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl text-gray-900 mb-1">{name}</h3>
            <p className="text-sm text-gray-600 font-medium">{role}</p>
          </div>
          <Sparkles className="w-5 h-5 text-yellow-500 opacity-70" />
        </div>
        
        <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {capabilities.map((capability, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
              {capability}
            </Badge>
          ))}
        </div>
        
        <Button className={`w-full bg-gradient-to-r ${color} text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Start Conversation
        </Button>
      </div>
    </Card>
  );
};

export default AgentCard;
