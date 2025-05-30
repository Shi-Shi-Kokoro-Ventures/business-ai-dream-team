
import { smsIntegrationService } from './smsIntegrationService';
import { businessProcessService } from './businessProcessService';
import { executivePermissionService } from './executivePermissionService';
import { supabase } from '@/integrations/supabase/client';

interface CommunicationChannel {
  id: string;
  name: string;
  type: 'sms' | 'email' | 'slack' | 'teams' | 'webhook' | 'dashboard';
  enabled: boolean;
  priority: number;
  configuration: any;
}

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  message: string;
  enabled: boolean;
}

interface BusinessNotification {
  id: string;
  type: 'metric_alert' | 'workflow_update' | 'permission_request' | 'task_completion' | 'system_alert';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  agentId?: string;
  channels: string[];
  acknowledged: boolean;
}

class EnhancedCommunicationService {
  private communicationChannels: CommunicationChannel[] = [
    { id: 'sms', name: 'SMS Alerts', type: 'sms', enabled: true, priority: 1, configuration: {} },
    { id: 'email', name: 'Email Notifications', type: 'email', enabled: true, priority: 2, configuration: {} },
    { id: 'dashboard', name: 'Dashboard Alerts', type: 'dashboard', enabled: true, priority: 3, configuration: {} }
  ];

  private alertRules: AlertRule[] = [
    {
      id: 'revenue-drop',
      name: 'Revenue Drop Alert',
      condition: 'revenue < target * 0.8',
      severity: 'high',
      channels: ['sms', 'email'],
      message: 'Revenue has dropped below 80% of target. Immediate attention required.',
      enabled: true
    },
    {
      id: 'system-downtime',
      name: 'System Downtime Alert',
      condition: 'uptime < 99.5',
      severity: 'critical',
      channels: ['sms', 'email', 'dashboard'],
      message: 'System uptime has fallen below acceptable levels. Technical team alerted.',
      enabled: true
    },
    {
      id: 'permission-pending',
      name: 'Permission Request Alert',
      condition: 'permission_pending > 30min',
      severity: 'medium',
      channels: ['sms', 'dashboard'],
      message: 'High-priority permission request has been pending for over 30 minutes.',
      enabled: true
    },
    {
      id: 'workflow-stalled',
      name: 'Workflow Stalled Alert',
      condition: 'workflow_stalled > 2hours',
      severity: 'medium',
      channels: ['email', 'dashboard'],
      message: 'Business workflow has been stalled for over 2 hours. Review required.',
      enabled: true
    }
  ];

  private notifications: BusinessNotification[] = [];

  async sendBusinessNotification(notification: Omit<BusinessNotification, 'id' | 'timestamp' | 'acknowledged'>): Promise<void> {
    const businessNotification: BusinessNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      acknowledged: false
    };

    this.notifications.push(businessNotification);

    // Send through enabled channels
    for (const channelId of notification.channels) {
      const channel = this.communicationChannels.find(c => c.id === channelId && c.enabled);
      if (channel) {
        await this.sendThroughChannel(channel, businessNotification);
      }
    }

    console.log(`Business notification sent: ${notification.title}`);
  }

  private async sendThroughChannel(channel: CommunicationChannel, notification: BusinessNotification): Promise<void> {
    try {
      switch (channel.type) {
        case 'sms':
          await this.sendSMSNotification(notification);
          break;
        case 'email':
          await this.sendEmailNotification(notification);
          break;
        case 'dashboard':
          await this.sendDashboardNotification(notification);
          break;
        default:
          console.log(`Channel type ${channel.type} not implemented yet`);
      }
    } catch (error) {
      console.error(`Failed to send notification through ${channel.name}:`, error);
    }
  }

  private async sendSMSNotification(notification: BusinessNotification): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: smsSettings } = await supabase
      .from('sms_settings')
      .select('phone_number')
      .eq('user_id', user.id)
      .single();

    if (smsSettings?.phone_number) {
      const message = `🚨 ${notification.title}\n\n${notification.message}\n\nAgent: ${notification.agentId || 'System'}\nTime: ${notification.timestamp.toLocaleString()}`;
      
      await supabase.functions.invoke('send-sms', {
        body: {
          agentId: notification.agentId || 'system',
          phoneNumber: smsSettings.phone_number,
          message: message,
          userId: user.id
        }
      });
    }
  }

  private async sendEmailNotification(notification: BusinessNotification): Promise<void> {
    // Implementation would depend on email service integration
    console.log(`Email notification: ${notification.title} - ${notification.message}`);
  }

  private async sendDashboardNotification(notification: BusinessNotification): Promise<void> {
    // This would update the dashboard UI with the notification
    console.log(`Dashboard notification: ${notification.title}`);
  }

  async checkBusinessAlerts(): Promise<void> {
    // Get current business metrics
    const metrics = businessProcessService.getBusinessMetrics();
    
    for (const rule of this.alertRules.filter(r => r.enabled)) {
      const shouldAlert = await this.evaluateAlertCondition(rule.condition, metrics);
      
      if (shouldAlert) {
        await this.sendBusinessNotification({
          type: 'metric_alert',
          title: rule.name,
          message: rule.message,
          severity: rule.severity,
          channels: rule.channels
        });
      }
    }
  }

  private async evaluateAlertCondition(condition: string, metrics: any[]): Promise<boolean> {
    // Simple condition evaluation - in production, this would be more sophisticated
    try {
      if (condition.includes('revenue < target * 0.8')) {
        const revenueMetric = metrics.find(m => m.id === 'revenue');
        return revenueMetric && revenueMetric.target && revenueMetric.value < (revenueMetric.target * 0.8);
      }
      
      if (condition.includes('uptime < 99.5')) {
        const uptimeMetric = metrics.find(m => m.id === 'system-uptime');
        return uptimeMetric && uptimeMetric.value < 99.5;
      }
      
      return false;
    } catch (error) {
      console.error('Error evaluating alert condition:', error);
      return false;
    }
  }

  getNotifications(unacknowledgedOnly: boolean = false): BusinessNotification[] {
    if (unacknowledgedOnly) {
      return this.notifications.filter(n => !n.acknowledged);
    }
    return this.notifications;
  }

  async acknowledgeNotification(notificationId: string): Promise<boolean> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.acknowledged = true;
      return true;
    }
    return false;
  }

  async sendWorkflowUpdate(workflowId: string, step: string, status: string, agentId: string): Promise<void> {
    await this.sendBusinessNotification({
      type: 'workflow_update',
      title: 'Workflow Progress Update',
      message: `Workflow step "${step}" is now ${status}`,
      severity: 'low',
      agentId,
      channels: ['dashboard']
    });
  }

  async sendPermissionAlert(permissionId: string, agentId: string, actionType: string): Promise<void> {
    await this.sendBusinessNotification({
      type: 'permission_request',
      title: 'Permission Request Requires Approval',
      message: `Agent ${agentId} is requesting permission for ${actionType} action (ID: ${permissionId})`,
      severity: 'medium',
      agentId,
      channels: ['sms', 'dashboard']
    });
  }
}

export const enhancedCommunicationService = new EnhancedCommunicationService();

// Start monitoring alerts every 5 minutes
setInterval(() => {
  enhancedCommunicationService.checkBusinessAlerts();
}, 5 * 60 * 1000);
