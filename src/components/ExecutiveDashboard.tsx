
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Crown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Bell,
  Settings,
  Activity,
  Eye,
  Users,
  BarChart3,
  TrendingUp,
  DollarSign,
  FileText,
  Lock,
  Unlock,
  Power,
  AlertCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Globe
} from 'lucide-react';
import { Agent } from '@/types/agent';
import { permissionService, BusinessMetrics } from '@/services/permissionService';
import { useToast } from '@/hooks/use-toast';

interface ExecutiveDashboardProps {
  onBack: () => void;
}

const ExecutiveDashboard = ({ onBack }: ExecutiveDashboardProps) => {
  const [userEmail, setUserEmail] = useState('executive@company.com');
  const [userPhone, setUserPhone] = useState('+1-555-0123');
  const [userName, setUserName] = useState('Chief Executive');
  const [userTitle, setUserTitle] = useState('CEO');
  const [contactPreferences, setContactPreferences] = useState({
    email: true,
    sms: true,
    phone: false,
    pushNotifications: true
  });
  const [approvalThresholds, setApprovalThresholds] = useState({
    financialLimit: 1000,
    autoApproveRoutine: true,
    requireApprovalForCommunications: true,
    requireApprovalForLegal: true
  });
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '17:00',
    timezone: 'UTC-5',
    emergencyOnly: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const pendingRequests = permissionService.getPendingRequests();
  const recentActivity = permissionService.getRecentActivity();
  const securityEvents = permissionService.getSecurityEvents();
  const isEmergencyMode = permissionService.isEmergencyMode();

  useEffect(() => {
    // Load business metrics
    setBusinessMetrics(permissionService.getBusinessMetrics());
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      setBusinessMetrics(permissionService.getBusinessMetrics());
    }, 30000); // Refresh every 30 seconds
    
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleApprove = (requestId: string) => {
    if (permissionService.approveRequest(requestId, userName)) {
      toast({
        title: "Request Approved",
        description: "Permission has been granted to the agent.",
      });
    }
  };

  const handleDeny = (requestId: string, reason: string = 'Executive decision') => {
    if (permissionService.denyRequest(requestId, reason, userName)) {
      toast({
        title: "Request Denied",
        description: `Permission denied: ${reason}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = () => {
    permissionService.updateExecutiveProfile({
      email: userEmail,
      phone: userPhone,
      name: userName,
      title: userTitle,
      contactPreferences,
      approvalThresholds,
      workingHours
    });
    
    toast({
      title: "Profile Updated",
      description: "Your executive profile has been updated successfully.",
    });
  };

  const handleEmergencyToggle = () => {
    if (isEmergencyMode) {
      permissionService.disableEmergencyMode();
      toast({
        title: "Emergency Mode Disabled",
        description: "Normal operations resumed.",
      });
    } else {
      permissionService.enableEmergencyMode('Manual activation by executive');
      toast({
        title: "Emergency Mode Activated",
        description: "All non-critical operations suspended.",
        variant: "destructive",
      });
    }
  };

  const generateAuditReport = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const report = permissionService.generateAuditReport(thirtyDaysAgo, new Date());
    console.log('Audit Report Generated:', report);
    
    toast({
      title: "Audit Report Generated",
      description: "30-day audit report has been generated. Check console for details.",
    });
  };

  const filteredRequests = pendingRequests.filter(request => {
    const matchesSearch = request.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || request.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return <MessageSquare className="w-4 h-4" />;
      case 'financial': return <DollarSign className="w-4 h-4" />;
      case 'legal': return <FileText className="w-4 h-4" />;
      case 'data_access': return <Eye className="w-4 h-4" />;
      case 'api_integration': return <Globe className="w-4 h-4" />;
      case 'strategic': return <TrendingUp className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl text-white shadow-lg ${isEmergencyMode ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-purple-600 to-indigo-700'}`}>
              {isEmergencyMode ? <AlertTriangle className="w-8 h-8" /> : <Crown className="w-8 h-8" />}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                Executive Control Center
                {isEmergencyMode && (
                  <Badge className="bg-red-600 text-white animate-pulse">
                    EMERGENCY MODE
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600">Central command for your Elite AI Business Team</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleEmergencyToggle}
              variant={isEmergencyMode ? "destructive" : "outline"}
              className={isEmergencyMode ? "animate-pulse" : ""}
            >
              {isEmergencyMode ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
              {isEmergencyMode ? 'Disable Emergency' : 'Emergency Mode'}
            </Button>
            <Button onClick={onBack} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Real-time Metrics Dashboard */}
        {businessMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-3xl font-bold text-blue-600">{businessMetrics.totalRequests}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approval Rate</p>
                  <p className="text-3xl font-bold text-green-600">{businessMetrics.approvalRate.toFixed(1)}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Response</p>
                  <p className="text-3xl font-bold text-amber-600">{businessMetrics.averageResponseTime}m</p>
                </div>
                <Clock className="w-8 h-8 text-amber-500" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Security Score</p>
                  <p className="text-3xl font-bold text-purple-600">{businessMetrics.complianceScore.toFixed(0)}%</p>
                </div>
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </div>
        )}

        <Tabs defaultValue="permissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="eva">Executive Eva</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitor</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Enhanced Permission Requests Tab */}
          <TabsContent value="permissions">
            <div className="grid gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-amber-600" />
                    <h2 className="text-2xl font-bold">Permission Requests</h2>
                    <Badge variant="destructive">{filteredRequests.length}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select 
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">All Categories</option>
                      <option value="communication">Communication</option>
                      <option value="financial">Financial</option>
                      <option value="legal">Legal</option>
                      <option value="data_access">Data Access</option>
                      <option value="api_integration">API Integration</option>
                      <option value="strategic">Strategic</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getCategoryIcon(request.category)}
                              {request.agentName}
                            </Badge>
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority)}`}></div>
                            <Badge 
                              variant={request.priority === 'critical' ? 'destructive' : 
                                      request.priority === 'high' ? 'default' : 'secondary'}
                            >
                              {request.priority}
                            </Badge>
                            <Badge variant="outline">{request.category}</Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{request.action}</h3>
                          <p className="text-gray-600 mb-2">{request.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Requested: {request.timestamp.toLocaleString()}</span>
                            {request.metadata?.amount && (
                              <span className="font-medium">Amount: ${request.metadata.amount.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            onClick={() => handleApprove(request.id)}
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleDeny(request.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Deny
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredRequests.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      {searchTerm || filterCategory !== 'all' ? 'No requests match your filters' : 'No pending permission requests'}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Executive Eva Tab */}
          <TabsContent value="eva">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Executive Eva</h2>
                  <p className="text-gray-600">Your Personal AI Executive Assistant</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Current Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span>Monitoring 13 Elite Agents</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Eye className="w-5 h-5 text-green-600" />
                      <span>Processing {pendingRequests.length} Permission Requests</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <span>Security Protocols {isEmergencyMode ? 'Emergency' : 'Active'}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-amber-600" />
                      <span>Business Intelligence Running</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Enhanced Capabilities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Badge variant="outline">Permission Management</Badge>
                    <Badge variant="outline">Real-time Monitoring</Badge>
                    <Badge variant="outline">Crisis Escalation</Badge>
                    <Badge variant="outline">Executive Reporting</Badge>
                    <Badge variant="outline">Multi-channel Contact</Badge>
                    <Badge variant="outline">Security Oversight</Badge>
                    <Badge variant="outline">Business Intelligence</Badge>
                    <Badge variant="outline">Compliance Monitoring</Badge>
                    <Badge variant="outline">Audit Trail Management</Badge>
                    <Badge variant="outline">Emergency Response</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Live Monitoring Tab */}
          <TabsContent value="monitoring">
            <div className="grid gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold">Live Activity Monitor</h2>
                  </div>
                  <Button onClick={() => setBusinessMetrics(permissionService.getBusinessMetrics())} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.slice(0, 15).map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg bg-white">
                      <div className={`p-2 rounded-full ${
                        activity.severity === 'critical' ? 'bg-red-100 text-red-600' :
                        activity.severity === 'warning' ? 'bg-amber-100 text-amber-600' :
                        activity.type === 'approval' ? 'bg-green-100 text-green-600' :
                        activity.type === 'denial' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {activity.type === 'approval' ? <CheckCircle className="w-4 h-4" /> :
                         activity.type === 'denial' ? <XCircle className="w-4 h-4" /> :
                         activity.type === 'escalation' ? <AlertTriangle className="w-4 h-4" /> :
                         activity.type === 'emergency' ? <Zap className="w-4 h-4" /> :
                         <Clock className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{activity.timestamp.toLocaleString()}</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.severity}
                          </Badge>
                          {activity.agentId && (
                            <Badge variant="secondary" className="text-xs">
                              {activity.agentId}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold">Security & Compliance</h2>
                  <Badge variant={securityEvents.length > 0 ? "destructive" : "secondary"}>
                    {securityEvents.length} Events
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Security Status</h3>
                    <div className="space-y-3">
                      <div className={`flex items-center gap-3 p-3 rounded-lg ${isEmergencyMode ? 'bg-red-50' : 'bg-green-50'}`}>
                        <Power className={`w-5 h-5 ${isEmergencyMode ? 'text-red-600' : 'text-green-600'}`} />
                        <span>System Status: {isEmergencyMode ? 'Emergency Mode' : 'Normal Operations'}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <span>Real-time Monitoring: Active</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <span>Audit Logging: Enabled</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button onClick={generateAuditReport} variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Generate Audit Report
                      </Button>
                      <Button 
                        onClick={handleEmergencyToggle}
                        variant={isEmergencyMode ? "destructive" : "outline"}
                        className="w-full justify-start"
                      >
                        {isEmergencyMode ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                        {isEmergencyMode ? 'Disable Emergency' : 'Emergency Lockdown'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Recent Security Events</h3>
                  {securityEvents.slice(0, 10).map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg bg-white">
                      <div className={`p-2 rounded-full ${
                        event.severity === 'critical' ? 'bg-red-100 text-red-600' :
                        event.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                        event.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{event.timestamp.toLocaleString()}</span>
                          <Badge variant="outline">{event.type}</Badge>
                          <Badge variant={event.resolved ? "secondary" : "destructive"}>
                            {event.resolved ? 'Resolved' : 'Active'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {securityEvents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      No security events detected
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold">Business Intelligence & Analytics</h2>
                </div>
                
                {businessMetrics && (
                  <div className="grid gap-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Request Analytics</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total Requests:</span>
                            <span className="font-bold">{businessMetrics.totalRequests}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Approval Rate:</span>
                            <span className="font-bold text-green-600">{businessMetrics.approvalRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Avg Response Time:</span>
                            <span className="font-bold">{businessMetrics.averageResponseTime} min</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Agent Productivity</h3>
                        <div className="space-y-2">
                          {Object.entries(businessMetrics.agentProductivity).slice(0, 3).map(([agentId, productivity]) => (
                            <div key={agentId} className="flex justify-between">
                              <span className="text-sm">{agentId}:</span>
                              <span className="font-bold">{productivity.toFixed(0)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Security & Compliance</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Security Incidents:</span>
                            <span className="font-bold text-red-600">{businessMetrics.securityIncidents}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Compliance Score:</span>
                            <span className="font-bold text-purple-600">{businessMetrics.complianceScore.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold">Executive Profile & Preferences</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                          value={userTitle}
                          onChange={(e) => setUserTitle(e.target.value)}
                          placeholder="Your job title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <Input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="your.email@company.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input
                          type="tel"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Working Hours</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Start Time</label>
                        <Input
                          type="time"
                          value={workingHours.start}
                          onChange={(e) => setWorkingHours(prev => ({ ...prev, start: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">End Time</label>
                        <Input
                          type="time"
                          value={workingHours.end}
                          onChange={(e) => setWorkingHours(prev => ({ ...prev, end: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Timezone</label>
                      <Input
                        value={workingHours.timezone}
                        onChange={(e) => setWorkingHours(prev => ({ ...prev, timezone: e.target.value }))}
                        placeholder="UTC-5"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Contact Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4" />
                          <span>Email notifications</span>
                        </div>
                        <Switch
                          checked={contactPreferences.email}
                          onCheckedChange={(checked) => 
                            setContactPreferences(prev => ({ ...prev, email: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-4 h-4" />
                          <span>SMS alerts</span>
                        </div>
                        <Switch
                          checked={contactPreferences.sms}
                          onCheckedChange={(checked) => 
                            setContactPreferences(prev => ({ ...prev, sms: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4" />
                          <span>Phone calls (critical only)</span>
                        </div>
                        <Switch
                          checked={contactPreferences.phone}
                          onCheckedChange={(checked) => 
                            setContactPreferences(prev => ({ ...prev, phone: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bell className="w-4 h-4" />
                          <span>Push notifications</span>
                        </div>
                        <Switch
                          checked={contactPreferences.pushNotifications}
                          onCheckedChange={(checked) => 
                            setContactPreferences(prev => ({ ...prev, pushNotifications: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Approval Thresholds</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Financial Limit ($)</label>
                        <Input
                          type="number"
                          value={approvalThresholds.financialLimit}
                          onChange={(e) => setApprovalThresholds(prev => ({ 
                            ...prev, 
                            financialLimit: parseInt(e.target.value) || 0 
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Auto-approve routine tasks</span>
                        <Switch
                          checked={approvalThresholds.autoApproveRoutine}
                          onCheckedChange={(checked) => 
                            setApprovalThresholds(prev => ({ ...prev, autoApproveRoutine: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Require approval for communications</span>
                        <Switch
                          checked={approvalThresholds.requireApprovalForCommunications}
                          onCheckedChange={(checked) => 
                            setApprovalThresholds(prev => ({ ...prev, requireApprovalForCommunications: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Require approval for legal documents</span>
                        <Switch
                          checked={approvalThresholds.requireApprovalForLegal}
                          onCheckedChange={(checked) => 
                            setApprovalThresholds(prev => ({ ...prev, requireApprovalForLegal: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <Button onClick={handleUpdateProfile} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Executive Profile
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Enhanced Settings Tab */}
          <TabsContent value="settings">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold">Advanced Executive Settings</h2>
              </div>
              
              <div className="grid gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Permission Policies</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <span className="font-medium">Financial transactions over</span>
                        <p className="text-sm text-gray-600">Require approval for amounts exceeding threshold</p>
                      </div>
                      <Input 
                        className="w-32" 
                        value={`$${approvalThresholds.financialLimit.toLocaleString()}`}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[$,]/g, '');
                          setApprovalThresholds(prev => ({ 
                            ...prev, 
                            financialLimit: parseInt(value) || 0 
                          }));
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <span className="font-medium">External communications</span>
                        <p className="text-sm text-gray-600">All outbound communications require approval</p>
                      </div>
                      <Badge variant="secondary">Always Required</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <span className="font-medium">Legal document modifications</span>
                        <p className="text-sm text-gray-600">Contract and legal changes require approval</p>
                      </div>
                      <Badge variant="secondary">Always Required</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <span className="font-medium">Data access requests</span>
                        <p className="text-sm text-gray-600">Access to sensitive business data</p>
                      </div>
                      <Badge variant="secondary">Always Required</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">System Controls</h3>
                  <div className="space-y-3">
                    <Button 
                      onClick={generateAuditReport}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download 30-Day Audit Report
                    </Button>
                    <Button 
                      onClick={() => {
                        setBusinessMetrics(permissionService.getBusinessMetrics());
                        toast({ title: "Data refreshed", description: "All dashboard data has been updated." });
                      }}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh All Data
                    </Button>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-lg text-red-600 mb-4">Emergency Controls</h3>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleEmergencyToggle}
                      variant={isEmergencyMode ? "destructive" : "outline"}
                      className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50"
                    >
                      {isEmergencyMode ? <Unlock className="w-4 h-4 mr-2" /> : <AlertTriangle className="w-4 h-4 mr-2" />}
                      {isEmergencyMode ? 'Disable Emergency Mode' : 'Activate Emergency Mode'}
                    </Button>
                    <p className="text-sm text-gray-600">
                      Emergency mode suspends all non-critical agent operations and requires manual approval for all requests.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
