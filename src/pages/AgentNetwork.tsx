import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Network, Activity, Zap, Brain, Users, Shield,
  MessageSquare, ArrowRight, Circle, Eye, EyeOff
} from 'lucide-react';

interface AgentNode {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  color: string;
  status: 'active' | 'busy' | 'idle';
  currentTask: string;
  connections: string[];
  messageCount: number;
}

interface LiveMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  progress: number;
}

const initialAgents: AgentNode[] = [
  { id: 'executive-eva', name: 'Eva', role: 'CEO', x: 50, y: 15, color: '#9333ea', status: 'active', currentTask: 'Overseeing operations', connections: ['strategy', 'finance', 'legal', 'chief-strategy'], messageCount: 45 },
  { id: 'strategy', name: 'Alex', role: 'Strategy', x: 25, y: 30, color: '#2563eb', status: 'active', currentTask: 'Market analysis', connections: ['data', 'intelligence', 'marketing'], messageCount: 38 },
  { id: 'marketing', name: 'Maya', role: 'Marketing', x: 75, y: 30, color: '#ec4899', status: 'busy', currentTask: 'Campaign creation', connections: ['communications', 'data', 'digital-fundraising'], messageCount: 52 },
  { id: 'finance', name: 'Felix', role: 'CFO', x: 15, y: 50, color: '#10b981', status: 'active', currentTask: 'Budget review', connections: ['legal', 'operations', 'grant-expert'], messageCount: 34 },
  { id: 'operations', name: 'Oliver', role: 'Operations', x: 40, y: 45, color: '#6366f1', status: 'active', currentTask: 'Process optimization', connections: ['cto', 'hr', 'documents'], messageCount: 41 },
  { id: 'customer', name: 'Clara', role: 'Customer', x: 85, y: 50, color: '#f97316', status: 'busy', currentTask: 'Client support', connections: ['communications', 'marketing', 'negotiation-expert'], messageCount: 58 },
  { id: 'hr', name: 'Harper', role: 'HR', x: 30, y: 65, color: '#06b6d4', status: 'idle', currentTask: 'Team development', connections: ['operations', 'legal'], messageCount: 22 },
  { id: 'legal', name: 'Lex', role: 'Legal', x: 60, y: 60, color: '#64748b', status: 'active', currentTask: 'Contract review', connections: ['finance', 'government-contracts'], messageCount: 28 },
  { id: 'cto', name: 'Code Cmd', role: 'CTO', x: 20, y: 80, color: '#7c3aed', status: 'busy', currentTask: 'Architecture design', connections: ['data', 'operations'], messageCount: 47 },
  { id: 'data', name: 'Dr. Data', role: 'Data Science', x: 45, y: 78, color: '#059669', status: 'active', currentTask: 'Predictive modeling', connections: ['intelligence', 'strategy', 'cto'], messageCount: 39 },
  { id: 'intelligence', name: 'Intel', role: 'BI Analyst', x: 70, y: 75, color: '#d97706', status: 'active', currentTask: 'Market research', connections: ['strategy', 'data'], messageCount: 33 },
  { id: 'communications', name: 'Comm', role: 'Comms', x: 90, y: 35, color: '#3b82f6', status: 'active', currentTask: 'PR management', connections: ['marketing', 'customer'], messageCount: 36 },
  { id: 'documents', name: 'Doc', role: 'Documents', x: 10, y: 65, color: '#475569', status: 'idle', currentTask: 'Knowledge base update', connections: ['legal', 'operations'], messageCount: 19 },
  { id: 'grant-expert', name: 'Grant', role: 'Grants', x: 5, y: 40, color: '#16a34a', status: 'active', currentTask: 'Grant research', connections: ['finance', 'government-contracts', 'digital-fundraising'], messageCount: 25 },
  { id: 'government-contracts', name: 'Samuel', role: 'Gov Contracts', x: 35, y: 92, color: '#dc2626', status: 'active', currentTask: 'RFP analysis', connections: ['legal', 'grant-expert'], messageCount: 21 },
  { id: 'chief-strategy', name: 'Victoria', role: 'Chief Strategy', x: 65, y: 92, color: '#7c3aed', status: 'active', currentTask: 'Growth planning', connections: ['executive-eva', 'strategy'], messageCount: 30 },
  { id: 'negotiation-expert', name: 'Marcus', role: 'Negotiation', x: 88, y: 70, color: '#ea580c', status: 'busy', currentTask: 'Deal structuring', connections: ['customer', 'legal'], messageCount: 27 },
  { id: 'digital-fundraising', name: 'Diana', role: 'Fundraising', x: 80, y: 88, color: '#0891b2', status: 'active', currentTask: 'Campaign analytics', connections: ['marketing', 'grant-expert'], messageCount: 31 },
];

