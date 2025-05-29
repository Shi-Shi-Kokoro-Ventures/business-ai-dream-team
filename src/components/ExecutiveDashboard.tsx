
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  BarChart3
} from 'lucide-react';
import { Agent } from '@/types/agent';
import { permissionService } from '@/services/permissionService';

interface ExecutiveDashboardProps {
  onBack: () => void;
}

const ExecutiveDashboard = ({ onBack }: ExecutiveDashboardProps) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [contactPreferences, setContactPreferences] = useState({
    email: true,
    sms: true,
    phone: false
  });

  const pendingRequests = permissionService.getPendingRequests();
  const recentActivity = permissionService.getRecentActivity();

  const handleApprove = (requestId: string) => {
    permissionService.approveRequest(requestId);
    console.log(`Executive approved request: ${requestId}`);
  };

  const handleDeny = (requestId: string) => {
    permissionService.denyRequest(requestId);
    console.log(`Executive denied request: ${requestId}`);
  };

  const handleUpdateProfile = () => {
    permissionService.updateExecutiveProfile({
      email: userEmail,
      phone: userPhone,
      contactPreferences
    });
    console.log('Executive profile updated');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Executive Control Center</h1>
              <p className="text-gray-600">Central command for your Elite AI Business Team</p>
            </div>
          </div>
          <Button onClick={onBack} variant="outline">
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="permissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="permissions">Permission Requests</TabsTrigger>
            <TabsTrigger value="eva">Executive Eva</TabsTrigger>
            <TabsTrigger value="activity">Activity Monitor</TabsTrigger>
            <TabsTrigger value="profile">Your Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Permission Requests Tab */}
          <TabsContent value="permissions">
            <div className="grid gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-bold">Pending Permission Requests</h2>
                  <Badge variant="destructive">{pendingRequests.length}</Badge>
                </div>
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{request.agentName}</Badge>
                            <Badge 
                              variant={request.priority === 'critical' ? 'destructive' : 
                                      request.priority === 'high' ? 'default' : 'secondary'}
                            >
                              {request.priority}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{request.action}</h3>
                          <p className="text-gray-600 mb-2">{request.description}</p>
                          <div className="text-sm text-gray-500">
                            Requested: {request.timestamp.toLocaleString()}
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
                  {pendingRequests.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      No pending permission requests
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
                      <span>Monitoring 12 Elite Agents</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Eye className="w-5 h-5 text-green-600" />
                      <span>Processing {pendingRequests.length} Permission Requests</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <span>Security Protocols Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Capabilities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Badge variant="outline">Permission Management</Badge>
                    <Badge variant="outline">Real-time Monitoring</Badge>
                    <Badge variant="outline">Crisis Escalation</Badge>
                    <Badge variant="outline">Executive Reporting</Badge>
                    <Badge variant="outline">Multi-channel Contact</Badge>
                    <Badge variant="outline">Security Oversight</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Activity Monitor Tab */}
          <TabsContent value="activity">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Recent Activity</h2>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg bg-white">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'approval' ? 'bg-green-100 text-green-600' :
                      activity.type === 'denial' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {activity.type === 'approval' ? <CheckCircle className="w-4 h-4" /> :
                       activity.type === 'denial' ? <XCircle className="w-4 h-4" /> :
                       <Clock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold">Executive Profile</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your.email@company.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={contactPreferences.email}
                        onChange={(e) => setContactPreferences(prev => ({
                          ...prev,
                          email: e.target.checked
                        }))}
                      />
                      <Mail className="w-4 h-4" />
                      Email notifications
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={contactPreferences.sms}
                        onChange={(e) => setContactPreferences(prev => ({
                          ...prev,
                          sms: e.target.checked
                        }))}
                      />
                      <MessageSquare className="w-4 h-4" />
                      SMS alerts
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={contactPreferences.phone}
                        onChange={(e) => setContactPreferences(prev => ({
                          ...prev,
                          phone: e.target.checked
                        }))}
                      />
                      <Phone className="w-4 h-4" />
                      Phone calls (critical only)
                    </label>
                  </div>
                </div>
              </div>
              <Button onClick={handleUpdateProfile} className="mt-6">
                Update Profile
              </Button>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold">Executive Settings</h2>
              </div>
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Permission Thresholds</h3>
                  <p className="text-gray-600 mb-4">Configure when agents need to request permission</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Financial transactions over</span>
                      <Input className="w-32" placeholder="$1,000" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>External communications</span>
                      <Badge variant="secondary">Always Required</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Legal document modifications</span>
                      <Badge variant="secondary">Always Required</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <Button variant="destructive" className="w-full">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Emergency: Suspend All Agent Operations
                  </Button>
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
