import api from './api';
import type { LoginRequest, RegisterRequest, AuthResponse, UserResponse } from '../types';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/v1/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<string> => {
  const response = await api.post<string>('/v1/auth/register', data);
  return response.data;
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>('/v1/auth/me');
  return response.data;
};
