import { motion } from 'framer-motion';
import { LandingLayout } from '../components/layout/LandingLayout';
import { Link } from 'react-router-dom';
import { Check, Activity, BarChart2, Shield, ArrowUpRight } from 'lucide-react';

export const Landing = () => {
  return (
    <LandingLayout>
      {/* SECTION 1: HERO */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Deep Space Radial Glow */}
        <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-[radial-gradient(ellipse_at_bottom,_rgba(139,92,246,0.35),_rgba(4,0,11,0.05)_55%,_rgba(4,0,11,0.95)_85%)] pointer-events-none" />
        
        {/* Floating Stars/Particles (Simulated via static small divs for performance) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.5, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md">
            <span className="text-[10px] uppercase tracking-[0.14em] text-gray-300">New</span>
            <span className="text-xs text-gray-200">AI-enhanced portfolio allocation is live</span>
          </div>
          <h1 className="font-display text-[12vw] sm:text-[8vw] md:text-8xl lg:text-9xl tracking-tight leading-none text-white mb-6 uppercase">
            Investing.<br />Simplified.
          </h1>
          <p className="text-gray-300 text-base md:text-xl max-w-2xl mx-auto mb-10 font-medium tracking-wide">
            Your commission-free, AI-powered self-directed investment platform.
          </p>
          
          <Link to="/register">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#8b5cf6] hover:bg-[#9333ea] text-white px-8 py-4 rounded-full font-bold tracking-[0.15em] uppercase text-sm shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-colors"
            >
              Open Your Account Now
            </motion.button>
          </Link>
          
          <div className="mt-12 flex flex-col items-center opacity-70">
            <p className="text-[10px] tracking-[0.1em] uppercase font-bold text-gray-400">When you invest, your capital is at risk.</p>
            <p className="text-[10px] tracking-[0.1em] uppercase font-bold text-gray-400">Other charges may apply.</p>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: FEATURES (Glassmorphic Mockups) */}
      <section id="features" className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 z-10"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-500">Award-Winning Platform</p>
            <h2 className="font-display text-5xl md:text-6xl text-white uppercase leading-[1.1] tracking-tight">
              Build a portfolio<br />to meet your goals
            </h2>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Invest commission-free in thousands of UK, US and EU stocks with AI-guided allocation and real-time market insights.
            </p>

            <ul className="space-y-4">
              {['Live personalized watchlists', 'Unlimited commission-free trades', 'Real-time anomaly alerts', 'Smart diversification guidance'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link to="/register">
                 <button className="bg-white text-black px-6 py-3 rounded-full font-bold tracking-[0.15em] uppercase text-xs hover:bg-gray-200 transition-colors">
                  Start Now
                 </button>
              </Link>
            </div>
          </motion.div>

          {/* Right Floating Elements (Mockups) */}
          <div className="relative h-[600px] w-full mt-12 lg:mt-0">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.2),_transparent_70%)] opacity-70 block lg:hidden" />
             
             {/* Main Dashboard Card */}
             <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-1/4 left-0 right-10 z-20"
             >
                <div className="bg-surface-container-low/80 backdrop-blur-2xl border border-outline-variant/40 rounded-2xl p-6 shadow-2xl">
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-3 items-center">
                         <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                           <Activity className="w-4 h-4 text-white" />
                         </div>
                         <div>
                           <p className="text-white font-semibold text-sm">MarketPulse Matrix</p>
                           <p className="text-primary text-xs tracking-wider">AI RECOMMENDATION: BUY</p>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-end gap-2 mb-6">
                      <span className="text-4xl font-display text-white tracking-tight">$4,092.11</span>
                      <span className="text-buy text-sm font-medium mb-1">+12.4%</span>
                   </div>
                   {/* Fake Graph */}
                   <div className="h-24 w-full flex items-end justify-between gap-1 opacity-80">
                      {[40, 50, 30, 60, 45, 70, 65, 80, 75, 90, 85, 100].map((h, i) => (
                        <div key={i} className="w-full bg-primary/40 rounded-t-sm" style={{ height: `${h}%` }} />
                      ))}
                   </div>
                </div>
             </motion.div>

             {/* Small Floating Card 1 */}
             <motion.div
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute top-0 right-0 z-10 w-48 bg-surface-container-high/90 backdrop-blur-xl border border-outline-variant/30 rounded-xl p-4 shadow-xl"
             >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs text-gray-400">Risk Level</p>
                    <p className="text-sm text-white font-bold">Very Low</p>
                  </div>
                </div>
             </motion.div>
             
             {/* Small Floating Card 2 */}
             <motion.div
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
               className="absolute bottom-1/3 right-4 z-30 w-56 bg-surface-container-highest/80 backdrop-blur-md border border-primary/20 rounded-xl p-4 shadow-2xl shadow-primary/10"
             >
                 <div className="flex items-center gap-3">
                  <BarChart2 className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-xs text-gray-400 tracking-wider">Live Confidence</p>
                    <p className="text-lg text-white font-bold">98.4%</p>
                  </div>
                </div>
                 <div className="w-full h-1 bg-surface mt-3 rounded-full overflow-hidden">
                   <div className="w-[98%] h-full bg-primary rounded-full" />
                 </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ACCOUNT TYPES */}
      <motion.section
        id="accounts"
        className="py-24 px-6 border-t border-outline-variant/20"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight leading-none">
              Your Gateway To<br />Commission-Free Investing
            </h2>
            <div className="mt-8">
              <Link to="/register">
                <button className="bg-white text-black px-6 py-3 rounded-full font-bold tracking-[0.12em] uppercase text-xs hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
                  Open Your Account
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          <div className="divide-y divide-outline-variant/30 border border-outline-variant/30 rounded-2xl bg-surface/30 backdrop-blur-xl">
            {[
              { name: 'Stock and shares ISA', desc: 'Tax-efficient account with annual allowances and long-term growth focus.' },
              { name: 'Personal pension', desc: 'Save for retirement with flexible contributions and automated rebalancing.' },
              { name: 'General Investment Account', desc: 'A flexible account for building and managing your wider portfolio.' },
            ].map((item, idx) => (
              <motion.div
                key={item.name}
                className="p-6 md:p-8 flex items-start justify-between gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <div>
                  <p className="text-xl text-white">{item.name}</p>
                  <p className={`text-sm text-gray-400 mt-2 max-w-2xl ${idx === 0 ? 'block' : 'hidden md:block'}`}>{item.desc}</p>
                </div>
                <button className="text-gray-300 hover:text-white text-2xl leading-none">{idx === 0 ? '-' : '+'}</button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 4: INTELLIGENCE STRIP */}
      <motion.section
        id="intelligence"
        className="py-24 px-6"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Realtime Signals', value: '24/7', desc: 'Continuous recommendation updates with live confidence scoring.' },
              { title: 'Tracked Assets', value: '600+', desc: 'Broad market coverage for US and global equities.' },
              { title: 'Low Latency Feed', value: '<1s', desc: 'Fast delivery of insights directly to your dashboard.' },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                className="rounded-2xl border border-outline-variant/30 bg-surface-container-low/40 p-6 backdrop-blur-xl"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">{item.title}</p>
                <p className="font-display text-5xl mt-3">{item.value}</p>
                <p className="text-sm text-gray-400 mt-3">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

    </LandingLayout>
  );
};
