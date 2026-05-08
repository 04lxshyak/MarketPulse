import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../ui/BrandLogo';

export const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#04000b] text-white font-sans overflow-x-hidden selection:bg-primary/30">
      
      {/* Absolute top navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between max-w-7xl left-1/2 -translate-x-1/2 bg-black/35 backdrop-blur-xl border-b border-white/10">
        
        {/* Brand */}
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <BrandLogo />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-[11px] font-bold tracking-[0.15em] text-gray-400 uppercase">
          <a href="#features" className="hover:text-white transition-colors">Platform</a>
          <a href="#accounts" className="hover:text-white transition-colors">Accounts</a>
          <a href="#intelligence" className="hover:text-white transition-colors">Intelligence</a>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-[11px] font-bold tracking-[0.1em] text-gray-400 hover:text-white uppercase transition-colors">
            Log In
          </Link>
          <Link to="/register" className="bg-primary hover:bg-primary_hover text-white text-[11px] font-bold tracking-[0.1em] uppercase px-5 py-2.5 rounded shadow-lg shadow-primary/20 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative w-full">
        {children}
      </main>

    </div>
  );
};
