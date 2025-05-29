
import { supabase } from '@/integrations/supabase/client';
import { intentRecognitionService } from './intentRecognitionService';

interface SMSWorkflow {
  id: string;
  phoneNumber: string;
  currentStep: string;
  context: any;
  activeAgents: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'completed' | 'paused';
  startedAt: Date;
  updatedAt: Date;
}

class SMSIntegrationService {
  private activeWorkflows: Map<string, SMSWorkflow> = new Map();

  async processingIncomingSMS(phoneNumber: string, message: string) {
    console.log(`Processing SMS from ${phoneNumber}: ${message}`);
    
    // Get or create workflow
    const workflow = this.getOrCreateWorkflow(phoneNumber);
    
    // Analyze intent
    const intent = intentRecognitionService.analyzeIntent(message);
    
    // Update workflow context
    workflow.context = {
      ...workflow.context,
      lastMessage: message,
      intent,
      timestamp: new Date()
    };
    
    // Determine next steps
    const nextSteps = this.determineNextSteps(intent, workflow);
    
    // Execute workflow steps
    await this.executeWorkflowSteps(nextSteps, workflow);
    
    // Update workflow
    this.updateWorkflow(workflow);
    
    return {
      workflow,
      intent,
      nextSteps
    };
  }

  private getOrCreateWorkflow(phoneNumber: string): SMSWorkflow {
    const existingWorkflow = this.activeWorkflows.get(phoneNumber);
    
    if (existingWorkflow) {
      return existingWorkflow;
    }
    
    const newWorkflow: SMSWorkflow = {
      id: `sms_${Date.now()}`,
      phoneNumber,
      currentStep: 'initial',
      context: {},
      activeAgents: ['executive-eva'],
      priority: 'medium',
      status: 'active',
      startedAt: new Date(),
      updatedAt: new Date()
    };
    
    this.activeWorkflows.set(phoneNumber, newWorkflow);
    return newWorkflow;
  }

  private determineNextSteps(intent: any, workflow: SMSWorkflow): string[] {
    const steps = [];
    
    // Always acknowledge receipt
    steps.push('acknowledge_receipt');
    
    // Route to appropriate agent
    steps.push(`route_to_${intent.suggestedAgent}`);
    
    // Activate team if needed
    if (intent.requiresTeamActivation) {
      steps.push('activate_team');
    }
    
    // Handle urgency
    if (intent.urgency === 'critical') {
      steps.push('escalate_critical');
    }
    
    // Schedule follow-up
    if (intent.category === 'meeting') {
      steps.push('schedule_meeting');
    }
    
    // Generate tasks
    if (intent.action === 'create' || intent.action === 'analyze') {
      steps.push('generate_tasks');
    }
    
    return steps;
  }

  private async executeWorkflowSteps(steps: string[], workflow: SMSWorkflow) {
    for (const step of steps) {
      try {
        await this.executeStep(step, workflow);
      } catch (error) {
        console.error(`Error executing step ${step}:`, error);
      }
    }
  }

  private async executeStep(step: string, workflow: SMSWorkflow) {
    switch (step) {
      case 'acknowledge_receipt':
        await this.sendAcknowledgment(workflow);
        break;
        
      case 'escalate_critical':
        await this.escalateCritical(workflow);
        break;
        
      case 'activate_team':
        await this.activateTeam(workflow);
        break;
        
      case 'schedule_meeting':
        await this.scheduleMeeting(workflow);
        break;
        
      case 'generate_tasks':
        await this.generateTasks(workflow);
        break;
        
      default:
        if (step.startsWith('route_to_')) {
          const agentId = step.replace('route_to_', '');
          await this.routeToAgent(agentId, workflow);
        }
        break;
    }
  }

  private async sendAcknowledgment(workflow: SMSWorkflow) {
    const intent = workflow.context.intent;
    const agentName = this.getAgentDisplayName(intent.suggestedAgent);
    
    let message = `Hi! This is ${agentName}. I received your message`;
    
    if (intent.urgency === 'critical') {
      message += ' and I'm treating it as urgent';
    }
    
    if (intent.requiresTeamActivation) {
      message += '. I\'m coordinating with the team';
    }
    
    message += '. I\'ll update you shortly.';
    
    await this.sendSMS(workflow.phoneNumber, message, intent.suggestedAgent);
  }

