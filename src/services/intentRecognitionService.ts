
interface BusinessIntent {
  category: string;
  action: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  entities: any;
  confidence: number;
  suggestedAgent: string;
  requiresTeamActivation: boolean;
}

interface ConversationContext {
  recentMessages: any[];
  userPreferences: any;
  activeProjects: any[];
  businessContext: any;
}

class IntentRecognitionService {
  private urgencyKeywords = {
    critical: ['emergency', 'critical', 'urgent', 'asap', 'immediately', 'crisis', 'breaking'],
    high: ['important', 'priority', 'soon', 'quickly', 'fast', 'rush', 'deadline'],
    medium: ['when possible', 'sometime', 'planning', 'considering'],
    low: ['eventually', 'future', 'maybe', 'thinking about']
  };

  private businessIntents = {
    meeting: ['meeting', 'schedule', 'appointment', 'call', 'conference', 'zoom'],
    financial: ['budget', 'cost', 'money', 'revenue', 'profit', 'expense', 'invoice', 'payment'],
    marketing: ['campaign', 'promotion', 'advertising', 'social media', 'content', 'brand'],
    sales: ['lead', 'prospect', 'deal', 'client', 'customer', 'proposal', 'quote'],
    operations: ['process', 'workflow', 'efficiency', 'automation', 'system'],
    hr: ['hire', 'employee', 'team', 'staff', 'training', 'performance'],
    legal: ['contract', 'agreement', 'compliance', 'legal', 'terms', 'policy'],
    technical: ['system', 'software', 'app', 'website', 'database', 'security'],
    strategy: ['plan', 'strategy', 'goal', 'objective', 'growth', 'competitive'],
    reporting: ['report', 'analysis', 'data', 'metrics', 'dashboard', 'insights']
  };

  private agentSpecialties = {
    'executive-eva': ['permission', 'coordination', 'oversight', 'management'],
    'strategy': ['planning', 'analysis', 'competitive', 'growth', 'market'],
    'marketing': ['campaign', 'content', 'brand', 'promotion', 'social'],
    'finance': ['budget', 'financial', 'cost', 'revenue', 'investment'],
    'operations': ['process', 'workflow', 'efficiency', 'system', 'automation'],
    'customer': ['client', 'customer', 'support', 'experience', 'satisfaction'],
    'hr': ['employee', 'team', 'hiring', 'training', 'performance'],
    'legal': ['contract', 'compliance', 'legal', 'terms', 'agreement'],
    'cto': ['technical', 'system', 'software', 'security', 'development'],
    'data': ['analysis', 'metrics', 'insights', 'reporting', 'data'],
    'intelligence': ['research', 'competitive', 'market', 'investigation'],
    'communications': ['messaging', 'communication', 'announcement', 'update'],
    'documents': ['document', 'file', 'report', 'documentation', 'template']
  };

  analyzeIntent(message: string, context?: ConversationContext): BusinessIntent {
    const lowerMessage = message.toLowerCase();
    
    // Analyze urgency
    const urgency = this.detectUrgency(lowerMessage);
    
    // Detect business category
    const category = this.detectBusinessCategory(lowerMessage);
    
    // Extract entities
    const entities = this.extractEntities(message);
    
    // Determine action type
    const action = this.detectAction(lowerMessage);
    
    // Suggest best agent
    const suggestedAgent = this.suggestAgent(lowerMessage, category);
    
    // Determine if team activation is needed
    const requiresTeamActivation = this.requiresTeamActivation(lowerMessage, category, urgency);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(lowerMessage, category, action);

    return {
      category,
      action,
      urgency,
      entities,
      confidence,
      suggestedAgent,
      requiresTeamActivation
    };
  }

