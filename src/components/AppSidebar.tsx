
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Home,
  Users,
  Bot,
  Activity,
  Crown,
  TestTube,
  Settings,
  HelpCircle,
  Sparkles
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
    description: 'AI Team Overview'
  },
  {
    title: 'Agent Contacts',
    url: '/agent-contacts',
    icon: Users,
    description: 'Team Directory'
  },
  {
    title: 'AI System Test',
    url: '/ai-test',
    icon: TestTube,
    description: 'Live AI Testing'
  }
];

const quickActions = [
  {
    title: 'Executive Control',
    icon: Crown,
    action: 'executive',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    title: 'Monitor Network',
    icon: Activity,
    action: 'monitor',
    color: 'from-blue-500 to-cyan-600'
  }
];

interface AppSidebarProps {
  onQuickAction?: (action: string) => void;
}

export function AppSidebar({ onQuickAction }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleQuickAction = (action: string) => {
    if (onQuickAction) {
      onQuickAction(action);
    }
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-gradient-to-b from-white to-gray-50">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">AI Business Team</h2>
            <p className="text-xs text-gray-600">Elite Autonomous Network</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`w-full justify-start rounded-lg transition-all duration-200 ${
                      location.pathname === item.url
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <button onClick={() => navigate(item.url)} className="flex items-center gap-3 p-3">
                      <item.icon className="w-5 h-5" />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs opacity-75">{item.description}</div>
                      </div>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  onClick={() => handleQuickAction(action.action)}
                  className={`w-full justify-start bg-gradient-to-r ${action.color} text-white shadow-md hover:shadow-lg transition-all duration-200`}
                >
                  <action.icon className="w-4 h-4 mr-3" />
                  {action.title}
                </Button>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupContent>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">System Status</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700">Active Agents</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">13/13</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700">Response Time</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">< 2s</Badge>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex-1">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
