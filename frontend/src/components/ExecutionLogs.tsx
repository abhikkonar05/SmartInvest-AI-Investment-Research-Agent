import React from 'react';
import { ExecutionLog } from '../types';
import { Play, CheckCircle2, AlertTriangle, Terminal, Cpu } from 'lucide-react';

interface ExecutionLogsProps {
  logs: ExecutionLog[];
  isAnalyzing: boolean;
  currentAgentIndex?: number; // to show which agent is active
}

const AGENTS_TIMELINE = [
  { id: 'ResearchAgent', name: 'Research Agent', description: 'Overview, industry & leadership' },
  { id: 'FinancialAgent', name: 'Financial Agent', description: 'Yahoo Finance stock metrics' },
  { id: 'NewsAgent', name: 'News Agent', description: 'Tavily web news sentiment' },
  { id: 'RiskAgent', name: 'Risk Agent', description: 'Competitive & market risks' },
  { id: 'DecisionAgent', name: 'Decision Agent', description: 'Groq Llama 3.3 Investment Thesis' },
];

export function ExecutionLogs({ logs, isAnalyzing }: ExecutionLogsProps) {
  // Determine if a specific agent has started/finished/pending
  const getAgentStatus = (agentId: string) => {
    const hasLogs = logs.some((l) => l.agent === agentId);
    if (!hasLogs) {
      return isAnalyzing ? 'pending' : 'idle';
    }
    
    // Check if the agent's work is completed or if a subsequent agent has started
    const nextAgentIdx = AGENTS_TIMELINE.findIndex((a) => a.id === agentId) + 1;
    const isNextAgentStarted = nextAgentIdx < AGENTS_TIMELINE.length && 
      logs.some((l) => l.agent === AGENTS_TIMELINE[nextAgentIdx].id);
      
    const isLastAgent = agentId === 'DecisionAgent';
    const isCompleted = isNextAgentStarted || (isLastAgent && !isAnalyzing && logs.some((l) => l.message.includes('Analysis finalized')));

    return isCompleted ? 'completed' : 'running';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Agent Graph Pipeline Checklist */}
      <div className="glass-card p-6 rounded-2xl lg:col-span-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Cpu className="text-emerald-400 w-5 h-5" />
            Agent Orchestration Graph
          </h3>
          <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-800">
            {AGENTS_TIMELINE.map((agent) => {
              const status = getAgentStatus(agent.id);
              
              let icon = <div className="w-8 h-8 rounded-full border border-gray-700 bg-gray-900 flex items-center justify-center text-xs text-gray-500">P</div>;
              let itemClass = 'opacity-50';

              if (status === 'completed') {
                icon = (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 glow-green">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                );
                itemClass = 'opacity-100';
              } else if (status === 'running') {
                icon = (
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-indigo-400 animate-pulse">
                    <Play className="w-4 h-4 fill-indigo-400/20 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                );
                itemClass = 'opacity-100 font-semibold';
              } else if (status === 'pending') {
                icon = (
                  <div className="w-8 h-8 rounded-full border border-gray-700 bg-gray-900/50 flex items-center justify-center text-xs text-gray-600">
                    &bull;
                  </div>
                );
                itemClass = 'opacity-30';
              } else {
                // idle
                icon = (
                  <div className="w-8 h-8 rounded-full border border-gray-800 bg-gray-900/10 flex items-center justify-center text-xs text-gray-700">
                    &bull;
                  </div>
                );
                itemClass = 'opacity-20';
              }

              return (
                <div key={agent.id} className={`flex items-start gap-4 transition-all duration-300 ${itemClass}`}>
                  <div className="z-10 bg-[#090d16]">{icon}</div>
                  <div>
                    <h4 className="text-sm">{agent.name}</h4>
                    <p className="text-xs text-gray-500">{agent.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isAnalyzing && (
          <div className="mt-6 p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping shrink-0" />
            <p className="text-xs text-indigo-300">LangGraph pipeline running. Fetching real-time signals...</p>
          </div>
        )}
      </div>

      {/* 2. Interactive Console Output */}
      <div className="glass-card rounded-2xl lg:col-span-2 flex flex-col h-[350px]">
        {/* Terminal Header */}
        <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-between bg-slate-900/40 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-mono text-gray-300">smartinvest-agent-logs.sh</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 bg-[#05080e]/95 select-all scroll-smooth">
          {logs.length === 0 ? (
            <div className="text-gray-600 italic">Console idle. Enter a company name to execute research.</div>
          ) : (
            logs.map((log, i) => {
              let tagColor = 'text-gray-400';
              if (log.agent === 'ResearchAgent') tagColor = 'text-green-400';
              else if (log.agent === 'FinancialAgent') tagColor = 'text-emerald-400';
              else if (log.agent === 'NewsAgent') tagColor = 'text-cyan-400';
              else if (log.agent === 'RiskAgent') tagColor = 'text-pink-400';
              else if (log.agent === 'DecisionAgent') tagColor = 'text-indigo-400';
              else if (log.agent === 'System') tagColor = 'text-amber-400';

              const timeStr = new Date(log.timestamp).toLocaleTimeString();

              return (
                <div key={i} className="flex items-start gap-2 hover:bg-slate-900/20 py-0.5 rounded px-1">
                  <span className="text-gray-600 shrink-0">[{timeStr}]</span>
                  <span className={`${tagColor} font-bold shrink-0`}>[{log.agent}]:</span>
                  <span className="text-gray-300 break-words">{log.message}</span>
                </div>
              );
            })
          )}
          
          {isAnalyzing && (
            <div className="flex items-center gap-1.5 text-indigo-400 py-1">
              <span className="animate-pulse">&gt;</span>
              <span className="animate-pulse">Awaiting agent callback...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
