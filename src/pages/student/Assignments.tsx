import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, Upload, Calendar } from 'lucide-react';

export function StudentAssignments() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('studentSession');
    if (!session) {
      navigate('/student/login');
      return;
    }
    const studentData = JSON.parse(session);
    setStudent(studentData);

    const fetchAssignments = async () => {
      if (!supabase) return;
      
      // Fetch courses for the student's level
      const { data: courses } = await supabase
        .from('courses')
        .select('course_code')
        .eq('level', studentData.level);

      if (courses && courses.length > 0) {
        const courseCodes = courses.map(c => c.course_code);
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .in('course_code', courseCodes)
          .order('deadline', { ascending: true });

        if (!error && data) {
          setAssignments(data);
        }
      }
      setLoading(false);
    };

    fetchAssignments();
  }, [navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, assignmentId: string) => {
    if (!e.target.files || e.target.files.length === 0 || !supabase) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${student.reg_number.replace(/\//g, '_')}_${assignmentId}.${fileExt}`;
    const filePath = `submissions/${fileName}`;

    setUploading(assignmentId);
    try {
      const { error: uploadError } = await supabase.storage
        .from('assignments')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('assignments')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('submissions')
        .insert([
          {
            assignment_id: assignmentId,
            student_reg: student.reg_number,
            file_url: urlData.publicUrl,
          }
        ]);

      if (dbError) throw dbError;
      alert('Assignment submitted successfully!');
    } catch (error: any) {
      alert('Error uploading file: ' + error.message);
    } finally {
      setUploading(null);
    }
  };

  if (!student) return null;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assignments</h1>
          <p className="text-slate-500">View and submit your course assignments.</p>
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-8">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="text-center text-slate-500 py-8 bg-white rounded-xl border border-slate-200">
            No assignments found for your courses.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                      {assignment.course_code}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-slate-600 mb-4 flex-1">
                    {assignment.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                  </div>

                  <div className="mt-auto">
                    {assignment.file_url && (
                      <a 
                        href={assignment.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4"
                      >
                        <FileText className="w-4 h-4" />
                        Download Resource
                      </a>
                    )}
                    
                    <div>
                      <input
                        type="file"
                        id={`file-${assignment.id}`}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.zip"
                        onChange={(e) => handleFileUpload(e, assignment.id)}
                        disabled={uploading === assignment.id}
                      />
                      <label htmlFor={`file-${assignment.id}`}>
                        <Button 
                          variant="outline" 
                          className="w-full cursor-pointer" 
                          asChild
                          disabled={uploading === assignment.id}
                        >
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading === assignment.id ? 'Uploading...' : 'Submit Assignment'}
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
