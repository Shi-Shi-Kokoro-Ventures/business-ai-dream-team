
import React, { useState, useEffect } from 'react';
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
  Zap
} from 'lucide-react';
import { agentCommunication } from '@/services/agentCommunication';
import { Agent, AgentMessage, AutonomousTask } from '@/types/agent';

interface AutonomousAgentMonitorProps {
  agents: Agent[];
}

const AutonomousAgentMonitor = ({ agents }: AutonomousAgentMonitorProps) => {
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [recentMessages, setRecentMessages] = useState<AgentMessage[]>([]);
  const [activeTasks, setActiveTasks] = useState<AutonomousTask[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Register all agents
    agents.forEach(agent => {
      agentCommunication.registerAgent({
        ...agent,
        isActive: true,
        lastActivity: new Date()
      });
    });

    // Start autonomous monitoring
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Simulate autonomous behavior
        simulateAutonomousBehavior();
        updateMonitorData();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [agents, isMonitoring]);

  const simulateAutonomousBehavior = () => {
    const activeAgentsList = agentCommunication.getActiveAgents();
    
    // Random inter-agent communication
    if (activeAgentsList.length >= 2 && Math.random() > 0.7) {
      const sender = activeAgentsList[Math.floor(Math.random() * activeAgentsList.length)];
      const receiver = activeAgentsList.filter(a => a.id !== sender.id)[0];
      
      const collaborationMessages = [
        "I've identified an opportunity for synergy in our current projects",
        "Can you share your latest insights on customer behavior?",
        "I need your expertise to optimize this process",
        "Let's collaborate on the upcoming quarterly review"
      ];
      
      agentCommunication.sendMessage(
        sender.id,
        receiver.id,
        collaborationMessages[Math.floor(Math.random() * collaborationMessages.length)],
        'collaboration'
      );
    }

    // Random task creation
    if (Math.random() > 0.8) {
      const assignee = activeAgentsList[Math.floor(Math.random() * activeAgentsList.length)];
      const taskTitles = [
        "Analyze quarterly performance metrics",
        "Optimize workflow efficiency",
        "Research market opportunities",
        "Improve customer engagement strategy"
      ];
      
      agentCommunication.createTask({
        title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
        description: "Autonomous task generated based on business analysis",
        assignedAgent: assignee.id,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        status: 'pending'
      });
    }
  };

  const updateMonitorData = () => {
    setActiveAgents(agentCommunication.getActiveAgents());
    
    // Get recent messages (last 10)
    const allMessages = agentCommunication.getActiveAgents()
      .flatMap(agent => agentCommunication.getAgentMessages(agent.id))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
    setRecentMessages(allMessages);
    
    // Get active tasks
    const allTasks = agentCommunication.getActiveAgents()
      .flatMap(agent => agentCommunication.getAgentTasks(agent.id))
      .filter(task => task.status !== 'completed');
    setActiveTasks(allTasks);
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      // Start autonomous analysis
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

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Autonomous Agent Network</h3>
              <p className="text-sm text-gray-600">Real-time monitoring of AI agent collaboration</p>
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
            <Button onClick={initiateTeamCollaboration} variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Team Collaboration
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{activeAgents.length}</div>
            <div className="text-sm text-gray-600">Active Agents</div>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{recentMessages.length}</div>
            <div className="text-sm text-gray-600">Recent Messages</div>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{activeTasks.length}</div>
            <div className="text-sm text-gray-600">Active Tasks</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Agent Status
          </h4>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {activeAgents.map(agent => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.color} text-white`}>
                      {agent.icon}
                    </div>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-gray-600">{agent.currentTask || 'Available'}</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Recent Communications */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Inter-Agent Communications
          </h4>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {recentMessages.map(message => (
                <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {agents.find(a => a.id === message.fromAgent)?.name} → {agents.find(a => a.id === message.toAgent)?.name}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{message.content}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Active Tasks */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Autonomous Tasks
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTasks.map(task => (
            <div key={task.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">{task.title}</h5>
                <Badge className={`text-xs ${
                  task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                  task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.priority}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Assigned: {agents.find(a => a.id === task.assignedAgent)?.name}
                </span>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AutonomousAgentMonitor;
