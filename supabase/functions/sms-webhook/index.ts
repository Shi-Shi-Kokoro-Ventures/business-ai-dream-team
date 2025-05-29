
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface IncomingMessage {
  From: string;
  Body: string;
  MessageSid: string;
  AccountSid: string;
  To: string;
}

interface IntentAnalysis {
  intent: string;
  confidence: number;
  entities: any;
  assignedAgent: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  requiresTeamActivation: boolean;
  suggestedActions: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse incoming SMS from Twilio webhook
    const formData = await req.formData();
    const message: IncomingMessage = {
      From: formData.get('From') as string,
      Body: formData.get('Body') as string,
      MessageSid: formData.get('MessageSid') as string,
      AccountSid: formData.get('AccountSid') as string,
      To: formData.get('To') as string,
    };

    console.log('Incoming SMS:', message);

    // Store incoming message
    await supabase.from('sms_messages').insert({
      phone_number: message.From,
      message_content: message.Body,
      direction: 'inbound',
      status: 'received',
      twilio_sid: message.MessageSid,
      agent_id: 'executive-eva' // Default to Executive Eva for routing
    });

    // Analyze intent using AI
    const intentAnalysis = await analyzeIntent(message.Body, message.From);
    
    // Get conversation context
    const context = await getConversationContext(message.From, supabase);
    
    // Route to appropriate agent and generate response
    const response = await routeAndRespond(intentAnalysis, message, context, supabase);
    
    // Send response via Twilio
    await sendSMSResponse(message.From, response.message, supabase);
    
    // Activate team if needed
    if (intentAnalysis.requiresTeamActivation) {
      await activateTeam(intentAnalysis, message, context, supabase);
    }

    // Return TwiML response
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>${response.message}</Message>
    </Response>`;

    return new Response(twimlResponse, {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("SMS webhook error:", error);
    
    const errorResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>I'm experiencing technical difficulties. Please try again or call if urgent.</Message>
    </Response>`;

    return new Response(errorResponse, {
      status: 200,
      headers: { "Content-Type": "text/xml", ...corsHeaders },
    });
  }
};

async function analyzeIntent(messageBody: string, phoneNumber: string): Promise<IntentAnalysis> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    // Fallback intent analysis
    return {
      intent: 'general_inquiry',
      confidence: 0.5,
      entities: {},
      assignedAgent: 'executive-eva',
      priority: 'medium',
      requiresTeamActivation: false,
      suggestedActions: ['respond_with_acknowledgment']
    };
  }

  const prompt = `Analyze this SMS message for business intent and routing:

Message: "${messageBody}"
From: ${phoneNumber}

Return a JSON object with:
1. intent: (meeting_request, task_assignment, status_check, urgent_issue, general_inquiry, team_activation, financial_request, marketing_request, legal_request, technical_request)
2. confidence: (0-1)
3. entities: {any relevant extracted data like dates, amounts, names}
4. assignedAgent: (executive-eva, strategy, marketing, finance, operations, customer, hr, legal, cto, data, intelligence, communications, documents)
5. priority: (low, medium, high, critical)
6. requiresTeamActivation: (true/false)
7. suggestedActions: [array of actions to take]

Consider:
- Urgency indicators (urgent, asap, emergency, critical)
- Business domain keywords
- Request complexity
- Time-sensitive language
- Authority level of request`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert business communication analyzer. Return only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);
    
    return analysis;
  } catch (error) {
    console.error('Intent analysis error:', error);
    return {
      intent: 'general_inquiry',
      confidence: 0.3,
      entities: {},
      assignedAgent: 'executive-eva',
      priority: 'medium',
      requiresTeamActivation: false,
      suggestedActions: ['respond_with_acknowledgment']
    };
  }
}

async function getConversationContext(phoneNumber: string, supabase: any) {
  const { data: recentMessages } = await supabase
    .from('sms_messages')
    .select('*')
    .eq('phone_number', phoneNumber)
    .order('sent_at', { ascending: false })
    .limit(10);

  return {
    recentMessages: recentMessages || [],
    conversationHistory: recentMessages?.map(msg => ({
      role: msg.direction === 'inbound' ? 'user' : 'assistant',
      content: msg.message_content,
      timestamp: msg.sent_at,
      agent: msg.agent_id
    })) || []
  };
}

