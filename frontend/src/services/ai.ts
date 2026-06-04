import api from './api';
import type { Recommendation, UserQueryRequest, UserQueryResponse } from '../types';

export const submitAiQuery = async (request: UserQueryRequest): Promise<UserQueryResponse> => {
  const response = await api.post<UserQueryResponse>('/ai/query', request);
  return response.data;
};

export const analyzeSymbol = async (symbol: string): Promise<Recommendation> => {
  const response = await api.post<Recommendation>(`/ai/analyze/${symbol}`);
  return response.data;
};
