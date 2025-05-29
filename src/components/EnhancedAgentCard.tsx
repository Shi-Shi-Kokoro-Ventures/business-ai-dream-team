
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Sparkles,
  Zap,
  Star,
  Activity,
  Phone,
  Video,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EnhancedAgentCardProps {
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  responseTime?: string;
  lastActivity?: string;
  tasksCompleted?: number;
}

const EnhancedAgentCard = ({
  name,
  role,
  description,
  capabilities,
  icon,
  color,
  onClick,
  responseTime = "< 2s",
  lastActivity = "2 min ago",
  tasksCompleted = 47
}: EnhancedAgentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Quick action: ${action} for ${name}`);
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-0 bg-gradient-to-br from-white via-gray-50 to-white"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-15 transition-all duration-500`} />
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-60`} />
      
      {/* Quick Actions Overlay */}
      <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <Button
          size="sm"
          variant="ghost"
          className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-md"
          onClick={(e) => handleQuickAction('call', e)}
        >
          <Phone className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-md"
          onClick={(e) => handleQuickAction('video', e)}
        >
          <Video className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white shadow-xl border border-gray-200">
            <DropdownMenuItem onClick={(e) => handleQuickAction('settings', e)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleQuickAction('analytics', e)}>
              <Activity className="w-4 h-4 mr-2" />
              Analytics
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{responseTime}</div>
            <div className="text-xs text-gray-500">Response</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{tasksCompleted}</div>
            <div className="text-xs text-gray-500">Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">98%</div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 leading-relaxed text-sm">{description}</p>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {capabilities.slice(0, 3).map((capability, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              {capability}
            </Badge>
          ))}
          {capabilities.length > 3 && (
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
              +{capabilities.length - 3} more
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
            <span className="text-xs text-gray-600 font-medium">Last: {lastActivity}</span>
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

export default EnhancedAgentCard;
