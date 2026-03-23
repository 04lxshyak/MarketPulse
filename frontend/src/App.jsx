import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Search, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Layers,
  ArrowRight,
  ChevronRight,
  TrendingDown,
  Activity,
  Calendar,
  Wallet
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

function App() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

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
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon"><Activity size={20} /></div>
          <span>MarketPulse</span>
        </div>
        <div className="nav-links">
          <a href="#" className="nav-link">Why MarketPulse?</a>
          <a href="#" className="nav-link">Terminal</a>
          <a href="#" className="nav-link">How it works</a>
          <a href="#" className="nav-link">FAQ</a>
        </div>
        <div>
          <button className="nav-btn" style={{ background: 'transparent', color: 'white', marginRight: '1rem' }}>Login</button>
          <button className="nav-btn">Create account</button>
        </div>
      </nav>

      <div className="container">
        {/* Hero Section */}
        <section className="hero animate-in">
          <h1 className="gradient-text">Take Control of<br />Your Market Insights</h1>
          <p>MarketPulse offers a seamless, secure experience for monitoring real-time stock analysis. Instant insights and optimized metrics.</p>
          <button className="cta-btn">
            Get started <ArrowRight size={18} />
          </button>
          
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', overlap: 'margin-left' }}>
               {[1,2,3,4,5].map(i => (
                 <div key={i} style={{ width: 24, height: 24, borderRadius: '50%', background: '#333', border: '2px solid black', marginLeft: i > 1 ? -8 : 0 }} />
               ))}
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>Trusted by 10k+ traders ⭐⭐⭐⭐⭐ 4.9/5</span>
          </div>
        </section>

        {/* Main Dashboard Card */}
        <main className="main-card glass-effect animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="card-header">
            <div>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Trading Dashboard</span>
              <h2 className="outfit" style={{ fontSize: '2.5rem' }}>Main Dashboard</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="search-container" style={{ marginBottom: '1rem' }}>
                <Search style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} size={16} />
                <input 
                  type="text" 
                  placeholder="Search assets..." 
                  style={{ background: '#111', border: '1px solid #222', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '0.8rem', color: 'white', outline: 'none', width: '250px' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div style={{ background: 'rgba(0,240,160,0.1)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={14} /> BULLISH TREND
              </div>
            </div>
          </div>
          
          <div className="card-content">
            <div className="chart-area">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Aggregated Sentiment Score</span>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>84.32 <span style={{ color: 'var(--primary)', fontSize: '1rem' }}>+12.5%</span></div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   {['1D', '1W', '1M', '1Y', 'ALL'].map(t => (
                     <button key={t} style={{ padding: '0.4rem 0.8rem', borderRadius: '0.5rem', background: t === '1M' ? '#222' : 'transparent', border: 'none', color: t === '1M' ? 'white' : 'var(--text-dim)', fontSize: '0.75rem', cursor: 'pointer' }}>{t}</button>
                   ))}
                </div>
              </div>
              
              {/* Mock Chart Visualization */}
              <div style={{ width: '100%', height: '250px', position: 'relative', marginTop: '2rem' }}>
                <svg viewBox="0 0 800 200" style={{ width: '100%', height: '100%' }}>
                  <path d="M0,150 Q100,140 200,160 T400,100 T600,120 T800,40" fill="none" stroke="var(--primary)" strokeWidth="3" />
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                  <path d="M0,150 Q100,140 200,160 T400,100 T600,120 T800,40 L800,200 L0,200 Z" fill="url(#chartGrad)" />
                </svg>
              </div>
            </div>
            
            <aside className="sidebar-tools">
               <h3 className="outfit" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Quick actions</h3>
               <div style={{ background: '#111', padding: '1.5rem', borderRadius: '1.2rem', marginBottom: '1.5rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Latest Signal</span>
                    <TrendingUp size={14} color="var(--primary)" />
                 </div>
                 <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>RELIANCE.NS</div>
                 <div style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800 }}>STRONG BUY</div>
                 <button style={{ width: '100%', marginTop: '1.5rem', background: 'var(--primary)', border: 'none', color: 'black', padding: '0.8rem', borderRadius: '0.8rem', fontWeight: 800, fontSize: '0.875rem' }}>Visualize Signal</button>
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span className="outfit" style={{ fontSize: '1rem' }}>Repartition</span>
                 <ChevronRight size={18} color="var(--text-dim)" />
               </div>
            </aside>
          </div>
        </main>

        {/* Features Section */}
        <section className="features-grid animate-in" style={{ animationDelay: '0.4s' }}>
          <div className="feature-card glass-effect">
            <Shield className="feature-icon" size={24} />
            <h3 className="outfit">Maximum Security</h3>
            <p>Your market data is processed with state-of-the-art encryption protocols.</p>
          </div>
          <div className="feature-card glass-effect">
             <Zap className="feature-icon" size={24} />
             <h3 className="outfit">Instant Analysis</h3>
             <p>Gemini AI processes live Kafka streams in milliseconds for real-time edge.</p>
          </div>
          <div className="feature-card glass-effect">
             <BarChart3 className="feature-icon" size={24} />
             <h3 className="outfit">Optimized Fees</h3>
             <p>Benefit from direct data feeds and low-latency infrastructure.</p>
          </div>
          <div className="feature-card glass-effect">
             <Layers className="feature-icon" size={24} />
             <h3 className="outfit">Premium Interface</h3>
             <p>An elegant, intuitive design that's built for professionals and easy for beginners.</p>
          </div>
        </section>

        {/* Asset List Section */}
        <section className="animate-in" style={{ animationDelay: '0.6s', paddingBottom: '8rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <h2 className="outfit" style={{ fontSize: '2.5rem' }}>Market Intel Grid</h2>
                <p style={{ color: 'var(--text-dim)' }}>Monitor individual stock performance and sentiment metrics.</p>
              </div>
              <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                View all market <ArrowRight size={16} />
              </a>
           </div>

           <div className="rec-grid">
             {loading ? (
               <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>Scanning Market Streams...</div>
             ) : recommendations.length > 0 ? (
               recommendations.map((rec) => (
                 <div key={rec.id} className="rec-item glass-effect">
                   <div className="symbol-badge">
                      <div className="symbol-avatar">{rec.symbol.substring(0,2)}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800 }}>{rec.symbol}</div>
                   </div>
                   <div style={{ fontSize: '0.875rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '2rem' }}>
                     {rec.reason}
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <span className={`badge badge-${rec.recommendation.toLowerCase()}`}>
                       {rec.recommendation}
                     </span>
                   </div>
                   <div style={{ textAlign: 'right', fontWeight: 700 }}>
                     {rec.confidence}%
                   </div>
                   <div style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                     {new Date(rec.timestamp).toLocaleTimeString()}
                   </div>
                 </div>
               ))
             ) : (
               <div className="glass-effect" style={{ padding: '4rem', borderRadius: '1.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                 No signals detected for search query.
               </div>
             )}
           </div>
        </section>
      </div>
    </div>
  )
}

export default App
