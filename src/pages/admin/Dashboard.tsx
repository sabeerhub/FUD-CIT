import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Users, BookOpen, FileText, Bell } from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    assignments: 0,
    announcements: 0,
  });

  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (!session) {
      navigate('/admin/login');
      return;
    }
    setAdmin(JSON.parse(session));

    const fetchStats = async () => {
      if (!supabase) return;

      const [studentsRes, coursesRes, assignmentsRes, announcementsRes] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact' }),
        supabase.from('courses').select('id', { count: 'exact' }),
        supabase.from('assignments').select('id', { count: 'exact' }),
        supabase.from('announcements').select('id', { count: 'exact' }),
      ]);

      setStats({
        students: studentsRes.count || 0,
        courses: coursesRes.count || 0,
        assignments: assignmentsRes.count || 0,
        announcements: announcementsRes.count || 0,
      });
    };

    fetchStats();
  }, [navigate]);

  if (!admin) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Overview of the IT Department Portal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Students</p>
                <p className="text-2xl font-bold text-slate-900">{stats.students}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Courses</p>
                <p className="text-2xl font-bold text-slate-900">{stats.courses}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Assignments</p>
                <p className="text-2xl font-bold text-slate-900">{stats.assignments}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Announcements</p>
                <p className="text-2xl font-bold text-slate-900">{stats.announcements}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