async function routeAndRespond(
  analysis: IntentAnalysis, 
  message: IncomingMessage, 
  context: any, 
  supabase: any
) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  // Get agent personality
  const agentPersonalities = {
    'executive-eva': 'Professional, authoritative executive assistant who manages permissions and coordinates teams',
    'strategy': 'Strategic, analytical business advisor focused on growth and competitive advantage',
    'marketing': 'Creative, energetic marketing expert with deep consumer psychology knowledge',
    'finance': 'Precise, conservative financial advisor focused on optimization and risk management',
    'operations': 'Systematic, efficient operations manager who streamlines processes',
    'customer': 'Empathetic, relationship-focused customer experience specialist',
    'hr': 'Supportive, diplomatic people development expert',
    'legal': 'Cautious, thorough legal strategist who protects business interests',
    'cto': 'Innovative, technical visionary who architects scalable solutions',
    'data': 'Analytical, insight-driven data scientist who uncovers hidden patterns',
    'intelligence': 'Investigative, strategic business intelligence researcher',
    'communications': 'Clear, strategic communications director',
    'documents': 'Organized, systematic documentation specialist'
  };

  const agentName = getAgentDisplayName(analysis.assignedAgent);
  const agentPersonality = agentPersonalities[analysis.assignedAgent] || agentPersonalities['executive-eva'];
  
  if (!openAIApiKey) {
    return {
      message: `Hi! This is ${agentName}. I received your message about "${message.Body.substring(0, 50)}..." and I'm working on it. I'll get back to you shortly.`,
      agent: analysis.assignedAgent
    };
  }

  const contextString = context.conversationHistory.length > 0 
    ? `Recent conversation context:\n${context.conversationHistory.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\n`
    : '';

  const prompt = `You are ${agentName}, ${agentPersonality}.

${contextString}Current message: "${message.Body}"
Intent: ${analysis.intent}
Priority: ${analysis.priority}
Entities: ${JSON.stringify(analysis.entities)}

Respond via SMS (keep under 160 characters if possible, max 320) as this specific agent would. Be:
1. Professional but conversational
2. Specific about what you'll do
3. Set clear expectations
4. Acknowledge urgency if present
5. Use your agent's expertise and personality

${analysis.requiresTeamActivation ? 'Mention that you\'re activating the appropriate team members.' : ''}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional AI agent responding via SMS. Keep responses concise but helpful.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    const responseMessage = data.choices[0].message.content;
    
    return {
      message: responseMessage,
      agent: analysis.assignedAgent
    };
  } catch (error) {
    console.error('Response generation error:', error);
    return {
      message: `Hi! This is ${agentName}. I received your message and I'm handling it now. You'll hear back from me or the team shortly.`,
      agent: analysis.assignedAgent
    };
  }
}

async function sendSMSResponse(phoneNumber: string, message: string, supabase: any) {
  const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioFromNumber = Deno.env.get('TWILIO_FROM_NUMBER');

  if (!twilioAccountSid || !twilioAuthToken || !twilioFromNumber) {
    console.error('Twilio credentials not configured');
    return;
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`
        },
        body: new URLSearchParams({
          From: twilioFromNumber,
          To: phoneNumber,
          Body: message
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      
      // Store outbound message
      await supabase.from('sms_messages').insert({
        phone_number: phoneNumber,
        message_content: message,
        direction: 'outbound',
        status: 'sent',
        twilio_sid: data.sid,
        agent_id: 'executive-eva'
      });
      
      console.log('SMS response sent successfully');
    } else {
      console.error('Failed to send SMS response:', await response.text());
    }
  } catch (error) {
    console.error('Error sending SMS response:', error);
  }
}

async function activateTeam(
  analysis: IntentAnalysis, 
  message: IncomingMessage, 
  context: any, 
  supabase: any
) {
  // Determine which agents to activate based on intent
  const teamActivationMap: { [key: string]: string[] } = {
    'financial_request': ['finance', 'strategy'],
    'marketing_request': ['marketing', 'communications', 'data'],
    'technical_request': ['cto', 'data'],
    'legal_request': ['legal', 'hr'],
    'urgent_issue': ['executive-eva', 'operations', 'communications'],
    'team_activation': ['hr', 'operations'],
    'task_assignment': ['operations', 'strategy']
  };

  const agentsToActivate = teamActivationMap[analysis.intent] || [analysis.assignedAgent];
  
  // Create tasks for activated agents
  for (const agentId of agentsToActivate) {
    try {
      // Use the agent communication service to create tasks
      const { data, error } = await supabase.functions.invoke('ai-agent-chat', {
        body: {
          agentId: agentId,
          message: `New SMS request from ${message.From}: "${message.Body}". Priority: ${analysis.priority}. Please handle this request and coordinate with other team members as needed.`,
          context: {
            phoneNumber: message.From,
            originalMessage: message.Body,
            intent: analysis.intent,
            priority: analysis.priority,
            entities: analysis.entities,
            taskType: 'sms_activation'
          }
        }
      });

      if (error) {
        console.error(`Failed to activate agent ${agentId}:`, error);
      } else {
        console.log(`Successfully activated agent ${agentId} for SMS request`);
      }
    } catch (error) {
      console.error(`Error activating agent ${agentId}:`, error);
    }
  }

  // Log team activation
  console.log(`Team activated for ${analysis.intent}: ${agentsToActivate.join(', ')}`);
}

function getAgentDisplayName(agentId: string): string {
  const agentNames: { [key: string]: string } = {
    'executive-eva': 'Executive Eva',
    'strategy': 'Alex Strategy',
    'marketing': 'Maya Creative',
    'finance': 'Felix Finance',
    'operations': 'Oliver Operations',
    'customer': 'Clara Customer',
    'hr': 'Harper HR',
    'legal': 'Lex Legal',
    'cto': 'Code Commander',
    'data': 'Dr. Data',
    'intelligence': 'Intel Investigator',
    'communications': 'Comm Chief',
    'documents': 'Doc Master'
  };
  return agentNames[agentId] || agentId;
}

serve(handler);