const sampleMessages = [
  'Analyzing market trends for Q1 report',
  'Optimizing campaign performance metrics',
  'Reviewing compliance requirements',
  'Processing financial model update',
  'Coordinating team development plan',
  'Updating strategic roadmap',
  'Generating customer insights report',
  'Running predictive analysis pipeline',
];

const AgentNetwork = () => {
  const [agents, setAgents] = useState<AgentNode[]>(initialAgents);
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentNode | null>(null);
  const [showConnections, setShowConnections] = useState(true);
  const [totalMessages, setTotalMessages] = useState(642);
  const [activeCollabs, setActiveCollabs] = useState(12);

  // Simulate live agent activity
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: Math.random() > 0.15 ? (Math.random() > 0.3 ? 'active' : 'busy') : 'idle',
        messageCount: agent.messageCount + Math.floor(Math.random() * 3),
      })));
      setTotalMessages(prev => prev + Math.floor(Math.random() * 5) + 1);
      setActiveCollabs(Math.floor(Math.random() * 6) + 8);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate live messages between agents
  useEffect(() => {
    const interval = setInterval(() => {
      const fromAgent = agents[Math.floor(Math.random() * agents.length)];
      const toId = fromAgent.connections[Math.floor(Math.random() * fromAgent.connections.length)];
      if (!toId) return;

      const newMsg: LiveMessage = {
        id: Date.now().toString(),
        from: fromAgent.id,
        to: toId,
        content: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
        timestamp: new Date(),
        progress: 0,
      };

      setLiveMessages(prev => [...prev.slice(-8), newMsg]);
    }, 2500);
    return () => clearInterval(interval);
  }, [agents]);

  // Animate message progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMessages(prev => prev
        .map(msg => ({ ...msg, progress: Math.min(msg.progress + 10, 100) }))
        .filter(msg => msg.progress < 100)
      );
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'busy': return '#f59e0b';
      case 'idle': return '#94a3b8';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Network className="w-8 h-8 text-indigo-600" />
              Agent Network
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Live visualization of AI agent communications and collaborations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant={showConnections ? 'default' : 'outline'}
              onClick={() => setShowConnections(!showConnections)}
              className={showConnections ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : ''}
            >
              {showConnections ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
              Connections
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{agents.filter(a => a.status !== 'idle').length}/18</p>
              <p className="text-xs text-gray-500">Agents Active</p>
            </div>
          </Card>
          <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMessages}</p>
              <p className="text-xs text-gray-500">Messages Today</p>
            </div>
          </Card>
          <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeCollabs}</p>
              <p className="text-xs text-gray-500">Active Collaborations</p>
            </div>
          </Card>
          <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-lg">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">99.97%</p>
              <p className="text-xs text-gray-500">Network Uptime</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Network Graph */}
          <Card className="lg:col-span-3 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="relative w-full" style={{ paddingBottom: '60%' }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {/* Connection Lines */}
                {showConnections && agents.map(agent =>
                  agent.connections.map(connId => {
                    const target = agents.find(a => a.id === connId);
                    if (!target) return null;
                    const hasLiveMsg = liveMessages.some(m =>
                      (m.from === agent.id && m.to === connId) || (m.from === connId && m.to === agent.id)
                    );
                    return (
                      <line
                        key={`${agent.id}-${connId}`}
                        x1={agent.x} y1={agent.y}
                        x2={target.x} y2={target.y}
                        stroke={hasLiveMsg ? '#6366f1' : '#e5e7eb'}
                        strokeWidth={hasLiveMsg ? 0.4 : 0.15}
                        opacity={hasLiveMsg ? 0.8 : 0.5}
                        className="transition-all duration-500"
                      />
                    );
                  })
                )}

                {/* Live message particles */}
                {liveMessages.map(msg => {
                  const fromAgent = agents.find(a => a.id === msg.from);
                  const toAgent = agents.find(a => a.id === msg.to);
                  if (!fromAgent || !toAgent) return null;
                  const px = fromAgent.x + (toAgent.x - fromAgent.x) * (msg.progress / 100);
                  const py = fromAgent.y + (toAgent.y - fromAgent.y) * (msg.progress / 100);
                  return (
                    <circle
                      key={msg.id}
                      cx={px} cy={py}
                      r={0.6}
                      fill="#6366f1"
                      opacity={0.9}
                    >
                      <animate attributeName="r" values="0.4;0.8;0.4" dur="1s" repeatCount="indefinite" />
                    </circle>
                  );
                })}

                {/* Agent Nodes */}
                {agents.map(agent => (
                  <g
                    key={agent.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
                  >
                    {/* Outer glow */}
                    <circle
                      cx={agent.x} cy={agent.y}
                      r={selectedAgent?.id === agent.id ? 3.5 : 2.8}
                      fill={agent.color}
                      opacity={0.15}
                      className="transition-all duration-300"
                    />
                    {/* Main circle */}
                    <circle
                      cx={agent.x} cy={agent.y}
                      r={selectedAgent?.id === agent.id ? 2.5 : 2}
                      fill={agent.color}
                      stroke="white"
                      strokeWidth={0.3}
                      className="transition-all duration-300"
                    />
                    {/* Status indicator */}
                    <circle
                      cx={agent.x + 1.5} cy={agent.y - 1.5}
                      r={0.5}
                      fill={getStatusColor(agent.status)}
                      stroke="white"
                      strokeWidth={0.15}
                    />
                    {/* Label */}
                    <text
                      x={agent.x} y={agent.y + 4.5}
                      textAnchor="middle"
                      fill="currentColor"
                      className="text-gray-700 dark:text-gray-300"
                      fontSize={2.2}
                      fontWeight="600"
                    >
                      {agent.name}
                    </text>
                    <text
                      x={agent.x} y={agent.y + 6.5}
                      textAnchor="middle"
                      fill="currentColor"
                      className="text-gray-400"
                      fontSize={1.5}
                    >
                      {agent.role}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Agent Detail */}
            {selectedAgent && (
              <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: selectedAgent.color }}>
                    {selectedAgent.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{selectedAgent.name}</h3>
                    <p className="text-xs text-gray-500">{selectedAgent.role}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <Badge className={`${
                      selectedAgent.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedAgent.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>{selectedAgent.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Messages</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedAgent.messageCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Connections</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedAgent.connections.length}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 text-xs mb-1">Current Task</p>
                    <p className="text-gray-900 dark:text-white font-medium text-xs">{selectedAgent.currentTask}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Live Activity Feed */}
            <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                Live Activity
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {liveMessages.slice().reverse().map(msg => {
                  const fromAgent = agents.find(a => a.id === msg.from);
                  const toAgent = agents.find(a => a.id === msg.to);
                  return (
                    <div key={msg.id} className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="font-semibold" style={{ color: fromAgent?.color }}>{fromAgent?.name}</span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="font-semibold" style={{ color: toAgent?.color }}>{toAgent?.name}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 truncate">{msg.content}</p>
                    </div>
                  );
                })}
                {liveMessages.length === 0 && (
                  <p className="text-gray-400 text-xs text-center py-4">Waiting for activity...</p>
                )}
              </div>
            </Card>

            {/* Legend */}
            <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Status Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Active - Processing tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Busy - Heavy workload</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-3 h-3 fill-gray-400 text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Idle - Awaiting tasks</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentNetwork;
