
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { Login, Register } from './pages/Auth';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { SymbolDetail } from './pages/SymbolDetail';
import { Stocks } from './pages/Stocks';
import { Feed } from './pages/Feed';
import { PrivateRoute } from './components/auth/PrivateRoute';

// Application wide querying configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" toastOptions={{
         style: { background: '#1a0b38', color: '#fff', border: '1px solid #4c3a73' },
         success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
         error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
      }} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/symbol/:symbol" element={<PrivateRoute><SymbolDetail /></PrivateRoute>} />
          <Route path="/stocks" element={<PrivateRoute><Stocks /></PrivateRoute>} />
          <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
          
          {/* Default redirect to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
