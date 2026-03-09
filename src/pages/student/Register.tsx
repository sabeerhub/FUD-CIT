import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export function StudentRegister() {
  const [formData, setFormData] = useState({
    regNumber: '',
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const calculateLevel = (regNumber: string) => {
    const match = regNumber.match(/^FCP\/CIT\/(\d{2})\/\d{4}$/);
    if (!match) return null;
    
    const year = parseInt(match[1]);
    // 24=Level2, 23=Level3, 22=Level4, 21=Graduate
    if (year === 24) return 'Level 2';
    if (year === 23) return 'Level 3';
    if (year === 22) return 'Level 4';
    if (year <= 21) return 'Graduate';
    return 'Level 1';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!supabase) throw new Error('Supabase not connected');

      const regex = /^FCP\/CIT\/\d{2}\/\d{4}$/;
      if (!regex.test(formData.regNumber)) {
        throw new Error('Invalid registration number format. Must be FCP/CIT/YY/XXXX');
      }

      const level = calculateLevel(formData.regNumber);
      const year = `20${formData.regNumber.split('/')[2]}`;

      const { data, error } = await supabase
        .from('students')
        .insert([
          {
            reg_number: formData.regNumber,
            full_name: formData.fullName,
            email: formData.email,
            password: formData.password,
            level,
            year,
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') throw new Error('Registration number or email already exists');
        throw error;
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
          <CardTitle className="text-2xl text-blue-600">Student Registration</CardTitle>
          <p className="text-slate-500 mt-2">Create your portal account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            <Input
              label="Registration Number"
              placeholder="FCP/CIT/YY/XXXX"
              value={formData.regNumber}
              onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
              required
            />
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
            <div className="text-center text-sm text-slate-500 mt-4">
              Already have an account?{' '}
              <Link to="/student/login" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
