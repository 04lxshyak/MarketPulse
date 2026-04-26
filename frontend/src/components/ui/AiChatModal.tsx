import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, X, BrainCircuit, Activity, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';
import { useAIQuery } from '../../hooks/queries';
import { RecommendationBadge, SentimentIndicator } from './DomainComponents';

export const AiChatModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const { mutate: askAi, isPending, data: response, error } = useAIQuery();

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    askAi({ query });
  };

  const getIntentIcon = (intent?: string) => {
    switch (intent) {
      case 'TECHNICALS': return <Activity className="w-5 h-5 text-primary" />;
      case 'NEWS': return <Search className="w-5 h-5 text-indigo-400" />;
      case 'GENERAL_KNOWLEDGE': return <BookOpen className="w-5 h-5 text-emerald-400" />;
      case 'ERROR': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <BrainCircuit className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="pointer-events-auto w-full max-w-2xl bg-[#0f1423] border border-outline-variant/30 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-gradient-to-r from-surface-container-low to-transparent">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-xl">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white tracking-wide">MarketPulse AI Agent</h2>
                    <p className="text-xs text-indigo-200/60">Powered by Gemini</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-indigo-200/60 hover:text-white" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="p-6 h-[400px] overflow-y-auto bg-gradient-to-b from-transparent to-surface-container-highest/20 custom-scrollbar">
                
                {/* Intro message */}
                {!response && !isPending && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                    <BrainCircuit className="w-12 h-12 text-primary/50" />
                    <div>
                      <p className="text-white font-medium">Ask anything about the markets!</p>
                      <p className="text-sm text-indigo-200/60 max-w-sm mt-2">
                        You can ask for technical analysis of a symbol, the latest news sentiment, or general financial concepts.
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isPending && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center animate-pulse">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="bg-surface-container-high rounded-2xl rounded-tl-none p-4 w-3/4 animate-pulse">
                      <div className="h-4 bg-outline-variant/30 rounded w-full mb-3" />
                      <div className="h-4 bg-outline-variant/30 rounded w-5/6 mb-3" />
                      <div className="h-4 bg-outline-variant/30 rounded w-4/6" />
                    </div>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-200 text-sm flex gap-3 items-start">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>Failed to reach the AI Agent. Ensure the backend is running.</p>
                  </div>
                )}

                {/* Response State */}
                {response && !isPending && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* User message block */}
                    <div className="flex items-start justify-end gap-3">
                       <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
                        <p className="text-indigo-100 text-sm">{query}</p>
                       </div>
                    </div>

                    {/* AI message block */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        {getIntentIcon(response.intent)}
                      </div>
                      
                      <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl rounded-tl-none p-5 flex-1 shadow-lg">
                        
                        {/* Meta Tags (Intent/Confidence) */}
                        <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-outline-variant/10 pb-3">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-surface-container-highest rounded text-indigo-300">
                             {response.intent.replace('_', ' ')}
                          </span>
                          {response.symbol !== 'GENERAL' && response.symbol !== 'UNKNOWN' && (
                             <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                              {response.symbol}
                             </span>
                          )}
                          {(response.intent === 'TECHNICALS' || response.intent === 'NEWS') && (
                            <React.Fragment>
                              <div className="h-3 w-px bg-outline-variant/30" />
                              <RecommendationBadge type={response.recommendation as any} />
                              <SentimentIndicator type={response.sentiment as any} />
                              <div className="ml-auto flex items-center gap-1.5 text-xs text-indigo-200/60 bg-surface-container-highest px-2 py-1 rounded">
                                <Activity className="w-3 h-3" />
                                {response.confidence}% Confidence
                              </div>
                            </React.Fragment>
                          )}
                        </div>

                        {/* Answer */}
                        <div className="text-sm text-indigo-50 leading-relaxed font-medium">
                          {response.answer}
                        </div>
                        
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-surface-container-low border-t border-outline-variant/20">
                <form onSubmit={handleAsk} className="relative flex items-center gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="E.g., What does the RSI tell us about INFY.NS?"
                    className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl pl-4 pr-12 py-3.5 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder-indigo-200/40"
                  />
                  <button 
                    type="submit" 
                    disabled={isPending || !query.trim()}
                    className="absolute right-2 p-2 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary text-white rounded-lg transition-colors flex items-center justify-center group"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>
              </div>

            </motion.div>
          </div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
