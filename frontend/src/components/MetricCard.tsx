import React from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  type?: 'financial' | 'growth' | 'risk' | 'final' | 'confidence';
}

export function MetricCard({ title, value, description, type = 'financial' }: MetricCardProps) {
  // Score styling
  let strokeColor = 'stroke-indigo-500';
  let textColor = 'text-indigo-400';
  let glowClass = 'shadow-indigo-500/10';

  if (type === 'financial') {
    strokeColor = value >= 70 ? 'stroke-emerald-500' : value >= 50 ? 'stroke-amber-500' : 'stroke-rose-500';
    textColor = value >= 70 ? 'text-emerald-400' : value >= 50 ? 'text-amber-400' : 'text-rose-400';
  } else if (type === 'growth') {
    strokeColor = value >= 70 ? 'stroke-cyan-500' : value >= 50 ? 'stroke-amber-500' : 'stroke-rose-500';
    textColor = value >= 70 ? 'text-cyan-400' : value >= 50 ? 'text-amber-400' : 'text-rose-400';
  } else if (type === 'risk') {
    // For risk, high score is good (meaning robust risk management, low risk exposure)
    strokeColor = value >= 70 ? 'stroke-teal-500' : value >= 50 ? 'stroke-amber-500' : 'stroke-rose-500';
    textColor = value >= 70 ? 'text-teal-400' : value >= 50 ? 'text-amber-400' : 'text-rose-400';
  } else if (type === 'final') {
    strokeColor = value >= 70 ? 'stroke-emerald-500' : value >= 50 ? 'stroke-amber-500' : 'stroke-rose-500';
    textColor = value >= 70 ? 'text-emerald-400' : value >= 50 ? 'text-amber-400' : 'text-rose-400';
    glowClass = value >= 70 ? 'shadow-emerald-500/20 glow-green' : 'shadow-rose-500/20 glow-red';
  } else if (type === 'confidence') {
    strokeColor = 'stroke-fuchsia-500';
    textColor = 'text-fuchsia-400';
  }

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className={`glass-card p-6 rounded-2xl relative overflow-hidden transition-all duration-300 flex items-center justify-between shadow-lg ${glowClass}`}>
      {/* Label and Info */}
      <div className="flex-1 pr-4">
        <span className="text-sm font-medium text-gray-400 block mb-1">{title}</span>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>

      {/* Radial Score Gauge */}
      <div className="relative flex items-center justify-center h-20 w-20 shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-gray-800"
            strokeWidth="6"
            fill="transparent"
          />
          {/* Foreground circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`transition-all duration-1000 ease-out ${strokeColor}`}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        {/* Score text inside */}
        <div className="absolute flex flex-col items-center">
          <span className={`text-xl font-bold tracking-tight ${textColor}`}>{value}%</span>
        </div>
      </div>

      {/* Decorative top-edge colored line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] opacity-60 ${
        type === 'financial' ? (value >= 70 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-500' : 'bg-rose-500') :
        type === 'growth' ? (value >= 70 ? 'bg-cyan-500' : value >= 50 ? 'bg-amber-500' : 'bg-rose-500') :
        type === 'risk' ? (value >= 70 ? 'bg-teal-500' : value >= 50 ? 'bg-amber-500' : 'bg-rose-500') :
        type === 'final' ? (value >= 70 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-500' : 'bg-rose-500') :
        'bg-fuchsia-500'
      }`} />
    </div>
  );
}
