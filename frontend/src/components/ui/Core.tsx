import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
  return (
    <div className={cn('glass-card p-6 relative overflow-hidden', className)} style={style}>
      {/* Glossy top-edge reflection */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </div>
  );
};

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-outline-variant/40 bg-surface-container-low/50 px-3 py-2 text-sm text-indigo-50 placeholder:text-outline-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors backdrop-blur-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
);
Input.displayName = "Input";

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-br from-primary to-primary-container text-surface hover:brightness-110",
      outline: "border border-outline-variant text-indigo-50 hover:bg-surface-container-highest",
      ghost: "text-indigo-50 hover:bg-surface-container-highest/50",
    };
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-8 text-lg"
    };
    
    return (
      <button
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
