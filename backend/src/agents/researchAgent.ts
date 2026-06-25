import { tavilySearch } from '../services/tavily';
import { getLLM } from '../lib/llm';
import { ResearchData, ExecutionLog } from '../types';

export async function runResearchAgent(state: any) {
  const company = state.company;
  const logs: ExecutionLog[] = [
    {
      timestamp: new Date().toISOString(),
      agent: 'ResearchAgent',
      message: `Initiating business research for ${company}...`,
    },
  ];

  try {
    // 1. Run Tavily Search
    const searchQuery = `${company} company overview, industry profile, products, executive leadership team`;
    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'ResearchAgent',
      message: `Searching web for: "${searchQuery}"`,
    });

    const searchResponse = await tavilySearch(searchQuery, 'basic', 5);
    const searchResults = searchResponse.results || [];
    const citations = searchResults.map((r) => r.url).filter(Boolean);

    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'ResearchAgent',
      message: `Retrieved ${searchResults.length} search results. Summarizing business data...`,
    });

    // 2. Format search results for LLM
    const searchContext = searchResults
      .map((r, i) => `[Result ${i + 1}] Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`)
      .join('\n\n');

    // 3. Ask LLM to extract structured research data
    const llm = getLLM();
    const systemPrompt = `You are a financial research assistant. Given the web search results, extract structural details about the company.
Return ONLY a valid JSON object matching this schema. Do not write markdown, code blocks, or conversational text.

JSON Schema:
{
  "overview": "A brief 2-3 sentence overview of the company, its mission, and its business model.",
  "industry": "The specific sector/industry category.",
  "products": ["Key product/service 1", "Key product/service 2", ...],
  "leadership": ["CEO Name (Job Title)", "CFO Name (Job Title)", ...]
}`;

    const userPrompt = `Company: ${company}\n\nSearch Context:\n${searchContext}`;
    
    const response = await llm.invoke([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    const responseText = response.content.toString().trim();
    
    // Clean JSON response (strip markdown wrappers if any)
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const researchData = JSON.parse(jsonStr) as ResearchData;

    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'ResearchAgent',
      message: `Successfully analyzed business structure, industry (${researchData.industry}), and leadership.`,
    });

    return {
      researchData,
      citations,
      logs,
    };
  } catch (error: any) {
    console.error('Error in Research Agent:', error);
    
    const fallbackData: ResearchData = {
      overview: `Failed to retrieve fresh overview for ${company}.`,
      industry: 'Unknown',
      products: [],
      leadership: [],
    };

    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'ResearchAgent',
      message: `Warning: Research Agent failed. Using placeholder details. Error: ${error.message || error}`,
    });

    return {
      researchData: fallbackData,
      citations: [],
      logs,
    };
  }
}
