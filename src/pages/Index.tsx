import React, { useState } from 'react';
import AgentCard from '@/components/AgentCard';
import ChatInterface from '@/components/ChatInterface';
import AutonomousAgentMonitor from '@/components/AutonomousAgentMonitor';
import ExecutiveDashboard from '@/components/ExecutiveDashboard';
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
  Activity,
  Scale,
  Code,
  Database,
  Search,
  Phone,
  FileText,
  Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Agent } from '@/types/agent';

const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showMonitor, setShowMonitor] = useState(false);
  const [showExecutiveDashboard, setShowExecutiveDashboard] = useState(false);

  const agents: Agent[] = [
    {
      id: 'executive-eva',
      name: 'Executive Eva',
      role: 'Executive Assistant & Permission Manager',
      description: 'Your elite personal AI executive assistant managing permissions, monitoring all agents, and ensuring you maintain complete control over critical business decisions.',
      capabilities: ['Permission Management', 'Executive Reporting', 'Crisis Escalation', 'Multi-channel Contact', 'Security Oversight', 'Real-time Monitoring'],
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-600 to-indigo-700',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'strategy',
      name: 'Alex Strategy',
      role: 'Strategic Planning & Analytics Expert',
      description: 'Elite strategic mind analyzing market trends, competitive intelligence, and providing data-driven strategic recommendations for exponential business growth.',
      capabilities: ['Market Analysis', 'Competitive Intelligence', 'Growth Strategy', 'KPI Tracking', 'Risk Assessment', 'Predictive Analytics'],
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'marketing',
      name: 'Maya Creative',
      role: 'Marketing & Content Specialist',
      description: 'Creative marketing genius crafting viral campaigns, compelling content strategies, and revolutionary brand messaging to dominate your market presence.',
      capabilities: ['Content Creation', 'Social Media', 'SEO Optimization', 'Brand Strategy', 'Campaign Management', 'Viral Marketing'],
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'finance',
      name: 'Felix Finance',
      role: 'Financial Management Advisor',
      description: 'Financial wizard managing budgets, forecasts, and financial planning to optimize profitability, cash flow, and investment strategies with precision.',
      capabilities: ['Budget Planning', 'Financial Forecasting', 'Cost Analysis', 'Investment Advice', 'Tax Optimization', 'Profit Maximization'],
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'operations',
      name: 'Oliver Operations',
      role: 'Operations & Productivity Manager',
      description: 'Operations mastermind streamlining processes, automating workflows, and optimizing operational efficiency to achieve maximum productivity.',
      capabilities: ['Process Optimization', 'Automation', 'Quality Control', 'Supply Chain', 'Productivity Tools', 'Workflow Design'],
      icon: <Settings className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-600',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'customer',
      name: 'Clara Customer',
      role: 'Customer Relations Specialist',
      description: 'Customer experience virtuoso enhancing satisfaction, managing relationships, and developing strategies to maximize retention and loyalty.',
      capabilities: ['Customer Service', 'Relationship Management', 'Feedback Analysis', 'Retention Strategy', 'Support Systems', 'Experience Design'],
      icon: <Users className="w-6 h-6" />,
      color: 'from-orange-500 to-amber-600',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'hr',
      name: 'Harper HR',
      role: 'HR & Team Development Coach',
      description: 'Team development expert focusing on talent optimization, performance enhancement, and creating exceptional workplace culture for peak productivity.',
      capabilities: ['Team Building', 'Performance Management', 'Recruitment', 'Training Programs', 'Culture Development', 'Talent Optimization'],
      icon: <Target className="w-6 h-6" />,
      color: 'from-indigo-500 to-purple-600',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'legal',
      name: 'Lex Legal',
      role: 'Chief Legal Officer',
      description: 'Elite legal strategist handling compliance, contract management, intellectual property, and providing comprehensive legal advisory services.',
      capabilities: ['Contract Management', 'Compliance Monitoring', 'IP Protection', 'Legal Strategy', 'Risk Mitigation', 'Regulatory Affairs'],
      icon: <Scale className="w-6 h-6" />,
      color: 'from-gray-700 to-gray-800',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'cto',
      name: 'Code Commander',
      role: 'Chief Technology Officer',
      description: 'Technology visionary leading full-stack development, DevOps, cybersecurity, and digital transformation initiatives with cutting-edge solutions.',
      capabilities: ['Full-Stack Development', 'DevOps', 'Cybersecurity', 'API Integration', 'Cloud Architecture', 'Tech Strategy'],
      icon: <Code className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-600',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'data',
      name: 'Dr. Data',
      role: 'Chief Data Scientist',
      description: 'Data science expert leveraging AI/ML, big data analytics, and predictive modeling to unlock powerful business insights and opportunities.',
      capabilities: ['AI/ML Development', 'Big Data Analytics', 'Predictive Modeling', 'Data Visualization', 'Statistical Analysis', 'Business Intelligence'],
      icon: <Database className="w-6 h-6" />,
      color: 'from-violet-500 to-purple-600',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'intelligence',
      name: 'Intel Investigator',
      role: 'Business Intelligence & Research Specialist',
      description: 'Intelligence expert conducting web research, competitive analysis, and market investigation to provide actionable business insights.',
      capabilities: ['Web Research', 'Competitive Analysis', 'Market Intelligence', 'Data Mining', 'Trend Analysis', 'OSINT'],
      icon: <Search className="w-6 h-6" />,
      color: 'from-cyan-500 to-blue-600',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'communications',
      name: 'Comm Chief',
      role: 'Communications Director',
      description: 'Communications specialist managing email campaigns, SMS marketing, phone operations, and multi-channel communication strategies.',
      capabilities: ['Email Automation', 'SMS Campaigns', 'Phone Management', 'Social Media', 'Communication Strategy', 'Channel Optimization'],
      icon: <Phone className="w-6 h-6" />,
      color: 'from-rose-500 to-pink-600',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'documents',
      name: 'Doc Master',
      role: 'Document & Content Management Specialist',
      description: 'Document expert creating reports, contracts, presentations, spreadsheets, and managing comprehensive content automation systems.',
      capabilities: ['Document Creation', 'Report Generation', 'Template Design', 'Spreadsheet Management', 'Content Automation', 'File Organization'],
      icon: <FileText className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600',
      isActive: true,
      lastActivity: new Date()
    }
  ];

  const handleAgentClick = (agent: Agent) => {
    if (agent.id === 'executive-eva') {
      setShowExecutiveDashboard(true);
    } else {
      setSelectedAgent(agent);
    }
  };

  if (selectedAgent) {
    return <ChatInterface agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  if (showMonitor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Elite Autonomous Agent Network</h1>
            <Button onClick={() => setShowMonitor(false)} variant="outline">
              Back to Dashboard
            </Button>
          </div>
          <AutonomousAgentMonitor agents={agents} />
        </div>
      </div>
    );
  }

  if (showExecutiveDashboard) {
    return <ExecutiveDashboard onBack={() => setShowExecutiveDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl">
              <Bot className="w-10 h-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Elite AI Business Team
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
            Your autonomous team of 13 elite AI specialists with Executive Assistant command & control. Complete permission management, real-time monitoring, and executive oversight for secure autonomous operations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              13 Elite Specialists + Executive Control
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200 px-4 py-2 text-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Permission Management System
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200 px-4 py-2 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              Executive Oversight & Control
            </Badge>
            <Button onClick={() => setShowMonitor(true)} className="ml-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700" variant="default">
              <Activity className="w-4 h-4 mr-2" />
              Monitor Elite Network
            </Button>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-gradient-to-br from-white to-blue-50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="text-4xl font-bold text-blue-600 mb-2">13</div>
            <div className="text-gray-600 font-medium">Elite Specialists + Executive</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-white to-green-50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Controlled Operations</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-white to-purple-50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="text-4xl font-bold text-purple-600 mb-2">🔐</div>
            <div className="text-gray-600 font-medium">Executive Permission Control</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-white to-amber-50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="text-4xl font-bold text-amber-600 mb-2">🚀</div>
            <div className="text-gray-600 font-medium">Secure Elite Performance</div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              name={agent.name}
              role={agent.role}
              description={agent.description}
              capabilities={agent.capabilities}
              icon={agent.icon}
              color={agent.color}
              onClick={() => handleAgentClick(agent)}
            />
          ))}
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Executive-Controlled AI Business Network</h3>
          <p className="text-gray-700 mb-6 max-w-4xl mx-auto text-lg leading-relaxed">
            Your elite AI team now operates under complete executive control with "Executive Eva" managing all permissions, monitoring activities, and ensuring critical decisions reach you through your preferred communication channels. Secure, autonomous, and always under your authority.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="outline" className="border-purple-200 text-purple-700 px-3 py-2">Executive Permission Management</Badge>
            <Badge variant="outline" className="border-blue-200 text-blue-700 px-3 py-2">Real-time Monitoring & Control</Badge>
            <Badge variant="outline" className="border-green-200 text-green-700 px-3 py-2">Multi-Channel Executive Alerts</Badge>
            <Badge variant="outline" className="border-amber-200 text-amber-700 px-3 py-2">Crisis Escalation Protocols</Badge>
            <Badge variant="outline" className="border-indigo-200 text-indigo-700 px-3 py-2">Secure Autonomous Operations</Badge>
            <Badge variant="outline" className="border-rose-200 text-rose-700 px-3 py-2">Complete Executive Authority</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
