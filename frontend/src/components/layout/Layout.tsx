import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../../utils/auth';
import { Activity, LogOut } from 'lucide-react';
import { Button } from '../ui/Core';

export const Layout = ({ children, email }: { children: React.ReactNode, email?: string }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b border-outline-variant/20 bg-surface-container-low/50 backdrop-blur-md flex items-center justify-between px-6 z-50 stick top-0">
        <div className="flex items-center space-x-3 text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>
           <img src="/logo.png" alt="MarketPulse Logo" className="h-8 w-auto object-contain" />
           <span className="font-bold text-xl tracking-tight text-white">Market<span className="text-primary">Pulse</span></span>
        </div>
        
        {email && (
          <div className="flex items-center space-x-4">
             <span className="text-sm text-indigo-200/60 hidden sm:inline-block">{email}</span>
             <Button variant="ghost" size="sm" onClick={handleLogout} className="px-2">
               <LogOut className="h-4 w-4 mr-2" />
               Logout
             </Button>
          </div>
        )}
      </header>
      <main className="flex-1 w-full relative">
        {children}
      </main>
    </div>
  );
};
