import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';

export function AdminManageAssignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    courseCode: '',
    title: '',
    description: '',
    deadline: '',
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
    const [assignmentsRes, coursesRes] = await Promise.all([
      supabase.from('assignments').select('*').order('deadline', { ascending: true }),
      supabase.from('courses').select('course_code, course_name').order('course_code', { ascending: true })
    ]);

    if (!assignmentsRes.error && assignmentsRes.data) {
      setAssignments(assignmentsRes.data);
    }
    if (!coursesRes.error && coursesRes.data) {
      setCourses(coursesRes.data);
      if (coursesRes.data.length > 0) {
        setFormData(prev => ({ ...prev, courseCode: coursesRes.data[0].course_code }));
      }
    }
    setLoading(false);
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    const { error } = await supabase
      .from('assignments')
      .insert([
        {
          course_code: formData.courseCode,
          title: formData.title,
          description: formData.description,
          deadline: formData.deadline,
        }
      ]);

    if (error) {
      alert(error.message);
    } else {
      setFormData({ ...formData, title: '', description: '', deadline: '' });
      setShowAdd(false);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (!error) {
      fetchData();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Assignments</h1>
            <p className="text-slate-500">Create and manage course assignments.</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Assignment
          </Button>
        </div>

        {showAdd && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAssignment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  label="Title"
                  placeholder="Assignment 1"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Enter assignment details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="Deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
                <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">Save Assignment</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 text-center text-slate-500">Loading assignments...</div>
            ) : assignments.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No assignments found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium text-slate-900">{assignment.title}</TableCell>
                      <TableCell>{assignment.course_code}</TableCell>
                      <TableCell>{new Date(assignment.deadline).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(assignment.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
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
