
import { useParams, Link } from 'react-router-dom';
import { useSymbolData, useRecommendations } from '../hooks/queries';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Core';
import { RecommendationBadge, ConfidenceRing } from '../components/ui/DomainComponents';
import { formatCurrency, formatNumber, formatTime, formatDate } from '../utils/formatters';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';

export const SymbolDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { data: stock, isLoading: isStockLoading } = useSymbolData(symbol || '', 15000);
  const { data: recsObj, isLoading: isRecsLoading } = useRecommendations(symbol, 0, 50, 'timestamp', 'asc');
  
  const recommendations = recsObj?.content || [];
  const latestRec = recommendations.length > 0 ? recommendations[recommendations.length - 1] : null;

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-outline-variant hover:text-indigo-50 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">{symbol}</h1>
            <p className="text-indigo-200/60 mt-1">Real-time artificial intelligence assessment</p>
          </div>
          {latestRec && (
             <div className="flex items-center gap-4 bg-surface-container-high/50 px-6 py-3 rounded-2xl border border-outline-variant/20 backdrop-blur-xl">
               <div className="flex flex-col">
                 <span className="text-xs uppercase text-indigo-200/60 mb-1">Current Stance</span>
                 <RecommendationBadge type={latestRec.recommendation} />
               </div>
               <div className="h-10 w-px bg-outline-variant/40 mx-2" />
               <div className="flex flex-col items-center">
                 <span className="text-xs uppercase text-indigo-200/60 mb-2">Confidence</span>
                 <ConfidenceRing value={latestRec.confidence} />
               </div>
             </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           <Card className="lg:col-span-1 space-y-6">
             <h3 className="text-sm uppercase tracking-wider text-outline-variant">Market Data</h3>
             {isStockLoading ? (
               <div className="text-sm text-outline-variant">Loading quote...</div>
             ) : (
               <div className="space-y-4">
                 <div>
                   <div className="text-xs text-indigo-200/60">Current Price</div>
                   <div className="text-2xl font-light text-white">{formatCurrency(stock?.price)}</div>
                 </div>
                 <div className="h-px w-full bg-outline-variant/20" />
                 <div>
                   <div className="text-xs text-indigo-200/60">Day High</div>
                   <div className="text-lg text-indigo-50">{formatCurrency(stock?.high)}</div>
                 </div>
                 <div>
                   <div className="text-xs text-indigo-200/60">Day Low</div>
                   <div className="text-lg text-indigo-50">{formatCurrency(stock?.low)}</div>
                 </div>
                 <div className="h-px w-full bg-outline-variant/20" />
                 <div>
                   <div className="text-xs text-indigo-200/60">Volume</div>
                   <div className="text-lg text-indigo-50">{formatNumber(stock?.volume)}</div>
                 </div>
               </div>
             )}
           </Card>

           <Card className="lg:col-span-3">
             <h3 className="text-sm uppercase tracking-wider text-outline-variant mb-6">Confidence Target History</h3>
             <div className="h-72">
               {isRecsLoading ? (
                 <div className="flex justify-center items-center h-full text-outline-variant text-sm">Building chart model...</div>
               ) : recommendations.length < 2 ? (
                 <div className="flex justify-center items-center h-full text-outline-variant text-sm">Not enough historical data to map trends.</div>
               ) : (
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={recommendations.map(r => ({ ...r, timeLabel: formatDate(r.timestamp) }))}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#2d3449" vertical={false} />
                     <XAxis dataKey="timeLabel" stroke="#908fa0" fontSize={12} tickMargin={10} minTickGap={30} />
                     <YAxis domain={[0, 100]} stroke="#908fa0" fontSize={12} tickFormatter={(val) => `${val}%`} />
                     <Tooltip 
                       contentStyle={{ backgroundColor: '#131b2e', borderColor: '#464554', borderRadius: '8px', color: 'white' }} 
                     />
                     <Line 
                       type="monotone" 
                       dataKey="confidence" 
                       stroke="#c0c1ff" 
                       strokeWidth={3}
                       dot={{ fill: '#c0c1ff', strokeWidth: 0, r: 4 }}
                       activeDot={{ r: 6, stroke: '#8083ff', strokeWidth: 2 }} 
                     />
                   </LineChart>
                 </ResponsiveContainer>
               )}
             </div>
           </Card>
        </div>
        
        <Card>
          <h3 className="text-sm uppercase tracking-wider text-outline-variant mb-4">Activity Log</h3>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-surface-container-low/50 text-indigo-200/60">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Event Time</th>
                    <th className="px-4 py-3">Signal</th>
                    <th className="px-4 py-3">Sentiment</th>
                    <th className="px-4 py-3 w-1/2">Algorithmic Reasoning</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.slice().reverse().map(rec => (
                     <tr key={rec.id} className="border-b border-outline-variant/10">
                        <td className="px-4 py-4 text-indigo-50 font-medium">
                          {formatDate(rec.timestamp)} <span className="text-xs text-outline-variant ml-1">{formatTime(rec.timestamp)}</span>
                        </td>
                        <td className="px-4 py-4"><RecommendationBadge type={rec.recommendation} /></td>
                        <td className="px-4 py-4 text-indigo-200/80">{rec.sentiment}</td>
                        <td className="px-4 py-4 text-indigo-200/60">{rec.reason}</td>
                     </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
