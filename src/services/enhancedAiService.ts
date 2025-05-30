
import { realAiService } from './realAiService';
import { executivePermissionService } from './executivePermissionService';
import { supabase } from '@/integrations/supabase/client';

interface BusinessContext {
  marketData: any;
  financialMetrics: any;
  operationalData: any;
  competitorAnalysis: any;
  customerInsights: any;
}

interface AgentTask {
  id: string;
  agentId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'requires_permission';
  createdAt: Date;
  dueDate?: Date;
  businessImpact: string;
  estimatedCost?: number;
  dependencies: string[];
  results?: any;
}

class EnhancedAiService {
  private businessContext: BusinessContext = {
    marketData: {},
    financialMetrics: {},
    operationalData: {},
    competitorAnalysis: {},
    customerInsights: {}
  };

  private activeTasks: Map<string, AgentTask> = new Map();

  async processBusinessRequest(agentId: string, request: string, context?: any): Promise<string> {
    // Analyze the request for business implications
    const businessAnalysis = await this.analyzeBusinessRequest(request);
    
    // Check if permission is required
    if (businessAnalysis.requiresPermission) {
      const permissionRequest = await executivePermissionService.requestPermission({
        agentId,
        actionType: businessAnalysis.actionType,
        description: request,
        riskLevel: businessAnalysis.riskLevel,
        requestedBy: agentId,
        businessImpact: businessAnalysis.businessImpact,
        estimatedCost: businessAnalysis.estimatedCost,
        urgency: businessAnalysis.urgency
      });

      if (permissionRequest.status === 'pending') {
        return `I've analyzed your request and it requires executive approval due to ${businessAnalysis.riskLevel} risk level. I've submitted it for review (ID: ${permissionRequest.id}). You'll be notified once approved.`;
      }
    }

    // Process with enhanced context
    const enhancedContext = {
      ...context,
      businessContext: this.businessContext,
      marketPosition: await this.getMarketPosition(),
      financialStatus: await this.getFinancialStatus(),
      operationalMetrics: await this.getOperationalMetrics()
    };

    const response = await realAiService.processMessage(agentId, request, enhancedContext);
    
    // Create task if action is required
    if (businessAnalysis.actionRequired) {
      await this.createBusinessTask(agentId, request, businessAnalysis);
    }

    return response;
  }

  private async analyzeBusinessRequest(request: string): Promise<any> {
    const lowerRequest = request.toLowerCase();
    
    let actionType = 'operational';
    let riskLevel = 'low';
    let requiresPermission = false;
    let actionRequired = false;
    let businessImpact = 'Minor operational task';
    let estimatedCost = 0;
    let urgency = 'medium';

    // Financial analysis
    if (lowerRequest.includes('budget') || lowerRequest.includes('spend') || lowerRequest.includes('invest')) {
      actionType = 'financial';
      requiresPermission = true;
      
      // Extract amount if mentioned
      const amountMatch = lowerRequest.match(/\$?([\d,]+)/);
      if (amountMatch) {
        estimatedCost = parseInt(amountMatch[1].replace(',', ''));
        riskLevel = estimatedCost > 10000 ? 'high' : estimatedCost > 1000 ? 'medium' : 'low';
      }
      businessImpact = `Financial action with estimated cost: $${estimatedCost}`;
    }

    // Strategic analysis
    if (lowerRequest.includes('strategy') || lowerRequest.includes('plan') || lowerRequest.includes('expansion')) {
      actionType = 'strategic';
      riskLevel = 'medium';
      requiresPermission = true;
      businessImpact = 'Strategic business decision with long-term implications';
    }

    // HR analysis
    if (lowerRequest.includes('hire') || lowerRequest.includes('fire') || lowerRequest.includes('employee')) {
      actionType = 'hr';
      riskLevel = 'medium';
      requiresPermission = true;
      businessImpact = 'Human resources action affecting personnel';
    }

    // Legal analysis
    if (lowerRequest.includes('contract') || lowerRequest.includes('legal') || lowerRequest.includes('compliance')) {
      actionType = 'legal';
      riskLevel = 'high';
      requiresPermission = true;
      businessImpact = 'Legal action with compliance implications';
    }

    // Urgency analysis
    if (lowerRequest.includes('urgent') || lowerRequest.includes('asap') || lowerRequest.includes('emergency')) {
      urgency = 'critical';
      riskLevel = riskLevel === 'low' ? 'medium' : 'high';
    }

    actionRequired = lowerRequest.includes('create') || lowerRequest.includes('execute') || 
                    lowerRequest.includes('implement') || lowerRequest.includes('start');

    return {
      actionType,
      riskLevel,
      requiresPermission,
      actionRequired,
      businessImpact,
      estimatedCost,
      urgency
    };
  }

  private async createBusinessTask(agentId: string, request: string, analysis: any): Promise<AgentTask> {
    const task: AgentTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      agentId,
      title: `Business Task: ${request.substring(0, 50)}...`,
      description: request,
      priority: analysis.urgency,
      status: 'pending',
      createdAt: new Date(),
      businessImpact: analysis.businessImpact,
      estimatedCost: analysis.estimatedCost,
      dependencies: []
    };

    this.activeTasks.set(task.id, task);
    console.log(`Created business task ${task.id} for agent ${agentId}`);
    
    return task;
  }

  private async getMarketPosition(): Promise<any> {
    // Simulate market data - in production, this would connect to real data sources
    return {
      marketShare: '12.5%',
      competitorRanking: 3,
      growthTrend: 'positive',
      customerSatisfaction: 8.7
    };
  }

  private async getFinancialStatus(): Promise<any> {
    return {
      revenue: '$2.4M',
      profitMargin: '18.2%',
      burnRate: '$45K/month',
      runway: '18 months'
    };
  }

  private async getOperationalMetrics(): Promise<any> {
    return {
      efficiency: '94.2%',
      customerResponseTime: '< 2 hours',
      systemUptime: '99.97%',
      teamProductivity: '8.9/10'
    };
  }

  getActiveTasks(): AgentTask[] {
    return Array.from(this.activeTasks.values());
  }

  async completeTask(taskId: string, results: any): Promise<boolean> {
    const task = this.activeTasks.get(taskId);
    if (task) {
      task.status = 'completed';
      task.results = results;
      console.log(`Task ${taskId} completed with results:`, results);
      return true;
    }
    return false;
  }
}

export const enhancedAiService = new EnhancedAiService();