  private async escalateCritical(workflow: SMSWorkflow) {
    // Send immediate notification to executive
    await this.sendSMS(workflow.phoneNumber, 
      'This has been escalated to Executive Eva for immediate attention.', 
      'executive-eva'
    );
    
    // Add executive to active agents
    if (!workflow.activeAgents.includes('executive-eva')) {
      workflow.activeAgents.push('executive-eva');
    }
    
    workflow.priority = 'critical';
  }

  private async activateTeam(workflow: SMSWorkflow) {
    const intent = workflow.context.intent;
    const teamMembers = this.getRelevantTeamMembers(intent.category);
    
    // Add team members to workflow
    teamMembers.forEach(agentId => {
      if (!workflow.activeAgents.includes(agentId)) {
        workflow.activeAgents.push(agentId);
      }
    });
    
    // Notify about team activation
    await this.sendSMS(workflow.phoneNumber, 
      `I've activated the ${intent.category} team: ${teamMembers.map(id => this.getAgentDisplayName(id)).join(', ')}. They're working on this now.`,
      intent.suggestedAgent
    );
  }

  private async routeToAgent(agentId: string, workflow: SMSWorkflow) {
    const agentName = this.getAgentDisplayName(agentId);
    const message = workflow.context.lastMessage;
    
    // Call the agent's AI processing
    try {
      const { data, error } = await supabase.functions.invoke('ai-agent-chat', {
        body: {
          agentId,
          message: `SMS Request: "${message}"`,
          context: {
            phoneNumber: workflow.phoneNumber,
            intent: workflow.context.intent,
            workflow: workflow.id,
            communicationMethod: 'sms'
          }
        }
      });

      if (error) {
        console.error(`Error routing to ${agentName}:`, error);
      } else {
        console.log(`Successfully routed to ${agentName}`);
      }
    } catch (error) {
      console.error(`Failed to route to ${agentName}:`, error);
    }
  }

  private async scheduleMeeting(workflow: SMSWorkflow) {
    const entities = workflow.context.intent.entities;
    
    if (entities.dates || entities.times) {
      await this.sendSMS(workflow.phoneNumber, 
        'I\'ll check calendar availability and send you meeting options shortly.',
        'executive-eva'
      );
    } else {
      await this.sendSMS(workflow.phoneNumber, 
        'What dates/times work best for you? I\'ll find the best option.',
        'executive-eva'
      );
    }
  }

  private async generateTasks(workflow: SMSWorkflow) {
    const intent = workflow.context.intent;
    
    await this.sendSMS(workflow.phoneNumber, 
      `I'm breaking this down into actionable tasks and assigning them to the right team members. You'll get progress updates.`,
      intent.suggestedAgent
    );
  }

  private async sendSMS(phoneNumber: string, message: string, agentId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          agentId,
          phoneNumber,
          message,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) {
        console.error('SMS send error:', error);
      } else {
        console.log('SMS sent successfully:', data);
      }
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  }

  private getRelevantTeamMembers(category: string): string[] {
    const teamMappings: { [key: string]: string[] } = {
      financial: ['finance', 'strategy', 'data'],
      marketing: ['marketing', 'communications', 'data'],
      sales: ['customer', 'marketing', 'strategy'],
      operations: ['operations', 'cto', 'hr'],
      hr: ['hr', 'legal', 'operations'],
      legal: ['legal', 'hr', 'finance'],
      technical: ['cto', 'data', 'operations'],
      strategy: ['strategy', 'data', 'intelligence'],
      reporting: ['data', 'intelligence', 'communications']
    };

    return teamMappings[category] || ['executive-eva'];
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

  private updateWorkflow(workflow: SMSWorkflow) {
    workflow.updatedAt = new Date();
    this.activeWorkflows.set(workflow.phoneNumber, workflow);
  }

  getActiveWorkflows(): SMSWorkflow[] {
    return Array.from(this.activeWorkflows.values());
  }

  getWorkflow(phoneNumber: string): SMSWorkflow | undefined {
    return this.activeWorkflows.get(phoneNumber);
  }

  completeWorkflow(phoneNumber: string) {
    const workflow = this.activeWorkflows.get(phoneNumber);
    if (workflow) {
      workflow.status = 'completed';
      workflow.updatedAt = new Date();
    }
  }
}

export const smsIntegrationService = new SMSIntegrationService();
