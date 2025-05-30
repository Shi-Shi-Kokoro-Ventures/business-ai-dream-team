
import { enhancedAiService } from './enhancedAiService';
import { supabase } from '@/integrations/supabase/client';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'marketing' | 'operations' | 'finance' | 'hr' | 'legal';
  steps: WorkflowStep[];
  automationLevel: 'manual' | 'semi-auto' | 'fully-auto';
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  assignedAgent: string;
  estimatedDuration: number; // minutes
  dependencies: string[];
  automatable: boolean;
  parameters?: any;
}

interface BusinessMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target?: number;
  category: 'financial' | 'operational' | 'customer' | 'growth';
  lastUpdated: Date;
}

class BusinessProcessService {
  private workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'customer-onboarding',
      name: 'Customer Onboarding Process',
      description: 'Complete customer onboarding from lead to active user',
      category: 'sales',
      automationLevel: 'semi-auto',
      steps: [
        { id: 'qualify-lead', name: 'Qualify Lead', description: 'Assess lead quality and fit', assignedAgent: 'customer', estimatedDuration: 15, dependencies: [], automatable: true },
        { id: 'schedule-demo', name: 'Schedule Demo', description: 'Book product demonstration', assignedAgent: 'customer', estimatedDuration: 5, dependencies: ['qualify-lead'], automatable: true },
        { id: 'conduct-demo', name: 'Conduct Demo', description: 'Present product capabilities', assignedAgent: 'customer', estimatedDuration: 60, dependencies: ['schedule-demo'], automatable: false },
        { id: 'create-proposal', name: 'Create Proposal', description: 'Generate customized proposal', assignedAgent: 'finance', estimatedDuration: 30, dependencies: ['conduct-demo'], automatable: true },
        { id: 'legal-review', name: 'Legal Review', description: 'Review contract terms', assignedAgent: 'legal', estimatedDuration: 45, dependencies: ['create-proposal'], automatable: false },
        { id: 'finalize-contract', name: 'Finalize Contract', description: 'Complete contract signing', assignedAgent: 'legal', estimatedDuration: 20, dependencies: ['legal-review'], automatable: false },
        { id: 'setup-account', name: 'Setup Account', description: 'Configure customer account', assignedAgent: 'cto', estimatedDuration: 30, dependencies: ['finalize-contract'], automatable: true }
      ]
    },
    {
      id: 'marketing-campaign',
      name: 'Marketing Campaign Launch',
      description: 'End-to-end marketing campaign execution',
      category: 'marketing',
      automationLevel: 'semi-auto',
      steps: [
        { id: 'market-research', name: 'Market Research', description: 'Analyze target market and competitors', assignedAgent: 'intelligence', estimatedDuration: 120, dependencies: [], automatable: true },
        { id: 'create-strategy', name: 'Create Strategy', description: 'Develop campaign strategy', assignedAgent: 'marketing', estimatedDuration: 90, dependencies: ['market-research'], automatable: false },
        { id: 'budget-approval', name: 'Budget Approval', description: 'Get budget approved', assignedAgent: 'finance', estimatedDuration: 30, dependencies: ['create-strategy'], automatable: false },
        { id: 'create-content', name: 'Create Content', description: 'Develop campaign materials', assignedAgent: 'marketing', estimatedDuration: 180, dependencies: ['budget-approval'], automatable: true },
        { id: 'setup-channels', name: 'Setup Channels', description: 'Configure marketing channels', assignedAgent: 'marketing', estimatedDuration: 60, dependencies: ['create-content'], automatable: true },
        { id: 'launch-campaign', name: 'Launch Campaign', description: 'Execute campaign launch', assignedAgent: 'marketing', estimatedDuration: 30, dependencies: ['setup-channels'], automatable: true },
        { id: 'monitor-performance', name: 'Monitor Performance', description: 'Track campaign metrics', assignedAgent: 'data', estimatedDuration: 15, dependencies: ['launch-campaign'], automatable: true }
      ]
    },
    {
      id: 'financial-planning',
      name: 'Monthly Financial Planning',
      description: 'Comprehensive monthly financial review and planning',
      category: 'finance',
      automationLevel: 'semi-auto',
      steps: [
        { id: 'collect-data', name: 'Collect Financial Data', description: 'Gather all financial metrics', assignedAgent: 'finance', estimatedDuration: 60, dependencies: [], automatable: true },
        { id: 'analyze-performance', name: 'Analyze Performance', description: 'Review financial performance', assignedAgent: 'data', estimatedDuration: 90, dependencies: ['collect-data'], automatable: true },
        { id: 'create-forecasts', name: 'Create Forecasts', description: 'Generate financial forecasts', assignedAgent: 'finance', estimatedDuration: 120, dependencies: ['analyze-performance'], automatable: true },
        { id: 'strategic-review', name: 'Strategic Review', description: 'Review with strategy team', assignedAgent: 'strategy', estimatedDuration: 60, dependencies: ['create-forecasts'], automatable: false },
        { id: 'executive-approval', name: 'Executive Approval', description: 'Get executive sign-off', assignedAgent: 'executive-eva', estimatedDuration: 30, dependencies: ['strategic-review'], automatable: false }
      ]
    }
  ];

  private businessMetrics: BusinessMetric[] = [
    { id: 'revenue', name: 'Monthly Revenue', value: 245000, unit: 'USD', trend: 'up', target: 300000, category: 'financial', lastUpdated: new Date() },
    { id: 'conversion-rate', name: 'Lead Conversion Rate', value: 23.5, unit: '%', trend: 'up', target: 25, category: 'customer', lastUpdated: new Date() },
    { id: 'customer-satisfaction', name: 'Customer Satisfaction', value: 8.7, unit: '/10', trend: 'stable', target: 9.0, category: 'customer', lastUpdated: new Date() },
    { id: 'operating-margin', name: 'Operating Margin', value: 18.2, unit: '%', trend: 'up', target: 20, category: 'financial', lastUpdated: new Date() },
    { id: 'team-productivity', name: 'Team Productivity', value: 89, unit: '%', trend: 'up', target: 90, category: 'operational', lastUpdated: new Date() },
    { id: 'system-uptime', name: 'System Uptime', value: 99.97, unit: '%', trend: 'stable', target: 99.9, category: 'operational', lastUpdated: new Date() }
  ];

  async executeWorkflow(templateId: string, parameters?: any): Promise<string> {
    const template = this.workflowTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Workflow template ${templateId} not found`);
    }

    console.log(`Executing workflow: ${template.name}`);
    
    // Create workflow instance
    const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Execute steps in order
    for (const step of template.steps) {
      if (step.automatable) {
        await this.executeAutomaticStep(step, workflowId, parameters);
      } else {
        await this.scheduleManualStep(step, workflowId);
      }
    }

    return `Workflow ${template.name} (${workflowId}) has been initiated. You'll receive updates as each step completes.`;
  }

  private async executeAutomaticStep(step: WorkflowStep, workflowId: string, parameters?: any): Promise<void> {
    console.log(`Executing automatic step: ${step.name} (Agent: ${step.assignedAgent})`);
    
    // Simulate step execution with the assigned agent
    const request = `Execute workflow step: ${step.description}. Parameters: ${JSON.stringify(parameters || {})}`;
    await enhancedAiService.processBusinessRequest(step.assignedAgent, request, {
      workflowId,
      stepId: step.id,
      estimatedDuration: step.estimatedDuration
    });
  }

  private async scheduleManualStep(step: WorkflowStep, workflowId: string): Promise<void> {
    console.log(`Scheduling manual step: ${step.name} for agent ${step.assignedAgent}`);
    
    // In a real system, this would create a task in the agent's queue
    const notification = `You have a manual workflow step to complete: ${step.name}. Description: ${step.description}. Estimated time: ${step.estimatedDuration} minutes.`;
    
    await enhancedAiService.processBusinessRequest(step.assignedAgent, notification, {
      workflowId,
      stepId: step.id,
      isManualStep: true
    });
  }

  getWorkflowTemplates(): WorkflowTemplate[] {
    return this.workflowTemplates;
  }

  getBusinessMetrics(category?: string): BusinessMetric[] {
    if (category) {
      return this.businessMetrics.filter(metric => metric.category === category);
    }
    return this.businessMetrics;
  }

  async updateMetric(metricId: string, newValue: number): Promise<boolean> {
    const metric = this.businessMetrics.find(m => m.id === metricId);
    if (metric) {
      const oldValue = metric.value;
      metric.value = newValue;
      metric.lastUpdated = new Date();
      
      // Determine trend
      if (newValue > oldValue) {
        metric.trend = 'up';
      } else if (newValue < oldValue) {
        metric.trend = 'down';
      } else {
        metric.trend = 'stable';
      }

      console.log(`Updated metric ${metric.name}: ${oldValue} → ${newValue} (${metric.trend})`);
      return true;
    }
    return false;
  }

  async generateBusinessReport(): Promise<string> {
    const financialMetrics = this.getBusinessMetrics('financial');
    const operationalMetrics = this.getBusinessMetrics('operational');
    const customerMetrics = this.getBusinessMetrics('customer');

    const report = `
BUSINESS PERFORMANCE REPORT
Generated: ${new Date().toLocaleDateString()}

FINANCIAL PERFORMANCE:
${financialMetrics.map(m => `• ${m.name}: ${m.value}${m.unit} (${m.trend === 'up' ? '↗️' : m.trend === 'down' ? '↘️' : '→'} ${m.target ? `Target: ${m.target}${m.unit}` : ''})`).join('\n')}

OPERATIONAL METRICS:
${operationalMetrics.map(m => `• ${m.name}: ${m.value}${m.unit} (${m.trend === 'up' ? '↗️' : m.trend === 'down' ? '↘️' : '→'} ${m.target ? `Target: ${m.target}${m.unit}` : ''})`).join('\n')}

CUSTOMER METRICS:
${customerMetrics.map(m => `• ${m.name}: ${m.value}${m.unit} (${m.trend === 'up' ? '↗️' : m.trend === 'down' ? '↘️' : '→'} ${m.target ? `Target: ${m.target}${m.unit}` : ''})`).join('\n')}

RECOMMENDATIONS:
• Focus on achieving revenue target through improved conversion rates
• Maintain excellent system uptime to support growth
• Continue customer satisfaction initiatives to reach 9.0 target
    `.trim();

    return report;
  }
}

export const businessProcessService = new BusinessProcessService();
