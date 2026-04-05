
import { useStocks } from '../hooks/queries';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Core';
import { Link } from 'react-router-dom';
import { formatCurrency, formatNumber } from '../utils/formatters';

export const Stocks = () => {
  const { data: stocks, isLoading } = useStocks();

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-white tracking-tight">Market Assets</h1>
          <p className="text-indigo-200/60 mt-2">Tracked symbols in the MarketPulse network.</p>
        </div>

        {isLoading ? (
           <div className="text-outline_variant text-center py-12">Fetching stock universe...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stocks?.map((stock) => (
              <Link to={`/symbol/${stock.symbol}`} key={stock.symbol}>
                <Card className="hover:bg-surface-container-high/60 transition-all cursor-pointer group">
                  <div className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                    {stock.symbol}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="text-indigo-200/60">Price</div>
                    <div className="text-right text-indigo-50">{formatCurrency(stock.price)}</div>
                    <div className="text-indigo-200/60">Volume</div>
                    <div className="text-right text-indigo-50">{formatNumber(stock.volume)}</div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
