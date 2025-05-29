
import { Agent } from '@/types/agent';

export interface PermissionRequest {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'communication' | 'financial' | 'legal' | 'data_access' | 'api_integration' | 'strategic';
  timestamp: Date;
  status: 'pending' | 'approved' | 'denied' | 'escalated';
  metadata?: any;
  approvedBy?: string;
  deniedReason?: string;
  escalationLevel?: number;
  autoApprovalEligible?: boolean;
}

export interface ExecutiveProfile {
  email: string;
  phone: string;
  name: string;
  title: string;
  contactPreferences: {
    email: boolean;
    sms: boolean;
    phone: boolean;
    pushNotifications: boolean;
  };
  approvalThresholds: {
    financialLimit: number;
    autoApproveRoutine: boolean;
    requireApprovalForCommunications: boolean;
    requireApprovalForLegal: boolean;
  };
  workingHours: {
    start: string;
    end: string;
    timezone: string;
    emergencyOnly: boolean;
  };
}

export interface ActivityLog {
  type: 'request' | 'approval' | 'denial' | 'escalation' | 'emergency' | 'audit';
  description: string;
  timestamp: Date;
  agentId?: string;
  requestId?: string;
  severity: 'info' | 'warning' | 'critical';
  metadata?: any;
}

export interface SecurityEvent {
  id: string;
  type: 'unauthorized_access' | 'suspicious_activity' | 'data_breach' | 'policy_violation';
  description: string;
  timestamp: Date;
  agentId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

export interface BusinessMetrics {
  totalRequests: number;
  approvalRate: number;
  averageResponseTime: number;
  agentProductivity: { [agentId: string]: number };
  securityIncidents: number;
  complianceScore: number;
}

class PermissionService {
  private permissionRequests: PermissionRequest[] = [];
  private activityLog: ActivityLog[] = [];
  private securityEvents: SecurityEvent[] = [];
  private executiveProfile: ExecutiveProfile | null = null;
  private permissionListeners: Map<string, (request: PermissionRequest) => void> = new Map();
  private emergencyMode: boolean = false;
  private compliancePolicies: Map<string, any> = new Map();

  constructor() {
    this.initializeSampleData();
    this.initializeDefaultPolicies();
  }

