import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import {
  Activity, TrendingUp, Users, Brain, Zap, Clock, Target,
  BarChart3, PieChart as PieChartIcon, ArrowUp, ArrowDown,
  Shield, CheckCircle, AlertTriangle, Cpu
} from 'lucide-react';

const agentPerformanceData = [
  { name: 'Eva', tasks: 89, accuracy: 98, responseTime: 1.2, satisfaction: 9.5 },
  { name: 'Alex', tasks: 76, accuracy: 95, responseTime: 1.8, satisfaction: 9.2 },
  { name: 'Maya', tasks: 94, accuracy: 92, responseTime: 1.5, satisfaction: 9.4 },
  { name: 'Felix', tasks: 67, accuracy: 99, responseTime: 2.1, satisfaction: 9.1 },
  { name: 'Oliver', tasks: 82, accuracy: 96, responseTime: 1.4, satisfaction: 9.3 },
  { name: 'Clara', tasks: 91, accuracy: 94, responseTime: 1.1, satisfaction: 9.7 },
  { name: 'Harper', tasks: 58, accuracy: 97, responseTime: 1.9, satisfaction: 9.0 },
  { name: 'Lex', tasks: 45, accuracy: 99, responseTime: 2.5, satisfaction: 8.8 },
  { name: 'Code Cmd', tasks: 73, accuracy: 93, responseTime: 1.7, satisfaction: 9.1 },
  { name: 'Dr. Data', tasks: 68, accuracy: 98, responseTime: 2.0, satisfaction: 9.3 },
];

const weeklyTrendData = [
  { day: 'Mon', tasks: 142, messages: 320, approvals: 28 },
  { day: 'Tue', tasks: 158, messages: 345, approvals: 32 },
  { day: 'Wed', tasks: 176, messages: 410, approvals: 41 },
  { day: 'Thu', tasks: 165, messages: 380, approvals: 35 },
  { day: 'Fri', tasks: 189, messages: 420, approvals: 45 },
  { day: 'Sat', tasks: 95, messages: 210, approvals: 15 },
  { day: 'Sun', tasks: 78, messages: 180, approvals: 12 },
];

const taskDistribution = [
  { name: 'Strategy', value: 22, color: '#6366f1' },
  { name: 'Marketing', value: 18, color: '#ec4899' },
  { name: 'Finance', value: 15, color: '#10b981' },
  { name: 'Operations', value: 14, color: '#8b5cf6' },
  { name: 'Customer', value: 12, color: '#f59e0b' },
  { name: 'Legal', value: 8, color: '#64748b' },
  { name: 'HR', value: 6, color: '#06b6d4' },
  { name: 'Other', value: 5, color: '#94a3b8' },
];

const radarData = [
  { metric: 'Speed', value: 92 },
  { metric: 'Accuracy', value: 96 },
  { metric: 'Throughput', value: 88 },
  { metric: 'Collaboration', value: 94 },
  { metric: 'Innovation', value: 85 },
  { metric: 'Reliability', value: 97 },
];

const hourlyLoad = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  load: Math.round(20 + Math.random() * 60 + (i >= 9 && i <= 17 ? 30 : 0)),
  capacity: 100,
}));

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [totalTasks, setTotalTasks] = useState(1003);
  const [avgResponse, setAvgResponse] = useState(1.7);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTasks(prev => prev + Math.floor(Math.random() * 3));
      setAvgResponse(prev => +(prev + (Math.random() - 0.5) * 0.1).toFixed(1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
              Agent Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time performance monitoring and insights across all 18 AI agents
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(['day', 'week', 'month'] as const).map((range) => (
              <Button
                key={range}
                size="sm"
                variant={timeRange === range ? 'default' : 'outline'}
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : ''}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalTasks.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-3 h-3 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+12.3%</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/50 dark:to-indigo-800/50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Avg Response</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{avgResponse}s</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDown className="w-3 h-3 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">-0.3s faster</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-800/50 dark:to-emerald-800/50 rounded-xl">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Agents Online</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">18/18</p>
                <div className="flex items-center gap-1 mt-2">
                  <Activity className="w-3 h-3 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">All operational</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800/50 dark:to-pink-800/50 rounded-xl">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Accuracy Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">96.2%</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-3 h-3 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+1.1%</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-800/50 dark:to-orange-800/50 rounded-xl">
                <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-2">
            <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl py-2.5 font-semibold">
              Performance
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl py-2.5 font-semibold">
              Trends
            </TabsTrigger>
            <TabsTrigger value="distribution" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl py-2.5 font-semibold">
              Distribution
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl py-2.5 font-semibold">
              System Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-500" />
                  Tasks Completed by Agent
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={agentPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="tasks" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Accuracy Rate by Agent
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={agentPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" domain={[80, 100]} tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={70} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => [`${value}%`, 'Accuracy']}
                    />
                    <Bar dataKey="accuracy" fill="url(#accuracyGradient)" radius={[0, 6, 6, 0]} />
                    <defs>
                      <linearGradient id="accuracyGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Agent Leaderboard */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Agent Leaderboard
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Rank</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Agent</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Tasks</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Accuracy</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Response</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Satisfaction</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentPerformanceData
                      .sort((a, b) => b.tasks - a.tasks)
                      .map((agent, index) => (
                        <tr key={agent.name} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-50 text-gray-600'
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{agent.name}</td>
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{agent.tasks}</td>
                          <td className="py-3 px-4">
                            <Badge className={agent.accuracy >= 97 ? 'bg-green-100 text-green-800' : agent.accuracy >= 94 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                              {agent.accuracy}%
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{agent.responseTime}s</td>
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{agent.satisfaction}/10</td>
                          <td className="py-3 px-4">
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <Activity className="w-3 h-3 mr-1" /> Active
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Weekly Activity Trends
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={weeklyTrendData}>
                  <defs>
                    <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Area type="monotone" dataKey="tasks" stroke="#6366f1" fillOpacity={1} fill="url(#taskGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="messages" stroke="#ec4899" fillOpacity={1} fill="url(#msgGrad)" strokeWidth={2} />
                  <Line type="monotone" dataKey="approvals" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-purple-500" />
                  Task Distribution by Department
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {taskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-500" />
                  System Capability Radar
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="System" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Cpu className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">System Uptime</h3>
                </div>
                <div className="text-center py-8">
                  <p className="text-5xl font-bold text-green-600">99.97%</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Last 30 days</p>
                  <Badge className="mt-4 bg-green-100 text-green-800 text-sm px-4 py-1">
                    <Shield className="w-3 h-3 mr-1" /> Excellent
                  </Badge>
                </div>
              </Card>

              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">API Latency</h3>
                </div>
                <div className="text-center py-8">
                  <p className="text-5xl font-bold text-blue-600">142ms</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">P95 Response Time</p>
                  <Badge className="mt-4 bg-blue-100 text-blue-800 text-sm px-4 py-1">
                    <TrendingUp className="w-3 h-3 mr-1" /> Optimal
                  </Badge>
                </div>
              </Card>

              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Error Rate</h3>
                </div>
                <div className="text-center py-8">
                  <p className="text-5xl font-bold text-amber-600">0.03%</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Last 24 hours</p>
                  <Badge className="mt-4 bg-green-100 text-green-800 text-sm px-4 py-1">
                    <CheckCircle className="w-3 h-3 mr-1" /> Within SLA
                  </Badge>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                24-Hour System Load
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={hourlyLoad}>
                  <defs>
                    <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="load" stroke="#6366f1" fill="url(#loadGrad)" strokeWidth={2} />
                  <Line type="monotone" dataKey="capacity" stroke="#ef4444" strokeDasharray="5 5" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
