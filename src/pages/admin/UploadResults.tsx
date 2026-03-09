import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';

export function AdminUploadResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    studentReg: '',
    courseCode: '',
    score: '',
    grade: 'A',
  });

  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (!session) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    if (!supabase) return;
    const [resultsRes, coursesRes] = await Promise.all([
      supabase.from('results').select('*').order('created_at', { ascending: false }),
      supabase.from('courses').select('course_code, course_name').order('course_code', { ascending: true })
    ]);

    if (!resultsRes.error && resultsRes.data) {
      setResults(resultsRes.data);
    }
    if (!coursesRes.error && coursesRes.data) {
      setCourses(coursesRes.data);
      if (coursesRes.data.length > 0) {
        setFormData(prev => ({ ...prev, courseCode: coursesRes.data[0].course_code }));
      }
    }
    setLoading(false);
  };

  const calculateGrade = (score: number) => {
    if (score >= 70) return 'A';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    if (score >= 45) return 'D';
    return 'F';
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const score = e.target.value;
    setFormData({
      ...formData,
      score,
      grade: score ? calculateGrade(Number(score)) : 'F'
    });
  };

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    // Check if student exists
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('reg_number')
      .eq('reg_number', formData.studentReg)
      .single();

    if (studentError || !studentData) {
      alert('Student registration number not found.');
      return;
    }

    const { error } = await supabase
      .from('results')
      .insert([
        {
          student_reg: formData.studentReg,
          course_code: formData.courseCode,
          score: parseInt(formData.score),
          grade: formData.grade,
        }
      ]);

    if (error) {
      alert(error.message);
    } else {
      setFormData({ ...formData, studentReg: '', score: '', grade: 'F' });
      setShowAdd(false);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('results').delete().eq('id', id);
    if (!error) {
      fetchData();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Upload Results</h1>
            <p className="text-slate-500">Manage student course results.</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Result
          </Button>
        </div>

        {showAdd && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Result</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddResult} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Student Reg Number"
                  placeholder="FCP/CIT/YY/XXXX"
                  value={formData.studentReg}
                  onChange={(e) => setFormData({ ...formData, studentReg: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    required
                  >
                    {courses.map(course => (
                      <option key={course.course_code} value={course.course_code}>
                        {course.course_code} - {course.course_name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Score (0-100)"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="85"
                  value={formData.score}
                  onChange={handleScoreChange}
                  required
                />
                <Input
                  label="Grade (Auto-calculated)"
                  value={formData.grade}
                  readOnly
                  className="bg-slate-50"
                />
                <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">Save Result</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 text-center text-slate-500">Loading results...</div>
            ) : results.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No results found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Reg</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium text-slate-900">{result.student_reg}</TableCell>
                      <TableCell>{result.course_code}</TableCell>
                      <TableCell>{result.score}</TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                          result.grade === 'A' ? 'bg-green-100 text-green-700' :
                          result.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                          result.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                          result.grade === 'D' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {result.grade}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(result.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
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
