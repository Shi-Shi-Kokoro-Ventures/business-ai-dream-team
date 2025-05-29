
import { Agent, AgentMessage, AutonomousTask } from '@/types/agent';

class AgentCommunicationService {
  private agents: Map<string, Agent> = new Map();
  private messages: AgentMessage[] = [];
  private tasks: AutonomousTask[] = [];
  private messageListeners: Map<string, (message: AgentMessage) => void> = new Map();
  private taskListeners: Map<string, (task: AutonomousTask) => void> = new Map();

  // Agent management
  registerAgent(agent: Agent) {
    this.agents.set(agent.id, { ...agent, isActive: true, lastActivity: new Date() });
    console.log(`Agent ${agent.name} registered and active`);
  }

  deactivateAgent(agentId: string) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.isActive = false;
      this.agents.set(agentId, agent);
    }
  }

  // Inter-agent messaging
  sendMessage(fromAgentId: string, toAgentId: string, content: string, type: AgentMessage['type'], metadata?: any) {
    const message: AgentMessage = {
      id: Date.now().toString(),
      fromAgent: fromAgentId,
      toAgent: toAgentId,
      content,
      type,
      timestamp: new Date(),
      metadata
    };

    this.messages.push(message);
    console.log(`Message sent from ${fromAgentId} to ${toAgentId}: ${content}`);

    // Notify the receiving agent
    const listener = this.messageListeners.get(toAgentId);
    if (listener) {
      listener(message);
    }

    return message;
  }

  // Task management
  createTask(task: Omit<AutonomousTask, 'id' | 'createdAt'>): AutonomousTask {
    const newTask: AutonomousTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    this.tasks.push(newTask);
    console.log(`Task created: ${newTask.title} assigned to ${newTask.assignedAgent}`);

    // Notify the assigned agent
    const listener = this.taskListeners.get(newTask.assignedAgent);
    if (listener) {
      listener(newTask);
    }

    return newTask;
  }

  updateTaskStatus(taskId: string, status: AutonomousTask['status']) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      console.log(`Task ${taskId} status updated to ${status}`);
    }
  }

  // Autonomous behavior
  initiateCollaboration(initiatorId: string, collaboratorIds: string[], taskDescription: string) {
    const task = this.createTask({
      title: 'Collaborative Task',
      description: taskDescription,
      assignedAgent: initiatorId,
      priority: 'medium',
      status: 'pending',
      collaboratingAgents: collaboratorIds
    });

    // Notify all collaborating agents
    collaboratorIds.forEach(agentId => {
      this.sendMessage(
        initiatorId,
        agentId,
        `I need your expertise for: ${taskDescription}`,
        'collaboration',
        { taskId: task.id }
      );
    });

    return task;
  }

  // Autonomous decision making
  analyzeBusinessMetrics() {
    // Simulate autonomous analysis
    const insights = [
      'Customer satisfaction down 5% this quarter',
      'Marketing campaign ROI increased 12%',
      'Operational efficiency improved 8%',
      'Revenue growth slowing in Q4'
    ];

    // Automatically assign tasks based on insights
    this.createTask({
      title: 'Improve Customer Satisfaction',
      description: 'Analyze feedback and create improvement plan',
      assignedAgent: 'customer',
      priority: 'high',
      status: 'pending'
    });

    this.createTask({
      title: 'Optimize Marketing Spend',
      description: 'Reallocate budget to high-performing campaigns',
      assignedAgent: 'marketing',
      priority: 'medium',
      status: 'pending'
    });

    return insights;
  }

  // Event listeners
  onMessage(agentId: string, callback: (message: AgentMessage) => void) {
    this.messageListeners.set(agentId, callback);
  }

  onTask(agentId: string, callback: (task: AutonomousTask) => void) {
    this.taskListeners.set(agentId, callback);
  }

  // Get agent data
  getAgent(agentId: string) {
    return this.agents.get(agentId);
  }

  getActiveAgents() {
    return Array.from(this.agents.values()).filter(agent => agent.isActive);
  }

  getAgentMessages(agentId: string) {
    return this.messages.filter(msg => msg.fromAgent === agentId || msg.toAgent === agentId);
  }

  getAgentTasks(agentId: string) {
    return this.tasks.filter(task => 
      task.assignedAgent === agentId || 
      task.collaboratingAgents?.includes(agentId)
    );
  }
}

export const agentCommunication = new AgentCommunicationService();
