import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import { runInvestmentAnalysis } from './graph/workflow';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Validation schema for incoming requests
const analyzeRequestSchema = z.object({
  company: z.string().min(1, { message: 'Company name is required' }),
});

// Route handler for investment analysis
app.post('/api/analyze', async (req: express.Request, res: express.Response) => {
  try {
    // 1. Parse and validate request body
    const result = analyzeRequestSchema.safeParse(req.body);
    
    if (!result.success) {
      res.status(400).json({
        error: result.error.issues.map((e) => e.message).join(', ')
      });
      return;
    }

    const { company } = result.data;

    // 2. Ensure API keys are present (give developer-friendly warning)
    if (!process.env.GROQ_API_KEY) {
      res.status(500).json({
        error: 'Missing GROQ_API_KEY environment variable on the server.'
      });
      return;
    }

    // 3. Execute LangGraph multi-agent analysis
    const finalState = await runInvestmentAnalysis(company);

    // 4. Return consolidated analytical response
    res.json({
      company: finalState.company,
      ticker: finalState.ticker || 'UNKNOWN',
      recommendation: finalState.decisionData?.recommendation || 'PASS',
      confidenceScore: finalState.decisionData?.confidenceScore ?? 0,
      financialScore: finalState.decisionData?.financialScore ?? 0,
      growthScore: finalState.decisionData?.growthScore ?? 0,
      riskScore: finalState.decisionData?.riskScore ?? 0,
      finalScore: finalState.decisionData?.finalScore ?? 0,
      reasoning: finalState.decisionData?.reasoning || 'No analysis available.',
      strengths: finalState.decisionData?.strengths || [],
      risks: finalState.decisionData?.risks || [],
      financialData: finalState.financialData || { ticker: finalState.ticker, revenueHistory: [], keyRatios: {} },
      news: finalState.newsData || [],
      riskData: finalState.riskData || { competition: [], regulation: [], debt: [], marketChallenges: [] },
      researchData: finalState.researchData || { overview: '', industry: '', products: [], leadership: [] },
      explainableReasoning: finalState.decisionData?.explainableReasoning || {
        businessQuality: '',
        financialStrength: '',
        competitiveAdvantage: '',
        growthPotential: '',
        riskAnalysis: '',
      },
      logs: finalState.logs || [],
      citations: Array.from(new Set(finalState.citations || [])), // deduplicate URLs
    });

  } catch (error: any) {
    console.error('Error executing analyze endpoint:', error);
    res.status(500).json({
      error: error.message || 'An unexpected error occurred during analysis.'
    });
  }
});

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
