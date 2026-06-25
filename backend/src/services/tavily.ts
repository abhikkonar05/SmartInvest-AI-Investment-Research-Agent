export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface TavilySearchResponse {
  results: TavilySearchResult[];
  answer?: string;
}

/**
 * Searches the web using the Tavily Search API.
 * Uses fetch to avoid dependency version mismatch issues.
 */
export async function tavilySearch(
  query: string,
  searchDepth: 'basic' | 'advanced' = 'basic',
  maxResults: number = 5
): Promise<TavilySearchResponse> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.warn('TAVILY_API_KEY is not defined in environment variables. Web search will return empty results.');
    return { results: [] };
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: searchDepth,
        max_results: maxResults,
        include_answer: false,
        include_images: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Tavily API responded with status ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as TavilySearchResponse;
    return data;
  } catch (error) {
    console.error(`Error performing Tavily search for query "${query}":`, error);
    return { results: [] };
  }
}
