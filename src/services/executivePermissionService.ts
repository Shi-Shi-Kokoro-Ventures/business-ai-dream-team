
import { supabase } from '@/integrations/supabase/client';

export interface PermissionRequest {
  id: string;
  agentId: string;
  actionType: 'financial' | 'strategic' | 'operational' | 'legal' | 'hr' | 'marketing';
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'denied' | 'escalated';
  approver?: string;
  businessImpact: string;
  estimatedCost?: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface PermissionRule {
  actionType: string;
  riskLevel: string;
  requiredApprover: 'executive-eva' | 'auto-approve' | 'manual-review';
  maxAmount?: number;
  requiredSignatures: number;
}

class ExecutivePermissionService {
  private permissionRules: PermissionRule[] = [
    { actionType: 'financial', riskLevel: 'low', requiredApprover: 'auto-approve', maxAmount: 1000, requiredSignatures: 0 },
    { actionType: 'financial', riskLevel: 'medium', requiredApprover: 'executive-eva', maxAmount: 10000, requiredSignatures: 1 },
    { actionType: 'financial', riskLevel: 'high', requiredApprover: 'manual-review', maxAmount: 50000, requiredSignatures: 2 },
    { actionType: 'financial', riskLevel: 'critical', requiredApprover: 'manual-review', requiredSignatures: 3 },
    { actionType: 'strategic', riskLevel: 'medium', requiredApprover: 'executive-eva', requiredSignatures: 1 },
    { actionType: 'strategic', riskLevel: 'high', requiredApprover: 'manual-review', requiredSignatures: 2 },
    { actionType: 'operational', riskLevel: 'low', requiredApprover: 'auto-approve', requiredSignatures: 0 },
    { actionType: 'operational', riskLevel: 'medium', requiredApprover: 'executive-eva', requiredSignatures: 1 },
    { actionType: 'hr', riskLevel: 'medium', requiredApprover: 'executive-eva', requiredSignatures: 1 },
    { actionType: 'legal', riskLevel: 'medium', requiredApprover: 'executive-eva', requiredSignatures: 1 },
    { actionType: 'marketing', riskLevel: 'low', requiredApprover: 'auto-approve', requiredSignatures: 0 }
  ];

  async requestPermission(request: Omit<PermissionRequest, 'id' | 'timestamp' | 'status'>): Promise<PermissionRequest> {
    const permissionRequest: PermissionRequest = {
      ...request,
      id: `perm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      status: 'pending'
    };

    // Check if auto-approval is possible
    const rule = this.getPermissionRule(request.actionType, request.riskLevel);
    if (rule?.requiredApprover === 'auto-approve') {
      if (!request.estimatedCost || (rule.maxAmount && request.estimatedCost <= rule.maxAmount)) {
        permissionRequest.status = 'approved';
        permissionRequest.approver = 'system-auto';
        console.log(`Auto-approved permission for ${request.agentId}: ${request.description}`);
      }
    }

    // Log the permission request
    this.logPermissionRequest(permissionRequest);
    
    return permissionRequest;
  }

  async approvePermission(permissionId: string, approver: string): Promise<boolean> {
    console.log(`Permission ${permissionId} approved by ${approver}`);
    // In a real system, this would update the database
    return true;
  }

  async denyPermission(permissionId: string, approver: string, reason: string): Promise<boolean> {
    console.log(`Permission ${permissionId} denied by ${approver}. Reason: ${reason}`);
    return true;
  }

  private getPermissionRule(actionType: string, riskLevel: string): PermissionRule | undefined {
    return this.permissionRules.find(rule => 
      rule.actionType === actionType && rule.riskLevel === riskLevel
    );
  }

  private async logPermissionRequest(request: PermissionRequest) {
    try {
      // Log to console for now, in production this would go to audit database
      console.log('Permission Request Logged:', {
        id: request.id,
        agent: request.agentId,
        action: request.actionType,
        risk: request.riskLevel,
        status: request.status,
        timestamp: request.timestamp.toISOString()
      });
      
      // Store in Supabase for audit trail
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('agent_permissions').insert({
          permission_id: request.id,
          agent_id: request.agentId,
          action_type: request.actionType,
          description: request.description,
          risk_level: request.riskLevel,
          status: request.status,
          business_impact: request.businessImpact,
          estimated_cost: request.estimatedCost,
          urgency: request.urgency,
          user_id: user.id
        });
      }
    } catch (error) {
      console.error('Failed to log permission request:', error);
    }
  }

  getAuditTrail(): PermissionRequest[] {
    // In a real system, this would fetch from database
    return [];
  }

  checkPermission(agentId: string, actionType: string, riskLevel: string): boolean {
    const rule = this.getPermissionRule(actionType, riskLevel);
    return rule?.requiredApprover === 'auto-approve';
  }
}

export const executivePermissionService = new ExecutivePermissionService();
