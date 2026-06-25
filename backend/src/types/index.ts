export interface FinancialMetricHistory {
  year: number;
  revenue: number;
  netIncome: number;
  operatingMargin?: number;
}

export interface FinancialData {
  ticker: string;
  marketCap?: number;
  peRatio?: number;
  priceToSales?: number;
  dividendYield?: number;
  debtToEquity?: number;
  freeCashFlow?: number;
  revenueHistory?: FinancialMetricHistory[];
  keyRatios?: {
    returnOnEquity?: number;
    currentRatio?: number;
    profitMargin?: number;
  };
}

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedDate?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary?: string;
}

export interface RiskData {
  competition: string[];
  regulation: string[];
  debt: string[];
  marketChallenges: string[];
}

export interface ResearchData {
  overview: string;
  industry: string;
  products: string[];
  leadership: string[];
}

export interface ExecutionLog {
  timestamp: string;
  agent: 'ResearchAgent' | 'FinancialAgent' | 'NewsAgent' | 'RiskAgent' | 'DecisionAgent' | 'System';
  message: string;
}

export interface ExplainableAI {
  businessQuality: string;
  financialStrength: string;
  competitiveAdvantage: string;
  growthPotential: string;
  riskAnalysis: string;
}

export interface DecisionData {
  recommendation: 'INVEST' | 'PASS';
  confidenceScore: number; // 0-100
  financialScore: number; // 0-100
  growthScore: number; // 0-100
  riskScore: number; // 0-100
  finalScore: number; // 0-100
  reasoning: string;
  strengths: string[];
  risks: string[];
  explainableReasoning: ExplainableAI;
}

export interface AnalyzeResponse {
  company: string;
  ticker: string;
  recommendation: 'INVEST' | 'PASS';
  confidenceScore: number;
  financialScore: number;
  growthScore: number;
  riskScore: number;
  finalScore: number;
  reasoning: string;
  strengths: string[];
  risks: string[];
  financialData: FinancialData;
  news: NewsItem[];
  riskData: RiskData;
  researchData: ResearchData;
  explainableReasoning: ExplainableAI;
  logs: ExecutionLog[];
  citations: string[];
}
