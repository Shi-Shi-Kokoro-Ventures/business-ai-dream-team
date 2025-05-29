
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CodeGenerationRequest {
  agentId: string;
  language: string;
  requirements: string;
  framework?: string;
  style?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentId, language, requirements, framework, style }: CodeGenerationRequest = await req.json();
    
    console.log(`Agent ${agentId} generating ${language} code: ${requirements}`);

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const systemPrompt = `You are an expert software engineer working for Agent ${agentId}. Generate high-quality, production-ready code that follows best practices. Include proper error handling, documentation, and testing considerations.

Language: ${language}
${framework ? `Framework: ${framework}` : ''}
${style ? `Style: ${style}` : ''}

Provide:
1. Clean, well-commented code
2. Installation/setup instructions if needed
3. Usage examples
4. Brief explanation of the approach
5. Potential improvements or considerations`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Generate code for: ${requirements}`
          }
        ],
        temperature: 0.1,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const generatedContent = result.choices[0]?.message?.content || '';

    // Parse the response to extract code and documentation
    const codeBlocks = extractCodeBlocks(generatedContent);
    const documentation = extractDocumentation(generatedContent);

    const codeResult = {
      success: true,
      agentId,
      language,
      framework,
      requirements,
      generatedContent,
      codeBlocks,
      documentation,
      linesGenerated: estimateLines(codeBlocks),
      features: extractFeatures(generatedContent),
      timestamp: new Date().toISOString(),
      codeId: `code_${Date.now()}`
    };

    console.log("Code generation completed successfully");

    return new Response(JSON.stringify(codeResult), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in code generation:", error);
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

function extractCodeBlocks(content: string): Array<{filename?: string, language: string, code: string}> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim()
    });
  }
  
  return blocks;
}

function extractDocumentation(content: string): string {
  // Extract non-code content as documentation
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, '');
  return withoutCodeBlocks.trim();
}

function estimateLines(codeBlocks: any[]): number {
  return codeBlocks.reduce((total, block) => {
    return total + block.code.split('\n').length;
  }, 0);
}

function extractFeatures(content: string): string[] {
  const features = [];
  if (content.includes('error handling')) features.push('Error handling');
  if (content.includes('test') || content.includes('Test')) features.push('Testing');
  if (content.includes('document') || content.includes('comment')) features.push('Documentation');
  if (content.includes('async') || content.includes('await')) features.push('Async operations');
  if (content.includes('validate') || content.includes('validation')) features.push('Validation');
  if (content.includes('security') || content.includes('auth')) features.push('Security');
  
  return features.length > 0 ? features : ['Code generation', 'Best practices'];
}

serve(handler);
