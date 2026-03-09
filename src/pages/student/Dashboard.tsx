import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BookOpen, FileText, Bell, GraduationCap } from 'lucide-react';

export function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState({
    courses: 0,
    assignments: 0,
    announcements: 0,
  });

  useEffect(() => {
    const session = localStorage.getItem('studentSession');
    if (!session) {
      navigate('/student/login');
      return;
    }
    const studentData = JSON.parse(session);
    setStudent(studentData);

    const fetchStats = async () => {
      if (!supabase) return;

      const [coursesRes, assignmentsRes, announcementsRes] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact' }).eq('level', studentData.level),
        supabase.from('assignments').select('id', { count: 'exact' }).eq('level', studentData.level),
        supabase.from('announcements').select('id', { count: 'exact' }),
      ]);

      setStats({
        courses: coursesRes.count || 0,
        assignments: assignmentsRes.count || 0,
        announcements: announcementsRes.count || 0,
      });
    };

    fetchStats();
  }, [navigate]);

  if (!student) return null;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {student.full_name.split(' ')[0]}!</h1>
          <p className="text-slate-500">Here's an overview of your academic progress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Current Level</p>
                <p className="text-2xl font-bold text-slate-900">{student.level}</p>
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
    </StudentLayout>
  );
}
