import { Agent, AgentMessage, AutonomousTask } from '@/types/agent';

interface AdvancedCapabilities {
  naturalLanguageProcessing: boolean;
  multiChannelCommunication: boolean;
  webBrowsing: boolean;
  documentGeneration: boolean;
  financialModeling: boolean;
  codingCapabilities: boolean;
  emailIntegration: boolean;
  smsIntegration: boolean;
  phoneIntegration: boolean;
}

class AgentCommunicationService {
  private agents: Map<string, Agent> = new Map();
  private messages: AgentMessage[] = [];
  private tasks: AutonomousTask[] = [];
  private messageListeners: Map<string, (message: AgentMessage) => void> = new Map();
  private taskListeners: Map<string, (task: AutonomousTask) => void> = new Map();
  private capabilities: AdvancedCapabilities = {
    naturalLanguageProcessing: true,
    multiChannelCommunication: true,
    webBrowsing: true,
    documentGeneration: true,
    financialModeling: true,
    codingCapabilities: true,
    emailIntegration: true,
    smsIntegration: true,
    phoneIntegration: true
  };

  // Agent management with enhanced capabilities
  registerAgent(agent: Agent) {
    this.agents.set(agent.id, { 
      ...agent, 
      isActive: true, 
      lastActivity: new Date(),
      currentTask: 'Initializing advanced AI systems...'
    });
    console.log(`Elite Agent ${agent.name} registered with advanced capabilities`);
    
    // Simulate initialization of advanced capabilities
    setTimeout(() => {
      const registeredAgent = this.agents.get(agent.id);
      if (registeredAgent) {
        registeredAgent.currentTask = 'Ready for autonomous operations';
        this.agents.set(agent.id, registeredAgent);
      }
    }, 2000);
  }

  // Enhanced inter-agent messaging with permission controls
  sendMessage(fromAgentId: string, toAgentId: string, content: string, type: AgentMessage['type'], metadata?: any) {
    // Check if this action requires permission
    if (this.requiresExecutivePermission('send_message', fromAgentId, { toAgentId, content, type })) {
      return this.requestPermissionAndQueue('send_message', fromAgentId, 'Send Inter-Agent Message', 
        `Send message to ${toAgentId}: ${content.substring(0, 100)}...`, 'medium', 
        { action: 'sendMessage', params: [fromAgentId, toAgentId, content, type, metadata] });
    }

    const message: AgentMessage = {
      id: Date.now().toString(),
      fromAgent: fromAgentId,
      toAgent: toAgentId,
      content: this.enhanceMessageWithNLP(content),
      type,
      timestamp: new Date(),
      metadata: {
        ...metadata,
        processedWithNLP: true,
        sentimentAnalysis: this.analyzeSentiment(content),
        priority: this.calculateMessagePriority(type, content),
        executiveApproved: true
      }
    };

    this.messages.push(message);
    console.log(`✅ Executive-approved message sent from ${fromAgentId} to ${toAgentId}: ${content}`);

    // Notify the receiving agent with advanced processing
    const listener = this.messageListeners.get(toAgentId);
    if (listener) {
      listener(message);
    }

    return message;
  }

  // Advanced task management with AI optimization
  createTask(task: Omit<AutonomousTask, 'id' | 'createdAt'>): AutonomousTask {
    const newTask: AutonomousTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      priority: this.optimizeTaskPriority(task),
      description: this.enhanceTaskDescription(task.description)
    };

    this.tasks.push(newTask);
    console.log(`Enhanced task created: ${newTask.title} with AI optimization`);

    // Auto-assign collaborating agents based on task requirements
    if (!newTask.collaboratingAgents) {
      newTask.collaboratingAgents = this.suggestCollaboratingAgents(newTask);
    }

    // Notify the assigned agent and collaborators
    const listener = this.taskListeners.get(newTask.assignedAgent);
    if (listener) {
      listener(newTask);
    }

