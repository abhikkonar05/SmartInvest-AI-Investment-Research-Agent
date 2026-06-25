import { tavilySearch } from '../services/tavily';
import { getLLM } from '../lib/llm';
import { NewsItem, ExecutionLog } from '../types';

export async function runNewsAgent(state: any) {
  const company = state.company;
  const ticker = state.ticker || company;
  const logs: ExecutionLog[] = [
    {
      timestamp: new Date().toISOString(),
      agent: 'NewsAgent',
      message: `Analyzing news and sentiment for ${company} ($${ticker})...`,
    },
  ];

  try {
    // 1. Search Tavily for news
    const newsQuery = `${company} ${ticker} stock news market sentiment events`;
    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'NewsAgent',
      message: `Searching web for news: "${newsQuery}"`,
    });

    const searchResponse = await tavilySearch(newsQuery, 'basic', 6);
    const searchResults = searchResponse.results || [];
    const citations = searchResults.map((r) => r.url).filter(Boolean);

    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'NewsAgent',
      message: `Retrieved ${searchResults.length} news references. Evaluating sentiment with LLM...`,
    });

    if (searchResults.length === 0) {
      logs.push({
        timestamp: new Date().toISOString(),
        agent: 'NewsAgent',
        message: 'No recent news articles found.',
      });
      return {
        newsData: [],
        citations: [],
        logs,
      };
    }

    // 2. Format news articles for sentiment analysis
    const contextText = searchResults
      .map((r, i) => `[Article ${i + 1}] Title: ${r.title}\nSource/URL: ${r.url}\nExcerpt: ${r.content}`)
      .join('\n\n');

    // 3. Request structured sentiment classification from LLM
    const llm = getLLM();
    const systemPrompt = `You are a financial news analyst. Evaluate the given articles and extract structured news metadata.
Categorize each article's sentiment as 'positive', 'negative', or 'neutral' based on its impact on the stock or business.
Provide a 1-sentence summary for each.
Return ONLY a valid JSON array matching the schema. No markdown wrappers or additional text.

JSON Schema:
[
  {
    "title": "Title of the article",
    "url": "URL of the article",
    "source": "Publisher name (e.g. Bloomberg, Reuters, Yahoo Finance, or domain name)",
    "sentiment": "positive" | "negative" | "neutral",
    "summary": "Brief summary sentence."
  },
  ...
]`;

    const userPrompt = `Company: ${company} ($${ticker})\n\nNews Context:\n${contextText}`;

    const response = await llm.invoke([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    const responseText = response.content.toString().trim();
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const newsData = JSON.parse(jsonStr) as NewsItem[];

    // Tally sentiment
    const pos = newsData.filter((n) => n.sentiment === 'positive').length;
    const neg = newsData.filter((n) => n.sentiment === 'negative').length;
    
    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'NewsAgent',
      message: `Completed news evaluation: ${pos} positive signals, ${neg} negative signals.`,
    });

    return {
      newsData,
      citations,
      logs,
    };
  } catch (error: any) {
    console.error('Error in News Agent:', error);

    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'NewsAgent',
      message: `Warning: News analysis failed. Returning basic web search titles. Error: ${error.message || error}`,
    });

    // Fallback: create plain neutral articles from search results directly
    const fallbackNews: NewsItem[] = (state.researchData?.overview ? [] : []).concat(
      (state.newsData || []).length > 0 ? state.newsData : []
    );

    return {
      newsData: fallbackNews,
      citations: [],
      logs,
    };
  }
}
