'use client';

import React, { useState, useEffect } from 'react';
import { AnalyzeResponse, ExecutionLog } from '../types';
import { MetricCard } from './MetricCard';
import { FinancialCharts } from './FinancialCharts';
import { ExecutionLogs } from './ExecutionLogs';
import { RiskAnalysis } from './RiskAnalysis';
import { NewsSentiment } from './NewsSentiment';
import { PdfReport } from './PdfReport';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  History, 
  Layers, 
  Award, 
  HelpCircle,
  Link as LinkIcon,
  Flame,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Pre-computed high-quality mock analyses for demonstration / offline trial
const DEMO_RUNS: Record<string, AnalyzeResponse> = {
  'Tesla': {
    company: 'Tesla',
    ticker: 'TSLA',
    recommendation: 'INVEST',
    confidenceScore: 88,
    financialScore: 78,
    growthScore: 92,
    riskScore: 72, // Health score: 72%
    finalScore: 81,
    reasoning: 'Tesla exhibits a strong market presence in clean energy and electric vehicles. Despite macroeconomic headwinds and increasing global competition from lower-cost manufacturers, its leading margins, vertical integration in batteries, and expansion into AI, FSD (Full Self-Driving), and robotics (Optimus) justify an INVEST rating for growth-oriented investors.',
    strengths: [
      'Industry-leading margins in electric vehicles.',
      'Massive cash reserve ($30B+) with minimal long-term debt.',
      'Pioneer status in autonomous driving software (FSD) and robotic neural nets.',
      'Supercharger network serves as a massive competitive moat.'
    ],
    risks: [
      'Intensifying competition from BYD and European automakers.',
      'Margin compression due to EV price cutting.',
      'High valuation multiple requires continuous hyper-growth execution.'
    ],
    financialData: {
      ticker: 'TSLA',
      marketCap: 785000000000,
      peRatio: 56.4,
      priceToSales: 7.2,
      dividendYield: 0,
      debtToEquity: 12.5,
      freeCashFlow: 4500000000,
      revenueHistory: [
        { year: 2023, revenue: 96770000000, netIncome: 14990000000, operatingMargin: 0.155 },
        { year: 2024, revenue: 104200000000, netIncome: 13420000000, operatingMargin: 0.128 },
        { year: 2025, revenue: 118500000000, netIncome: 15800000000, operatingMargin: 0.133 }
      ],
      keyRatios: {
        returnOnEquity: 0.185,
        currentRatio: 1.88,
        profitMargin: 0.133
      }
    },
    news: [
      { title: 'Tesla Full Self-Driving reaches new milestone in active miles', url: 'https://finance.yahoo.com', source: 'Bloomberg', sentiment: 'positive', summary: 'FSD beta v12 shows significant reduction in driver interventions.' },
      { title: 'Tesla EV market share dips in Europe as competitors push hybrid models', url: 'https://reuters.com', source: 'Reuters', sentiment: 'negative', summary: 'Increased hybridization slowing pure EV sales in certain markets.' },
      { title: 'Tesla Gigafactory expansion approved for sustainable growth', url: 'https://bloomberg.com', source: 'Yahoo Finance', sentiment: 'positive', summary: 'Local authorities approve expansion permitting higher vehicle throughput.' }
    ],
    riskData: {
      competition: ['Fierce pricing competition from Chinese EV makers like BYD.', 'Legacy automakers ramping hybrids.'],
      regulation: ['Changes in federal clean vehicle tax credits.', 'Safety inquiries regarding autopilot and FSD.'],
      debt: ['Extremely low debt, very solid liquidity profile.'],
      marketChallenges: ['EV adoption rate saturation in North America.', 'High global interest rates affecting consumer auto financing.']
    },
    researchData: {
      overview: 'Tesla, Inc. designs, develops, manufactures, sells, and leases fully electric vehicles, energy generation and storage systems, and offers services related to its products.',
      industry: 'Automotive & Clean Energy',
      products: ['Model Y', 'Model 3', 'Cybertruck', 'Megapack', 'FSD Software'],
      leadership: ['Elon Musk (CEO)', 'Vaibhav Taneja (CFO)', 'Tom Zhu (SVP Automotive)']
    },
    explainableReasoning: {
      businessQuality: 'High-quality disruptive ecosystem spanning hardware, software, and energy capture.',
      financialStrength: 'Pristine balance sheet with zero net debt, self-funded research & development, and strong capital efficiency.',
      competitiveAdvantage: 'Extensive Supercharger footprint, vertical supply integration, and AI compute capacity for autonomous training.',
      growthPotential: 'Long-term tailwinds from robotaxis, commercial energy grid storage, and humanoid manufacturing scaling.',
      riskAnalysis: 'Subject to vehicle average selling price volatility, brand key-man risk, and severe competitive volume scaling from China.'
    },
    citations: ['https://ir.tesla.com', 'https://finance.yahoo.com/quote/TSLA'],
    logs: []
  },
  'Nvidia': {
    company: 'Nvidia',
    ticker: 'NVDA',
    recommendation: 'INVEST',
    confidenceScore: 95,
    financialScore: 94,
    growthScore: 97,
    riskScore: 78,
    finalScore: 91,
    reasoning: 'Nvidia represents the foundational infrastructure of the artificial intelligence boom. Its CUDA software ecosystem, combined with ultra-high bandwidth tensor core GPUs (Hopper, Blackwell), creates a virtual monopoly in AI computing training and inference workloads. Unprecedented gross margins and negative net debt support an INVEST thesis.',
    strengths: [
      '80%+ market share in datacenter AI silicon.',
      'Gross margins exceeding 75% for AI server architecture.',
      'CUDA developer platform creates an immense software lock-in moat.',
      'Unprecedented triple-digit revenue expansion.'
    ],
    risks: [
      'High client concentration (Big Tech hyperscalers make up 40% of sales).',
      'Geopolitical restrictions on shipping chips to China.',
      'Cyclical demand risk if corporate AI ROI slows down.'
    ],
    financialData: {
      ticker: 'NVDA',
      marketCap: 3150000000000,
      peRatio: 64.2,
      priceToSales: 32.5,
      dividendYield: 0.02,
      debtToEquity: 15.8,
      freeCashFlow: 27000000000,
      revenueHistory: [
        { year: 2023, revenue: 26970000000, netIncome: 4370000000, operatingMargin: 0.162 },
        { year: 2024, revenue: 60920000000, netIncome: 29760000000, operatingMargin: 0.488 },
        { year: 2025, revenue: 96300000000, netIncome: 53000000000, operatingMargin: 0.550 }
      ],
      keyRatios: {
        returnOnEquity: 0.523,
        currentRatio: 3.52,
        profitMargin: 0.550
      }
    },
    news: [
      { title: 'Nvidia Blackwell chips enter mass volume shipments to hyper-scalers', url: 'https://finance.yahoo.com', source: 'Yahoo Finance', sentiment: 'positive', summary: 'Production of Blackwell architectures ramps up to meet insatiable cloud demand.' },
      { title: 'AI chip competition grows as startups and custom silicon enter space', url: 'https://bloomberg.com', source: 'Bloomberg', sentiment: 'neutral', summary: 'AMD, Intel, and custom TPU projects aim to take minor shares.' },
      { title: 'US exports restrictions on AI accelerators tightened further', url: 'https://reuters.com', source: 'Reuters', sentiment: 'negative', summary: 'Export restrictions block high-end chip shipments to select regions.' }
    ],
    riskData: {
      competition: ['AMD Instinct accelerators.', 'Hyperscalers building custom silicon (TPUs/Trainium).'],
      regulation: ['US export controls restricting China/Middle East shipments.', 'FTC antitrust reviews.'],
      debt: ['Extremely strong balance sheet with negligible debt relative to capital base.'],
      marketChallenges: ['AI GPU hardware inventory digestion periods.', 'Potential slowdown in aggregate venture funding for LLM startups.']
    },
    researchData: {
      overview: 'NVIDIA Corporation focuses on personal computer graphics, graphics processing units, and also on artificial intelligence solutions for enterprise, cloud, and automotive industries.',
      industry: 'Semiconductors & AI Hardware',
      products: ['H100 Tensor Core GPU', 'Blackwell B200 GPU', 'CUDA Platform', 'Drive Thor'],
      leadership: ['Jensen Huang (CEO)', 'Colette Kress (CFO)', 'Jay Puri (EVP Worldwide Field Operations)']
    },
    explainableReasoning: {
      businessQuality: 'A-grade AI compute monopolist with deep software integration pipelines.',
      financialStrength: 'Hyper-profitable operating margins, multi-billion dollar cash flows, and high asset returns.',
      competitiveAdvantage: 'CUDA platform binds millions of developers to NVIDIA silicon, making architecture switches highly expensive.',
      growthPotential: 'Massive transition from general CPU servers to accelerated computing datacenters globally.',
      riskAnalysis: 'High customer concentration limits bargaining power; geopolitical chip bans constrain regional expansion.'
    },
    citations: ['https://nvidianews.nvidia.com', 'https://finance.yahoo.com/quote/NVDA'],
    logs: []
  }
};

