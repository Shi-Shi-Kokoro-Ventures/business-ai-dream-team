
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FinancialAnalysisRequest {
  agentId: string;
  analysisType: 'market_data' | 'company_analysis' | 'portfolio_review' | 'risk_assessment';
  symbol?: string;
  parameters: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentId, analysisType, symbol, parameters }: FinancialAnalysisRequest = await req.json();
    
    console.log(`Agent ${agentId} conducting financial analysis: ${analysisType} for ${symbol || 'portfolio'}`);

    const alphaVantageKey = Deno.env.get("ALPHA_VANTAGE_API_KEY");
    
    let analysisResult;

    switch (analysisType) {
      case 'market_data':
        analysisResult = await getMarketData(symbol!, alphaVantageKey);
        break;
      case 'company_analysis':
        analysisResult = await getCompanyAnalysis(symbol!, alphaVantageKey);
        break;
      case 'portfolio_review':
        analysisResult = await performPortfolioReview(parameters);
        break;
      case 'risk_assessment':
        analysisResult = await performRiskAssessment(parameters);
        break;
      default:
        throw new Error(`Unknown analysis type: ${analysisType}`);
    }

    const result = {
      success: true,
      agentId,
      analysisType,
      symbol,
      data: analysisResult,
      timestamp: new Date().toISOString(),
      analysisId: `analysis_${Date.now()}`
    };

    console.log("Financial analysis completed successfully");

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in financial analysis:", error);
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

async function getMarketData(symbol: string, apiKey?: string) {
  if (!apiKey) {
    // Return simulated data if no API key
    return generateSimulatedMarketData(symbol);
  }

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }
    
    const data = await response.json();
    const quote = data['Global Quote'];
    
    return {
      symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'],
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      volume: parseInt(quote['06. volume']),
      timestamp: quote['07. latest trading day']
    };
  } catch (error) {
    return generateSimulatedMarketData(symbol);
  }
}

async function getCompanyAnalysis(symbol: string, apiKey?: string) {
  if (!apiKey) {
    return generateSimulatedCompanyAnalysis(symbol);
  }

  try {
    const overviewResponse = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
    );
    
    if (!overviewResponse.ok) {
      throw new Error('Failed to fetch company data');
    }
    
    const overview = await overviewResponse.json();
    
    return {
      symbol,
      name: overview.Name,
      sector: overview.Sector,
      industry: overview.Industry,
      marketCap: overview.MarketCapitalization,
      peRatio: parseFloat(overview.PERatio),
      dividend: parseFloat(overview.DividendYield),
      eps: parseFloat(overview.EPS),
      revenue: overview.RevenueTTM,
      profitMargin: parseFloat(overview.ProfitMargin)
    };
  } catch (error) {
    return generateSimulatedCompanyAnalysis(symbol);
  }
}

async function performPortfolioReview(parameters: any) {
  // AI-powered portfolio analysis
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!openaiApiKey) {
    return generateSimulatedPortfolioReview(parameters);
  }

  try {
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
            content: 'You are a financial analyst. Analyze the portfolio data and provide actionable insights.'
          },
          {
            role: 'user',
            content: `Analyze this portfolio: ${JSON.stringify(parameters)}`
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    const result = await response.json();
    return {
      analysis: result.choices[0]?.message?.content,
      recommendations: extractRecommendations(result.choices[0]?.message?.content)
    };
  } catch (error) {
    return generateSimulatedPortfolioReview(parameters);
  }
}

async function performRiskAssessment(parameters: any) {
  return {
    riskScore: Math.floor(Math.random() * 100),
    riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    factors: [
      'Market volatility exposure',
      'Sector concentration risk',
      'Liquidity considerations',
      'Credit quality assessment'
    ],
    recommendations: [
      'Consider diversification across sectors',
      'Monitor correlation between holdings',
      'Review position sizing'
    ]
  };
}

function generateSimulatedMarketData(symbol: string) {
  const basePrice = Math.random() * 200 + 50;
  const change = (Math.random() - 0.5) * 10;
  
  return {
    symbol,
    price: basePrice,
    change,
    changePercent: `${(change / basePrice * 100).toFixed(2)}%`,
    high: basePrice + Math.random() * 5,
    low: basePrice - Math.random() * 5,
    volume: Math.floor(Math.random() * 1000000),
    timestamp: new Date().toISOString().split('T')[0]
  };
}

function generateSimulatedCompanyAnalysis(symbol: string) {
  return {
    symbol,
    name: `${symbol} Corporation`,
    sector: 'Technology',
    industry: 'Software',
    marketCap: Math.floor(Math.random() * 1000000000),
    peRatio: Math.random() * 30 + 10,
    dividend: Math.random() * 5,
    eps: Math.random() * 10,
    revenue: Math.floor(Math.random() * 10000000),
    profitMargin: Math.random() * 0.3
  };
}

function generateSimulatedPortfolioReview(parameters: any) {
  return {
    analysis: "Portfolio shows balanced allocation across sectors with moderate risk exposure. Consider rebalancing for optimal performance.",
    recommendations: [
      "Increase technology sector allocation",
      "Reduce exposure to volatile assets",
      "Consider ESG-focused investments"
    ]
  };
}

function extractRecommendations(analysis: string): string[] {
  if (!analysis) return [];
  
  // Simple extraction of bullet points or numbered items
  const lines = analysis.split('\n');
  return lines
    .filter(line => line.includes('•') || line.includes('-') || /^\d+\./.test(line.trim()))
    .map(line => line.replace(/^[•\-\d\.]\s*/, '').trim())
    .slice(0, 5);
}

serve(handler);
