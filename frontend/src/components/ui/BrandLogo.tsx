import { cn } from './Core';

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

export const BrandLogo = ({ compact = false, className }: BrandLogoProps) => {
  if (compact) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="font-bold text-xl tracking-tight text-white">
        Market<span className="text-primary">Pulse</span>
      </span>
    </div>
  );
};
