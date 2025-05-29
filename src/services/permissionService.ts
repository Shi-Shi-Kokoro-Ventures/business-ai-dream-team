
import { Agent } from '@/types/agent';

export interface PermissionRequest {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  status: 'pending' | 'approved' | 'denied';
  metadata?: any;
}

export interface ExecutiveProfile {
  email: string;
  phone: string;
  contactPreferences: {
    email: boolean;
    sms: boolean;
    phone: boolean;
  };
}

export interface ActivityLog {
  type: 'request' | 'approval' | 'denial' | 'escalation';
  description: string;
  timestamp: Date;
  agentId?: string;
  requestId?: string;
}

class PermissionService {
  private permissionRequests: PermissionRequest[] = [];
  private activityLog: ActivityLog[] = [];
  private executiveProfile: ExecutiveProfile | null = null;
  private permissionListeners: Map<string, (request: PermissionRequest) => void> = new Map();

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  // Request permission from agents
  requestPermission(
    agentId: string,
    agentName: string,
    action: string,
    description: string,
    priority: PermissionRequest['priority'] = 'medium',
    metadata?: any
  ): PermissionRequest {
    const request: PermissionRequest = {
      id: `perm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      agentId,
      agentName,
      action,
      description,
      priority,
      timestamp: new Date(),
      status: 'pending',
      metadata
    };

    this.permissionRequests.push(request);
    this.logActivity('request', `${agentName} requested permission: ${action}`, agentId, request.id);

    console.log(`Permission requested by ${agentName}: ${action}`);

    // Notify Executive Eva
    this.notifyExecutive(request);

    // Auto-escalate critical requests
    if (priority === 'critical') {
      this.escalateToCritical(request);
    }

    return request;
  }

  // Approve permission request
  approveRequest(requestId: string): boolean {
    const request = this.permissionRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') {
      return false;
    }

    request.status = 'approved';
    this.logActivity('approval', `Executive approved: ${request.action}`, request.agentId, requestId);

    console.log(`Permission approved: ${request.action} for ${request.agentName}`);

    // Notify the requesting agent
    this.notifyAgent(request.agentId, 'approved', request);

    return true;
  }

  // Deny permission request
  denyRequest(requestId: string, reason?: string): boolean {
    const request = this.permissionRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') {
      return false;
    }

    request.status = 'denied';
    if (reason) {
      request.metadata = { ...request.metadata, denialReason: reason };
    }

    this.logActivity('denial', `Executive denied: ${request.action}${reason ? ` (${reason})` : ''}`, request.agentId, requestId);

    console.log(`Permission denied: ${request.action} for ${request.agentName}`);

    // Notify the requesting agent
    this.notifyAgent(request.agentId, 'denied', request);

    return true;
  }

  // Get pending requests
  getPendingRequests(): PermissionRequest[] {
    return this.permissionRequests
      .filter(r => r.status === 'pending')
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  }

  // Get all requests for an agent
  getAgentRequests(agentId: string): PermissionRequest[] {
    return this.permissionRequests.filter(r => r.agentId === agentId);
  }

  // Get recent activity
  getRecentActivity(limit: number = 10): ActivityLog[] {
    return this.activityLog
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Update executive profile
  updateExecutiveProfile(profile: ExecutiveProfile): void {
    this.executiveProfile = profile;
    console.log('Executive profile updated');
  }

  // Get executive profile
  getExecutiveProfile(): ExecutiveProfile | null {
    return this.executiveProfile;
  }

  // Check if action requires permission
  requiresPermission(action: string, agentId: string, metadata?: any): boolean {
    const highRiskActions = [
      'send_email',
      'make_phone_call',
      'send_sms',
      'financial_transaction',
      'legal_document_modification',
      'external_api_access',
      'data_export',
      'system_configuration',
      'user_data_access'
    ];

    // Financial threshold check
    if (action === 'financial_transaction' && metadata?.amount) {
      return metadata.amount > 1000; // Require permission for amounts over $1000
    }

    return highRiskActions.includes(action);
  }

  // Executive notification system
  private notifyExecutive(request: PermissionRequest): void {
    console.log(`🔔 Executive Alert: ${request.agentName} requests permission for ${request.action}`);
    
    if (this.executiveProfile) {
      const { contactPreferences } = this.executiveProfile;
      
      if (contactPreferences.email) {
        this.simulateEmailNotification(request);
      }
      
      if (request.priority === 'critical' && contactPreferences.phone) {
        this.simulatePhoneCall(request);
      } else if (request.priority === 'high' && contactPreferences.sms) {
        this.simulateSMSNotification(request);
      }
    }
  }

  // Critical escalation
  private escalateToCritical(request: PermissionRequest): void {
    this.logActivity('escalation', `CRITICAL: ${request.action} escalated to executive`, request.agentId, request.id);
    console.log(`🚨 CRITICAL ESCALATION: ${request.agentName} - ${request.action}`);
  }

  // Agent notification
  private notifyAgent(agentId: string, decision: 'approved' | 'denied', request: PermissionRequest): void {
    const listener = this.permissionListeners.get(agentId);
    if (listener) {
      listener(request);
    }
  }

  // Simulation methods
  private simulateEmailNotification(request: PermissionRequest): void {
    console.log(`📧 Email sent to executive: Permission request from ${request.agentName}`);
  }

  private simulateSMSNotification(request: PermissionRequest): void {
    console.log(`📱 SMS sent to executive: ${request.agentName} needs permission for ${request.action}`);
  }

  private simulatePhoneCall(request: PermissionRequest): void {
    console.log(`📞 CALLING EXECUTIVE: Critical permission needed - ${request.action}`);
  }

  // Log activity
  private logActivity(
    type: ActivityLog['type'],
    description: string,
    agentId?: string,
    requestId?: string
  ): void {
    this.activityLog.push({
      type,
      description,
      timestamp: new Date(),
      agentId,
      requestId
    });
  }

  // Initialize sample data
  private initializeSampleData(): void {
    // Sample permission requests
    this.requestPermission(
      'strategy',
      'Alex Strategy',
      'Access External Market Data API',
      'Request access to Bloomberg API for real-time market analysis and competitive intelligence gathering',
      'high',
      { apiProvider: 'Bloomberg', cost: '$500/month' }
    );

    this.requestPermission(
      'communications',
      'Comm Chief',
      'Send Marketing Email Campaign',
      'Send promotional email to 10,000 customers about new product launch',
      'medium',
      { recipients: 10000, campaignType: 'product_launch' }
    );

    this.requestPermission(
      'finance',
      'Felix Finance',
      'Approve Budget Reallocation',
      'Reallocate $25,000 from marketing budget to R&D for urgent project requirements',
      'critical',
      { amount: 25000, fromBudget: 'marketing', toBudget: 'rd' }
    );
  }

  // Listener management
  onPermissionUpdate(agentId: string, callback: (request: PermissionRequest) => void): void {
    this.permissionListeners.set(agentId, callback);
  }

  removePermissionListener(agentId: string): void {
    this.permissionListeners.delete(agentId);
  }
}

export const permissionService = new PermissionService();
