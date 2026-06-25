import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

const COMMON_MAPPINGS: Record<string, string> = {
  'tesla': 'TSLA',
  'nvidia': 'NVDA',
  'apple': 'AAPL',
  'microsoft': 'MSFT',
  'google': 'GOOGL',
  'alphabet': 'GOOGL',
  'amazon': 'AMZN',
  'meta': 'META',
  'facebook': 'META',
  'netflix': 'NFLX',
  'berkshire': 'BRK-B',
  'berkshire hathaway': 'BRK-B',
  'eli lilly': 'LLY',
  'broadcom': 'AVGO',
  'jpmorgan': 'JPM',
  'jp morgan': 'JPM',
  'tesla motors': 'TSLA',
};

/**
 * Resolves a company name or query to a stock ticker symbol.
 */
export async function resolveTicker(query: string): Promise<string> {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    throw new Error('Company name query cannot be empty');
  }

  // 1. Check if it's already a valid ticker (e.g. 1-10 uppercase letters, numbers, or suffixes like .NS)
  if (/^[A-Z0-9&-]{1,10}(\.[A-Z]{2,4})?$/.test(cleanQuery)) {
    return cleanQuery;
  }

  // 2. Check common mappings
  const lowerQuery = cleanQuery.toLowerCase();
  if (COMMON_MAPPINGS[lowerQuery]) {
    return COMMON_MAPPINGS[lowerQuery];
  }

  // 3. Search Yahoo Finance
  try {
    const searchResults = (await yahooFinance.search(cleanQuery)) as any;
    if (searchResults.quotes && searchResults.quotes.length > 0) {
      // Prioritize EQUITY type quotes (e.g. stocks)
      const equityQuote = searchResults.quotes.find(
        (q: any) => q.quoteType === 'EQUITY' && q.symbol
      );
      if (equityQuote && equityQuote.symbol) {
        return equityQuote.symbol;
      }

      // Fallback to the first quote that has a symbol
      const firstSymbol = searchResults.quotes.find((q: any) => q.symbol);
      if (firstSymbol && firstSymbol.symbol) {
        return firstSymbol.symbol;
      }
    }
  } catch (error) {
    console.warn(`Yahoo Finance search failed for query: "${cleanQuery}". Using fallbacks.`, error);
  }

  // 4. Default fallback: use the first word or strip non-alphabetic chars
  const words = cleanQuery.split(/\s+/);
  const firstWord = words[0].toLowerCase();
  if (COMMON_MAPPINGS[firstWord]) {
    return COMMON_MAPPINGS[firstWord];
  }

  const alphanumeric = cleanQuery.replace(/[^A-Za-z]/g, '').toUpperCase();
  if (alphanumeric.length >= 1) {
    return alphanumeric.substring(0, 5);
  }

  return 'AAPL'; // Ultimate default fallback
}
