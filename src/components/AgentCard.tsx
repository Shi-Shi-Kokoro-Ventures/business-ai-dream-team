
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles, Zap, Star, Activity } from 'lucide-react';

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
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-0 bg-gradient-to-br from-white via-gray-50 to-white" onClick={onClick}>
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-15 transition-all duration-500`} />
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-60`} />
      
      <div className="relative p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-xl text-gray-900">{name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-xs text-yellow-600 font-medium">Elite</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">{role}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Activity className="w-5 h-5 text-green-500" />
            <span className="text-xs text-green-600 font-medium">Active</span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 leading-relaxed text-sm">{description}</p>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {capabilities.slice(0, 4).map((capability, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              {capability}
            </Badge>
          ))}
          {capabilities.length > 4 && (
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
              +{capabilities.length - 4} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-gray-600 font-medium">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-gray-600 font-medium">Autonomous</span>
          </div>
        </div>
        
        <Button className={`w-full bg-gradient-to-r ${color} text-white border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 font-medium`}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Connect & Collaborate
        </Button>
      </div>
    </Card>
  );
};

export default AgentCard;
