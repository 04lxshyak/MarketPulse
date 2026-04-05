import api from './api';
import type { Stock } from '../types';

export const fetchAllStocks = async (): Promise<Stock[]> => {
  const response = await api.get<Stock[]>('/stocks');
  return response.data;
};

export const fetchStockBySymbol = async (symbol: string): Promise<Stock> => {
  const response = await api.get<Stock>(`/stocks/fetch/${symbol}`);
  return response.data;
};
