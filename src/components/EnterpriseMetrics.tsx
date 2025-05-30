
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Brain,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Clock
} from 'lucide-react';

const EnterpriseMetrics = () => {
  const salesforceComparison = [
    {
      metric: 'Setup Time',
      us: '5 minutes',
      salesforce: '6+ months',
      advantage: 'faster',
      icon: Clock,
      improvement: '99.7% faster'
    },
    {
      metric: 'AI Capabilities',
      us: '18 Specialized Agents',
      salesforce: 'Einstein (Limited)',
      advantage: 'better',
      icon: Brain,
      improvement: '18x more AI power'
    },
    {
      metric: 'Cost Efficiency',
      us: 'All-in-one Platform',
      salesforce: 'Multiple Licenses',
      advantage: 'cheaper',
      icon: DollarSign,
      improvement: '80% cost reduction'
    },
    {
      metric: 'Automation Level',
      us: 'Fully Autonomous',
      salesforce: 'Manual Workflows',
      advantage: 'automated',
      icon: Zap,
      improvement: '95% automation'
    }
  ];

  const enterpriseFeatures = [
    {
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, SOC 2 compliance, and advanced access controls',
      icon: Shield,
      status: 'active'
    },
    {
      title: 'Global Scalability',
      description: 'Multi-region deployment with 99.99% uptime guarantee',
      icon: Globe,
      status: 'active'
    },
    {
      title: 'Advanced Analytics',
      description: 'Real-time business intelligence with predictive insights',
      icon: BarChart3,
      status: 'active'
    },
    {
      title: 'Custom Integrations',
      description: 'Connect with 500+ enterprise applications seamlessly',
      icon: Target,
      status: 'coming-soon'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Competitive Advantage Section */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Why We're Better Than Salesforce
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Our AI-powered platform delivers enterprise results with unprecedented speed and intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {salesforceComparison.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-white">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.metric}</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Our Platform:</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {item.us}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Salesforce:</span>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      {item.salesforce}
                    </Badge>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        {item.improvement}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Enterprise Features */}
      <Card className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Enterprise-Grade Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enterpriseFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-white flex-shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <Badge 
                        className={
                          feature.status === 'active' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-orange-100 text-orange-800 border-orange-200'
                        }
                      >
                        {feature.status === 'active' ? 'Live' : 'Coming Soon'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* ROI Calculator */}
      <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">ROI Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">$2.3M</div>
              <div className="text-gray-600">Average Annual Savings</div>
              <div className="text-sm text-gray-500 mt-1">vs Salesforce Enterprise</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">300%</div>
              <div className="text-gray-600">ROI in First Year</div>
              <div className="text-sm text-gray-500 mt-1">Typical enterprise client</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-600">Productivity Increase</div>
              <div className="text-sm text-gray-500 mt-1">Through AI automation</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnterpriseMetrics;
