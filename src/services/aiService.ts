
// Simple AI service implementation for the agent contacts system
export const aiService = {
  sendMessage: async (agentId: string, message: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response based on agent
    const responses = {
      'executive-eva': "I understand your request. I'll coordinate with the team and ensure all permissions are properly managed.",
      'strategy': "Let me analyze the market data and provide you with strategic recommendations.",
      'marketing': "I'll create a compelling campaign strategy for your marketing objectives.",
      'finance': "I'll review the financial implications and provide budget recommendations.",
      'operations': "I'll optimize the workflow and improve operational efficiency.",
      'customer': "I'll enhance the customer experience and improve satisfaction metrics."
    };
    
    return {
      id: Date.now().toString(),
      content: responses[agentId as keyof typeof responses] || "I'm here to help with your request.",
      sender: 'agent' as const,
      timestamp: new Date(),
      status: 'read' as const
    };
  },
  
  getAgentStatus: async (agentId: string) => {
    // Mock agent status
    return {
      isOnline: true,
      isTyping: false,
      lastSeen: new Date()
    };
  },

  getAgentPersonality: (agentId: string) => {
    // Mock agent personalities
    const personalities = {
      'executive-eva': {
        name: 'Executive Eva',
        personality: 'Professional, authoritative, and strategic. Focuses on coordination and oversight.',
        communicationStyle: 'Direct and decisive'
      },
      'strategy': {
        name: 'Alex Strategy', 
        personality: 'Analytical, forward-thinking, and methodical. Expert in strategic planning.',
        communicationStyle: 'Thoughtful and data-driven'
      },
      'marketing': {
        name: 'Maya Creative',
        personality: 'Creative, enthusiastic, and brand-focused. Passionate about campaigns.',
        communicationStyle: 'Energetic and persuasive'
      },
      'finance': {
        name: 'Felix Finance',
        personality: 'Precise, analytical, and risk-aware. Detail-oriented with numbers.',
        communicationStyle: 'Methodical and accurate'
      },
      'operations': {
        name: 'Oliver Operations',
        personality: 'Systematic, efficient, and process-oriented. Focused on optimization.',
        communicationStyle: 'Clear and systematic'
      },
      'customer': {
        name: 'Clara Customer',
        personality: 'Empathetic, service-oriented, and relationship-focused.',
        communicationStyle: 'Warm and supportive'
      }
    };
    
    return personalities[agentId as keyof typeof personalities] || null;
  },

  processMessage: async (agentId: string, message: string, context?: any) => {
    // Enhanced message processing with personality
    const personality = aiService.getAgentPersonality(agentId);
    
    if (!personality) {
      return message;
    }

    // Simple message enhancement based on agent personality
    const enhancements = {
      'executive-eva': (msg: string) => `As your executive assistant, ${msg.toLowerCase()}`,
      'strategy': (msg: string) => `From a strategic perspective, ${msg.toLowerCase()}`,
      'marketing': (msg: string) => `Let's create something amazing! ${msg}`,
      'finance': (msg: string) => `Analyzing the financial aspects: ${msg.toLowerCase()}`,
      'operations': (msg: string) => `To optimize this process: ${msg.toLowerCase()}`,
      'customer': (msg: string) => `I'm here to help! ${msg}`
    };

    const enhanceFunction = enhancements[agentId as keyof typeof enhancements];
    return enhanceFunction ? enhanceFunction(message) : message;
  }
};
