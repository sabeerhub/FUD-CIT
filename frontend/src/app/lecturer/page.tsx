'use client';

import LecturerLayout from '@/components/layout/LecturerLayout';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Users, BookOpen, FileText,
  TrendingUp, ArrowRight, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';

export default function LecturerDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Total Students', value: '142', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Active Courses', value: '4', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Gradings', value: '28', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Average Attendance', value: '88%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <LecturerLayout>
      <div className="space-y-8">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-slate-900 dark:text-white"
            >
              Welcome, {user?.fullName.split(' ')[0]}
            </motion.h1>
            <p className="text-slate-500 mt-2">Manage your courses and student academic performance.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="glass" className="hidden sm:flex">
              <Plus className="w-5 h-5" />
              New Assignment
            </Button>
            <Button>
              <Plus className="w-5 h-5" />
              Upload Result
            </Button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Recent Submissions</h3>
              <Button variant="glass" className="py-2 text-sm">View All</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    <th className="pb-4 font-medium">Student</th>
                    <th className="pb-4 font-medium">Course</th>
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[1, 2, 3, 4].map((_, i) => (
                    <tr key={i} className="group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">JD</div>
                          <span className="font-medium">John Doe</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm">CSC 401</td>
                      <td className="py-4 text-sm text-slate-500">Oct 12, 2023</td>
                      <td className="py-4 text-right">
                        <button className="text-emerald-600 font-medium hover:underline">Grade</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-6">My Courses</h3>
            <div className="space-y-4">
              {['CSC 401', 'CSC 405', 'CSC 409'].map((course) => (
                <div key={course} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{course}</span>
                    <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full font-bold">Active</span>
                  </div>
                  <p className="text-sm text-slate-500">42 Students Enrolled</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </LecturerLayout>
  );
}
