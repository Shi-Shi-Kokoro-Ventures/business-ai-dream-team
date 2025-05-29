
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
  }
};
