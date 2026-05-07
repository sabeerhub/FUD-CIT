'use client';

import StudentLayout from '@/components/layout/StudentLayout';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';
import {
  BookOpen, Clock, Target,
  TrendingUp, Calendar, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Attendance Rate', value: '92%', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Avg. Test Score', value: '78/100', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Completed Assignments', value: '14/16', icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Productivity Score', value: '8.5', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <section>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-slate-900 dark:text-white"
          >
            Welcome back, {user?.fullName.split(' ')[0]}! 👋
          </motion.h1>
          <p className="text-slate-500 mt-2">Here's what's happening with your academic progress today.</p>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
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
          {/* Upcoming Classes */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Upcoming Classes</h3>
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-12 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-bold">Advanced Web Development</p>
                      <p className="text-sm text-slate-500">CSC 401 • 08:00 AM - 10:00 AM</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all text-blue-500" />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Announcements</h3>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div className="space-y-6">
              {[1, 2].map((_, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-xs font-medium text-blue-600 uppercase">Department</p>
                  <p className="font-bold line-clamp-1">Mid-Semester Test Schedule Updated</p>
                  <p className="text-sm text-slate-500 line-clamp-2">Please note that the mid-semester tests for all 400 level students have been rescheduled...</p>
                  <p className="text-[10px] text-slate-400">2 hours ago</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}

import { cn } from '@/utils/cn';
