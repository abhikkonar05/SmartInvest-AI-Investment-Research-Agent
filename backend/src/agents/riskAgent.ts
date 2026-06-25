import { tavilySearch } from '../services/tavily';
import { getLLM } from '../lib/llm';
import { RiskData, ExecutionLog } from '../types';

export async function runRiskAgent(state: any) {
  const company = state.company;
  const ticker = state.ticker || company;
  const logs: ExecutionLog[] = [
    {
      timestamp: new Date().toISOString(),
      agent: 'RiskAgent',
      message: `Analyzing risk exposure for ${company} ($${ticker})...`,
    },
  ];

  try {
    // 1. Search Tavily for risks
    const riskQuery = `${company} ${ticker} business risks competition regulation debt challenges`;
    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'RiskAgent',
      message: `Searching web for risk reports: "${riskQuery}"`,
    });

    const searchResponse = await tavilySearch(riskQuery, 'basic', 5);
    const searchResults = searchResponse.results || [];

    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'RiskAgent',
      message: `Analyzing regulatory, competitive, debt, and market conditions...`,
    });

    const contextText = searchResults
      .map((r, i) => `[Risk Info ${i + 1}] Title: ${r.title}\nContent: ${r.content}`)
      .join('\n\n');

    // 2. Request structured risk categories from LLM
    const llm = getLLM();
    const systemPrompt = `You are a financial risk officer. Review the provided search results and identify key risks for the company.
Categorize them into competition, regulation, debt/balance sheet, and general market challenges.
Provide 2-3 bullet points for each category. Keep bullets short, descriptive, and objective.
Return ONLY a valid JSON object matching the schema. No markdown wrappers or additional text.

JSON Schema:
{
  "competition": ["bullet 1", "bullet 2", ...],
  "regulation": ["bullet 1", "bullet 2", ...],
  "debt": ["bullet 1", "bullet 2", ...],
  "marketChallenges": ["bullet 1", "bullet 2", ...]
}`;

    const userPrompt = `Company: ${company} ($${ticker})\n\nRisk Context:\n${contextText}`;

    const response = await llm.invoke([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    const responseText = response.content.toString().trim();
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const riskData = JSON.parse(jsonStr) as RiskData;

    const totalRisksCount = 
      riskData.competition.length + 
      riskData.regulation.length + 
      riskData.debt.length + 
      riskData.marketChallenges.length;

    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'RiskAgent',
      message: `Identified ${totalRisksCount} major risk factors across 4 categories.`,
    });

    return {
      riskData,
      logs,
    };
  } catch (error: any) {
    console.error('Error in Risk Agent:', error);

    const fallbackData: RiskData = {
      competition: ['Intensifying sector competition.'],
      regulation: ['Compliance overhead and regulatory shifts.'],
      debt: ['Capital requirements and macroeconomic factors.'],
      marketChallenges: ['Global supply chain and demand shifts.'],
    };

    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'RiskAgent',
      message: `Warning: Risk Agent failed. Using default risks. Error: ${error.message || error}`,
    });

    return {
      riskData: fallbackData,
      logs,
    };
  }
}
