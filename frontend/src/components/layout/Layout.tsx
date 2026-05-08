import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearToken } from '../../utils/auth';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/Core';
import { motion } from 'framer-motion';
import { BrandLogo } from '../ui/BrandLogo';

export const Layout = ({ children, email }: { children: React.ReactNode, email?: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/stocks', label: 'Stocks' },
    { to: '/feed', label: 'Live Feed' },
  ];

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-16 border-b border-outline-variant/20 bg-black/35 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 z-50 sticky top-0">
        <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
          <BrandLogo />
        </div>

        <nav className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to} className="relative px-4 py-1.5 text-xs uppercase tracking-[0.12em] text-gray-300">
                {isActive && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-full bg-primary/30 border border-primary/40"
                    transition={{ type: 'spring', stiffness: 250, damping: 24 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-3 md:space-x-4">
          {email && <span className="text-sm text-indigo-200/60 hidden lg:inline-block">{email}</span>}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="px-2">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 w-full relative">
        {children}
      </main>
    </div>
  );
};
