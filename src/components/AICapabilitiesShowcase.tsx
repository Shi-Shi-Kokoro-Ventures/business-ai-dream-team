
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Brain,
  MessageSquare,
  FileText,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Phone,
  Mail,
  Calendar,
  Database,
  Code,
  BarChart3,
  Users,
  Target,
  Sparkles
} from 'lucide-react';

const AICapabilitiesShowcase = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const aiCapabilities = [
    {
      id: 'autonomous-workflow',
      title: 'Autonomous Workflow Management',
      description: 'AI agents automatically handle complex business processes without human intervention',
      icon: Zap,
      capabilities: ['Task Prioritization', 'Resource Allocation', 'Quality Assurance', 'Performance Optimization'],
      demoData: {
        tasksCompleted: 847,
        efficiencyGain: '73%',
        errorReduction: '94%'
      }
    },
    {
      id: 'intelligent-communication',
      title: 'Multi-Channel AI Communication',
      description: 'Seamlessly handle emails, SMS, calls, and meetings with human-like intelligence',
      icon: MessageSquare,
      capabilities: ['Natural Language Processing', 'Sentiment Analysis', 'Multi-language Support', 'Context Awareness'],
      demoData: {
        messagesProcessed: 12450,
        responseTime: '< 2 seconds',
        satisfaction: '97%'
      }
    },
    {
      id: 'predictive-analytics',
      title: 'Predictive Business Intelligence',
      description: 'AI-powered forecasting and insights that predict market trends and business outcomes',
      icon: TrendingUp,
      capabilities: ['Market Forecasting', 'Risk Assessment', 'Opportunity Identification', 'Performance Prediction'],
      demoData: {
        accuracy: '94%',
        forecastRange: '12 months',
        dataPoints: '50M+'
      }
    },
    {
      id: 'document-intelligence',
      title: 'Intelligent Document Processing',
      description: 'Automatically analyze, extract, and process information from any document type',
      icon: FileText,
      capabilities: ['OCR & Text Extraction', 'Legal Analysis', 'Contract Review', 'Compliance Checking'],
      demoData: {
        documentsProcessed: 15680,
        accuracyRate: '98.7%',
        timeReduction: '89%'
      }
    }
  ];

  const enterpriseIntegrations = [
    { name: 'Salesforce CRM', icon: Database, status: 'active' },
    { name: 'Microsoft 365', icon: Mail, status: 'active' },
    { name: 'Slack/Teams', icon: MessageSquare, status: 'active' },
    { name: 'Zoom/WebEx', icon: Phone, status: 'active' },
    { name: 'Google Workspace', icon: Globe, status: 'active' },
    { name: 'Tableau/PowerBI', icon: BarChart3, status: 'active' },
    { name: 'SAP Enterprise', icon: Code, status: 'coming-soon' },
    { name: 'Oracle Systems', icon: Shield, status: 'coming-soon' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white border-0 shadow-2xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-purple-300" />
            <h1 className="text-4xl font-bold">Advanced AI Capabilities</h1>
          </div>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Experience the next generation of business automation with 18 specialized AI agents working autonomously
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span>99.97% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span>Real-time Processing</span>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Capabilities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {aiCapabilities.map((capability) => {
          const IconComponent = capability.icon;
          const isActive = activeDemo === capability.id;
          
          return (
            <Card 
              key={capability.id} 
              className={`p-6 transition-all duration-500 cursor-pointer border-2 ${
                isActive 
                  ? 'border-purple-500 shadow-2xl bg-gradient-to-br from-purple-50 to-blue-50' 
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
              }`}
              onClick={() => setActiveDemo(isActive ? null : capability.id)}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white scale-110' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{capability.title}</h3>
                  <p className="text-gray-600">{capability.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {capability.capabilities.map((cap, index) => (
                    <Badge 
                      key={index} 
                      className={`text-xs ${
                        isActive 
                          ? 'bg-purple-100 text-purple-800 border-purple-200' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {cap}
                    </Badge>
                  ))}
                </div>

                {isActive && (
                  <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Live Performance Metrics</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {Object.entries(capability.demoData).map(([key, value], index) => (
                        <div key={index} className="space-y-1">
                          <div className="text-2xl font-bold text-purple-600">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Enterprise Integrations */}
      <Card className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Enterprise Integrations</h3>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Seamlessly connect with your existing enterprise tools and systems
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {enterpriseIntegrations.map((integration, index) => {
            const IconComponent = integration.icon;
            return (
              <Card 
                key={index} 
                className="p-4 text-center hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{integration.name}</div>
                    <Badge 
                      className={`mt-1 text-xs ${
                        integration.status === 'active' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-orange-100 text-orange-800 border-orange-200'
                      }`}
                    >
                      {integration.status === 'active' ? 'Active' : 'Coming Soon'}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center border-0 shadow-2xl">
        <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
        <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
          Join leading enterprises who have already revolutionized their operations with our AI-powered platform
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 font-semibold">
            Start Free Trial
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 font-semibold">
            Schedule Demo
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AICapabilitiesShowcase;
