import { getLLM } from '../lib/llm';
import { DecisionData, ExecutionLog } from '../types';

export async function runDecisionAgent(state: any) {
  const company = state.company;
  const ticker = state.ticker || company;
  const logs: ExecutionLog[] = [
    {
      timestamp: new Date().toISOString(),
      agent: 'DecisionAgent',
      message: `Running final investment decision node for ${company} ($${ticker})...`,
    },
  ];

  try {
    const research = state.researchData;
    const financials = state.financialData;
    const news = state.newsData || [];
    const risks = state.riskData;

    // 1. Prepare structured prompt summarizing all collected data
    const contextData = {
      company,
      ticker,
      businessOverview: research?.overview || 'N/A',
      industry: research?.industry || 'N/A',
      products: research?.products || [],
      leadership: research?.leadership || [],
      financialMetrics: {
        marketCap: financials?.marketCap,
        peRatio: financials?.peRatio,
        priceToSales: financials?.priceToSales,
        dividendYield: financials?.dividendYield,
        debtToEquity: financials?.debtToEquity,
        freeCashFlow: financials?.freeCashFlow,
        keyRatios: financials?.keyRatios || {},
        revenueHistory: financials?.revenueHistory || [],
      },
      recentNewsAndSentiment: news.map((n: any) => ({
        title: n.title,
        sentiment: n.sentiment,
        summary: n.summary,
      })),
      riskAssessment: risks || {},
    };

    // 2. Query LLM for final recommendation
    const llm = getLLM(0.3); // slightly higher temp for analyst synthesis
    
    const systemPrompt = `You are an experienced investment analyst.
Analyze the company based on the consolidated research, financial ratios, news sentiment, and risk analysis provided.
Evaluate:
1. Business Quality
2. Financial Strength
3. Competitive Advantage (Moat)
4. Growth Potential
5. Risks

Provide a final RECOMMENDATION (either "INVEST" or "PASS") and score cards.
Scores are from 0 to 100:
- financialScore: Assessment of balance sheet, debt, cash flow, margins, and growth.
- growthScore: Potential for revenue expansion, industry tailwinds, product innovation.
- riskScore: Lower is better risk mitigation (0 = highly risky, 100 = bulletproof risk management). Let's define the riskScore as a health score where 100 is excellent (low risk) and 0 is terrible (extreme risk).
- finalScore: A weighted average of business indicators (financials, growth, risk).
- confidenceScore: Assessment of data quality and consistency of positive indicators.

You must return a valid JSON object matching the JSON schema. Do not write markdown, code blocks, or conversational filler.

JSON Schema:
{
  "recommendation": "INVEST" | "PASS",
  "confidenceScore": number (0 to 100),
  "financialScore": number (0 to 100),
  "growthScore": number (0 to 100),
  "riskScore": number (0 to 100),
  "finalScore": number (0 to 100),
  "reasoning": "A comprehensive 2-3 paragraph explanation summarizing the investment thesis.",
  "strengths": ["Key strength 1", "Key strength 2", ...],
  "risks": ["Key risk 1", "Key risk 2", ...],
  "explainableReasoning": {
    "businessQuality": "Detailed analysis of business model, moat, and leadership.",
    "financialStrength": "Detailed analysis of balance sheet, metrics, and income history.",
    "competitiveAdvantage": "Detailed analysis of barriers to entry and moat depth.",
    "growthPotential": "Detailed analysis of secular trends and growth vectors.",
    "riskAnalysis": "Detailed analysis of debt, competitive pressures, and regulations."
  }
}`;

    const userPrompt = `Perform investment analysis for: ${company} ($${ticker})\n\nConsolidated Data:\n${JSON.stringify(contextData, null, 2)}`;

    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'DecisionAgent',
      message: `Compiling final investment thesis...`,
    });

    const response = await llm.invoke([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    const responseText = response.content.toString().trim();
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const decisionData = JSON.parse(jsonStr) as DecisionData;

    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'DecisionAgent',
      message: `Analysis finalized. Recommendation: ${decisionData.recommendation} (Score: ${decisionData.finalScore}%, Confidence: ${decisionData.confidenceScore}%).`,
    });

    return {
      decisionData,
      logs,
    };
  } catch (error: any) {
    console.error('Error in Decision Agent:', error);

    const fallbackDecision: DecisionData = {
      recommendation: 'PASS',
      confidenceScore: 30,
      financialScore: 50,
      growthScore: 50,
      riskScore: 50,
      finalScore: 50,
      reasoning: `Analysis failed due to technical constraints. Decided to PASS to protect capital. Error: ${error.message || error}`,
      strengths: [],
      risks: ['Unable to fetch full research state.'],
      explainableReasoning: {
        businessQuality: 'Data incomplete.',
        financialStrength: 'Data incomplete.',
        competitiveAdvantage: 'Data incomplete.',
        growthPotential: 'Data incomplete.',
        riskAnalysis: 'Data incomplete.',
      },
    };

    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'DecisionAgent',
      message: `Error: Decision Agent crashed. Defaulting to PASS. Error: ${error.message || error}`,
    });

    return {
      decisionData: fallbackDecision,
      logs,
    };
  }
}
