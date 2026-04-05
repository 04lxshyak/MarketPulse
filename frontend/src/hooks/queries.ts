import { useQuery } from '@tanstack/react-query';
import { fetchRecommendations } from '../services/recommendations';
import { fetchAllStocks, fetchStockBySymbol } from '../services/stocks';
import { getCurrentUser } from '../services/auth';

export const useRecommendations = (
  symbol?: string, 
  page = 0, 
  size = 10,
  sortBy = 'timestamp',
  direction: 'asc' | 'desc' = 'desc',
  refetchInterval: number | false = 10000 // default polling every 10s
) => {
  return useQuery({
    queryKey: ['recommendations', symbol, page, size, sortBy, direction],
    queryFn: () => fetchRecommendations({ symbol, page, size, sortBy, direction }),
    refetchInterval,
  });
};

export const useStocks = () => {
  return useQuery({
    queryKey: ['stocks'],
    queryFn: fetchAllStocks,
  });
};

export const useSymbolData = (symbol: string, refetchInterval: number | false = false) => {
  return useQuery({
    queryKey: ['stock', symbol],
    queryFn: () => fetchStockBySymbol(symbol),
    enabled: !!symbol,
    refetchInterval
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false, // Don't retry on 401
    staleTime: Infinity,
  });
};
