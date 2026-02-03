import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Workflow, Play, Pause, CheckCircle, Clock, AlertTriangle,
  Plus, ArrowRight, Users, Zap, Settings, BarChart3,
  ChevronDown, ChevronRight, RefreshCw, Eye
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  agent: string;
  agentColor: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
  duration: string;
  description: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  status: 'active' | 'paused' | 'completed' | 'draft';
  progress: number;
  lastRun: string;
  totalRuns: number;
}

const workflows: WorkflowTemplate[] = [
  {
    id: 'customer-onboarding',
    name: 'Customer Onboarding Pipeline',
    description: 'End-to-end customer onboarding from lead qualification to account setup',
    category: 'Sales',
    status: 'active',
    progress: 65,
    lastRun: '2 hours ago',
    totalRuns: 156,
    steps: [
      { id: '1', name: 'Lead Qualification', agent: 'Clara Customer', agentColor: '#f97316', status: 'completed', duration: '15m', description: 'Assess lead quality and fit' },
      { id: '2', name: 'Demo Scheduling', agent: 'Clara Customer', agentColor: '#f97316', status: 'completed', duration: '5m', description: 'Book product demonstration' },
      { id: '3', name: 'Product Demo', agent: 'Clara Customer', agentColor: '#f97316', status: 'completed', duration: '60m', description: 'Present product capabilities' },
      { id: '4', name: 'Proposal Generation', agent: 'Felix Finance', agentColor: '#10b981', status: 'running', duration: '30m', description: 'Generate customized proposal' },
      { id: '5', name: 'Legal Review', agent: 'Lex Legal', agentColor: '#64748b', status: 'pending', duration: '45m', description: 'Review contract terms' },
      { id: '6', name: 'Contract Signing', agent: 'Lex Legal', agentColor: '#64748b', status: 'pending', duration: '20m', description: 'Finalize contract' },
      { id: '7', name: 'Account Setup', agent: 'Code Commander', agentColor: '#7c3aed', status: 'pending', duration: '30m', description: 'Configure customer account' },
    ]
  },
  {
    id: 'marketing-campaign',
    name: 'Marketing Campaign Launch',
    description: 'Full marketing campaign from research to launch with performance tracking',
    category: 'Marketing',
    status: 'active',
    progress: 42,
    lastRun: '5 hours ago',
    totalRuns: 89,
    steps: [
      { id: '1', name: 'Market Research', agent: 'Intel Investigator', agentColor: '#d97706', status: 'completed', duration: '2h', description: 'Analyze target market' },
      { id: '2', name: 'Strategy Development', agent: 'Maya Creative', agentColor: '#ec4899', status: 'completed', duration: '1.5h', description: 'Create campaign strategy' },
      { id: '3', name: 'Budget Approval', agent: 'Felix Finance', agentColor: '#10b981', status: 'running', duration: '30m', description: 'Approve campaign budget' },
      { id: '4', name: 'Content Creation', agent: 'Maya Creative', agentColor: '#ec4899', status: 'pending', duration: '3h', description: 'Develop materials' },
      { id: '5', name: 'Channel Setup', agent: 'Diana Digital', agentColor: '#0891b2', status: 'pending', duration: '1h', description: 'Configure channels' },
      { id: '6', name: 'Launch', agent: 'Maya Creative', agentColor: '#ec4899', status: 'pending', duration: '30m', description: 'Execute launch' },
      { id: '7', name: 'Analytics', agent: 'Dr. Data', agentColor: '#059669', status: 'pending', duration: '15m', description: 'Track metrics' },
    ]
  },
  {
    id: 'grant-application',
    name: 'Grant Application Process',
    description: 'Complete grant application workflow from research to submission',
    category: 'Nonprofit',
    status: 'paused',
    progress: 30,
    lastRun: '1 day ago',
    totalRuns: 34,
    steps: [
      { id: '1', name: 'Grant Research', agent: 'Dr. Grant Sterling', agentColor: '#16a34a', status: 'completed', duration: '4h', description: 'Research funding opportunities' },
      { id: '2', name: 'Eligibility Check', agent: 'Agent Samuel', agentColor: '#dc2626', status: 'completed', duration: '1h', description: 'Verify requirements' },
      { id: '3', name: 'Draft Proposal', agent: 'Dr. Grant Sterling', agentColor: '#16a34a', status: 'running', duration: '8h', description: 'Write grant proposal' },
      { id: '4', name: 'Budget Preparation', agent: 'Felix Finance', agentColor: '#10b981', status: 'pending', duration: '2h', description: 'Prepare budget justification' },
      { id: '5', name: 'Legal Compliance', agent: 'Lex Legal', agentColor: '#64748b', status: 'pending', duration: '3h', description: 'Ensure compliance' },
      { id: '6', name: 'Executive Review', agent: 'Executive Eva', agentColor: '#9333ea', status: 'pending', duration: '1h', description: 'Final approval' },
    ]
  },
  {
    id: 'financial-planning',
    name: 'Monthly Financial Planning',
    description: 'Comprehensive monthly financial review cycle with executive sign-off',
    category: 'Finance',
    status: 'completed',
    progress: 100,
    lastRun: '3 days ago',
    totalRuns: 12,
    steps: [
      { id: '1', name: 'Data Collection', agent: 'Felix Finance', agentColor: '#10b981', status: 'completed', duration: '1h', description: 'Gather financial data' },
      { id: '2', name: 'Performance Analysis', agent: 'Dr. Data', agentColor: '#059669', status: 'completed', duration: '1.5h', description: 'Review performance' },
      { id: '3', name: 'Forecasting', agent: 'Felix Finance', agentColor: '#10b981', status: 'completed', duration: '2h', description: 'Create forecasts' },
      { id: '4', name: 'Strategic Review', agent: 'Alex Strategy', agentColor: '#2563eb', status: 'completed', duration: '1h', description: 'Strategy alignment' },
      { id: '5', name: 'Executive Sign-off', agent: 'Executive Eva', agentColor: '#9333ea', status: 'completed', duration: '30m', description: 'Final approval' },
    ]
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'running': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
    case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
    default: return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

const getWorkflowStatusBadge = (status: string) => {
  switch (status) {
    case 'active': return <Badge className="bg-green-100 text-green-800 border-green-200"><Play className="w-3 h-3 mr-1" />Active</Badge>;
    case 'paused': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Pause className="w-3 h-3 mr-1" />Paused</Badge>;
    case 'completed': return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
    case 'draft': return <Badge className="bg-gray-100 text-gray-800 border-gray-200"><Settings className="w-3 h-3 mr-1" />Draft</Badge>;
    default: return null;
  }
};

const Workflows = () => {
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>('customer-onboarding');
  const [filter, setFilter] = useState<string>('all');

  const filteredWorkflows = filter === 'all' ? workflows : workflows.filter(w => w.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Workflow className="w-8 h-8 text-indigo-600" />
              Workflow Builder
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Design, monitor, and manage AI agent workflow pipelines
            </p>
          </div>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg"><Play className="w-5 h-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{workflows.filter(w => w.status === 'active').length}</p>
                <p className="text-xs text-gray-500">Active Workflows</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg"><CheckCircle className="w-5 h-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{workflows.reduce((acc, w) => acc + w.totalRuns, 0)}</p>
                <p className="text-xs text-gray-500">Total Executions</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg"><Users className="w-5 h-5 text-purple-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">14</p>
                <p className="text-xs text-gray-500">Agents Involved</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-lg"><Zap className="w-5 h-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">94%</p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'active', 'paused', 'completed'].map(f => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
              className={filter === f ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : ''}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Workflow Cards */}
        <div className="space-y-6">
          {filteredWorkflows.map(workflow => (
            <Card key={workflow.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
              {/* Workflow Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                onClick={() => setExpandedWorkflow(expandedWorkflow === workflow.id ? null : workflow.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {expandedWorkflow === workflow.id ?
                      <ChevronDown className="w-5 h-5 text-gray-400" /> :
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    }
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{workflow.name}</h3>
                        {getWorkflowStatusBadge(workflow.status)}
                        <Badge variant="outline" className="text-xs">{workflow.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{workflow.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">{workflow.totalRuns}</p>
                      <p className="text-xs">Total Runs</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">{workflow.lastRun}</p>
                      <p className="text-xs">Last Run</p>
                    </div>
                    <div className="w-32">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{workflow.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            workflow.progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                          }`}
                          style={{ width: `${workflow.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Step View */}
              {expandedWorkflow === workflow.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50/50 dark:bg-gray-900/30">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Pipeline Steps</h4>
                    <div className="flex-1" />
                    <Button size="sm" variant="outline" className="text-xs">
                      <Eye className="w-3 h-3 mr-1" /> View Logs
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs">
                      <Play className="w-3 h-3 mr-1" /> Run Again
                    </Button>
                  </div>

                  {/* Visual Pipeline */}
                  <div className="flex items-start gap-0 overflow-x-auto pb-4">
                    {workflow.steps.map((step, index) => (
                      <React.Fragment key={step.id}>
                        <div className={`flex-shrink-0 w-48 p-4 rounded-xl border-2 transition-all duration-300 ${
                          step.status === 'completed' ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' :
                          step.status === 'running' ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 shadow-lg shadow-blue-100 dark:shadow-blue-900/30' :
                          step.status === 'failed' ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800' :
                          'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(step.status)}
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">STEP {index + 1}</span>
                          </div>
                          <h5 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{step.name}</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{step.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full" style={{ background: step.agentColor }} />
                              <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">{step.agent}</span>
                            </div>
                            <span className="text-[10px] text-gray-400">{step.duration}</span>
                          </div>
                        </div>
                        {index < workflow.steps.length - 1 && (
                          <div className="flex-shrink-0 flex items-center px-1 pt-8">
                            <ArrowRight className={`w-5 h-5 ${
                              step.status === 'completed' ? 'text-green-400' : 'text-gray-300 dark:text-gray-600'
                            }`} />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workflows;
