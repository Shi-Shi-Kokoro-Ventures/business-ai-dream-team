
export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  icon: React.ReactNode;
  color: string;
  isActive: boolean;
  currentTask?: string;
  lastActivity: Date;
}

export interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  content: string;
  type: 'task_request' | 'task_completion' | 'information_share' | 'collaboration';
  timestamp: Date;
  metadata?: any;
}

export interface AutonomousTask {
  id: string;
  title: string;
  description: string;
  assignedAgent: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'requires_input';
  createdAt: Date;
  dueDate?: Date;
  dependencies?: string[];
  collaboratingAgents?: string[];
}
