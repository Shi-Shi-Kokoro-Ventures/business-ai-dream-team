import React, { useState } from 'react';
import EnhancedAgentCard from '@/components/EnhancedAgentCard';
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
  Shield,
  Crown,
  Filter,
  Grid3X3,
  List,
  Award,
  Handshake,
  Heart,
  Megaphone,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Agent } from '@/types/agent';

const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showMonitor, setShowMonitor] = useState(false);
  const [showExecutiveDashboard, setShowExecutiveDashboard] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState('all');

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
    },
    // NEW ELITE AGENTS
    {
      id: 'grant-expert',
      name: 'Dr. Grant Sterling',
      role: 'Senior Grant Writing Specialist',
      description: 'Elite grant writing expert specializing in federal grants, foundation funding, and research proposals with guaranteed approval strategies and compliance mastery.',
      capabilities: ['Federal Grants', 'State Funding', 'Foundation Grants', 'NIH/NSF Proposals', 'Compliance Review', 'Budget Analysis', 'Narrative Development', 'Success Rate Optimization'],
      icon: <Award className="w-6 h-6" />,
      color: 'from-yellow-500 to-amber-600',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'government-contracts',
      name: 'Agent Samuel Contracts',
      role: 'Government Procurement Specialist',
      description: 'Government contracting master navigating federal procurement processes, GSA schedules, and RFP responses with expert compliance and winning strategies.',
      capabilities: ['Federal Contracting', 'GSA Schedules', 'RFP Responses', 'Compliance Auditing', 'Vendor Registration', 'Contract Negotiation', 'Procurement Strategy', 'Government Relations'],
      icon: <Shield className="w-6 h-6" />,
      color: 'from-blue-700 to-blue-900',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'chief-strategy',
      name: 'Victoria Sterling',
      role: 'Chief Strategy Officer & Legal Innovation Expert',
      description: 'Strategic mastermind specializing in legal loophole identification, creative compliance solutions, and innovative business strategies that maximize success within legal frameworks.',
      capabilities: ['Legal Loophole Analysis', 'Regulatory Navigation', 'Creative Compliance', 'Strategic Positioning', 'Risk Mitigation', 'Innovation Strategy', 'Competitive Advantage', 'Legal Innovation'],
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-600 to-violet-700',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'negotiation-expert',
      name: 'Marcus Dealmaker',
      role: 'Master Negotiator & Deal Architect',
      description: 'Elite negotiation specialist creating win-win solutions, managing complex stakeholder relationships, and architecting deals that maximize value for all parties.',
      capabilities: ['Contract Negotiation', 'Stakeholder Management', 'Win-Win Solutions', 'Conflict Resolution', 'Strategic Partnerships', 'Deal Architecture', 'Relationship Building', 'Value Optimization'],
      icon: <Handshake className="w-6 h-6" />,
      color: 'from-emerald-600 to-green-700',
      isActive: true,
      lastActivity: new Date()
    },
    {
      id: 'digital-fundraising',
      name: 'Diana Digital',
      role: 'Digital Marketing & Fundraising Expert',
      description: 'Nonprofit digital marketing specialist driving fundraising success through innovative campaigns, donor acquisition, and multi-channel digital strategies that maximize impact.',
      capabilities: ['Digital Campaigns', 'Donor Acquisition', 'Crowdfunding', 'Social Media Fundraising', 'Grant Marketing', 'Email Fundraising', 'Nonprofit Marketing', 'Campaign Optimization'],
      icon: <Heart className="w-6 h-6" />,
      color: 'from-coral-500 to-red-600',
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

  const handleQuickAction = (action: string) => {
    if (action === 'executive') {
      setShowExecutiveDashboard(true);
    } else if (action === 'monitor') {
      setShowMonitor(true);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (selectedAgent) {
    return <ChatInterface agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  if (showMonitor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Elite Autonomous Agent Network</h1>
          <Button onClick={() => setShowMonitor(false)} variant="outline">
            Back to Dashboard
          </Button>
        </div>
        <AutonomousAgentMonitor agents={agents} />
      </div>
    );
  }

  if (showExecutiveDashboard) {
    return <ExecutiveDashboard onBack={() => setShowExecutiveDashboard(false)} />;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Enhanced Header with improved layout */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl">
            <Bot className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Elite AI Business Team
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              18 autonomous AI specialists with executive control & oversight
            </p>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">18</div>
                <div className="text-blue-700 font-medium">Elite Specialists</div>
              </div>
              <Bot className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">24/7</div>
                <div className="text-green-700 font-medium">Active Operations</div>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600">98%</div>
                <div className="text-purple-700 font-medium">Accuracy Rate</div>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-amber-600">&lt; 2s</div>
                <div className="text-amber-700 font-medium">Response Time</div>
              </div>
              <Zap className="w-8 h-8 text-amber-500" />
            </div>
          </Card>
        </div>

        {/* Enhanced Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex items-center gap-4 flex-1">
            <Input
              placeholder="Search agents by name, role, or capabilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Agent Grid */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
        : "space-y-4"
      }>
        {filteredAgents.map((agent) => (
          <EnhancedAgentCard
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
          Your elite AI team operates under complete executive control with secure, autonomous capabilities, always under your authority.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="outline" className="border-purple-200 text-purple-700 px-3 py-2">Executive Permission Management</Badge>
          <Badge variant="outline" className="border-blue-200 text-blue-700 px-3 py-2">Real-time Monitoring & Control</Badge>
          <Badge variant="outline" className="border-green-200 text-green-700 px-3 py-2">Multi-Channel Executive Alerts</Badge>
          <Badge variant="outline" className="border-amber-200 text-amber-700 px-3 py-2">Crisis Escalation Protocols</Badge>
          <Badge variant="outline" className="border-red-200 text-red-700 px-3 py-2">Grant & Contract Specialists</Badge>
          <Badge variant="outline" className="border-emerald-200 text-emerald-700 px-3 py-2">Negotiation & Fundraising Experts</Badge>
        </div>
      </div>
    </div>
  );
};

export default Index;
