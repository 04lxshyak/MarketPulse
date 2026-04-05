import React from 'react';
import { cn } from './Core';

interface BadgeProps {
  type: 'BUY' | 'SELL' | 'HOLD';
  className?: string;
}

export const RecommendationBadge = ({ type, className }: BadgeProps) => {
  const styles = {
    BUY: 'bg-buy/10 text-buy border-buy/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]',
    SELL: 'bg-sell/10 text-sell border-sell/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    HOLD: 'bg-hold/10 text-hold border-hold/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
  };

  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md inline-flex items-center gap-1.5', styles[type], className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', {
        'bg-buy': type === 'BUY',
        'bg-sell': type === 'SELL',
        'bg-hold': type === 'HOLD',
      })} />
      {type}
    </span>
  );
};

export const ConfidenceRing = ({ value }: { value: number }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-10 h-10">
        <circle
          cx="20"
          cy="20"
          r={radius}
          className="stroke-surface-container-highest fill-none"
          strokeWidth="4"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          className="stroke-primary fill-none transition-all duration-1000 ease-in-out"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-primary">{value}</span>
    </div>
  );
};

export const KPICard = ({ title, value, subtext }: { title: string, value: React.ReactNode, subtext?: React.ReactNode }) => (
  <div className="glass-card flex flex-col p-5 bg-gradient-to-b from-surface-container-high/60 to-surface-container-lowest/60">
    <span className="text-xs uppercase tracking-[0.05em] text-outline text-indigo-200/60 mb-2">{title}</span>
    <div className="text-3xl font-light tracking-tight text-white">{value}</div>
    {subtext && <div className="mt-2 text-xs text-indigo-200/40">{subtext}</div>}
  </div>
);

export const RiskPill = ({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' }) => {
  const styles = {
    LOW: 'bg-buy/10 text-buy border-buy/20',
    MEDIUM: 'bg-hold/10 text-hold border-hold/20',
    HIGH: 'bg-sell/10 text-sell border-sell/20',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border tracking-wider', styles[level])}>
      {level}
    </span>
  );
};

export const SentimentIndicator = ({ type }: { type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' }) => {
  const colors = {
    POSITIVE: 'text-buy',
    NEGATIVE: 'text-sell',
    NEUTRAL: 'text-outline-variant',
  };

  return (
    <span className={cn('font-medium text-xs', colors[type])}>
      {type}
    </span>
  );
};

export const SkeletonLoader = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-surface-container-highest/50 rounded-md", className)} />
);

export const LiveTicker = ({ items }: { items: { symbol: string, type: 'BUY'|'SELL'|'HOLD' }[] }) => {
  return (
    <div className="w-full bg-surface-container-lowest/60 backdrop-blur-xl border-b border-outline-variant/20 h-10 flex items-center overflow-hidden whitespace-nowrap sticky top-0 z-40 relative">
      <div className="animate-[ticker_30s_linear_infinite] flex items-center space-x-8 px-4">
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center space-x-2 shrink-0">
             <span className="text-xs font-bold tracking-wider text-indigo-50">{item.symbol}</span>
             <RecommendationBadge type={item.type} className="scale-75" />
          </div>
        ))}
      </div>
      {/* CSS animation defined directly here for utility */}
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
};
