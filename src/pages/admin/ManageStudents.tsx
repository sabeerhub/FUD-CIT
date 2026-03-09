import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';

export function AdminManageStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    regNumber: '',
    fullName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (!session) {
      navigate('/admin/login');
      return;
    }
    fetchStudents();
  }, [navigate]);

  const fetchStudents = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setStudents(data);
    }
    setLoading(false);
  };

  const calculateLevel = (regNumber: string) => {
    const match = regNumber.match(/^FCP\/CIT\/(\d{2})\/\d{4}$/);
    if (!match) return null;
    const year = parseInt(match[1]);
    if (year === 24) return 'Level 2';
    if (year === 23) return 'Level 3';
    if (year === 22) return 'Level 4';
    if (year <= 21) return 'Graduate';
    return 'Level 1';
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    const regex = /^FCP\/CIT\/\d{2}\/\d{4}$/;
    if (!regex.test(formData.regNumber)) {
      alert('Invalid registration number format. Must be FCP/CIT/YY/XXXX');
      return;
    }

    const level = calculateLevel(formData.regNumber);
    const year = `20${formData.regNumber.split('/')[2]}`;

    const { error } = await supabase
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
      ]);

    if (error) {
      alert(error.message);
    } else {
      setFormData({ regNumber: '', fullName: '', email: '', password: '' });
      setShowAdd(false);
      fetchStudents();
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (!error) {
      fetchStudents();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Students</h1>
            <p className="text-slate-500">View, add, or remove students.</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>

        {showAdd && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Student</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">Save Student</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 text-center text-slate-500">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No students found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reg Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium text-slate-900">{student.reg_number}</TableCell>
                      <TableCell>{student.full_name}</TableCell>
                      <TableCell>{student.level}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(student.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
