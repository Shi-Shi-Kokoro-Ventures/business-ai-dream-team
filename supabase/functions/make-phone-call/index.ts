
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PhoneCallRequest {
  agentId: string;
  phoneNumber: string;
  purpose: string;
  message: string;
  voice?: 'alice' | 'man' | 'woman';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentId, phoneNumber, purpose, message, voice = 'alice' }: PhoneCallRequest = await req.json();
    
    console.log(`Agent ${agentId} making phone call to ${phoneNumber} for: ${purpose}`);

    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioFromNumber = Deno.env.get("TWILIO_FROM_NUMBER");

    if (!twilioAccountSid || !twilioAuthToken || !twilioFromNumber) {
      throw new Error("Twilio credentials not configured");
    }

    // Create TwiML for the call
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="${voice}">
        Hello, this is an automated call from your AI Agent Team.
        Agent ${agentId} is calling regarding: ${purpose}.
        ${message}
        If you need to respond, please call back or send a message through your dashboard.
        Thank you for your time.
      </Say>
      <Pause length="2"/>
      <Say voice="${voice}">Goodbye.</Say>
    </Response>`;

    // Make the call using Twilio API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Calls.json`;
    const credentials = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

    const formData = new URLSearchParams();
    formData.append('From', twilioFromNumber);
    formData.append('To', phoneNumber);
    formData.append('Twiml', twiml);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Twilio API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    const callResult = {
      success: true,
      agentId,
      phoneNumber,
      purpose,
      message,
      callSid: result.sid,
      status: result.status,
      duration: result.duration,
      timestamp: new Date().toISOString(),
      callId: `call_${Date.now()}`
    };

    console.log("Phone call initiated successfully:", result.sid);

    return new Response(JSON.stringify(callResult), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error making phone call:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
