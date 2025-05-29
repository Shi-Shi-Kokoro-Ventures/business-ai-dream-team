
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Command,
  Menu
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MainLayoutProps {
  children: React.ReactNode;
  onQuickAction?: (action: string) => void;
}

export function MainLayout({ children, onQuickAction }: MainLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Implementation for theme switching would go here
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setShowCommandPalette(true);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" onKeyDown={handleKeyDown}>
        <AppSidebar onQuickAction={onQuickAction} />
        
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </SidebarTrigger>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search agents, actions, or data... (⌘K)"
                    className="pl-10 w-64 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    onClick={() => setShowCommandPalette(true)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800 border-green-200 hidden md:flex">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  All Systems Operational
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="w-4 h-4" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                        3
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-white shadow-xl border border-gray-200">
                    <div className="p-3 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <DropdownMenuItem className="p-3">
                      <div>
                        <p className="text-sm font-medium">Executive Eva completed task</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3">
                      <div>
                        <p className="text-sm font-medium">New strategy report ready</p>
                        <p className="text-xs text-gray-500">15 minutes ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3">
                      <div>
                        <p className="text-sm font-medium">System performance optimized</p>
                        <p className="text-xs text-gray-500">1 hour ago</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="sm" onClick={toggleTheme}>
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>

                <Button variant="ghost" size="sm" onClick={() => setShowCommandPalette(true)}>
                  <Command className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
