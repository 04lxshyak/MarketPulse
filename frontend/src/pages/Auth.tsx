import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, register } from '../services/auth';
import { setToken } from '../utils/auth';
import toast from 'react-hot-toast';
import { Card, Input, Button } from '../components/ui/Core';
import { Activity } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      setToken(res.token);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <Activity className="h-10 w-10 text-primary mb-2" />
          <h1 className="text-2xl font-bold text-white">MarketPulse</h1>
          <p className="text-sm text-indigo-200/60 mt-1">AI-Powered Stock Intelligence</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-outline_variant mb-1 block">Email</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-outline_variant mb-1 block">Password</label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full mt-6">Secure Login</Button>
        </form>
        <div className="mt-6 text-center text-sm text-indigo-200/60">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Register here</Link>
        </div>
      </Card>
    </div>
  );
};

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      toast.success('Registration successful. Please login.');
      navigate('/login');
    } catch (err) {
      toast.error('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
         <div className="flex flex-col items-center mb-8">
          <Activity className="h-10 w-10 text-primary mb-2" />
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-outline_variant mb-1 block">Full Name</label>
            <Input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-outline_variant mb-1 block">Email</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-outline_variant mb-1 block">Password</label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full mt-6">Register</Button>
        </form>
        <div className="mt-6 text-center text-sm text-indigo-200/60">
          Already registered? <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
        </div>
      </Card>
    </div>
  );
};
