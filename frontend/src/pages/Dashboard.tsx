import React, { useState } from 'react';
import { useRecommendations, useCurrentUser } from '../hooks/queries';
import { Layout } from '../components/layout/Layout';
import { KPICard, LiveTicker, RecommendationBadge, ConfidenceRing, SentimentIndicator } from '../components/ui/DomainComponents';
import { Card, Input, Button } from '../components/ui/Core';
import { formatTime } from '../utils/formatters';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const Dashboard = () => {
  const { data: user } = useCurrentUser();
  const [symbolSearch, setSymbolSearch] = useState('');
  const [activeSymbol, setActiveSymbol] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);

  const { data, isLoading } = useRecommendations(activeSymbol, page, 10, 'timestamp', 'desc', 10000);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSymbol(symbolSearch || undefined);
    setPage(0);
  };

  const recs = data?.content || [];
  
  // Calculate KPIs
  const total = data?.totalElements || 0;
  const buyCount = recs.filter(r => r.recommendation === 'BUY').length;
  const sellCount = recs.filter(r => r.recommendation === 'SELL').length;
  const holdCount = recs.filter(r => r.recommendation === 'HOLD').length;
  const buyPct = recs.length ? Math.round((buyCount / recs.length) * 100) : 0;
  const sellPct = recs.length ? Math.round((sellCount / recs.length) * 100) : 0;
  
  const avgConf = recs.length 
    ? Math.round(recs.reduce((acc, curr) => acc + curr.confidence, 0) / recs.length) 
    : 0;

  const pieData = [
    { name: 'BUY', value: buyCount, color: '#22c55e' },
    { name: 'HOLD', value: holdCount, color: '#f59e0b' },
    { name: 'SELL', value: sellCount, color: '#ef4444' },
  ];

  return (
    <Layout email={user?.email}>
      {recs.length > 0 && (
         <LiveTicker items={recs.slice(0, 10).map(r => ({ symbol: r.symbol, type: r.recommendation }))} />
      )}
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Signals" value={total} subtext="Tracked in current filter" />
          <KPICard title="Buy Sentiment" value={`${buyPct}%`} subtext={<span className="text-buy">Based on latest page</span>} />
          <KPICard title="Sell Pressure" value={`${sellPct}%`} subtext={<span className="text-sell">Based on latest page</span>} />
          <KPICard title="Avg Confidence" value={`${avgConf}%`} subtext={<ConfidenceRing value={avgConf} />} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Latest Recommendations</h2>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-outline-variant" />
                  <Input 
                    placeholder="Filter Symbol (e.g. AAPL)" 
                    className="pl-9 w-48"
                    value={symbolSearch}
                    onChange={(e) => setSymbolSearch(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="outline">Search</Button>
              </form>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-surface-container-low/50 text-indigo-200/60">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Symbol</th>
                    <th className="px-4 py-3">Signal</th>
                    <th className="px-4 py-3">Sentiment</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={5} className="text-center py-8 text-outline-variant">Loading signals...</td></tr>
                  ) : recs.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-outline-variant">No recommendations found.</td></tr>
                  ) : (
                    recs.map((rec) => (
                      <tr key={rec.id} className="border-b border-outline-variant/10 hover:bg-surface-container-high/50 transition-colors">
                        <td className="px-4 py-4 font-bold text-white">
                          <Link to={`/symbol/${rec.symbol}`} className="hover:underline">{rec.symbol}</Link>
                        </td>
                        <td className="px-4 py-4"><RecommendationBadge type={rec.recommendation} /></td>
                        <td className="px-4 py-4">
                           <SentimentIndicator type={rec.sentiment} />
                        </td>
                        <td className="px-4 py-4 flex items-center gap-2">
                          <div className="w-24 h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${rec.confidence}%` }} />
                          </div>
                          <span className="text-xs">{rec.confidence}%</span>
                        </td>
                        <td className="px-4 py-4 text-indigo-200/60">{formatTime(rec.timestamp)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {data && data.totalPages > 1 && (
               <div className="flex justify-between items-center mt-4 text-sm text-indigo-200/60">
                 <span>Page {data.number + 1} of {data.totalPages}</span>
                 <div className="space-x-2">
                   <Button variant="outline" size="sm" disabled={data.number === 0} onClick={() => setPage(p => p - 1)}>Prev</Button>
                   <Button variant="outline" size="sm" disabled={data.number >= data.totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
                 </div>
               </div>
            )}
          </Card>
          
          <div className="space-y-6">
            <Card>
              <h3 className="text-sm uppercase tracking-wider text-outline-variant mb-4 flex items-center justify-between">
                Signal Distribution
                 <Link to="/feed" className="text-primary hover:underline text-xs normal-case">Live Feed →</Link>
              </h3>
              <div className="h-64">
                {recs.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#131b2e', borderColor: '#464554', borderRadius: '8px', color: 'white' }} 
                        itemStyle={{ color: 'white' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-outline-variant text-sm">No data</div>
                )}
              </div>
            </Card>
            
            <Card>
               <h3 className="text-sm uppercase tracking-wider text-outline-variant mb-4 flex items-center justify-between">
                Explore Market
                 <Link to="/stocks" className="text-primary hover:underline text-xs normal-case">All Stocks →</Link>
              </h3>
              <p className="text-sm text-indigo-200/60 leading-relaxed">
                Dive deeper into specific market assets by exploring the global stock list or typing a direct symbol above.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};
