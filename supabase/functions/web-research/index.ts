
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebResearchRequest {
  agentId: string;
  query: string;
  purpose: string;
  searchType?: 'general' | 'news' | 'academic' | 'financial';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentId, query, purpose, searchType = 'general' }: WebResearchRequest = await req.json();
    
    console.log(`Agent ${agentId} conducting web research: ${query} for ${purpose}`);

    const perplexityApiKey = Deno.env.get("PERPLEXITY_API_KEY");
    if (!perplexityApiKey) {
      throw new Error("Perplexity API key not configured");
    }

    // Choose model based on search type
    const modelMap = {
      'general': 'llama-3.1-sonar-large-128k-online',
      'news': 'llama-3.1-sonar-large-128k-online',
      'academic': 'llama-3.1-sonar-huge-128k-online',
      'financial': 'llama-3.1-sonar-large-128k-online'
    };

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelMap[searchType],
        messages: [
          {
            role: 'system',
            content: `You are an AI research assistant for Agent ${agentId}. Provide comprehensive, accurate, and actionable information. Focus on recent data and credible sources. Format your response clearly with key insights, data points, and source citations.`
          },
          {
            role: 'user',
            content: `Research query: ${query}\nPurpose: ${purpose}\n\nPlease provide detailed research findings with sources.`
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: true,
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const researchContent = result.choices[0]?.message?.content || '';
    const relatedQuestions = result.related_questions || [];

    // Extract key insights using simple parsing
    const insights = researchContent.split('\n')
      .filter(line => line.trim().length > 20)
      .slice(0, 5)
      .map(line => line.trim());

    const researchResult = {
      success: true,
      agentId,
      query,
      purpose,
      searchType,
      content: researchContent,
      insights,
      relatedQuestions,
      sources: extractSources(researchContent),
      timestamp: new Date().toISOString(),
      searchId: `research_${Date.now()}`
    };

    console.log("Web research completed successfully");

    return new Response(JSON.stringify(researchResult), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in web research:", error);
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

function extractSources(content: string): string[] {
  // Simple source extraction - look for URLs and citations
  const urlRegex = /https?:\/\/[^\s\)]+/g;
  const urls = content.match(urlRegex) || [];
  
  // Extract domain names for cleaner source list
  const sources = urls.map(url => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  });
  
  return [...new Set(sources)].slice(0, 10); // Remove duplicates and limit
}

serve(handler);
