import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { User, Mail, Hash, Calendar, GraduationCap } from 'lucide-react';

export function StudentProfile() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('studentSession');
    if (!session) {
      navigate('/student/login');
      return;
    }
    setStudent(JSON.parse(session));
  }, [navigate]);

  if (!student) return null;

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Profile</h1>
          <p className="text-slate-500">View your personal information.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Full Name</p>
                <p className="font-medium text-slate-900">{student.full_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Hash className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Registration Number</p>
                <p className="font-medium text-slate-900">{student.reg_number}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Email Address</p>
                <p className="font-medium text-slate-900">{student.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Current Level</p>
                <p className="font-medium text-slate-900">{student.level}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Admission Year</p>
                <p className="font-medium text-slate-900">{student.year}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
