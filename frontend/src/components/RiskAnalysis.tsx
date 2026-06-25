import React from 'react';
import { RiskData } from '../types';
import { ShieldAlert, Users, Scale, CreditCard, Globe } from 'lucide-react';

interface RiskAnalysisProps {
  riskData: RiskData;
}

export function RiskAnalysis({ riskData }: RiskAnalysisProps) {
  const categories = [
    {
      title: 'Competitive Risk',
      icon: <Users className="w-5 h-5 text-indigo-400" />,
      items: riskData.competition || [],
      bgColor: 'bg-indigo-950/10 border-indigo-500/10',
    },
    {
      title: 'Regulatory & Compliance',
      icon: <Scale className="w-5 h-5 text-pink-400" />,
      items: riskData.regulation || [],
      bgColor: 'bg-pink-950/10 border-pink-500/10',
    },
    {
      title: 'Balance Sheet & Debt',
      icon: <CreditCard className="w-5 h-5 text-amber-400" />,
      items: riskData.debt || [],
      bgColor: 'bg-amber-950/10 border-amber-500/10',
    },
    {
      title: 'Market Challenges',
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
      items: riskData.marketChallenges || [],
      bgColor: 'bg-cyan-950/10 border-cyan-500/10',
    },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <ShieldAlert className="text-pink-400 w-5 h-5" />
        Risk Exposure Vectors
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, i) => (
          <div key={i} className={`p-5 rounded-xl border ${cat.bgColor} flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                {cat.icon}
                <span className="text-sm font-semibold text-gray-200">{cat.title}</span>
              </div>
              
              {cat.items.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No significant risks identified in this area.</p>
              ) : (
                <ul className="space-y-2">
                  {cat.items.map((item, j) => (
                    <li key={j} className="text-xs text-gray-400 leading-relaxed flex items-start gap-1.5">
                      <span className="text-gray-600 mt-1 shrink-0">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
