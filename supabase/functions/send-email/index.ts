
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  agentId: string;
  recipient: string;
  subject: string;
  body: string;
  html?: string;
  metadata?: any;
}

const getAgentDisplayName = (agentId: string): string => {
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
};

const getAgentDepartment = (agentId: string): string => {
  const departments: { [key: string]: string } = {
    'executive-eva': 'Executive Office',
    'strategy': 'Strategic Planning',
    'marketing': 'Marketing & Communications',
    'finance': 'Finance & Accounting',
    'operations': 'Operations',
    'customer': 'Customer Success',
    'hr': 'Human Resources',
    'legal': 'Legal Affairs',
    'cto': 'Technology',
    'data': 'Data Analytics',
    'intelligence': 'Business Intelligence',
    'communications': 'Communications',
    'documents': 'Document Management'
  };
  return departments[agentId] || 'AI Operations';
};

const generateProfessionalHtml = (agentId: string, body: string, metadata?: any): string => {
  const agentName = getAgentDisplayName(agentId);
  const department = getAgentDepartment(agentId);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Message from ${agentName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
            ${agentName}
          </h1>
          <p style="margin: 8px 0 0 0; color: #e2e8f0; font-size: 14px;">
            ${department} • AI Agent Team
          </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px; line-height: 1.6;">
          <div style="background: #f8fafc; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; color: #374151; white-space: pre-wrap; font-size: 16px;">
              ${body}
            </p>
          </div>
          
          ${metadata?.priority ? `
            <div style="margin: 20px 0; padding: 12px 16px; background: ${metadata.priority === 'high' || metadata.priority === 'critical' ? '#fee2e2' : '#eff6ff'}; border-radius: 6px; border: 1px solid ${metadata.priority === 'high' || metadata.priority === 'critical' ? '#fca5a5' : '#93c5fd'};">
              <p style="margin: 0; font-size: 14px; color: ${metadata.priority === 'high' || metadata.priority === 'critical' ? '#dc2626' : '#1d4ed8'}; font-weight: 500;">
                Priority: ${metadata.priority.toUpperCase()}
              </p>
            </div>
          ` : ''}
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 20px;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              This message was sent by <strong>${agentName}</strong>, an AI Agent operating within your business ecosystem.
            </p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
              AI Agent Team • Autonomous Business Operations
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              Powered by Advanced AI Technology
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentId, recipient, subject, body, html, metadata }: EmailRequest = await req.json();

    const agentName = getAgentDisplayName(agentId);
    console.log(`${agentName} sending professional email to ${recipient}: ${subject}`);

    // Use custom domain if available, otherwise fall back to Resend default
    // The "from" field will be automatically configured based on your verified domain in Resend
    const fromAddress = "AI Agent Team <agents@resend.dev>"; // This will be updated once you add your custom domain

    const emailResponse = await resend.emails.send({
      from: fromAddress,
      to: [recipient],
      subject: `[${agentName}] ${subject}`,
      text: body,
      html: html || generateProfessionalHtml(agentId, body, metadata),
      // Add reply-to to your Gmail address once configured
      // replyTo: "your-email@yourdomain.com"
    });

    console.log("Professional email sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      messageId: emailResponse.data?.id,
      agentId,
      agentName,
      recipient,
      subject,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        department: getAgentDepartment(agentId),
        emailType: 'professional'
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending professional email:", error);
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
