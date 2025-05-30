
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, CheckCircle, XCircle, Clock, AlertTriangle, 
  TrendingUp, TrendingDown, Activity, Users, DollarSign,
  BarChart3, Settings, Bell, Target, Zap
} from 'lucide-react';
import { businessProcessService } from '@/services/businessProcessService';
import { enhancedCommunicationService } from '@/services/enhancedCommunicationService';
import { executivePermissionService } from '@/services/executivePermissionService';

const ExecutiveDashboard = () => {
  const [metrics, setMetrics] = useState(businessProcessService.getBusinessMetrics());
  const [notifications, setNotifications] = useState(enhancedCommunicationService.getNotifications(true));
  const [activeWorkflows, setActiveWorkflows] = useState(0);
  const [pendingPermissions, setPendingPermissions] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(businessProcessService.getBusinessMetrics());
      setNotifications(enhancedCommunicationService.getNotifications(true));
      // Simulate real-time updates
      setActiveWorkflows(Math.floor(Math.random() * 8) + 3);
      setPendingPermissions(Math.floor(Math.random() * 5));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const financialMetrics = metrics.filter(m => m.category === 'financial');
  const operationalMetrics = metrics.filter(m => m.category === 'operational');
  const customerMetrics = metrics.filter(m => m.category === 'customer');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600">Real-time business intelligence and AI agent oversight</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Shield className="w-3 h-3 mr-1" />
            System Secure
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Activity className="w-3 h-3 mr-1" />
            18 Agents Active
          </Badge>
        </div>
      </div>

      {/* Alert Strip */}
      {notifications.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Active Alerts ({notifications.length})</h3>
              <p className="text-red-700 text-sm">
                {notifications[0]?.title} {notifications.length > 1 && `+ ${notifications.length - 1} more`}
              </p>
            </div>
            <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
              View All
            </Button>
          </div>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$245K</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +12.5% vs last month
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Workflows</p>
              <p className="text-2xl font-bold text-gray-900">{activeWorkflows}</p>
              <p className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                <Activity className="w-3 h-3" />
                Processing efficiently
              </p>
            </div>
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">8.7/10</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <Target className="w-3 h-3" />
                Above industry avg
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPermissions}</p>
              <p className="text-sm text-orange-600 flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                Requires attention
              </p>
            </div>
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Business Metrics</TabsTrigger>
          <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Financial Metrics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Financial Performance
              </h3>
              <div className="space-y-4">
                {financialMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{metric.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {metric.value}{metric.unit}
                        </span>
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                    {metric.target && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Target</p>
                        <p className="font-semibold text-gray-900">{metric.target}{metric.unit}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Operational Metrics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Operational Efficiency
              </h3>
              <div className="space-y-4">
                {operationalMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{metric.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {metric.value}{metric.unit}
                        </span>
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                    {metric.target && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Target</p>
                        <p className="font-semibold text-gray-900">{metric.target}{metric.unit}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Customer Metrics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Customer Success
              </h3>
              <div className="space-y-4">
                {customerMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{metric.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {metric.value}{metric.unit}
                        </span>
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                    {metric.target && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Target</p>
                        <p className="font-semibold text-gray-900">{metric.target}{metric.unit}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Business Workflows</h3>
            <div className="space-y-4">
              {businessProcessService.getWorkflowTemplates().slice(0, 3).map((workflow) => (
                <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">{workflow.name}</h4>
                    <p className="text-sm text-gray-600">{workflow.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{workflow.category}</Badge>
                      <Badge variant={workflow.automationLevel === 'fully-auto' ? 'default' : 'outline'}>
                        {workflow.automationLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{workflow.steps.length} steps</p>
                    <Button size="sm" className="mt-2">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Management</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-orange-900">Financial Transaction Approval</h4>
                    <p className="text-sm text-orange-700">Felix Finance requesting approval for $15,000 marketing budget</p>
                    <p className="text-xs text-orange-600 mt-1">Risk Level: Medium • Submitted 15 minutes ago</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                      <XCircle className="w-4 h-4 mr-1" />
                      Deny
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Workflow Automation</h4>
                    <p className="text-sm text-gray-600">Maya Creative requesting automation of content approval process</p>
                    <p className="text-xs text-gray-500 mt-1">Risk Level: Low • Auto-approved</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approved
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts & Monitoring</h3>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-4 border rounded-lg ${getSeverityColor(notification.severity)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{notification.title}</h4>
                      <p className="text-sm mt-1">{notification.message}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {notification.agentId && `Agent: ${notification.agentId} • `}
                        {notification.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Acknowledge
                    </Button>
                  </div>
                </div>
              ))}
              
              {notifications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No active alerts</p>
                  <p className="text-sm">All systems operating normally</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveDashboard;
