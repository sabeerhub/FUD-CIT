import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Bell, Calendar } from 'lucide-react';

export function StudentAnnouncements() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('studentSession');
    if (!session) {
      navigate('/student/login');
      return;
    }
    setStudent(JSON.parse(session));

    const fetchAnnouncements = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAnnouncements(data);
      }
      setLoading(false);
    };

    fetchAnnouncements();
  }, [navigate]);

  if (!student) return null;

  return (
    <StudentLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
          <p className="text-slate-500">Stay updated with department news.</p>
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-8">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center text-slate-500 py-8 bg-white rounded-xl border border-slate-200">
            No announcements yet.
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="bg-blue-50 p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-blue-100 min-w-[120px]">
                    <Bell className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-xs font-medium text-blue-800 uppercase tracking-wider">
                      Notice
                    </span>
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {announcement.title}
                    </h3>
                    <p className="text-slate-600 whitespace-pre-wrap">
                      {announcement.content}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
