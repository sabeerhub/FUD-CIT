import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export function StudentLogin() {
  const [regNumber, setRegNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!supabase) throw new Error('Supabase not connected');

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('reg_number', regNumber)
        .eq('password', password)
        .single();

      if (error || !data) {
        throw new Error('Invalid registration number or password');
      }

      localStorage.setItem('studentSession', JSON.stringify(data));
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blue-600">Student Portal</CardTitle>
          <p className="text-slate-500 mt-2">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            <Input
              label="Registration Number"
              placeholder="FCP/CIT/YY/XXXX"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center text-sm text-slate-500 mt-4">
              Don't have an account?{' '}
              <Link to="/student/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </div>
            <div className="text-center text-sm text-slate-500 mt-2">
              <Link to="/admin/login" className="text-slate-600 hover:underline">
                Admin Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
