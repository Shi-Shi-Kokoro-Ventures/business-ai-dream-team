import React, { useState, useCallback } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Home, Users, TestTube, Settings, BarChart3, Network, Workflow,
  Award, Target, Megaphone, DollarSign, Briefcase, MessageSquare,
  Scale, Code, Search, BookOpen, Globe, Lightbulb, Crown, Brain,
  Zap, Moon, Activity, FileText, Phone, UserCircle
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (path: string) => void;
  onAgentSelect: (agentId: string) => void;
  onAction?: (action: string) => void;
}

const navigationItems = [
  { label: 'Dashboard', path: '/', icon: Home, description: 'AI Team Overview' },
  { label: 'Agent Contacts', path: '/agent-contacts', icon: Users, description: 'Team Directory' },
  { label: 'AI System Test', path: '/ai-test', icon: TestTube, description: 'Live AI Testing' },
  { label: 'System Config', path: '/system-config', icon: Settings, description: 'Configuration' },
  { label: 'Analytics', path: '/analytics', icon: BarChart3, description: 'Performance Analytics' },
  { label: 'Agent Network', path: '/agent-network', icon: Network, description: 'Live Agent Map' },
  { label: 'Workflows', path: '/workflows', icon: Workflow, description: 'Workflow Builder' },
];

const agentItems = [
  { id: 'executive-eva', name: 'Executive Eva', role: 'CEO', icon: Award },
  { id: 'strategy', name: 'Alex Strategy', role: 'Strategic Planner', icon: Target },
  { id: 'marketing', name: 'Maya Creative', role: 'Marketing Director', icon: Megaphone },
  { id: 'finance', name: 'Felix Finance', role: 'CFO', icon: DollarSign },
  { id: 'operations', name: 'Oliver Operations', role: 'Operations Manager', icon: Settings },
  { id: 'customer', name: 'Clara Customer', role: 'Customer Success', icon: Users },
  { id: 'hr', name: 'Harper HR', role: 'HR Director', icon: UserCircle },
  { id: 'legal', name: 'Lex Legal', role: 'Legal Counsel', icon: Scale },
  { id: 'cto', name: 'Code Commander', role: 'CTO', icon: Code },
  { id: 'data', name: 'Dr. Data', role: 'Data Scientist', icon: BarChart3 },
  { id: 'intelligence', name: 'Intel Investigator', role: 'BI Analyst', icon: Search },
  { id: 'communications', name: 'Comm Chief', role: 'Comms Director', icon: MessageSquare },
  { id: 'documents', name: 'Doc Master', role: 'Document Manager', icon: FileText },
  { id: 'grant-expert', name: 'Dr. Grant Sterling', role: 'Grant Expert', icon: BookOpen },
  { id: 'government-contracts', name: 'Agent Samuel Contracts', role: 'Gov Contracts', icon: Briefcase },
  { id: 'chief-strategy', name: 'Victoria Sterling', role: 'Chief Strategy', icon: Lightbulb },
  { id: 'negotiation-expert', name: 'Marcus Dealmaker', role: 'Negotiation Expert', icon: Users },
  { id: 'digital-fundraising', name: 'Diana Digital', role: 'Digital Fundraising', icon: Globe },
];

const quickActions = [
  { label: 'Executive Dashboard', action: 'executive', icon: Crown, description: 'Open command center' },
  { label: 'Run System Test', action: 'system-test', icon: Zap, description: 'Verify all systems' },
  { label: 'View Live Metrics', action: 'metrics', icon: Activity, description: 'Real-time analytics' },
  { label: 'Toggle Dark Mode', action: 'toggle-dark', icon: Moon, description: 'Switch theme' },
];

const CommandPalette = ({ open, onOpenChange, onNavigate, onAgentSelect, onAction }: CommandPaletteProps) => {
  const handleSelect = useCallback((callback: () => void) => {
    onOpenChange(false);
    callback();
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl max-w-2xl">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 dark:text-gray-400">
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
            <CommandInput
              placeholder="Search agents, pages, or actions..."
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0"
            />
            <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-500 sm:flex">
              ESC
            </kbd>
          </div>
          <CommandList className="max-h-[400px] overflow-y-auto p-2">
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              No results found. Try a different search term.
            </CommandEmpty>

            <CommandGroup heading="Navigation">
              {navigationItems.map((item) => (
                <CommandItem
                  key={item.path}
                  onSelect={() => handleSelect(() => onNavigate(item.path))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-blue-50 data-[selected=true]:to-indigo-50 dark:data-[selected=true]:from-blue-900/30 dark:data-[selected=true]:to-indigo-900/30 transition-all duration-150"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/50 dark:to-indigo-800/50">
                    <item.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator className="my-2" />

            <CommandGroup heading="AI Agents">
              {agentItems.map((agent) => (
                <CommandItem
                  key={agent.id}
                  onSelect={() => handleSelect(() => onAgentSelect(agent.id))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-purple-50 data-[selected=true]:to-pink-50 dark:data-[selected=true]:from-purple-900/30 dark:data-[selected=true]:to-pink-900/30 transition-all duration-150"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800/50 dark:to-pink-800/50">
                    <agent.icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{agent.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{agent.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">Online</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator className="my-2" />

            <CommandGroup heading="Quick Actions">
              {quickActions.map((action) => (
                <CommandItem
                  key={action.action}
                  onSelect={() => handleSelect(() => onAction?.(action.action))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-amber-50 data-[selected=true]:to-orange-50 dark:data-[selected=true]:from-amber-900/30 dark:data-[selected=true]:to-orange-900/30 transition-all duration-150"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-800/50 dark:to-orange-800/50">
                    <action.icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{action.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono">↑↓</kbd>
              <span>Navigate</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono">↵</kbd>
              <span>Select</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono">esc</kbd>
              <span>Close</span>
            </div>
            <div className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              <span>AI-Powered Search</span>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
