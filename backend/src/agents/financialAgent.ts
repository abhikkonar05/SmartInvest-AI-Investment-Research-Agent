import { resolveTicker } from '../services/tickerResolver';
import { fetchFinancials } from '../services/yahooFinance';
import { ExecutionLog } from '../types';

export async function runFinancialAgent(state: any) {
  const company = state.company;
  const logs: ExecutionLog[] = [
    {
      timestamp: new Date().toISOString(),
      agent: 'FinancialAgent',
      message: `Initiating financial analysis for "${company}"...`,
    },
  ];

  try {
    // 1. Resolve stock ticker
    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'FinancialAgent',
      message: `Resolving stock ticker for "${company}"...`,
    });
    
    const ticker = await resolveTicker(company);
    
    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'FinancialAgent',
      message: `Resolved ticker to: $${ticker}`,
    });

    // 2. Fetch financial metrics
    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'FinancialAgent',
      message: `Fetching financials and income history for $${ticker} from Yahoo Finance...`,
    });

    const financialData = await fetchFinancials(ticker);

    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'FinancialAgent',
      message: `Successfully retrieved financial stats (Cap: $${(financialData.marketCap || 0).toLocaleString()}, PE: ${financialData.peRatio || 'N/A'}).`,
    });

    return {
      ticker,
      financialData,
      logs,
    };
  } catch (error: any) {
    console.error('Error in Financial Agent:', error);

    logs.push({
      timestamp: new Date().toISOString(),
      agent: 'FinancialAgent',
      message: `Error: Financial Agent failed. Fallback to mock data. Error: ${error.message || error}`,
    });

    return {
      ticker: 'UNKNOWN',
      financialData: {
        ticker: 'UNKNOWN',
        revenueHistory: [],
        keyRatios: {},
      },
      logs,
    };
  }
}
