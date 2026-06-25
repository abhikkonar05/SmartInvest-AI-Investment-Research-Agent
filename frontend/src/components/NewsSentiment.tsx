import React from 'react';
import { NewsItem } from '../types';
import { Newspaper, ArrowUpRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NewsSentimentProps {
  news: NewsItem[];
}

export function NewsSentiment({ news }: NewsSentimentProps) {
  const total = news.length;
  const positive = news.filter((n) => n.sentiment === 'positive').length;
  const negative = news.filter((n) => n.sentiment === 'negative').length;
  const neutral = total - positive - negative;

  const posPercent = total > 0 ? Math.round((positive / total) * 100) : 0;
  const negPercent = total > 0 ? Math.round((negative / total) * 100) : 0;
  const neuPercent = total > 0 ? Math.round((neutral / total) * 100) : 0;

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Newspaper className="text-cyan-400 w-5 h-5" />
          News Sentiment Analysis
        </h3>

        {/* Sentiment breakdown bar */}
        {total > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-emerald-400 font-semibold">{posPercent}% Positive</span>
              <span className="text-gray-400">{neuPercent}% Neutral</span>
              <span className="text-rose-400 font-semibold">{negPercent}% Negative</span>
            </div>
            
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${posPercent}%` }} />
              <div className="h-full bg-gray-600 transition-all duration-500" style={{ width: `${neuPercent}%` }} />
              <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${negPercent}%` }} />
            </div>
          </div>
        )}

        {/* News list */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {news.length === 0 ? (
            <div className="text-xs text-gray-500 italic text-center py-8">
              No news items found.
            </div>
          ) : (
            news.map((item, i) => {
              let sentimentIcon = <Minus className="w-3.5 h-3.5 text-gray-400" />;
              let pillClass = 'bg-gray-950/40 text-gray-400 border-gray-800';

              if (item.sentiment === 'positive') {
                sentimentIcon = <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
                pillClass = 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20';
              } else if (item.sentiment === 'negative') {
                sentimentIcon = <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
                pillClass = 'bg-rose-950/20 text-rose-400 border-rose-500/20';
              }

              return (
                <div key={i} className="p-3 bg-slate-900/30 border border-gray-800/40 rounded-xl space-y-1.5 hover:border-gray-800 transition-all duration-300">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-semibold text-gray-300 line-clamp-1">{item.title}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-indigo-400 shrink-0 transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed">{item.summary}</p>

                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-gray-500 font-medium">{item.source || 'Search source'}</span>
                    <div className={`px-2 py-0.5 rounded-full border flex items-center gap-1 ${pillClass}`}>
                      {sentimentIcon}
                      <span className="capitalize">{item.sentiment}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
