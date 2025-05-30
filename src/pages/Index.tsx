import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import EnhancedAgentCard from '@/components/EnhancedAgentCard';
import EnterpriseMetrics from '@/components/EnterpriseMetrics';
import AICapabilitiesShowcase from '@/components/AICapabilitiesShowcase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Brain,
  Target,
  MessageSquare,
  Settings,
  BarChart3,
  FileText,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Award,
  Lightbulb,
  Briefcase,
  Scale,
  Database,
  Code,
  PieChart,
  Search,
  BookOpen,
  Megaphone
} from 'lucide-react';
import { agentCommunication } from '@/services/agentCommunication';

const Index = () => {
  const [connectedAgents, setConnectedAgents] = useState(18);
  const [totalTasks] = useState(247);
  const [systemHealth] = useState(99.97);

  const handleAgentClick = (agentId: string) => {
    console.log(`Connecting to agent: ${agentId}`);
    // In a real implementation, this would open a chat interface or agent interaction panel
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setConnectedAgents(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const agents = [
    {
      id: 'executive-eva',
      name: 'Executive Eva',
      role: 'Chief Executive Officer',
      description: 'Strategic leadership and executive decision-making with comprehensive business oversight and autonomous operations management.',
      capabilities: ['Strategic Planning', 'Executive Decisions', 'Board Relations', 'Vision Setting'],
      icon: <Award className="w-8 h-8" />,
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'strategy',
      name: 'Alex Strategy',
      role: 'Strategic Planner',
      description: 'Develops comprehensive business strategies, market analysis, and long-term planning with AI-powered insights and competitive intelligence.',
      capabilities: ['Market Analysis', 'Strategic Planning', 'Competitive Intelligence', 'Business Development'],
      icon: <Target className="w-8 h-8" />,
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'marketing',
      name: 'Maya Creative',
      role: 'Marketing Director',
      description: 'Creates compelling marketing campaigns, brand strategies, and customer engagement initiatives with creative AI assistance.',
      capabilities: ['Campaign Management', 'Brand Strategy', 'Content Creation', 'Social Media'],
      icon: <Megaphone className="w-8 h-8" />,
      color: 'from-pink-600 to-rose-600'
    },
    {
      id: 'finance',
      name: 'Felix Finance',
      role: 'Chief Financial Officer',
      description: 'Manages financial planning, budgeting, investment strategies, and fiscal analysis with advanced AI modeling capabilities.',
      capabilities: ['Financial Modeling', 'Budget Planning', 'Investment Analysis', 'Risk Management'],
      icon: <DollarSign className="w-8 h-8" />,
      color: 'from-green-600 to-emerald-600'
    },
    {
      id: 'operations',
      name: 'Oliver Operations',
      role: 'Operations Manager',
      description: 'Optimizes business processes, supply chain management, and operational efficiency with intelligent automation systems.',
      capabilities: ['Process Optimization', 'Supply Chain', 'Quality Control', 'Efficiency Analysis'],
      icon: <Settings className="w-8 h-8" />,
      color: 'from-indigo-600 to-purple-600'
    },
    {
      id: 'customer',
      name: 'Clara Customer',
      role: 'Customer Success Manager',
      description: 'Ensures exceptional customer experiences, manages relationships, and drives customer satisfaction with personalized AI insights.',
      capabilities: ['Customer Relations', 'Success Planning', 'Feedback Analysis', 'Retention Strategies'],
      icon: <Users className="w-8 h-8" />,
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'hr',
      name: 'Harper HR',
      role: 'Human Resources Director',
      description: 'Manages talent acquisition, employee development, and organizational culture with AI-driven people analytics.',
      capabilities: ['Talent Management', 'Employee Development', 'Culture Building', 'Performance Analysis'],
      icon: <Users className="w-8 h-8" />,
      color: 'from-teal-600 to-cyan-600'
    },
    {
      id: 'legal',
      name: 'Lex Legal',
      role: 'Legal Counsel',
      description: 'Provides legal guidance, contract analysis, compliance monitoring, and risk assessment with intelligent legal research.',
      capabilities: ['Contract Analysis', 'Compliance', 'Legal Research', 'Risk Assessment'],
      icon: <Scale className="w-8 h-8" />,
      color: 'from-gray-700 to-slate-600'
    },
    {
      id: 'cto',
      name: 'Code Commander',
      role: 'Chief Technology Officer',
      description: 'Leads technology strategy, development initiatives, and digital transformation with advanced coding and architecture expertise.',
      capabilities: ['Tech Strategy', 'Development', 'Architecture', 'Innovation'],
      icon: <Code className="w-8 h-8" />,
      color: 'from-violet-600 to-indigo-600'
    },
    {
      id: 'data',
      name: 'Dr. Data',
      role: 'Data Scientist',
      description: 'Extracts insights from complex datasets, builds predictive models, and drives data-driven decision making with advanced analytics.',
      capabilities: ['Data Analysis', 'Machine Learning', 'Predictive Modeling', 'Business Intelligence'],
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'intelligence',
      name: 'Intel Investigator',
      role: 'Business Intelligence Analyst',
      description: 'Gathers market intelligence, competitive analysis, and strategic insights with comprehensive research capabilities.',
      capabilities: ['Market Research', 'Competitive Analysis', 'Trend Analysis', 'Intelligence Gathering'],
      icon: <Search className="w-8 h-8" />,
      color: 'from-amber-600 to-orange-600'
    },
    {
      id: 'communications',
      name: 'Comm Chief',
      role: 'Communications Director',
      description: 'Manages internal and external communications, public relations, and stakeholder engagement with strategic messaging.',
      capabilities: ['Public Relations', 'Internal Comms', 'Crisis Management', 'Stakeholder Relations'],
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'documents',
      name: 'Doc Master',
      role: 'Document Manager',
      description: 'Manages document workflows, knowledge bases, and information systems with intelligent organization and retrieval.',
      capabilities: ['Document Management', 'Knowledge Base', 'Information Systems', 'Content Organization'],
      icon: <FileText className="w-8 h-8" />,
      color: 'from-slate-600 to-gray-600'
    },
    {
      id: 'grant-expert',
      name: 'Dr. Grant Sterling',
      role: 'Grant Writing Expert',
      description: 'Specializes in grant research, application writing, and funding strategies with comprehensive grant management capabilities.',
      capabilities: ['Grant Writing', 'Funding Research', 'Application Management', 'Compliance Tracking'],
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-emerald-600 to-green-600'
    },
    {
      id: 'government-contracts',
      name: 'Agent Samuel Contracts',
      role: 'Government Contracts Specialist',
      description: 'Expert in government contracting, procurement processes, and regulatory compliance with specialized federal knowledge.',
      capabilities: ['Government Contracting', 'Procurement', 'Regulatory Compliance', 'Federal Relations'],
      icon: <Briefcase className="w-8 h-8" />,
      color: 'from-red-600 to-pink-600'
    },
    {
      id: 'chief-strategy',
      name: 'Victoria Sterling',
      role: 'Chief Strategy Officer',
      description: 'Develops enterprise-level strategic initiatives, market positioning, and growth strategies with executive-level decision making.',
      capabilities: ['Enterprise Strategy', 'Market Positioning', 'Growth Planning', 'Strategic Partnerships'],
      icon: <Lightbulb className="w-8 h-8" />,
      color: 'from-purple-600 to-violet-600'
    },
    {
      id: 'negotiation-expert',
      name: 'Marcus Dealmaker',
      role: 'Negotiation Expert',
      description: 'Masters complex negotiations, deal structuring, and relationship management with advanced persuasion and analytical skills.',
      capabilities: ['Contract Negotiation', 'Deal Structuring', 'Relationship Building', 'Conflict Resolution'],
      icon: <Users className="w-8 h-8" />,
      color: 'from-orange-600 to-amber-600'
    },
    {
      id: 'digital-fundraising',
      name: 'Diana Digital',
      role: 'Digital Fundraising Expert',
      description: 'Specializes in online fundraising, crowdfunding campaigns, and digital marketing for nonprofit organizations.',
      capabilities: ['Digital Campaigns', 'Crowdfunding', 'Donor Relations', 'Online Marketing'],
      icon: <Globe className="w-8 h-8" />,
      color: 'from-cyan-600 to-blue-600'
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          <div className="relative container mx-auto px-6 py-20">
            <div className="text-center text-white">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Elite AI Business Team
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                The world's most advanced autonomous AI business platform with 18 specialized agents working 24/7 to transform your enterprise operations
              </p>
              
              <div className="flex items-center justify-center gap-8 mb-8 text-sm">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-200">{connectedAgents} Agents Online</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-200">{totalTasks} Tasks Completed</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-200">{systemHealth}% Uptime</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button className="bg-white text-indigo-900 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Experience the Future
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-900 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <Tabs defaultValue="agents" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-2">
              <TabsTrigger value="agents" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl py-3 font-semibold transition-all duration-300">
                AI Agents
              </TabsTrigger>
              <TabsTrigger value="capabilities" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl py-3 font-semibold transition-all duration-300">
                Capabilities
              </TabsTrigger>
              <TabsTrigger value="enterprise" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl py-3 font-semibold transition-all duration-300">
                Enterprise
              </TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl py-3 font-semibold transition-all duration-300">
                vs Salesforce
              </TabsTrigger>
            </TabsList>

            <TabsContent value="agents" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Your AI Business Team</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  18 specialized AI agents, each with unique expertise and autonomous capabilities, working together to revolutionize your business operations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {agents.map((agent) => (
                  <EnhancedAgentCard
                    key={agent.id}
                    name={agent.name}
                    role={agent.role}
                    description={agent.description}
                    capabilities={agent.capabilities}
                    icon={agent.icon}
                    color={agent.color}
                    onClick={() => handleAgentClick(agent.id)}
                    responseTime="< 2s"
                    lastActivity="1 min ago"
                    tasksCompleted={Math.floor(Math.random() * 100) + 20}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="capabilities">
              <AICapabilitiesShowcase />
            </TabsContent>

            <TabsContent value="enterprise">
              <EnterpriseMetrics />
            </TabsContent>

            <TabsContent value="comparison">
              <EnterpriseMetrics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