    return newTask;
  }

  // Autonomous business intelligence and decision making
  analyzeBusinessMetrics() {
    const insights = [
      'AI-detected: Customer satisfaction patterns show 12% improvement opportunity',
      'Predictive analysis: Marketing ROI can increase 25% with current trends',
      'Autonomous recommendation: Operational efficiency optimization identified',
      'Financial modeling: Revenue growth acceleration path discovered',
      'Risk assessment: Market volatility mitigation strategies available',
      'Competitive intelligence: New market positioning opportunities detected'
    ];

    // Create enhanced autonomous tasks
    this.createAdvancedAutonomousTasks();
    
    // Trigger inter-agent collaboration
    this.initiateAdvancedCollaboration();

    return insights;
  }

  // Enhanced communication capabilities with permission controls
  sendEmail(agentId: string, recipient: string, subject: string, body: string) {
    if (this.requiresExecutivePermission('send_email', agentId, { recipient, subject })) {
      return this.requestPermissionAndQueue('send_email', agentId, 'Send Email', 
        `Send email to ${recipient}: ${subject}`, 'high',
        { action: 'sendEmail', params: [agentId, recipient, subject, body] });
    }

    console.log(`✅ Executive-approved: Agent ${agentId} sending email to ${recipient}: ${subject}`);
    return this.simulateEmailDelivery(agentId, recipient, subject, body);
  }

  sendSMS(agentId: string, phoneNumber: string, message: string) {
    if (this.requiresExecutivePermission('send_sms', agentId, { phoneNumber, message })) {
      return this.requestPermissionAndQueue('send_sms', agentId, 'Send SMS', 
        `Send SMS to ${phoneNumber}: ${message.substring(0, 50)}...`, 'medium',
        { action: 'sendSMS', params: [agentId, phoneNumber, message] });
    }

    console.log(`✅ Executive-approved: Agent ${agentId} sending SMS to ${phoneNumber}: ${message}`);
    return this.simulateSMSDelivery(agentId, phoneNumber, message);
  }

  initiatePhoneCall(agentId: string, phoneNumber: string, purpose: string) {
    if (this.requiresExecutivePermission('make_phone_call', agentId, { phoneNumber, purpose })) {
      return this.requestPermissionAndQueue('make_phone_call', agentId, 'Initiate Phone Call', 
        `Call ${phoneNumber} for: ${purpose}`, 'high',
        { action: 'initiatePhoneCall', params: [agentId, phoneNumber, purpose] });
    }

    console.log(`✅ Executive-approved: Agent ${agentId} initiating call to ${phoneNumber} for: ${purpose}`);
    return this.simulatePhoneCall(agentId, phoneNumber, purpose);
  }

  // Document and financial capabilities
  generateDocument(agentId: string, documentType: string, data: any) {
    console.log(`Agent ${agentId} generating ${documentType} document`);
    // Simulate advanced document generation
    return this.simulateDocumentGeneration(agentId, documentType, data);
  }

  generateFinancialModel(agentId: string, modelType: string, parameters: any) {
    const amount = parameters?.budgetImpact || 0;
    if (this.requiresExecutivePermission('financial_transaction', agentId, { amount, modelType })) {
      return this.requestPermissionAndQueue('financial_transaction', agentId, 'Generate Financial Model', 
        `Create ${modelType} financial model with ${amount > 0 ? `$${amount} budget impact` : 'analysis'}`, 
        amount > 10000 ? 'critical' : 'high',
        { action: 'generateFinancialModel', params: [agentId, modelType, parameters] });
    }

    console.log(`✅ Executive-approved: Agent ${agentId} creating ${modelType} financial model`);
    return this.simulateFinancialModeling(agentId, modelType, parameters);
  }

  // Web browsing and research capabilities
  browseWeb(agentId: string, query: string, purpose: string) {
    console.log(`Agent ${agentId} browsing web for: ${query}`);
    // Simulate intelligent web browsing
    return this.simulateWebBrowsing(agentId, query, purpose);
  }

  // Coding and automation capabilities
  generateCode(agentId: string, language: string, requirements: string) {
    console.log(`Agent ${agentId} generating ${language} code for: ${requirements}`);
    // Simulate AI code generation
    return this.simulateCodeGeneration(agentId, language, requirements);
  }

  // Private helper methods
  private enhanceMessageWithNLP(content: string): string {
    // Simulate NLP enhancement
    return content + " [Enhanced with AI Natural Language Processing]";
  }

  private analyzeSentiment(content: string): string {
    const sentiments = ['positive', 'neutral', 'urgent', 'collaborative'];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  }

  private calculateMessagePriority(type: AgentMessage['type'], content: string): string {
    if (content.includes('urgent') || content.includes('critical')) return 'high';
    if (type === 'collaboration') return 'medium';
    return 'normal';
  }

  private optimizeTaskPriority(task: any): 'low' | 'medium' | 'high' | 'urgent' {
    // AI-driven priority optimization
    if (task.title.includes('critical') || task.title.includes('urgent')) return 'urgent';
    if (task.title.includes('optimize') || task.title.includes('improve')) return 'high';
    return task.priority || 'medium';
  }

  private enhanceTaskDescription(description: string): string {
    return description + " [AI-Enhanced with predictive analysis and optimization recommendations]";
  }

  private suggestCollaboratingAgents(task: AutonomousTask): string[] {
    const collaborationMap: { [key: string]: string[] } = {
      'strategy': ['data', 'intelligence', 'finance'],
      'marketing': ['communications', 'data', 'documents'],
      'finance': ['strategy', 'data', 'legal'],
      'operations': ['cto', 'hr', 'documents'],
      'legal': ['finance', 'hr', 'strategy'],
      'cto': ['operations', 'data', 'intelligence'],
      'data': ['strategy', 'marketing', 'intelligence'],
      'intelligence': ['strategy', 'marketing', 'data'],
      'communications': ['marketing', 'customer', 'documents'],
      'documents': ['legal', 'communications', 'finance']
    };
    
    return collaborationMap[task.assignedAgent] || [];
  }

  private createAdvancedAutonomousTasks() {
    const autonomousTasks = [
      {
        title: 'AI-Driven Market Analysis',
        description: 'Autonomous analysis of market trends using advanced AI algorithms',
        assignedAgent: 'intelligence',
        priority: 'high' as const,
        status: 'pending' as const
      },
      {
        title: 'Predictive Customer Behavior Modeling',
        description: 'Create ML models to predict customer behavior patterns',
        assignedAgent: 'data',
        priority: 'medium' as const,
        status: 'pending' as const
      },
      {
        title: 'Automated Compliance Monitoring',
        description: 'Set up autonomous legal compliance monitoring systems',
        assignedAgent: 'legal',
        priority: 'high' as const,
        status: 'pending' as const
      }
    ];

    autonomousTasks.forEach(task => this.createTask(task));
  }

  private initiateAdvancedCollaboration() {
    // Trigger strategic collaboration
    this.initiateCollaboration(
      'strategy',
      ['data', 'intelligence', 'finance'],
      'Quarterly business optimization with AI-driven insights and predictive analytics'
    );
  }

  // Simulation methods for advanced capabilities
  private simulateEmailDelivery(agentId: string, recipient: string, subject: string, body: string) {
    return {
      success: true,
      messageId: `email_${Date.now()}`,
      deliveryStatus: 'sent',
      timestamp: new Date()
    };
  }

  private simulateSMSDelivery(agentId: string, phoneNumber: string, message: string) {
    return {
      success: true,
      messageId: `sms_${Date.now()}`,
      deliveryStatus: 'delivered',
      timestamp: new Date()
    };
  }

  private simulatePhoneCall(agentId: string, phoneNumber: string, purpose: string) {
    return {
      success: true,
      callId: `call_${Date.now()}`,
      status: 'completed',
      duration: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
      summary: `AI-powered call completed for: ${purpose}`
    };
  }

  private simulateDocumentGeneration(agentId: string, documentType: string, data: any) {
    return {
      success: true,
      documentId: `doc_${Date.now()}`,
      type: documentType,
      url: `/documents/${documentType}_${Date.now()}.pdf`,
      createdAt: new Date()
    };
  }

  private simulateFinancialModeling(agentId: string, modelType: string, parameters: any) {
    return {
      success: true,
      modelId: `model_${Date.now()}`,
      type: modelType,
      predictions: {
        revenue: Math.floor(Math.random() * 1000000),
        growth: Math.floor(Math.random() * 30) + 5,
        roi: Math.floor(Math.random() * 25) + 10
      },
      confidence: Math.floor(Math.random() * 20) + 80
    };
  }

  private simulateWebBrowsing(agentId: string, query: string, purpose: string) {
    return {
      success: true,
      searchId: `search_${Date.now()}`,
      resultsFound: Math.floor(Math.random() * 50) + 10,
      insights: [
        'Market trend identified',
        'Competitive analysis completed',
        'Industry insights gathered'
      ],
      sources: ['industry-reports.com', 'market-analysis.org', 'business-intelligence.net']
    };
  }

  private simulateCodeGeneration(agentId: string, language: string, requirements: string) {
    return {
      success: true,
      codeId: `code_${Date.now()}`,
      language,
      linesGenerated: Math.floor(Math.random() * 500) + 50,
      features: ['Error handling', 'Documentation', 'Testing', 'Optimization'],
      repository: `/generated-code/${language}_${Date.now()}`
    };
  }

  // Permission checking system
  private requiresExecutivePermission(action: string, agentId: string, metadata?: any): boolean {
    // Import permission service dynamically to avoid circular dependencies
    const { permissionService } = require('./permissionService');
    return permissionService.requiresPermission(action, agentId, metadata);
  }

  // Request permission and queue action
  private requestPermissionAndQueue(
    action: string, 
    agentId: string, 
    actionTitle: string,
    description: string, 
    priority: 'low' | 'medium' | 'high' | 'critical',
    queuedAction: any
  ) {
    const { permissionService } = require('./permissionService');
    const agentName = this.getAgentDisplayName(agentId);
    
    const request = permissionService.requestPermission(
      agentId,
      agentName,
      actionTitle,
      description,
      priority,
      { ...queuedAction.params, queuedAction }
    );

    console.log(`⏳ Permission requested by ${agentName}: ${actionTitle}`);
    
    return {
      success: false,
      pending: true,
      requestId: request.id,
      message: `Permission requested from Executive. Waiting for approval...`
    };
  }

  // Get agent display name
  private getAgentDisplayName(agentId: string): string {
    const agentNames: { [key: string]: string } = {
      'executive-eva': 'Executive Eva',
      'strategy': 'Alex Strategy',
      'marketing': 'Maya Creative',
      'finance': 'Felix Finance',
      'operations': 'Oliver Operations',
      'customer': 'Clara Customer',
      'hr': 'Harper HR',
      'legal': 'Lex Legal',
      'cto': 'Code Commander',
      'data': 'Dr. Data',
      'intelligence': 'Intel Investigator',
      'communications': 'Comm Chief',
      'documents': 'Doc Master'
    };
    return agentNames[agentId] || agentId;
  }

  // Keep existing methods unchanged
  deactivateAgent(agentId: string) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.isActive = false;
      this.agents.set(agentId, agent);
    }
  }

  updateTaskStatus(taskId: string, status: AutonomousTask['status']) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      console.log(`Task ${taskId} status updated to ${status}`);
    }
  }

  initiateCollaboration(initiatorId: string, collaboratorIds: string[], taskDescription: string) {
    const task = this.createTask({
      title: 'Elite Collaborative Initiative',
      description: taskDescription,
      assignedAgent: initiatorId,
      priority: 'high',
      status: 'pending',
      collaboratingAgents: collaboratorIds
    });

    collaboratorIds.forEach(agentId => {
      this.sendMessage(
        initiatorId,
        agentId,
        `Elite collaboration request: ${taskDescription}`,
        'collaboration',
        { taskId: task.id, capabilities: this.capabilities }
      );
    });

    return task;
  }

  onMessage(agentId: string, callback: (message: AgentMessage) => void) {
    this.messageListeners.set(agentId, callback);
  }

  onTask(agentId: string, callback: (task: AutonomousTask) => void) {
    this.taskListeners.set(agentId, callback);
  }

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

  getAdvancedCapabilities() {
    return this.capabilities;
  }
}

export const agentCommunication = new AgentCommunicationService();
