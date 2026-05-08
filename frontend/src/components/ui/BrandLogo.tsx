import { cn } from './Core';

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

export const BrandLogo = ({ compact = false, className }: BrandLogoProps) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img src="/logo.png" alt="MarketPulse Logo" className="h-8 w-auto object-contain" />
      {!compact && (
        <span className="font-bold text-xl tracking-tight text-white">
          Market<span className="text-primary">Pulse</span>
        </span>
      )}
    </div>
  );
};

