
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CommandPalette from './CommandPalette';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Command,
  Menu,
  ChevronRight,
  Home,
  Wifi,
  WifiOff
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

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/agent-contacts': 'Agent Contacts',
  '/ai-test': 'AI System Test',
  '/system-config': 'System Config',
  '/analytics': 'Analytics',
  '/agent-network': 'Agent Network',
  '/workflows': 'Workflows',
};

export function MainLayout({ children, onQuickAction }: MainLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Executive Eva completed strategic review', time: '2 minutes ago', read: false },
    { id: 2, title: 'New grant opportunity identified by Dr. Sterling', time: '15 minutes ago', read: false },
    { id: 3, title: 'System performance optimized by Code Commander', time: '1 hour ago', read: true },
    { id: 4, title: 'Marketing campaign metrics ready', time: '2 hours ago', read: true },
  ]);

  const navigate = useNavigate();
  const location = useLocation();

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleAgentSelect = useCallback((agentId: string) => {
    navigate('/');
    // Dispatch custom event that Index page can listen to
    window.dispatchEvent(new CustomEvent('agent-select', { detail: { agentId } }));
  }, [navigate]);

  const handleCommandAction = useCallback((action: string) => {
    switch (action) {
      case 'toggle-dark':
        toggleTheme();
        break;
      case 'executive':
        navigate('/');
        window.dispatchEvent(new CustomEvent('view-change', { detail: { view: 'executive' } }));
        break;
      case 'system-test':
        navigate('/ai-test');
        break;
      case 'metrics':
        navigate('/analytics');
        break;
      default:
        onQuickAction?.(action);
    }
  }, [toggleTheme, navigate, onQuickAction]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentRoute = routeNames[location.pathname] || 'Page';

  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <AppSidebar onQuickAction={onQuickAction} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Enhanced Header */}
          <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700/50 px-4 md:px-6 py-3 sticky top-0 z-50 transition-colors duration-300">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <SidebarTrigger className="lg:hidden flex-shrink-0">
                  <Menu className="w-5 h-5" />
                </SidebarTrigger>

                {/* Breadcrumb */}
                <nav className="hidden md:flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <Home className="w-3.5 h-3.5" />
                  <ChevronRight className="w-3 h-3" />
                  <span className="font-medium text-gray-900 dark:text-white">{currentRoute}</span>
                </nav>

                {/* Search Bar */}
                <div className="relative ml-4 hidden sm:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    placeholder="Search... (⌘K)"
                    className="pl-10 w-48 lg:w-64 bg-gray-50 dark:bg-gray-800 border-0 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200 rounded-xl text-sm dark:text-gray-200 dark:placeholder-gray-500"
                    onClick={() => setShowCommandPalette(true)}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Online Status */}
                <Badge className={`hidden lg:flex text-xs ${isOnline ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700' : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700'}`}>
                  {isOnline ? <Wifi className="w-3 h-3 mr-1.5" /> : <WifiOff className="w-3 h-3 mr-1.5" />}
                  {isOnline ? 'All Systems Online' : 'Offline'}
                </Badge>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative dark:text-gray-300 dark:hover:bg-gray-800">
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold animate-pulse">
                          {unreadCount}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <Badge className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 text-xs">{unreadCount} new</Badge>
                      )}
                    </div>
                    {notifications.map(notif => (
                      <DropdownMenuItem
                        key={notif.id}
                        className="p-3 cursor-pointer focus:bg-gray-50 dark:focus:bg-gray-700/50"
                        onClick={() => markNotificationRead(notif.id)}
                      >
                        <div className="flex gap-3 w-full">
                          {!notif.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                          )}
                          <div className={`flex-1 ${notif.read ? 'ml-5' : ''}`}>
                            <p className={`text-sm ${notif.read ? 'text-gray-500 dark:text-gray-400' : 'font-medium text-gray-900 dark:text-white'}`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{notif.time}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Dark Mode Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="dark:text-gray-300 dark:hover:bg-gray-800 transition-all duration-200"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>

                {/* Command Palette Trigger */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCommandPalette(true)}
                  className="hidden sm:flex dark:text-gray-300 dark:hover:bg-gray-800"
                >
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

      {/* Command Palette */}
      <CommandPalette
        open={showCommandPalette}
        onOpenChange={setShowCommandPalette}
        onNavigate={handleNavigate}
        onAgentSelect={handleAgentSelect}
        onAction={handleCommandAction}
      />
    </SidebarProvider>
  );
}