  private detectUrgency(message: string): 'low' | 'medium' | 'high' | 'critical' {
    for (const [level, keywords] of Object.entries(this.urgencyKeywords)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return level as 'low' | 'medium' | 'high' | 'critical';
      }
    }
    return 'medium';
  }

  private detectBusinessCategory(message: string): string {
    let bestMatch = 'general';
    let maxMatches = 0;

    for (const [category, keywords] of Object.entries(this.businessIntents)) {
      const matches = keywords.filter(keyword => message.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = category;
      }
    }

    return bestMatch;
  }

  private extractEntities(message: string): any {
    const entities: any = {};
    
    // Extract dates
    const datePattern = /(?:today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}\/\d{1,2}|\d{1,2}-\d{1,2})/gi;
    const dates = message.match(datePattern);
    if (dates) entities.dates = dates;
    
    // Extract times
    const timePattern = /(?:\d{1,2}:\d{2}(?:\s?[ap]m)?|\d{1,2}\s?[ap]m)/gi;
    const times = message.match(timePattern);
    if (times) entities.times = times;
    
    // Extract money amounts
    const moneyPattern = /\$[\d,]+(?:\.\d{2})?/gi;
    const amounts = message.match(moneyPattern);
    if (amounts) entities.amounts = amounts;
    
    // Extract email addresses
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
    const emails = message.match(emailPattern);
    if (emails) entities.emails = emails;
    
    // Extract phone numbers
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/gi;
    const phones = message.match(phonePattern);
    if (phones) entities.phones = phones;

    return entities;
  }

  private detectAction(message: string): string {
    const actionKeywords = {
      create: ['create', 'make', 'build', 'generate', 'develop'],
      update: ['update', 'change', 'modify', 'edit', 'revise'],
      schedule: ['schedule', 'book', 'arrange', 'set up', 'plan'],
      analyze: ['analyze', 'review', 'check', 'examine', 'look at'],
      send: ['send', 'email', 'message', 'forward', 'deliver'],
      research: ['research', 'find', 'look up', 'investigate', 'discover'],
      report: ['report', 'summarize', 'brief', 'update', 'status']
    };

    for (const [action, keywords] of Object.entries(actionKeywords)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return action;
      }
    }
    
    return 'process';
  }

  private suggestAgent(message: string, category: string): string {
    let bestAgent = 'executive-eva';
    let maxRelevance = 0;

    for (const [agentId, specialties] of Object.entries(this.agentSpecialties)) {
      const relevance = specialties.filter(specialty => 
        message.includes(specialty) || category === specialty
      ).length;
      
      if (relevance > maxRelevance) {
        maxRelevance = relevance;
        bestAgent = agentId;
      }
    }

    // Category-based fallback
    const categoryToAgent: { [key: string]: string } = {
      financial: 'finance',
      marketing: 'marketing',
      sales: 'customer',
      operations: 'operations',
      hr: 'hr',
      legal: 'legal',
      technical: 'cto',
      strategy: 'strategy',
      reporting: 'data'
    };

    return categoryToAgent[category] || bestAgent;
  }

  private requiresTeamActivation(message: string, category: string, urgency: string): boolean {
    const teamActivationTriggers = [
      'team', 'everyone', 'all hands', 'coordinate', 'collaborate',
      'project', 'initiative', 'campaign', 'launch'
    ];

    const hasTeamTrigger = teamActivationTriggers.some(trigger => message.includes(trigger));
    const isHighPriority = urgency === 'high' || urgency === 'critical';
    const isComplexCategory = ['strategy', 'marketing', 'operations'].includes(category);

    return hasTeamTrigger || (isHighPriority && isComplexCategory);
  }

  private calculateConfidence(message: string, category: string, action: string): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on keyword matches
    const categoryKeywords = this.businessIntents[category] || [];
    const matches = categoryKeywords.filter(keyword => message.includes(keyword)).length;
    confidence += (matches * 0.1);
    
    // Increase confidence for clear action words
    if (action !== 'process') confidence += 0.2;
    
    // Increase confidence for structured messages
    if (message.length > 20 && message.includes(' ')) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  getConversationSuggestions(intent: BusinessIntent): string[] {
    const suggestions = [];
    
    if (intent.urgency === 'critical') {
      suggestions.push('Escalating to executive team immediately');
    }
    
    if (intent.requiresTeamActivation) {
      suggestions.push('Activating relevant team members');
    }
    
    if (intent.entities.dates) {
      suggestions.push('Calendar integration available');
    }
    
    if (intent.entities.amounts) {
      suggestions.push('Financial analysis recommended');
    }
    
    return suggestions;
  }
}

export const intentRecognitionService = new IntentRecognitionService();