export default function Dashboard() {
  const [company, setCompany] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(DEMO_RUNS['Tesla']);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [history, setHistory] = useState<AnalyzeResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Peer comparison state
  const [compareCompany, setCompareCompany] = useState<AnalyzeResponse | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);

  // Initialize history from localStorage and pre-fill with demos if empty
  useEffect(() => {
    const saved = localStorage.getItem('smartinvest_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Pre-fill history with Nvidia and Tesla demos so the UI starts populated
      const defaultHistory = [DEMO_RUNS['Nvidia'], DEMO_RUNS['Tesla']];
      setHistory(defaultHistory);
      localStorage.setItem('smartinvest_history', JSON.stringify(defaultHistory));
    }
  }, []);

  // Trigger confetti for INVEST recommendations
  useEffect(() => {
    if (analysisResult?.recommendation === 'INVEST') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#60a5fa', '#a78bfa'],
      });
    }
  }, [analysisResult]);

  // Form submission handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setCompareCompany(null);
    setIsCompareMode(false);
    setLogs([
      {
        timestamp: new Date().toISOString(),
        agent: 'System',
        message: `Analyzing "${company}"... Setting up Next.js route request.`,
      },
    ]);

    // Local stream simulation for agent logs
    const mockLogs = [
      { agent: 'ResearchAgent', msg: `Initiating business research for ${company}...` },
      { agent: 'ResearchAgent', msg: `Searching web for overview and leadership...` },
      { agent: 'FinancialAgent', msg: `Resolving ticker for ${company}...` },
      { agent: 'FinancialAgent', msg: `Fetching key valuation ratios and history...` },
      { agent: 'NewsAgent', msg: `Scraping Tavily for recent market news...` },
      { agent: 'NewsAgent', msg: `Analyzing sentiment profiles...` },
      { agent: 'RiskAgent', msg: `Quantifying competitive, debt, and regulatory risks...` },
      { agent: 'DecisionAgent', msg: `Synthesizing final investment recommendation...` }
    ];

    let logCounter = 0;
    const interval = setInterval(() => {
      if (logCounter < mockLogs.length) {
        const currentMockLog = mockLogs[logCounter];
        setLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toISOString(),
            agent: currentMockLog.agent as any,
            message: currentMockLog.msg,
          },
        ]);
        logCounter++;
      } else {
        clearInterval(interval);
      }
    }, 1800);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBase}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company: company.trim() }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errText = await response.json();
        throw new Error(errText.error || 'Server error. Please verify your API keys.');
      }

      const data = (await response.json()) as AnalyzeResponse;
      setAnalysisResult(data);
      setLogs(data.logs || []);

      // Append to local history list
      setHistory((prev) => {
        // Prevent duplicates
        const filtered = prev.filter((item) => item.company.toLowerCase() !== data.company.toLowerCase());
        const updated = [data, ...filtered].slice(0, 10);
        localStorage.setItem('smartinvest_history', JSON.stringify(updated));
        return updated;
      });

      setCompany('');
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || 'Failed to complete analysis.');
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          agent: 'System',
          message: `CRITICAL ERROR: ${err.message || 'Analysis aborted.'}`,
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadFromHistory = (item: AnalyzeResponse) => {
    setAnalysisResult(item);
    setError(null);
    setLogs(item.logs || []);
    setCompareCompany(null);
    setIsCompareMode(false);
  };

  const clearHistory = () => {
    if (confirm('Clear analysis history?')) {
      setHistory([]);
      localStorage.removeItem('smartinvest_history');
    }
  };

  const selectCompareTarget = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCompany = e.target.value;
    if (!selectedCompany) {
      setCompareCompany(null);
      return;
    }
    const match = history.find((h) => h.company === selectedCompany);
    setCompareCompany(match || null);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* 1. Header Hero section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 glow-green">
              <Flame className="w-3.5 h-3.5 fill-indigo-400/20" />
              SaaS Analyst Edition
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gray-100 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
            SmartInvest AI
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-xl">
            Real-time multi-agent LangGraph.js pipeline compiling research, financials, news, and risk models into clear recommendations.
          </p>
        </div>

        {/* Action Buttons */}
        {analysisResult && !isAnalyzing && (
          <PdfReport elementId="investment-report" companyName={analysisResult.company} />
        )}
      </header>

      {/* 2. Interactive Search Form & Quick History Badge Bar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 no-pdf-export">
        {/* Search form */}
        <form onSubmit={handleSearch} className="xl:col-span-3 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter company name (e.g. Apple, Tesla, Nvidia...)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={isAnalyzing}
              className="w-full bg-[#0a0f1b] border border-gray-800/80 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-6 py-3 rounded-xl disabled:bg-indigo-800 disabled:opacity-50 transition-all shrink-0 cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-600/10 active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              'Run Research'
            )}
          </button>
        </form>

        {/* Quick history widgets */}
        <div className="xl:col-span-1 flex items-center justify-between border border-gray-800/40 bg-slate-950/20 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <History className="w-4 h-4 text-gray-500" />
            <span>Search History</span>
          </div>
          
          <div className="flex gap-2">
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[10px] text-gray-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick History badge bar row */}
      {history.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center text-xs no-pdf-export bg-[#0c1223]/25 p-3 rounded-xl border border-gray-900/50">
          <span className="text-gray-500 mr-2">Recent searches:</span>
          {history.map((h, i) => (
            <button
              key={i}
              onClick={() => loadFromHistory(h)}
              className={`px-3 py-1 rounded-lg border text-xs cursor-pointer transition-all duration-300 flex items-center gap-1.5 ${
                analysisResult?.company === h.company
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 font-medium'
                  : 'bg-slate-900/40 text-gray-400 border-gray-800 hover:bg-slate-800 hover:text-gray-200'
              }`}
            >
              <span>{h.company}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                h.recommendation === 'INVEST' ? 'bg-emerald-950 text-emerald-400' : 'bg-gray-800 text-gray-400'
              }`}>
                {h.recommendation}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Server Error notification card */}
      {error && (
        <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl flex items-center gap-3 text-sm text-rose-400 glow-red no-pdf-export">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <span className="font-semibold block">Analysis Pipeline Error</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* 3. Real-time Agent Log Terminal */}
      {(isAnalyzing || logs.length > 0) && (
        <div className="no-pdf-export">
          <ExecutionLogs logs={logs} isAnalyzing={isAnalyzing} />
        </div>
      )}

      {/* 4. Main Investment Report Block (Target for PDF capture) */}
      {analysisResult && !isAnalyzing && (
        <div id="investment-report" className="flex flex-col gap-8 pt-4">
          
          {/* Company Comparison Selector Row */}
          {history.length > 1 && (
            <div className="no-pdf-export bg-indigo-950/10 border border-indigo-500/10 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Layers className="text-indigo-400 w-5 h-5" />
                <div>
                  <span className="text-sm font-semibold block text-gray-200">Side-by-Side Peer Comparison</span>
                  <span className="text-xs text-gray-500">Compare {analysisResult.company} with another company from search history.</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  onChange={selectCompareTarget}
                  value={compareCompany?.company || ''}
                  className="bg-[#0a0f1b] border border-gray-800 text-xs text-gray-200 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose Peer to Compare --</option>
                  {history
                    .filter((h) => h.company !== analysisResult.company)
                    .map((h, i) => (
                      <option key={i} value={h.company}>
                        {h.company} ({h.ticker})
                      </option>
                    ))}
                </select>

                {compareCompany && (
                  <button
                    onClick={() => setIsCompareMode(!isCompareMode)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg transition-all"
                  >
                    {isCompareMode ? 'Exit Comparison' : 'Toggle Compare View'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* MAIN REPORT VIEW */}
          {!isCompareMode ? (
            <>
              {/* Recommendation Hero Panel */}
              <div className={`p-8 rounded-3xl border glass-card relative overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-8 items-center ${
                analysisResult.recommendation === 'INVEST' 
                  ? 'border-emerald-500/30 bg-gradient-to-br from-slate-900/60 to-emerald-950/20 shadow-xl shadow-emerald-500/5 glow-green' 
                  : 'border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-950/40'
              }`}>
                {/* Visual Recommendation Badge */}
                <div className="lg:col-span-1 flex flex-col items-center justify-center text-center p-6 border-b lg:border-b-0 lg:border-r border-gray-800/80">
                  <div className="mb-4">
                    {analysisResult.recommendation === 'INVEST' ? (
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/15">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-500/10 border border-gray-700 flex items-center justify-center text-gray-400">
                        <XCircle className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Recommendation</span>
                  <span className={`text-4xl font-extrabold tracking-tight mt-1 ${
                    analysisResult.recommendation === 'INVEST' ? 'text-emerald-400' : 'text-gray-300'
                  }`}>
                    {analysisResult.recommendation}
                  </span>

                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-4">Confidence Level</span>
                  <span className="text-lg font-bold text-gray-300 mt-0.5">{analysisResult.confidenceScore}%</span>
                </div>

                {/* Reasoning summary text */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    <Award className="text-indigo-400 w-4 h-4" />
                    <span>Executive Summary — {analysisResult.company} ({analysisResult.ticker})</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-100">{analysisResult.company} Analysis Thesis</h2>
                  <p className="text-sm text-gray-300 leading-relaxed font-sans">{analysisResult.reasoning}</p>
                </div>

                {/* Background design glow circles */}
                <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-[80px] opacity-25 ${
                  analysisResult.recommendation === 'INVEST' ? 'bg-emerald-500' : 'bg-gray-700'
                }`} />
              </div>

              {/* Score Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                  title="Financial Health Score" 
                  value={analysisResult.financialScore} 
                  description="Leverage ratios, profit margins, free cash flow profile, and liquidity depth."
                  type="financial"
                />
                <MetricCard 
                  title="Growth Vector Score" 
                  value={analysisResult.growthScore} 
                  description="Market size expansion, product lifecycle, and multi-year revenue growth trajectory."
                  type="growth"
                />
                <MetricCard 
                  title="Risk Mitigation Score" 
                  value={analysisResult.riskScore} 
                  description="Resiliency score: high value represents low risk exposure and secure business moats."
                  type="risk"
                />
                <MetricCard 
                  title="Aggregate Score" 
                  value={analysisResult.finalScore} 
                  description="Consolidated rating reflecting aggregated agent metrics and weights."
                  type="final"
                />
              </div>

              {/* Business Overview & Key details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overview */}
                <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold border-b border-gray-800/60 pb-3 flex items-center gap-2">
                    <HelpCircle className="text-indigo-400 w-5 h-5" />
                    Business & Industry Overview
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{analysisResult.researchData?.overview}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div>
                      <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider mb-2">Core Products & Services</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.researchData?.products.map((p, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 bg-slate-900/60 border border-gray-800 text-gray-300 rounded-lg">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider mb-2">Key Executive Leadership</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.researchData?.leadership.map((l, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 bg-slate-900/60 border border-gray-800 text-gray-300 rounded-lg">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bullets Strengths & Risks */}
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-md font-semibold text-emerald-400 mb-4 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      Key Catalysts & Strengths
                    </h3>
                    <ul className="space-y-3 mb-6">
                      {analysisResult.strengths.map((str, idx) => (
                        <li key={idx} className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-md font-semibold text-rose-400 mb-4 flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4" />
                      Identified Headwinds & Risks
                    </h3>
                    <ul className="space-y-3">
                      {analysisResult.risks.map((r, idx) => (
                        <li key={idx} className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Financial Charts & valuation metrics */}
              <FinancialCharts financialData={analysisResult.financialData} />

              {/* Web News Sentiment & Risk Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NewsSentiment news={analysisResult.news} />
                <RiskAnalysis riskData={analysisResult.riskData} />
              </div>

              {/* Explainable AI Reasoning Section */}
              <div className="glass-card p-6 rounded-2xl space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-gray-800/60 pb-3">
                  <Award className="text-indigo-400 w-5 h-5" />
                  Explainable AI (XAI) Attribution Breakdown
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="space-y-1">
                    <span className="text-xs text-indigo-400 font-bold block uppercase tracking-wider">1. Business Quality</span>
                    <p className="text-xs text-gray-400 leading-relaxed">{analysisResult.explainableReasoning?.businessQuality}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-emerald-400 font-bold block uppercase tracking-wider">2. Financial Strength</span>
                    <p className="text-xs text-gray-400 leading-relaxed">{analysisResult.explainableReasoning?.financialStrength}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-cyan-400 font-bold block uppercase tracking-wider">3. Competitive Moat</span>
                    <p className="text-xs text-gray-400 leading-relaxed">{analysisResult.explainableReasoning?.competitiveAdvantage}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-teal-400 font-bold block uppercase tracking-wider">4. Growth Potential</span>
                    <p className="text-xs text-gray-400 leading-relaxed">{analysisResult.explainableReasoning?.growthPotential}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-pink-400 font-bold block uppercase tracking-wider">5. Risk Analysis</span>
                    <p className="text-xs text-gray-400 leading-relaxed">{analysisResult.explainableReasoning?.riskAnalysis}</p>
                  </div>
                </div>
              </div>

              {/* Citations section */}
              {analysisResult.citations && analysisResult.citations.length > 0 && (
                <div className="border-t border-gray-900/60 pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5" />
                    Sources Citations:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.citations.map((url, i) => {
                      const domain = new URL(url).hostname.replace('www.', '');
                      return (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-400 underline transition-colors"
                        >
                          {domain}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            // COMPARISON PEER VIEW
            compareCompany && (
              <div className="space-y-8 animate-fade-in">
                {/* Header summary of comparison */}
                <div className="glass-card p-6 rounded-2xl flex justify-between items-center bg-slate-900/30">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Layers className="text-indigo-400 w-5 h-5" />
                    Peer Comparison: {analysisResult.company} vs {compareCompany.company}
                  </h2>
                  
                  <button
                    onClick={() => {
                      setIsCompareMode(false);
                      setCompareCompany(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-800 text-xs text-gray-400 hover:text-gray-200 rounded-lg cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset View
                  </button>
                </div>

                {/* Score Comparison Matrix Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Company Core Card */}
                  <div className="glass-card p-6 rounded-2xl border-l-4 border-l-indigo-500 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold block uppercase">Symbol</span>
                        <h3 className="text-2xl font-bold text-gray-100">{analysisResult.company} (${analysisResult.ticker})</h3>
                      </div>
                      <div className={`px-4 py-1.5 rounded-xl font-extrabold text-xs tracking-wider ${
                        analysisResult.recommendation === 'INVEST' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {analysisResult.recommendation}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3 bg-slate-950/40 rounded-xl text-center">
                        <span className="text-[10px] text-gray-500 block uppercase">Final Rating</span>
                        <span className="text-lg font-bold text-indigo-400">{analysisResult.finalScore}%</span>
                      </div>
                      <div className="p-3 bg-slate-950/40 rounded-xl text-center">
                        <span className="text-[10px] text-gray-500 block uppercase">Confidence</span>
                        <span className="text-lg font-bold text-gray-300">{analysisResult.confidenceScore}%</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 text-xs">
                      <div className="flex justify-between border-b border-gray-800/30 pb-2">
                        <span className="text-gray-500">Financial Score:</span>
                        <span className="font-semibold">{analysisResult.financialScore}%</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800/30 pb-2">
                        <span className="text-gray-500">Growth Score:</span>
                        <span className="font-semibold">{analysisResult.growthScore}%</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-gray-500">Risk Health Score:</span>
                        <span className="font-semibold">{analysisResult.riskScore}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Company Core Card */}
                  <div className="glass-card p-6 rounded-2xl border-l-4 border-l-pink-500 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold block uppercase">Symbol</span>
                        <h3 className="text-2xl font-bold text-gray-100">{compareCompany.company} (${compareCompany.ticker})</h3>
                      </div>
                      <div className={`px-4 py-1.5 rounded-xl font-extrabold text-xs tracking-wider ${
                        compareCompany.recommendation === 'INVEST' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {compareCompany.recommendation}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3 bg-slate-950/40 rounded-xl text-center">
                        <span className="text-[10px] text-gray-500 block uppercase">Final Rating</span>
                        <span className="text-lg font-bold text-pink-400">{compareCompany.finalScore}%</span>
                      </div>
                      <div className="p-3 bg-slate-950/40 rounded-xl text-center">
                        <span className="text-[10px] text-gray-500 block uppercase">Confidence</span>
                        <span className="text-lg font-bold text-gray-300">{compareCompany.confidenceScore}%</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 text-xs">
                      <div className="flex justify-between border-b border-gray-800/30 pb-2">
                        <span className="text-gray-500">Financial Score:</span>
                        <span className="font-semibold">{compareCompany.financialScore}%</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800/30 pb-2">
                        <span className="text-gray-500">Growth Score:</span>
                        <span className="font-semibold">{compareCompany.growthScore}%</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-gray-500">Risk Health Score:</span>
                        <span className="font-semibold">{compareCompany.riskScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Metric Comparison Grid Table */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-800 bg-slate-900/20">
                    <h3 className="text-sm font-semibold">Fundamental Comparison Matrix</h3>
                  </div>
                  
                  <div className="overflow-x-auto text-xs font-mono">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-950/40 border-b border-gray-800 text-gray-400">
                          <th className="p-4">Key Metric</th>
                          <th className="p-4">{analysisResult.company} ({analysisResult.ticker})</th>
                          <th className="p-4">{compareCompany.company} ({compareCompany.ticker})</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/60 text-gray-300">
                        {/* Market Cap */}
                        <tr className="hover:bg-slate-900/10">
                          <td className="p-4 font-semibold">Market Cap</td>
                          <td className="p-4">
                            {analysisResult.financialData.ticker?.toUpperCase().endsWith('.NS') || analysisResult.financialData.ticker?.toUpperCase().endsWith('.BO') ? '₹' : '$'}
                            {(analysisResult.financialData.marketCap || 0).toLocaleString()}
                          </td>
                          <td className="p-4">
                            {compareCompany.financialData.ticker?.toUpperCase().endsWith('.NS') || compareCompany.financialData.ticker?.toUpperCase().endsWith('.BO') ? '₹' : '$'}
                            {(compareCompany.financialData.marketCap || 0).toLocaleString()}
                          </td>
                        </tr>
                        {/* PE Ratio */}
                        <tr className="hover:bg-slate-900/10">
                          <td className="p-4 font-semibold">P/E Ratio (TTM)</td>
                          <td className="p-4">{analysisResult.financialData.peRatio?.toFixed(2) || 'N/A'}</td>
                          <td className="p-4">{compareCompany.financialData.peRatio?.toFixed(2) || 'N/A'}</td>
                        </tr>
                        {/* Price/Sales */}
                        <tr className="hover:bg-slate-900/10">
                          <td className="p-4 font-semibold">Price to Sales</td>
                          <td className="p-4">{analysisResult.financialData.priceToSales?.toFixed(2) || 'N/A'}</td>
                          <td className="p-4">{compareCompany.financialData.priceToSales?.toFixed(2) || 'N/A'}</td>
                        </tr>
                        {/* Debt to Equity */}
                        <tr className="hover:bg-slate-900/10">
                          <td className="p-4 font-semibold">Debt to Equity</td>
                          <td className="p-4">{analysisResult.financialData.debtToEquity?.toFixed(2) || 'N/A'}%</td>
                          <td className="p-4">{compareCompany.financialData.debtToEquity?.toFixed(2) || 'N/A'}%</td>
                        </tr>
                        {/* Return on Equity */}
                        <tr className="hover:bg-slate-900/10">
                          <td className="p-4 font-semibold">ROE</td>
                          <td className="p-4 text-emerald-400">
                            {analysisResult.financialData.keyRatios?.returnOnEquity !== undefined 
                              ? `${(analysisResult.financialData.keyRatios.returnOnEquity * 100).toFixed(2)}%` 
                              : 'N/A'}
                          </td>
                          <td className="p-4 text-emerald-400">
                            {compareCompany.financialData.keyRatios?.returnOnEquity !== undefined 
                              ? `${(compareCompany.financialData.keyRatios.returnOnEquity * 100).toFixed(2)}%` 
                              : 'N/A'}
                          </td>
                        </tr>
                        {/* Free cash flow */}
                        <tr className="hover:bg-slate-900/10">
                          <td className="p-4 font-semibold">Free Cash Flow</td>
                          <td className="p-4">
                            {analysisResult.financialData.ticker?.toUpperCase().endsWith('.NS') || analysisResult.financialData.ticker?.toUpperCase().endsWith('.BO') ? '₹' : '$'}
                            {(analysisResult.financialData.freeCashFlow || 0).toLocaleString()}
                          </td>
                          <td className="p-4">
                            {compareCompany.financialData.ticker?.toUpperCase().endsWith('.NS') || compareCompany.financialData.ticker?.toUpperCase().endsWith('.BO') ? '₹' : '$'}
                            {(compareCompany.financialData.freeCashFlow || 0).toLocaleString()}
                          </td>
                        </tr>
                        {/* Profit margin */}
                        <tr className="hover:bg-slate-900/10">
                          <td className="p-4 font-semibold">Profit Margin</td>
                          <td className="p-4">
                            {analysisResult.financialData.keyRatios?.profitMargin !== undefined 
                              ? `${(analysisResult.financialData.keyRatios.profitMargin * 100).toFixed(2)}%` 
                              : 'N/A'}
                          </td>
                          <td className="p-4">
                            {compareCompany.financialData.keyRatios?.profitMargin !== undefined 
                              ? `${(compareCompany.financialData.keyRatios.profitMargin * 100).toFixed(2)}%` 
                              : 'N/A'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Side-by-side Revenue Growth Charts comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-sm font-semibold mb-4">{analysisResult.company} Growth</h3>
                    <FinancialCharts financialData={analysisResult.financialData} />
                  </div>
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-sm font-semibold mb-4">{compareCompany.company} Growth</h3>
                    <FinancialCharts financialData={compareCompany.financialData} />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
