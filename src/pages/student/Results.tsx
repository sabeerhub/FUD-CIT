import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

export function StudentResults() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('studentSession');
    if (!session) {
      navigate('/student/login');
      return;
    }
    const studentData = JSON.parse(session);
    setStudent(studentData);

    const fetchResults = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('student_reg', studentData.reg_number)
        .order('course_code', { ascending: true });

      if (!error && data) {
        setResults(data);
      }
      setLoading(false);
    };

    fetchResults();
  }, [navigate]);

  if (!student) return null;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Results</h1>
          <p className="text-slate-500">View your academic performance.</p>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 text-center text-slate-500">Loading results...</div>
            ) : results.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No results published yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium text-slate-900">{result.course_code}</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
