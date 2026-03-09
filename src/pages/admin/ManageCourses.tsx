import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus, Edit2 } from 'lucide-react';

export function AdminManageCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    level: 'Level 1',
    semester: '1',
  });

  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (!session) {
      navigate('/admin/login');
      return;
    }
    fetchCourses();
  }, [navigate]);

  const fetchCourses = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('level', { ascending: true })
      .order('semester', { ascending: true });

    if (!error && data) {
      setCourses(data);
    }
    setLoading(false);
  };

  const handleAddOrEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (editingId) {
      const { error } = await supabase
        .from('courses')
        .update({
          course_code: formData.courseCode,
          course_name: formData.courseName,
          level: formData.level,
          semester: parseInt(formData.semester),
        })
        .eq('id', editingId);

      if (error) alert(error.message);
      else {
        resetForm();
        fetchCourses();
      }
    } else {
      const { error } = await supabase
        .from('courses')
        .insert([
          {
            course_code: formData.courseCode,
            course_name: formData.courseName,
            level: formData.level,
            semester: parseInt(formData.semester),
          }
        ]);

      if (error) alert(error.message);
      else {
        resetForm();
        fetchCourses();
      }
    }
  };

  const resetForm = () => {
    setFormData({ courseCode: '', courseName: '', level: 'Level 1', semester: '1' });
    setShowAdd(false);
    setEditingId(null);
  };

  const handleEdit = (course: any) => {
    setFormData({
      courseCode: course.course_code,
      courseName: course.course_name,
      level: course.level,
      semester: course.semester.toString(),
    });
    setEditingId(course.id);
    setShowAdd(true);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (!error) {
      fetchCourses();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Courses</h1>
            <p className="text-slate-500">Add, edit, or remove courses.</p>
          </div>
          <Button onClick={() => { resetForm(); setShowAdd(!showAdd); }} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>

        {showAdd && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Course' : 'Add New Course'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddOrEditCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Course Code"
                  placeholder="CIT 101"
                  value={formData.courseCode}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                  required
                />
                <Input
                  label="Course Name"
                  placeholder="Introduction to IT"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    required
                  >
                    <option value="Level 1">Level 1</option>
                    <option value="Level 2">Level 2</option>
                    <option value="Level 3">Level 3</option>
                    <option value="Level 4">Level 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    required
                  >
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingId ? 'Update Course' : 'Save Course'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 text-center text-slate-500">Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No courses found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium text-slate-900">{course.course_code}</TableCell>
                      <TableCell>{course.course_name}</TableCell>
                      <TableCell>{course.level}</TableCell>
                      <TableCell>{course.semester}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(course)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(course.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
