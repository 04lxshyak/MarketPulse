import api from './api';
import type { UserQueryRequest, UserQueryResponse } from '../types';

export const submitAiQuery = async (request: UserQueryRequest): Promise<UserQueryResponse> => {
  const response = await api.post<UserQueryResponse>('/ai/query', request);
  return response.data;
};
