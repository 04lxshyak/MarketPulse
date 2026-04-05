import api from './api';
import type { Recommendation, PaginatedResponse } from '../types';

interface FetchRecommendationsParams {
  symbol?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export const fetchRecommendations = async (params: FetchRecommendationsParams = {}): Promise<PaginatedResponse<Recommendation>> => {
  const response = await api.get<PaginatedResponse<Recommendation>>('/recommendations', { params });
  return response.data;
};
