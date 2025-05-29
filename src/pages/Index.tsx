import React, { useState } from 'react';
import AgentCard from '@/components/AgentCard';
import ChatInterface from '@/components/ChatInterface';
import AutonomousAgentMonitor from '@/components/AutonomousAgentMonitor';
import { 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Settings, 
  Users, 
  Target,
  Sparkles,
  Bot,
  BarChart3,
  Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  icon: React.ReactNode;
  color: string;
}

const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showMonitor, setShowMonitor] = useState(false);

  const agents: Agent[] = [
    {
      id: 'strategy',
      name: 'Alex Strategy',
      role: 'Strategic Planning & Analytics Expert',
      description: 'Analyzes market trends, competitive landscape, and provides data-driven strategic recommendations for business growth.',
      capabilities: ['Market Analysis', 'Competitive Intelligence', 'Growth Strategy', 'KPI Tracking', 'Risk Assessment'],
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'marketing',
      name: 'Maya Creative',
      role: 'Marketing & Content Specialist',
      description: 'Creates compelling marketing campaigns, content strategies, and brand messaging to boost your market presence.',
      capabilities: ['Content Creation', 'Social Media', 'SEO Optimization', 'Brand Strategy', 'Campaign Management'],
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'finance',
      name: 'Felix Finance',
      role: 'Financial Management Advisor',
      description: 'Manages budgets, forecasts, and financial planning to optimize your business profitability and cash flow.',
      capabilities: ['Budget Planning', 'Financial Forecasting', 'Cost Analysis', 'Investment Advice', 'Tax Optimization'],
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'operations',
      name: 'Oliver Operations',
      role: 'Operations & Productivity Manager',
      description: 'Streamlines processes, automates workflows, and optimizes operational efficiency across your business.',
      capabilities: ['Process Optimization', 'Automation', 'Quality Control', 'Supply Chain', 'Productivity Tools'],
      icon: <Settings className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'customer',
      name: 'Clara Customer',
      role: 'Customer Relations Specialist',
      description: 'Enhances customer experience, manages relationships, and develops strategies to improve satisfaction and retention.',
      capabilities: ['Customer Service', 'Relationship Management', 'Feedback Analysis', 'Retention Strategy', 'Support Systems'],
      icon: <Users className="w-6 h-6" />,
      color: 'from-orange-500 to-amber-600'
    },
    {
      id: 'hr',
      name: 'Harper HR',
      role: 'HR & Team Development Coach',
      description: 'Focuses on team building, talent management, and creating a positive workplace culture for maximum productivity.',
      capabilities: ['Team Building', 'Performance Management', 'Recruitment', 'Training Programs', 'Culture Development'],
      icon: <Target className="w-6 h-6" />,
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  if (selectedAgent) {
    return <ChatInterface agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  if (showMonitor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Autonomous Agent Network</h1>
            <Button onClick={() => setShowMonitor(false)} variant="outline">
              Back to Dashboard
            </Button>
          </div>
          <AutonomousAgentMonitor agents={agents} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
              <Bot className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              AI Business Team
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your autonomous team of AI agents that communicate with each other and work together to transform your business
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              6 Autonomous Agents
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
              <BarChart3 className="w-3 h-3 mr-1" />
              Inter-Agent Communication
            </Badge>
            <Button onClick={() => setShowMonitor(true)} className="ml-4" variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              Monitor Network
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
            <div className="text-gray-600">Specialized Agents</div>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">Availability</div>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
            <div className="text-gray-600">Possibilities</div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              name={agent.name}
              role={agent.role}
              description={agent.description}
              capabilities={agent.capabilities}
              icon={agent.icon}
              color={agent.color}
              onClick={() => setSelectedAgent(agent)}
            />
          ))}
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-16 p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Autonomous AI Business Network</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            These agents work autonomously, communicate with each other, share insights, and collaborate on tasks to optimize your business operations 24/7
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="outline" className="border-blue-200 text-blue-700">Autonomous Decision Making</Badge>
            <Badge variant="outline" className="border-pink-200 text-pink-700">Inter-Agent Communication</Badge>
            <Badge variant="outline" className="border-green-200 text-green-700">Collaborative Task Execution</Badge>
            <Badge variant="outline" className="border-purple-200 text-purple-700">Real-time Business Optimization</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
