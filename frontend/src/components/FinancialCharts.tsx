'use client';

import React from 'react';
import { FinancialData } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Landmark, TrendingUp, DollarSign, Activity } from 'lucide-react';

interface FinancialChartsProps {
  financialData: FinancialData;
}

export function FinancialCharts({ financialData }: FinancialChartsProps) {
  // Determine currency based on stock ticker (Indian stocks use INR)
  const isIndian = (financialData.ticker || '').toUpperCase().endsWith('.NS') || 
                   (financialData.ticker || '').toUpperCase().endsWith('.BO');
  const currencySymbol = isIndian ? '₹' : '$';

  // Format long numbers for readability
  const formatCurrency = (value: number) => {
    if (!value) return `${currencySymbol}0`;
    if (value >= 1e12) return `${currencySymbol}${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${currencySymbol}${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${currencySymbol}${(value / 1e6).toFixed(2)}M`;
    return `${currencySymbol}${value.toLocaleString()}`;
  };

  const formatPercent = (value?: number) => {
    if (value === undefined) return 'N/A';
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatRatio = (value?: number) => {
    if (value === undefined) return 'N/A';
    return value.toFixed(2);
  };

  // Map revenue history to recharts data format
  const chartData = (financialData.revenueHistory || []).map((item) => ({
    name: item.year.toString(),
    Revenue: item.revenue,
    'Net Income': item.netIncome,
  }));

  const keyRatios = financialData.keyRatios || {};

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* 1. Historical Area Chart (Revenue vs Income) */}
      <div className="glass-card p-6 rounded-2xl xl:col-span-2 flex flex-col h-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="text-indigo-400 w-5 h-5" />
            Financial Growth Trajectory
          </h3>
          <span className="text-xs text-gray-500 italic">Figures in USD ($)</span>
        </div>

        <div className="flex-1 w-full min-h-0">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No historical financial data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={11}
                  tickFormatter={formatCurrency}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    color: '#f3f4f6',
                  }}
                  formatter={(value: any) => [formatCurrency(Number(value || 0)), '']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="Net Income"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2. Key Valuation & Ratio Grid */}
      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Landmark className="text-cyan-400 w-5 h-5" />
            Valuation Metrics
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Market Cap */}
            <div className="p-3 bg-slate-900/40 rounded-xl border border-gray-800/40">
              <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block">Market Cap</span>
              <span className="text-sm font-bold text-gray-200 mt-1 block">
                {financialData.marketCap ? formatCurrency(financialData.marketCap) : 'N/A'}
              </span>
            </div>

            {/* P/E Ratio */}
            <div className="p-3 bg-slate-900/40 rounded-xl border border-gray-800/40">
              <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block">P/E Ratio (TTM)</span>
              <span className="text-sm font-bold text-gray-200 mt-1 block">
                {formatRatio(financialData.peRatio)}
              </span>
            </div>

            {/* Price to Sales */}
            <div className="p-3 bg-slate-900/40 rounded-xl border border-gray-800/40">
              <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block">Price to Sales</span>
              <span className="text-sm font-bold text-gray-200 mt-1 block">
                {formatRatio(financialData.priceToSales)}
              </span>
            </div>

            {/* Dividend Yield */}
            <div className="p-3 bg-slate-900/40 rounded-xl border border-gray-800/40">
              <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block">Dividend Yield</span>
              <span className="text-sm font-bold text-gray-200 mt-1 block">
                {financialData.dividendYield !== undefined ? `${(financialData.dividendYield * 100).toFixed(2)}%` : '0.00%'}
              </span>
            </div>

            {/* Debt to Equity */}
            <div className="p-3 bg-slate-900/40 rounded-xl border border-gray-800/40">
              <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block">Debt to Equity</span>
              <span className="text-sm font-bold text-gray-200 mt-1 block">
                {financialData.debtToEquity !== undefined ? `${(financialData.debtToEquity).toFixed(2)}%` : 'N/A'}
              </span>
            </div>

            {/* ROE */}
            <div className="p-3 bg-slate-900/40 rounded-xl border border-gray-800/40">
              <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block">Return on Equity</span>
              <span className="text-sm font-bold text-emerald-400 mt-1 block">
                {formatPercent(keyRatios.returnOnEquity)}
              </span>
            </div>
          </div>
        </div>

        {/* Free Cash Flow & Margins summary footer */}
        <div className="mt-6 pt-4 border-t border-gray-800/60 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-gray-500" />
              Free Cash Flow:
            </span>
            <span className="font-semibold text-gray-200">
              {financialData.freeCashFlow ? formatCurrency(financialData.freeCashFlow) : 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-gray-500" />
              Profit Margin:
            </span>
            <span className="font-semibold text-gray-200">
              {formatPercent(keyRatios.profitMargin)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-gray-500" />
              Current Ratio:
            </span>
            <span className="font-semibold text-gray-200">
              {formatRatio(keyRatios.currentRatio)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
