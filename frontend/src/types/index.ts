export interface Recommendation {
  id: number;
  symbol: string;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  reason: string;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export interface Stock {
  symbol: string;
  price?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface AuthResponse {
  token: string;
}

export interface UserResponse {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
