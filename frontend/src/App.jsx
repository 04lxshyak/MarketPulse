import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { 
  Search, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Layers,
  ArrowRight,
  ChevronRight,
  Activity,
  Star,
  Users
} from 'lucide-react'

const API_BASE = 'http://localhost:8083/api/recommendations'

const fetchRecommendations = async (symbol = '', page = 0) => {
  try {
    const url = symbol ? `${API_BASE}?symbol=${symbol}&page=${page}&size=10` : `${API_BASE}?page=${page}&size=10`
    const response = await axios.get(url)
    return response.data
  } catch (err) {
    console.error("API Error:", err)
    return { content: [] }
  }
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  }
}

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

function App() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search, page])

  const loadData = async (symbol) => {
    setLoading(true)
    const data = await fetchRecommendations(symbol, page)
    setRecommendations(data.content || [])
    setLoading(false)
  }

  return (
    <div className="app-wrapper">
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <div className="bg-mesh" />

      {/* Navbar */}
      <motion.nav 
        className="navbar"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <div className="logo">
          <motion.div 
            className="logo-icon"
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Activity size={20} />
          </motion.div>
          <span className="outfit">MarketPulse</span>
        </div>
        <div className="nav-links">
          {['Terminal', 'How it works', 'Analytics', 'Enterprise'].map(link => (
            <motion.a 
              key={link} 
              href="#" 
              className="nav-link"
              whileHover={{ y: -2 }}
            >
              {link}
            </motion.a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <motion.button 
            className="nav-btn" 
            style={{ background: 'transparent', color: 'white' }}
            whileHover={{ opacity: 0.8 }}
          >
            Sign In
          </motion.button>
          <motion.button 
            className="nav-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore App
          </motion.button>
        </div>
      </motion.nav>

      <div className="container">
        {/* Hero Section */}
        <motion.section 
          className="hero"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h1 className="gradient-text outfit" variants={itemVariants}>
            Take Control of<br />Your Market Insights
          </motion.h1>
          <motion.p variants={itemVariants}>
            MarketPulse offers a seamless, secure experience for monitoring real-time stock analysis. Instant insights and optimized metrics powered by advanced AI.
          </motion.p>
          <motion.button 
            className="cta-btn outfit" 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Launch Terminal <ArrowRight size={18} />
          </motion.button>
          
          <motion.div 
            className="hero-social"
            variants={itemVariants}
            style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '-8px' }}>
               {[1,2,3,4].map(i => (
                 <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: '#111', border: '2px solid var(--primary)', marginLeft: i > 1 ? -12 : 0, overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={12} color="var(--primary)" />
                    </div>
                 </div>
               ))}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                 {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="var(--primary)" color="var(--primary)" />)}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Trusted by 12,000+ Institutional Clients</span>
            </div>
          </motion.div>
        </motion.section>

        {/* Main Dashboard Card */}
        <motion.main 
          className="main-card glass-effect"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="card-header">
            <div>
              <span className="outfit" style={{ color: 'var(--primary)', fontSize: '0.75rem', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>AI TERMINAL V.2.0</span>
              <h2 className="outfit" style={{ fontSize: '2.5rem', fontWeight: 700 }}>Market Overview</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div className="search-container" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <Search style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} size={16} />
                <input 
                  type="text" 
                  placeholder="Filter market assets..." 
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '1rem', color: 'white', outline: 'none', width: '280px', fontSize: '0.875rem' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ background: 'rgba(0,240,160,0.1)', color: 'var(--primary)', padding: '0.5rem 1.2rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
              >
                <div className="pulse-dot" /> LIVE MARKET ANALYTICS
              </motion.div>
            </div>
          </div>
          
          <div className="card-content">
            <div className="chart-area">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 500 }}>Aggregated Market Alpha</span>
                  <div style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                    +42.18% <TrendingUp size={24} color="var(--primary)" inline="true" style={{ marginBottom: 4 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignSelf: 'flex-start', background: 'rgba(255,255,255,0.03)', padding: '0.3rem', borderRadius: '0.8rem' }}>
                   {['1D', '5D', '1M', '6M', 'YTD', 'ALL'].map(t => (
                     <motion.button 
                       key={t} 
                       whileHover={{ background: 'rgba(255,255,255,0.05)' }}
                       style={{ padding: '0.5rem 1rem', borderRadius: '0.6rem', border: 'none', background: t === '1M' ? 'var(--primary)' : 'transparent', color: t === '1M' ? 'black' : 'var(--text-dim)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                     >
                       {t}
                     </motion.button>
                   ))}
                </div>
              </div>
              
              {/* Animated SVG Chart */}
              <div style={{ width: '100%', height: '280px', position: 'relative', marginTop: '1rem' }}>
                <svg viewBox="0 0 800 200" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path 
                    d="M0,160 Q100,150 200,170 T400,110 T600,130 T800,50" 
                    fill="none" 
                    stroke="var(--primary)" 
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <motion.path 
                    d="M0,160 Q100,150 200,170 T400,110 T600,130 T800,50 L800,200 L0,200 Z" 
                    fill="url(#chartGrad)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                  />
                </svg>
              </div>
            </div>
            
            <aside className="sidebar-tools">
               <h3 className="outfit" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Alpha Intelligence</h3>
               <motion.div 
                 className="glass-effect"
                 whileHover={{ y: -5, borderColor: 'var(--primary)' }}
                 style={{ background: 'rgba(255,255,255,0.02)', padding: '1.8rem', borderRadius: '1.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}
               >
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 600 }}>Top Performer Signal</span>
                    <TrendingUp size={16} color="var(--primary)" />
                 </div>
                 <div style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>RELIANCE.NS</div>
                 <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.5px' }}>STRONG OVERWEIGHT</div>
                 <motion.button 
                   whileTap={{ scale: 0.95 }}
                   style={{ width: '100%', marginTop: '1.8rem', background: 'white', border: 'none', color: 'black', padding: '1rem', borderRadius: '1rem', fontWeight: 800, fontSize: '0.875rem' }}
                 >
                   Deep Dive
                 </motion.button>
               </motion.div>
               
               <motion.div 
                 whileHover={{ x: 5 }}
                 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '0.5rem 0' }}
               >
                 <span className="outfit" style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Risk Repartition</span>
                 <ChevronRight size={18} color="var(--text-muted)" />
               </motion.div>
            </aside>
          </div>
        </motion.main>

        {/* Features Section */}
        <motion.section 
          className="features-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div className="feature-card" variants={itemVariants} whileHover={{ y: -10 }}>
            <Shield className="feature-icon" size={28} />
            <h3 className="outfit">Institution-Grade</h3>
            <p>Your analysis vectors are processed through multi-layered cryptographic isolation.</p>
          </motion.div>
          <motion.div className="feature-card" variants={itemVariants} whileHover={{ y: -10 }}>
             <Zap className="feature-icon" size={28} />
             <h3 className="outfit">Sub-ms Latency</h3>
             <p>Real-time edge processing via Gemini 1.5 Pro and dedicated Kafka backbones.</p>
          </motion.div>
          <motion.div className="feature-card" variants={itemVariants} whileHover={{ y: -10 }}>
             <BarChart3 className="feature-icon" size={28} />
             <h3 className="outfit">Signal Optimization</h3>
             <p>Optimized data telemetry points eliminate noise for high-conviction decision making.</p>
          </motion.div>
          <motion.div className="feature-card" variants={itemVariants} whileHover={{ y: -10 }}>
             <Layers className="feature-icon" size={28} />
             <h3 className="outfit">Infinite Scaling</h3>
             <p>Architecture built for global distribution, capable of monitoring 1M+ instrument streams.</p>
          </motion.div>
        </motion.section>

        {/* Recommendation Grid Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          style={{ paddingBottom: '10rem' }}
        >
           <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
              <div>
                <h2 className="outfit" style={{ fontSize: '2.8rem', fontWeight: 800 }}>Intelligence Grid</h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>Active probabilistic metrics across domestic and global equity markets.</p>
              </div>
              <motion.a 
                href="#" 
                whileHover={{ x: 5, color: 'var(--primary)' }}
                style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, background: 'rgba(255,255,255,0.03)', padding: '0.8rem 1.5rem', borderRadius: '1rem' }}
              >
                Full Analytics <ArrowRight size={16} />
              </motion.a>
           </motion.div>

           <motion.div className="rec-grid" variants={containerVariants}>
             <AnimatePresence mode="popLayout">
               {loading ? (
                 <motion.div 
                   key="loading"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   style={{ textAlign: 'center', padding: '6rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px' }}
                 >
                   <Activity size={40} className="feature-icon" style={{ margin: '0 auto 1.5rem', display: 'block' }} />
                   INITIALIZING TELEMETRY...
                 </motion.div>
               ) : recommendations.length > 0 ? (
                 recommendations.map((rec, idx) => (
                   <motion.div 
                     key={rec.id} 
                     className="rec-item outfit"
                     variants={itemVariants}
                     whileHover={{ x: 10, borderColor: 'rgba(0, 240, 160, 0.4)', background: 'rgba(0, 240, 160, 0.02)' }}
                   >
                     <div className="symbol-badge">
                        <div className="symbol-avatar">{rec.symbol.substring(0,2)}</div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white' }}>{rec.symbol}</div>
                     </div>
                     <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '3rem', fontFamily: 'Inter' }}>
                       {rec.reason}
                     </div>
                     <div style={{ textAlign: 'right' }}>
                       <span className={`badge badge-${rec.recommendation.toLowerCase()}`}>
                         {rec.recommendation === 'BUY' && <TrendingUp size={12} />}
                         {rec.recommendation}
                       </span>
                     </div>
                     <div style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                       {rec.confidence}<span style={{ fontSize: '0.7rem' }}>%</span>
                     </div>
                     <div style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>
                       {new Date(rec.timestamp).toLocaleTimeString()}
                     </div>
                   </motion.div>
                 ))
               ) : (
                 <motion.div 
                    key="empty"
                    variants={itemVariants}
                    className="glass-effect" 
                    style={{ padding: '5rem', borderRadius: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}
                 >
                   <Layers size={48} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                   <p style={{ fontSize: '1.125rem' }}>No active signals detected for query "<strong>{search}</strong>"</p>
                 </motion.div>
               )}
             </AnimatePresence>
           </motion.div>
        </motion.section>
      </div>
    </div>
  )
}

export default App
