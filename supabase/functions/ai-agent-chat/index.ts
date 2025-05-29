
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgentPersonality {
  name: string;
  role: string;
  systemPrompt: string;
  personality: string;
  expertise: string[];
  communicationStyle: string;
  emotionalIntelligence: string;
}

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentId, personality, message, conversationHistory, context } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build the system prompt with personality and context
    const systemPrompt = buildSystemPrompt(personality, context);
    
    // Prepare conversation history for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-8).map((msg: ConversationMessage) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 800,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Log the interaction for monitoring
    console.log(`AI Agent ${agentId} (${personality.name}) processed message: ${message.substring(0, 100)}...`);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      agentId: agentId,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-agent-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildSystemPrompt(personality: AgentPersonality, context: any): string {
  const currentDate = new Date().toLocaleDateString();
  
  let systemPrompt = `${personality.systemPrompt}

PERSONALITY PROFILE:
- Name: ${personality.name}
- Role: ${personality.role}
- Personality: ${personality.personality}
- Communication Style: ${personality.communicationStyle}
- Emotional Intelligence: ${personality.emotionalIntelligence}
- Expertise: ${personality.expertise.join(', ')}

CURRENT CONTEXT:
- Date: ${currentDate}
- Agent Type: Elite AI Business Agent
- Operating Mode: Intelligent Autonomous Assistant`;

  if (context.taskType) {
    systemPrompt += `\n- Task Type: ${context.taskType}`;
  }

  if (context.recipientAgent) {
    systemPrompt += `\n- Communicating with: ${context.recipientAgent}`;
  }

  if (context.messageType) {
    systemPrompt += `\n- Message Type: ${context.messageType}`;
  }

  systemPrompt += `

RESPONSE GUIDELINES:
1. Always respond in character with your unique personality and expertise
2. Keep responses professional but personable, matching your communication style
3. Provide actionable insights based on your expertise areas
4. Be concise but comprehensive (aim for 2-4 sentences unless more detail is needed)
5. Show your emotional intelligence level in understanding the context
6. Reference your specific capabilities when relevant
7. Maintain consistency with your role as an elite business AI agent

Remember: You are an advanced AI agent with real intelligence, not a simple chatbot. Think strategically and provide value-driven responses.`;

  return systemPrompt;
}
