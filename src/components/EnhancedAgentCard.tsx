
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
  MoreHorizontal,
  TrendingUp,
  Clock
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
      className="group relative overflow-hidden transition-all duration-700 hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-3 cursor-pointer border-0 bg-gradient-to-br from-white via-gray-50/50 to-white backdrop-blur-sm"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Background Effects */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-all duration-700`} />
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${color} opacity-80 group-hover:opacity-100 transition-all duration-300`} />
      <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500`} />
      
      {/* Floating Status Indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="relative">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
        </div>
        <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
          Active
        </span>
      </div>

      {/* Enhanced Quick Actions Overlay */}
      <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-500 ${isHovered ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'}`}>
        <Button
          size="sm"
          variant="ghost"
          className="w-9 h-9 p-0 bg-white/95 hover:bg-white shadow-lg hover:shadow-xl border border-white/50 backdrop-blur-sm transition-all duration-300"
          onClick={(e) => handleQuickAction('call', e)}
        >
          <Phone className="w-4 h-4 text-green-600" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="w-9 h-9 p-0 bg-white/95 hover:bg-white shadow-lg hover:shadow-xl border border-white/50 backdrop-blur-sm transition-all duration-300"
          onClick={(e) => handleQuickAction('video', e)}
        >
          <Video className="w-4 h-4 text-blue-600" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="w-9 h-9 p-0 bg-white/95 hover:bg-white shadow-lg hover:shadow-xl border border-white/50 backdrop-blur-sm transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md shadow-2xl border border-white/20">
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

      <div className="relative p-8">
        {/* Enhanced Header Section */}
        <div className="flex items-start gap-6 mb-6">
          <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
            <div className="relative z-10">
              {icon}
            </div>
            <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-all duration-500`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-2xl text-gray-900 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
                {name}
              </h3>
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 px-3 py-1 rounded-full border border-yellow-200">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-xs text-yellow-700 font-bold">Elite</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">{role}</p>
          </div>
        </div>

        {/* Enhanced Performance Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl border border-gray-100 shadow-inner">
          <div className="text-center group/metric">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <div className="text-lg font-bold text-blue-600 group-hover/metric:scale-110 transition-transform duration-300">
                {responseTime}
              </div>
            </div>
            <div className="text-xs text-gray-500 font-medium">Response</div>
          </div>
          <div className="text-center group/metric">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <div className="text-lg font-bold text-green-600 group-hover/metric:scale-110 transition-transform duration-300">
                {tasksCompleted}
              </div>
            </div>
            <div className="text-xs text-gray-500 font-medium">Tasks</div>
          </div>
          <div className="text-center group/metric">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-4 h-4 text-purple-500 fill-current" />
              <div className="text-lg font-bold text-purple-600 group-hover/metric:scale-110 transition-transform duration-300">
                98%
              </div>
            </div>
            <div className="text-xs text-gray-500 font-medium">Accuracy</div>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6 leading-relaxed text-sm line-clamp-3">{description}</p>
        
        {/* Enhanced Capabilities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {capabilities.slice(0, 3).map((capability, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 hover:from-gray-200 hover:to-gray-100 border border-gray-200 transition-all duration-300 hover:scale-105"
            >
              {capability}
            </Badge>
          ))}
          {capabilities.length > 3 && (
            <Badge 
              variant="secondary" 
              className="text-xs px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-all duration-300 hover:scale-105"
            >
              +{capabilities.length - 3} more
            </Badge>
          )}
        </div>
        
        {/* Enhanced Footer */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-gray-600 font-medium">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-gray-600 font-medium">Last: {lastActivity}</span>
          </div>
        </div>
        
        {/* Enhanced CTA Button */}
        <Button className={`w-full bg-gradient-to-r ${color} text-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] font-semibold py-6 rounded-xl text-base relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <MessageSquare className="w-5 h-5 mr-3" />
          Connect & Collaborate
        </Button>
      </div>
    </Card>
  );
};

export default EnhancedAgentCard;
