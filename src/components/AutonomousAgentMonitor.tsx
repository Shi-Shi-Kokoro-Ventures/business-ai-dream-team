
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity,
  MessageSquare,
  CheckCircle,
  Clock,
  Users,
  Brain,
  Zap,
  Loader2,
  Target,
  GitBranch,
  AlertCircle,
  Package
} from 'lucide-react';
import { agentCommunication } from '@/services/agentCommunication';
import { agentBrain, ThoughtStep, AgentPlan, Deliverable } from '@/services/agentBrain';
import { Agent, AgentMessage, AutonomousTask } from '@/types/agent';

interface AutonomousAgentMonitorProps {
  agents: Agent[];
}

interface AgentActivity {
  id: string;
  agentId: string;
  agentName: string;
  type: 'thinking' | 'plan_created' | 'step_completed' | 'deliverable' | 'collaboration' | 'task_completed';
  description: string;
  timestamp: Date;
  details?: string;
}

const AutonomousAgentMonitor = ({ agents }: AutonomousAgentMonitorProps) => {
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [recentMessages, setRecentMessages] = useState<AgentMessage[]>([]);
  const [activeTasks, setActiveTasks] = useState<AutonomousTask[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([]);
  const [thinkingAgents, setThinkingAgents] = useState<Set<string>>(new Set());
  const [completedPlans, setCompletedPlans] = useState(0);
  const [totalDeliverables, setTotalDeliverables] = useState(0);

  // Subscribe to real AgentBrain thought stream
  useEffect(() => {
    const unsubscribe = agentBrain.subscribe((thought) => {
      const agentInfo = agents.find(a => a.id === thought.agentId);
      const agentName = agentInfo?.name || thought.agentId;

      if (thought.isThinking) {
        setThinkingAgents(prev => new Set(prev).add(thought.agentId));
      } else {
        setThinkingAgents(prev => {
          const next = new Set(prev);
          next.delete(thought.agentId);
          return next;
        });
      }

      // Track latest thought as activity
      const latestThought = thought.thoughts[thought.thoughts.length - 1];
      if (latestThought && latestThought.status === 'complete') {
        const activity: AgentActivity = {
          id: latestThought.id,
          agentId: thought.agentId,
          agentName,
          type: latestThought.type === 'synthesis' ? 'deliverable' :
                latestThought.type === 'planning' ? 'plan_created' :
                latestThought.type === 'delegation' ? 'collaboration' :
                latestThought.type === 'execution' ? 'step_completed' : 'thinking',
          description: latestThought.content,
          timestamp: latestThought.timestamp,
          details: latestThought.result
        };

        setAgentActivities(prev => [activity, ...prev].slice(0, 50));
      }

      // Track plan completions
      if (thought.plan && thought.plan.status === 'completed') {
        setCompletedPlans(prev => prev + 1);
        if (thought.plan.deliverables.length > 0) {
          setTotalDeliverables(prev => prev + thought.plan.deliverables.length);
        }
      }
    });

    return unsubscribe;
  }, [agents]);

  // Register agents and start monitoring
  useEffect(() => {
    agents.forEach(agent => {
      agentCommunication.registerAgent({
        ...agent,
        isActive: true,
        lastActivity: new Date()
      });
    });

    if (isMonitoring) {
      const interval = setInterval(() => {
        updateMonitorData();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [agents, isMonitoring]);

  const updateMonitorData = useCallback(() => {
    setActiveAgents(agentCommunication.getActiveAgents());

    const allMessages = agentCommunication.getActiveAgents()
      .flatMap(agent => agentCommunication.getAgentMessages(agent.id))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
    setRecentMessages(allMessages);

    const allTasks = agentCommunication.getActiveAgents()
      .flatMap(agent => agentCommunication.getAgentTasks(agent.id))
      .filter(task => task.status !== 'completed');
    setActiveTasks(allTasks);
  }, []);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      agentCommunication.analyzeBusinessMetrics();
      updateMonitorData();
    }
  };

  const initiateTeamCollaboration = () => {
    const activeAgentIds = activeAgents.map(a => a.id);
    agentCommunication.initiateCollaboration(
      'strategy',
      activeAgentIds.filter(id => id !== 'strategy'),
      'Quarterly business optimization initiative'
    );
    updateMonitorData();
  };

  // Get current agent brain activity
  const activeThoughts = agentBrain.getAllActiveThoughts();
  const allPlans = agentBrain.getPlans();
  const recentPlans = allPlans.slice(-5);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/80 dark:to-gray-700/80 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Autonomous Agent Network</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Live AI reasoning and task execution monitor</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={toggleMonitoring}
              className={`${isMonitoring ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              <Activity className="w-4 h-4 mr-2" />
              {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
            </Button>
            <Button onClick={initiateTeamCollaboration} variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              <Users className="w-4 h-4 mr-2" />
              Team Collaboration
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{agents.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Agents</div>
          </div>
          <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
              {thinkingAgents.size}
              {thinkingAgents.size > 0 && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Agents Thinking</div>
          </div>
          <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completedPlans}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Plans Completed</div>
          </div>
          <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalDeliverables}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Deliverables</div>
          </div>
        </div>
      </Card>

      {/* Live Agent Reasoning Activity */}
      {activeThoughts.length > 0 && (
        <Card className="p-6 border-0 shadow-lg dark:bg-gray-800/80">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Brain className="w-5 h-5 text-purple-500 animate-pulse" />
            Live Agent Reasoning
          </h4>
          <div className="space-y-4">
            {activeThoughts.map((thought) => {
              const agentInfo = agents.find(a => a.id === thought.agentId);
              return (
                <div key={thought.agentId} className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${agentInfo?.color || 'from-blue-500 to-purple-500'} text-white`}>
                      <Brain className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{agentInfo?.name || thought.agentId}</span>
                    <Loader2 className="w-4 h-4 text-purple-500 animate-spin ml-auto" />
                  </div>
                  <div className="space-y-1.5 ml-8">
                    {thought.thoughts.slice(-4).map((step) => (
                      <div key={step.id} className="flex items-start gap-2">
                        {step.status === 'thinking' ? (
                          <Loader2 className="w-3 h-3 text-blue-400 animate-spin mt-1 flex-shrink-0" />
                        ) : step.status === 'complete' ? (
                          <CheckCircle className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-red-400 mt-1 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className={`text-[10px] font-bold uppercase tracking-wide ${
                            step.type === 'analysis' ? 'text-blue-600 dark:text-blue-400' :
                            step.type === 'planning' ? 'text-purple-600 dark:text-purple-400' :
                            step.type === 'execution' ? 'text-green-600 dark:text-green-400' :
                            step.type === 'delegation' ? 'text-yellow-600 dark:text-yellow-400' :
                            step.type === 'synthesis' ? 'text-cyan-600 dark:text-cyan-400' :
                            'text-gray-500 dark:text-gray-400'
                          }`}>{step.type}</span>
                          <p className="text-xs text-gray-700 dark:text-gray-300">{step.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {thought.plan && (
                    <div className="mt-3 ml-8 pt-2 border-t border-purple-200 dark:border-purple-700/50">
                      <div className="flex items-center gap-1.5 mb-1">
                        <GitBranch className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                          Plan: {thought.plan.steps.filter(s => s.status === 'completed').length}/{thought.plan.steps.length} steps
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status */}
        <Card className="p-6 border-0 shadow-lg dark:bg-gray-800/80">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Zap className="w-5 h-5 text-yellow-500" />
            Agent Status
          </h4>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {agents.map(agent => {
                const isThinking = thinkingAgents.has(agent.id);
                const latestActivity = agentActivities.find(a => a.agentId === agent.id);
                return (
                  <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.color} text-white flex-shrink-0`}>
                        {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : agent.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white">{agent.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {isThinking ? 'Processing...' : (latestActivity?.description || 'Available')}
                        </div>
                      </div>
                    </div>
                    <Badge className={isThinking
                      ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700'
                      : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
                    }>
                      {isThinking ? 'Thinking' : 'Active'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </Card>

        {/* Live Activity Feed */}
        <Card className="p-6 border-0 shadow-lg dark:bg-gray-800/80">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Activity className="w-5 h-5 text-blue-500" />
            Live Activity Feed
          </h4>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {agentActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No agent activity yet.</p>
                  <p className="text-xs mt-1">Chat with an agent to see live reasoning.</p>
                </div>
              ) : (
                agentActivities.map(activity => (
                  <div key={activity.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {activity.type === 'thinking' && <Brain className="w-3.5 h-3.5 text-purple-500" />}
                        {activity.type === 'plan_created' && <GitBranch className="w-3.5 h-3.5 text-indigo-500" />}
                        {activity.type === 'step_completed' && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                        {activity.type === 'deliverable' && <Package className="w-3.5 h-3.5 text-emerald-500" />}
                        {activity.type === 'collaboration' && <Users className="w-3.5 h-3.5 text-yellow-500" />}
                        {activity.type === 'task_completed' && <Target className="w-3.5 h-3.5 text-blue-500" />}
                        <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                          {activity.agentName}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{activity.description}</p>
                    {activity.details && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{activity.details}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Recent Plans */}
      {recentPlans.length > 0 && (
        <Card className="p-6 border-0 shadow-lg dark:bg-gray-800/80">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Target className="w-5 h-5 text-blue-500" />
            Recent Execution Plans
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPlans.map(plan => {
              const agentInfo = agents.find(a => a.id === plan.agentId);
              const completedSteps = plan.steps.filter(s => s.status === 'completed').length;
              return (
                <div key={plan.id} className={`p-4 rounded-lg border-l-4 ${
                  plan.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
                  plan.status === 'executing' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' :
                  plan.status === 'failed' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                  'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900 dark:text-white text-sm truncate">{plan.objective.substring(0, 50)}</h5>
                    <Badge className={`text-xs ${
                      plan.status === 'completed' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                      plan.status === 'executing' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {plan.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Agent: {agentInfo?.name || plan.agentId}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Steps: {completedSteps}/{plan.steps.length}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {plan.deliverables.length} deliverable(s)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        plan.status === 'completed' ? 'bg-green-500' :
                        plan.status === 'executing' ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${plan.steps.length > 0 ? (completedSteps / plan.steps.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Active Tasks from Communication */}
      {activeTasks.length > 0 && (
        <Card className="p-6 border-0 shadow-lg dark:bg-gray-800/80">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Active Tasks
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTasks.map(task => (
              <div key={task.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900 dark:text-white">{task.title}</h5>
                  <Badge className={`text-xs ${
                    task.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                    task.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' :
                    task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Assigned: {agents.find(a => a.id === task.assignedAgent)?.name}
                  </span>
                  <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {task.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AutonomousAgentMonitor;