  // Enhanced permission request with category classification
  requestPermission(
    agentId: string,
    agentName: string,
    action: string,
    description: string,
    priority: PermissionRequest['priority'] = 'medium',
    metadata?: any
  ): PermissionRequest {
    const category = this.categorizeRequest(action);
    const autoApprovalEligible = this.checkAutoApprovalEligibility(action, metadata);

    const request: PermissionRequest = {
      id: `perm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      agentId,
      agentName,
      action,
      description,
      priority,
      category,
      timestamp: new Date(),
      status: autoApprovalEligible ? 'approved' : 'pending',
      metadata,
      autoApprovalEligible
    };

    this.permissionRequests.push(request);

    if (autoApprovalEligible) {
      this.logActivity('approval', `Auto-approved: ${action} for ${agentName}`, 'info', agentId, request.id);
      this.notifyAgent(agentId, 'approved', request);
    } else {
      this.logActivity('request', `${agentName} requested permission: ${action}`, 'info', agentId, request.id);
      this.notifyExecutive(request);
    }

    // Emergency mode check
    if (this.emergencyMode && !autoApprovalEligible) {
      this.escalateRequest(request.id, 'System in emergency mode');
    }

    // Auto-escalate critical requests
    if (priority === 'critical') {
      this.escalateToCritical(request);
    }

    return request;
  }

  // Enhanced approval with audit trail
  approveRequest(requestId: string, approvedBy: string = 'Executive'): boolean {
    const request = this.permissionRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') {
      return false;
    }

    request.status = 'approved';
    request.approvedBy = approvedBy;
    
    this.logActivity('approval', `${approvedBy} approved: ${request.action}`, 'info', request.agentId, requestId);
    this.notifyAgent(request.agentId, 'approved', request);

    // Update business metrics
    this.updateBusinessMetrics('approval', request);

    return true;
  }

  // Enhanced denial with reason tracking
  denyRequest(requestId: string, reason: string, deniedBy: string = 'Executive'): boolean {
    const request = this.permissionRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') {
      return false;
    }

    request.status = 'denied';
    request.deniedReason = reason;
    request.metadata = { ...request.metadata, deniedBy };

    this.logActivity('denial', `${deniedBy} denied: ${request.action} (${reason})`, 'warning', request.agentId, requestId);
    this.notifyAgent(request.agentId, 'denied', request);

    // Update business metrics
    this.updateBusinessMetrics('denial', request);

    return true;
  }

  // Emergency controls
  enableEmergencyMode(reason: string): void {
    this.emergencyMode = true;
    this.logActivity('emergency', `Emergency mode activated: ${reason}`, 'critical');
    console.log('🚨 EMERGENCY MODE ACTIVATED 🚨');
    
    // Auto-deny all pending non-critical requests
    this.getPendingRequests().forEach(request => {
      if (request.priority !== 'critical') {
        this.denyRequest(request.id, 'Emergency mode activated', 'System');
      }
    });
  }

  disableEmergencyMode(): void {
    this.emergencyMode = false;
    this.logActivity('emergency', 'Emergency mode deactivated', 'info');
    console.log('✅ Emergency mode deactivated');
  }

  // Security monitoring
  reportSecurityEvent(
    type: SecurityEvent['type'],
    description: string,
    agentId: string,
    severity: SecurityEvent['severity'] = 'medium'
  ): void {
    const event: SecurityEvent = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      description,
      timestamp: new Date(),
      agentId,
      severity,
      resolved: false
    };

    this.securityEvents.push(event);
    this.logActivity('audit', `Security event: ${description}`, severity === 'critical' ? 'critical' : 'warning', agentId);

    if (severity === 'critical') {
      this.escalateSecurityEvent(event);
    }
  }

  // Business intelligence
  getBusinessMetrics(): BusinessMetrics {
    const totalRequests = this.permissionRequests.length;
    const approvedRequests = this.permissionRequests.filter(r => r.status === 'approved').length;
    
    return {
      totalRequests,
      approvalRate: totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0,
      averageResponseTime: this.calculateAverageResponseTime(),
      agentProductivity: this.calculateAgentProductivity(),
      securityIncidents: this.securityEvents.filter(e => !e.resolved).length,
      complianceScore: this.calculateComplianceScore()
    };
  }

  // Advanced querying
  getPendingRequests(): PermissionRequest[] {
    return this.permissionRequests
      .filter(r => r.status === 'pending')
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }

  getRequestsByCategory(category: PermissionRequest['category']): PermissionRequest[] {
    return this.permissionRequests.filter(r => r.category === category);
  }

  getSecurityEvents(): SecurityEvent[] {
    return this.securityEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Compliance and audit
  generateAuditReport(startDate: Date, endDate: Date): any {
    const filteredRequests = this.permissionRequests.filter(
      r => r.timestamp >= startDate && r.timestamp <= endDate
    );

    return {
      period: { start: startDate, end: endDate },
      totalRequests: filteredRequests.length,
      approvals: filteredRequests.filter(r => r.status === 'approved').length,
      denials: filteredRequests.filter(r => r.status === 'denied').length,
      securityEvents: this.securityEvents.filter(
        e => e.timestamp >= startDate && e.timestamp <= endDate
      ),
      complianceIssues: this.findComplianceIssues(filteredRequests),
      recommendations: this.generateRecommendations(filteredRequests)
    };
  }

  // Helper methods
  private categorizeRequest(action: string): PermissionRequest['category'] {
    if (action.includes('email') || action.includes('call') || action.includes('sms')) {
      return 'communication';
    }
    if (action.includes('budget') || action.includes('financial') || action.includes('payment')) {
      return 'financial';
    }
    if (action.includes('legal') || action.includes('contract') || action.includes('document')) {
      return 'legal';
    }
    if (action.includes('data') || action.includes('database') || action.includes('access')) {
      return 'data_access';
    }
    if (action.includes('api') || action.includes('integration') || action.includes('external')) {
      return 'api_integration';
    }
    return 'strategic';
  }

  private checkAutoApprovalEligibility(action: string, metadata?: any): boolean {
    if (!this.executiveProfile?.approvalThresholds.autoApproveRoutine) {
      return false;
    }

    const routineActions = [
      'status_update',
      'data_backup',
      'routine_maintenance',
      'report_generation'
    ];

    if (metadata?.amount && metadata.amount > this.executiveProfile.approvalThresholds.financialLimit) {
      return false;
    }

    return routineActions.some(routine => action.toLowerCase().includes(routine));
  }

  private escalateRequest(requestId: string, reason: string): void {
    const request = this.permissionRequests.find(r => r.id === requestId);
    if (request) {
      request.status = 'escalated';
      request.escalationLevel = (request.escalationLevel || 0) + 1;
      this.logActivity('escalation', `Request escalated: ${reason}`, 'critical', request.agentId, requestId);
    }
  }

  private escalateSecurityEvent(event: SecurityEvent): void {
    console.log(`🚨 CRITICAL SECURITY EVENT: ${event.description}`);
    if (this.executiveProfile?.contactPreferences.phone) {
      this.simulateEmergencyCall(event);
    }
  }

  private calculateAverageResponseTime(): number {
    const resolvedRequests = this.permissionRequests.filter(r => r.status !== 'pending');
    if (resolvedRequests.length === 0) return 0;
    
    // Simulate response times (in reality, this would track actual approval times)
    return 15; // 15 minutes average
  }

  private calculateAgentProductivity(): { [agentId: string]: number } {
    const productivity: { [agentId: string]: number } = {};
    const agents = [...new Set(this.permissionRequests.map(r => r.agentId))];
    
    agents.forEach(agentId => {
      const agentRequests = this.permissionRequests.filter(r => r.agentId === agentId);
      const approvedRequests = agentRequests.filter(r => r.status === 'approved');
      productivity[agentId] = agentRequests.length > 0 ? (approvedRequests.length / agentRequests.length) * 100 : 0;
    });

    return productivity;
  }

  private calculateComplianceScore(): number {
    const totalRequests = this.permissionRequests.length;
    const complianceViolations = this.securityEvents.filter(e => e.type === 'policy_violation').length;
    
    if (totalRequests === 0) return 100;
    return Math.max(0, 100 - (complianceViolations / totalRequests * 100));
  }

  private findComplianceIssues(requests: PermissionRequest[]): any[] {
    return requests
      .filter(r => r.status === 'denied' && r.deniedReason?.includes('compliance'))
      .map(r => ({
        requestId: r.id,
        agent: r.agentName,
        issue: r.deniedReason,
        timestamp: r.timestamp
      }));
  }

  private generateRecommendations(requests: PermissionRequest[]): string[] {
    const recommendations: string[] = [];
    
    const denialRate = requests.filter(r => r.status === 'denied').length / requests.length;
    if (denialRate > 0.3) {
      recommendations.push('Consider reviewing permission policies - high denial rate detected');
    }

    const criticalRequests = requests.filter(r => r.priority === 'critical');
    if (criticalRequests.length > requests.length * 0.2) {
      recommendations.push('High volume of critical requests - review agent training and protocols');
    }

    return recommendations;
  }

  private updateBusinessMetrics(action: 'approval' | 'denial', request: PermissionRequest): void {
    // This would update real-time business intelligence dashboards
    console.log(`📊 Metrics updated: ${action} for ${request.category} request`);
  }

  // Notification methods
  private notifyExecutive(request: PermissionRequest): void {
    console.log(`🔔 Executive Alert: ${request.agentName} requests permission for ${request.action}`);
    
    if (this.executiveProfile) {
      const { contactPreferences, workingHours } = this.executiveProfile;
      const isWorkingHours = this.isWithinWorkingHours();
      
      if (contactPreferences.email) {
        this.simulateEmailNotification(request);
      }
      
      if (request.priority === 'critical') {
        if (contactPreferences.phone) {
          this.simulatePhoneCall(request);
        }
      } else if (request.priority === 'high' && contactPreferences.sms && isWorkingHours) {
        this.simulateSMSNotification(request);
      }

      if (contactPreferences.pushNotifications) {
        this.simulatePushNotification(request);
      }
    }
  }

  private isWithinWorkingHours(): boolean {
    // Simplified working hours check
    const now = new Date();
    const hour = now.getHours();
    return hour >= 9 && hour <= 17; // 9 AM to 5 PM
  }

  private simulateEmailNotification(request: PermissionRequest): void {
    console.log(`📧 Email sent: Permission request from ${request.agentName} - ${request.action}`);
  }

  private simulateSMSNotification(request: PermissionRequest): void {
    console.log(`📱 SMS: ${request.agentName} needs permission for ${request.action}`);
  }

  private simulatePhoneCall(request: PermissionRequest): void {
    console.log(`📞 CALLING: Critical permission needed - ${request.action}`);
  }

  private simulatePushNotification(request: PermissionRequest): void {
    console.log(`🔔 Push: New permission request from ${request.agentName}`);
  }

  private simulateEmergencyCall(event: SecurityEvent): void {
    console.log(`📞 EMERGENCY CALL: Security incident - ${event.description}`);
  }

  private escalateToCritical(request: PermissionRequest): void {
    this.logActivity('escalation', `CRITICAL: ${request.action} escalated to executive`, 'critical', request.agentId, request.id);
    console.log(`🚨 CRITICAL ESCALATION: ${request.agentName} - ${request.action}`);
  }

  private notifyAgent(agentId: string, decision: 'approved' | 'denied', request: PermissionRequest): void {
    const listener = this.permissionListeners.get(agentId);
    if (listener) {
      listener(request);
    }
    console.log(`✅ Agent ${request.agentName} notified: ${decision} - ${request.action}`);
  }

  private logActivity(
    type: ActivityLog['type'],
    description: string,
    severity: ActivityLog['severity'] = 'info',
    agentId?: string,
    requestId?: string
  ): void {
    this.activityLog.push({
      type,
      description,
      timestamp: new Date(),
      agentId,
      requestId,
      severity,
      metadata: { source: 'permission_service' }
    });
  }

  private initializeDefaultPolicies(): void {
    this.compliancePolicies.set('financial_threshold', { maxAmount: 10000 });
    this.compliancePolicies.set('communication_policy', { requireApproval: true });
    this.compliancePolicies.set('data_access_policy', { logAllAccess: true });
  }

  private initializeSampleData(): void {
    // Sample executive profile
    this.executiveProfile = {
      email: 'executive@company.com',
      phone: '+1-555-0123',
      name: 'Chief Executive',
      title: 'CEO',
      contactPreferences: {
        email: true,
        sms: true,
        phone: false,
        pushNotifications: true
      },
      approvalThresholds: {
        financialLimit: 1000,
        autoApproveRoutine: true,
        requireApprovalForCommunications: true,
        requireApprovalForLegal: true
      },
      workingHours: {
        start: '09:00',
        end: '17:00',
        timezone: 'UTC-5',
        emergencyOnly: false
      }
    };

    // Sample permission requests with various categories
    this.requestPermission(
      'strategy',
      'Alex Strategy',
      'Access External Market Data API',
      'Request access to Bloomberg API for real-time market analysis and competitive intelligence gathering',
      'high',
      { apiProvider: 'Bloomberg', cost: 500, category: 'api_integration' }
    );

    this.requestPermission(
      'communications',
      'Comm Chief',
      'Send Marketing Email Campaign',
      'Send promotional email to 10,000 customers about new product launch',
      'medium',
      { recipients: 10000, campaignType: 'product_launch', category: 'communication' }
    );

    this.requestPermission(
      'finance',
      'Felix Finance',
      'Approve Budget Reallocation',
      'Reallocate $25,000 from marketing budget to R&D for urgent project requirements',
      'critical',
      { amount: 25000, fromBudget: 'marketing', toBudget: 'rd', category: 'financial' }
    );

    this.requestPermission(
      'legal',
      'Lex Legal',
      'Modify Vendor Contract Terms',
      'Update contract terms with primary vendor to include new service level agreements',
      'high',
      { contractValue: 50000, vendor: 'Primary Tech Vendor', category: 'legal' }
    );

    // Sample security events
    this.reportSecurityEvent(
      'unauthorized_access',
      'Attempted unauthorized access to financial database',
      'unknown_agent',
      'high'
    );
  }

  // Public methods for external access
  updateExecutiveProfile(profile: ExecutiveProfile): void {
    this.executiveProfile = profile;
    this.logActivity('audit', 'Executive profile updated', 'info');
    console.log('Executive profile updated');
  }

  getExecutiveProfile(): ExecutiveProfile | null {
    return this.executiveProfile;
  }

  getAgentRequests(agentId: string): PermissionRequest[] {
    return this.permissionRequests.filter(r => r.agentId === agentId);
  }

  getRecentActivity(limit: number = 20): ActivityLog[] {
    return this.activityLog
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

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
      'user_data_access',
      'contract_modification',
      'budget_change',
      'strategic_decision'
    ];

    // Financial threshold check
    if (action === 'financial_transaction' && metadata?.amount) {
      return metadata.amount > (this.executiveProfile?.approvalThresholds.financialLimit || 1000);
    }

    // Communication policy check
    if (this.executiveProfile?.approvalThresholds.requireApprovalForCommunications) {
      const communicationActions = ['send_email', 'make_phone_call', 'send_sms'];
      if (communicationActions.includes(action)) {
        return true;
      }
    }

    return highRiskActions.includes(action);
  }

  onPermissionUpdate(agentId: string, callback: (request: PermissionRequest) => void): void {
    this.permissionListeners.set(agentId, callback);
  }

  removePermissionListener(agentId: string): void {
    this.permissionListeners.delete(agentId);
  }

  isEmergencyMode(): boolean {
    return this.emergencyMode;
  }
}

export const permissionService = new PermissionService();
