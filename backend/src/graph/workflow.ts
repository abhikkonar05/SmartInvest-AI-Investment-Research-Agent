import { Annotation, StateGraph, START, END } from '@langchain/langgraph';
import { runResearchAgent } from '../agents/researchAgent';
import { runFinancialAgent } from '../agents/financialAgent';
import { runNewsAgent } from '../agents/newsAgent';
import { runRiskAgent } from '../agents/riskAgent';
import { runDecisionAgent } from '../agents/decisionAgent';
import { ResearchData, FinancialData, NewsItem, RiskData, DecisionData, ExecutionLog } from '../types';

// Reducer function to append new items to list channels in state updates
const appendReducer = <T>(stateValue: T[] | undefined | null, newValue: T[]): T[] => {
  const current = Array.isArray(stateValue) ? stateValue : [];
  return [...current, ...newValue];
};

/**
 * Define the annotated state shape for our LangGraph agents.
 */
export const AgentState = Annotation.Root({
  company: Annotation<string>(),
  ticker: Annotation<string>(),
  researchData: Annotation<ResearchData | null>(),
  financialData: Annotation<FinancialData | null>(),
  newsData: Annotation<NewsItem[] | null>(),
  riskData: Annotation<RiskData | null>(),
  decisionData: Annotation<DecisionData | null>(),
  citations: Annotation<string[]>({
    reducer: appendReducer,
    default: () => [],
  }),
  logs: Annotation<ExecutionLog[]>({
    reducer: appendReducer,
    default: () => [],
  }),
});

/**
 * Builds and compiles the investment analysis multi-agent workflow.
 */
export function buildWorkflow() {
  const workflow = new StateGraph(AgentState)
    // 1. Add nodes
    .addNode('ResearchAgent', runResearchAgent)
    .addNode('FinancialAgent', runFinancialAgent)
    .addNode('NewsAgent', runNewsAgent)
    .addNode('RiskAgent', runRiskAgent)
    .addNode('DecisionAgent', runDecisionAgent)

    // 2. Add edges in sequential order
    .addEdge(START, 'ResearchAgent')
    .addEdge('ResearchAgent', 'FinancialAgent')
    .addEdge('FinancialAgent', 'NewsAgent')
    .addEdge('NewsAgent', 'RiskAgent')
    .addEdge('RiskAgent', 'DecisionAgent')
    .addEdge('DecisionAgent', END);

  // Compile the workflow
  return workflow.compile();
}

/**
 * Runs the investment analysis graph for a given company.
 */
export async function runInvestmentAnalysis(companyName: string) {
  const app = buildWorkflow();
  
  const systemLog: ExecutionLog = {
    timestamp: new Date().toISOString(),
    agent: 'System',
    message: `Initialized analysis pipeline for company: "${companyName}"`,
  };

  const initialState = {
    company: companyName,
    ticker: '',
    researchData: null,
    financialData: null,
    newsData: null,
    riskData: null,
    decisionData: null,
    citations: [],
    logs: [systemLog],
  };

  // Run the graph to completion
  const finalState = await app.invoke(initialState);
  return finalState;
}
