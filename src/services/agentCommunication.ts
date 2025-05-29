
import { Agent, AgentMessage, AutonomousTask } from '@/types/agent';
import { aiService } from './aiService';

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

  // Enhanced agent registration with AI personality integration
  registerAgent(agent: Agent) {
    this.agents.set(agent.id, { 
      ...agent, 
      isActive: true, 
      lastActivity: new Date(),
      currentTask: 'Initializing AI brain and personality systems...'
    });
    
    const personality = aiService.getAgentPersonality(agent.id);
    console.log(`Elite Agent ${agent.name} registered with AI personality: ${personality?.personality || 'Standard'}`);
    
    // Simulate AI initialization
    setTimeout(() => {
      const registeredAgent = this.agents.get(agent.id);
      if (registeredAgent) {
        registeredAgent.currentTask = 'AI systems online - Ready for intelligent autonomous operations';
        this.agents.set(agent.id, registeredAgent);
      }
    }, 2000);
  }

  // Enhanced inter-agent messaging with AI-generated content
  async sendMessage(fromAgentId: string, toAgentId: string, content: string, type: AgentMessage['type'], metadata?: any) {
    // Check if this action requires permission
    if (this.requiresExecutivePermission('send_message', fromAgentId, { toAgentId, content, type })) {
      return this.requestPermissionAndQueue('send_message', fromAgentId, 'Send Inter-Agent Message', 
        `Send AI-generated message to ${toAgentId}: ${content.substring(0, 100)}...`, 'medium', 
        { action: 'sendMessage', params: [fromAgentId, toAgentId, content, type, metadata] });
    }

    // Generate AI-enhanced message content
    const enhancedContent = await this.generateAIEnhancedMessage(fromAgentId, toAgentId, content, type);

    const message: AgentMessage = {
      id: Date.now().toString(),
      fromAgent: fromAgentId,
      toAgent: toAgentId,
      content: enhancedContent,
      type,
      timestamp: new Date(),
      metadata: {
        ...metadata,
        processedWithAI: true,
        originalContent: content,
        sentimentAnalysis: await this.analyzeMessageSentiment(enhancedContent),
        priority: this.calculateMessagePriority(type, enhancedContent),
        executiveApproved: true
      }
    };

    this.messages.push(message);
    console.log(`✅ AI-enhanced message sent from ${this.getAgentDisplayName(fromAgentId)} to ${this.getAgentDisplayName(toAgentId)}`);

    // Notify the receiving agent with AI processing
    const listener = this.messageListeners.get(toAgentId);
    if (listener) {
      listener(message);
    }

    return message;
  }

  // AI-powered task creation and optimization
  async createTask(task: Omit<AutonomousTask, 'id' | 'createdAt'>): Promise<AutonomousTask> {
    const enhancedDescription = await this.enhanceTaskWithAI(task.assignedAgent, task.description);
    
    const newTask: AutonomousTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      priority: this.optimizeTaskPriority(task),
      description: enhancedDescription
    };

    this.tasks.push(newTask);
    console.log(`AI-enhanced task created: ${newTask.title} with intelligent optimization`);

    // AI-powered collaborator suggestion
    if (!newTask.collaboratingAgents) {
      newTask.collaboratingAgents = await this.suggestCollaboratingAgentsWithAI(newTask);
    }

    // Notify the assigned agent and collaborators
    const listener = this.taskListeners.get(newTask.assignedAgent);
    if (listener) {
      listener(newTask);
    }

    return newTask;
  }

  // AI-powered business intelligence and decision making
  async analyzeBusinessMetrics() {
    const insights = await this.generateAIBusinessInsights();
    
    // Create AI-enhanced autonomous tasks
    await this.createAdvancedAutonomousTasks();
    
    // Trigger AI-powered inter-agent collaboration
    await this.initiateAdvancedCollaboration();

    return insights;
  }

  // Enhanced communication capabilities with AI content generation
  async sendEmail(agentId: string, recipient: string, subject: string, body: string) {
    if (this.requiresExecutivePermission('send_email', agentId, { recipient, subject })) {
      return this.requestPermissionAndQueue('send_email', agentId, 'Send AI-Generated Email', 
        `Send intelligent email to ${recipient}: ${subject}`, 'high',
        { action: 'sendEmail', params: [agentId, recipient, subject, body] });
    }

    // Generate AI-enhanced email content
    const enhancedEmail = await this.generateAIEmailContent(agentId, recipient, subject, body);
    
    console.log(`✅ Executive-approved: ${this.getAgentDisplayName(agentId)} sending AI-enhanced email to ${recipient}: ${enhancedEmail.subject}`);
    return this.simulateEmailDelivery(agentId, recipient, enhancedEmail.subject, enhancedEmail.body);
  }

  async sendSMS(agentId: string, phoneNumber: string, message: string) {
    if (this.requiresExecutivePermission('send_sms', agentId, { phoneNumber, message })) {
      return this.requestPermissionAndQueue('send_sms', agentId, 'Send AI-Optimized SMS', 
        `Send intelligent SMS to ${phoneNumber}: ${message.substring(0, 50)}...`, 'medium',
        { action: 'sendSMS', params: [agentId, phoneNumber, message] });
    }

    // Generate AI-optimized SMS content
    const optimizedMessage = await this.optimizeSMSWithAI(agentId, message);
    
    console.log(`✅ Executive-approved: ${this.getAgentDisplayName(agentId)} sending AI-optimized SMS to ${phoneNumber}: ${optimizedMessage}`);
    return this.simulateSMSDelivery(agentId, phoneNumber, optimizedMessage);
  }

  // AI-enhanced helper methods
  private async generateAIEnhancedMessage(
    fromAgentId: string, 
    toAgentId: string, 
    content: string, 
    type: AgentMessage['type']
  ): Promise<string> {
    const fromPersonality = aiService.getAgentPersonality(fromAgentId);
    const toPersonality = aiService.getAgentPersonality(toAgentId);
    
    if (!fromPersonality) return content;
    
    // Generate personalized message based on sender's personality
    const context = `Sending ${type} message to ${toPersonality?.name || 'colleague'}`;
    const enhancedMessage = await aiService.processMessage(fromAgentId, 
      `Please craft a professional ${type} message: ${content}`, 
      { recipientAgent: toAgentId, messageType: type }
    );
    
    return enhancedMessage || content;
  }

  private async analyzeMessageSentiment(content: string): Promise<string> {
    // AI-powered sentiment analysis simulation
    const sentiments = ['positive', 'professional', 'urgent', 'collaborative', 'analytical', 'supportive'];
    const selectedSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    // In a real implementation, this would use actual AI sentiment analysis
    return selectedSentiment;
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

  private async enhanceTaskWithAI(agentId: string, description: string): Promise<string> {
    const personality = aiService.getAgentPersonality(agentId);
    if (!personality) return description;
    
    // Generate AI-enhanced task description
    const enhancedDescription = await aiService.processMessage(agentId,
      `Please enhance this task description with specific action items and success criteria: ${description}`,
      { taskType: 'enhancement' }
    );
    
    return enhancedDescription || description;
  }

  private async suggestCollaboratingAgentsWithAI(task: AutonomousTask): Promise<string[]> {
    const assignedPersonality = aiService.getAgentPersonality(task.assignedAgent);
    if (!assignedPersonality) return this.suggestCollaboratingAgents(task);
    
    // AI-powered collaboration suggestion
    const collaborationSuggestion = await aiService.processMessage(task.assignedAgent,
      `Who should I collaborate with for this task: ${task.title}? Consider expertise requirements.`,
      { taskDetails: task, requestType: 'collaboration_suggestion' }
    );
    
    // Extract agent IDs from suggestion (simplified logic)
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

  private async generateAIBusinessInsights(): Promise<string[]> {
    const insights = [
      'AI Analysis: Customer satisfaction patterns indicate 15% improvement opportunity through personalized communication',
      'Predictive Intelligence: Marketing campaign optimization could increase ROI by 28% based on current data trends',
      'Autonomous Recommendation: Operations workflow automation can reduce processing time by 35%',
      'AI Financial Modeling: Revenue growth acceleration path identified through strategic market positioning',
      'Risk Assessment AI: Market volatility mitigation strategies show 90% confidence rating',
      'Competitive Intelligence: New market opportunities detected through AI-powered trend analysis'
    ];
    
    return insights;
  }

  private async generateAIEmailContent(
    agentId: string, 
    recipient: string, 
    subject: string, 
    body: string
  ): Promise<{ subject: string; body: string }> {
    const personality = aiService.getAgentPersonality(agentId);
    if (!personality) return { subject, body };
    
    const enhancedSubject = await aiService.processMessage(agentId,
      `Optimize this email subject line: ${subject}`,
      { emailType: 'business', recipient }
    );
    
    const enhancedBody = await aiService.processMessage(agentId,
      `Write a professional email body for: ${body}`,
      { emailType: 'business', recipient, subject }
    );
    
    return {
      subject: enhancedSubject || subject,
      body: enhancedBody || body
    };
  }

  private async optimizeSMSWithAI(agentId: string, message: string): Promise<string> {
    const personality = aiService.getAgentPersonality(agentId);
    if (!personality) return message;
    
    const optimizedMessage = await aiService.processMessage(agentId,
      `Optimize this SMS message for clarity and impact (keep under 160 characters): ${message}`,
      { messageType: 'sms', optimization: true }
    );
    
    return optimizedMessage || message;
  }

  private async createAdvancedAutonomousTasks() {
    const autonomousTasks = [
      {
        title: 'AI-Driven Market Sentiment Analysis',
        description: 'Deploy advanced sentiment analysis algorithms to monitor market trends and customer feedback',
        assignedAgent: 'intelligence',
        priority: 'high' as const,
        status: 'pending' as const
      },
      {
        title: 'Predictive Customer Behavior AI Model',
        description: 'Develop machine learning models to predict customer behavior and optimize engagement strategies',
        assignedAgent: 'data',
        priority: 'medium' as const,
        status: 'pending' as const
      },
      {
        title: 'Autonomous Legal Compliance Monitoring',
        description: 'Implement AI-powered compliance monitoring system with real-time legal risk assessment',
        assignedAgent: 'legal',
        priority: 'high' as const,
        status: 'pending' as const
      }
    ];

    for (const task of autonomousTasks) {
      await this.createTask(task);
    }
  }

  private async initiateAdvancedCollaboration() {
    // Trigger AI-powered strategic collaboration
    await this.initiateCollaboration(
      'strategy',
      ['data', 'intelligence', 'finance'],
      'AI-powered quarterly business optimization with predictive analytics and intelligent market positioning'
    );
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

  async initiateCollaboration(initiatorId: string, collaboratorIds: string[], taskDescription: string) {
    const task = await this.createTask({
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

  initiatePhoneCall(agentId: string, phoneNumber: string, purpose: string) {
    if (this.requiresExecutivePermission('make_phone_call', agentId, { phoneNumber, purpose })) {
      return this.requestPermissionAndQueue('make_phone_call', agentId, 'Initiate Phone Call', 
        `Call ${phoneNumber} for: ${purpose}`, 'high',
        { action: 'initiatePhoneCall', params: [agentId, phoneNumber, purpose] });
    }

    console.log(`✅ Executive-approved: Agent ${agentId} initiating call to ${phoneNumber} for: ${purpose}`);
    return this.simulatePhoneCall(agentId, phoneNumber, purpose);
  }

  generateCode(agentId: string, language: string, requirements: string) {
    console.log(`Agent ${agentId} generating ${language} code for: ${requirements}`);
    // Simulate AI code generation
    return this.simulateCodeGeneration(agentId, language, requirements);
  }

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

  browseWeb(agentId: string, query: string, purpose: string) {
    console.log(`Agent ${agentId} browsing web for: ${query}`);
    // Simulate intelligent web browsing
    return this.simulateWebBrowsing(agentId, query, purpose);
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

  private requiresExecutivePermission(action: string, agentId: string, metadata?: any): boolean {
    // Import permission service dynamically to avoid circular dependencies
    const { permissionService } = require('./permissionService');
    return permissionService.requiresPermission(action, agentId, metadata);
  }

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
}

export const agentCommunication = new AgentCommunicationService();
