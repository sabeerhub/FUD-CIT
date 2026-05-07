'use client';

import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/Card';
import {
  Users, BookOpen, Activity,
  TrendingUp, Search, Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Students', value: '1,284', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Lecturers', value: '42', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Active Courses', value: '86', icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Platform Activity', value: '98%', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <section>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-slate-900 dark:text-white"
          >
            Institutional Overview
          </motion.h1>
          <p className="text-slate-500 mt-2">Global analytics and management dashboard for the IT Department.</p>
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
              <h3 className="text-xl font-bold">Recent User Activity</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-none text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button variant="glass" className="p-2"><Filter className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div>
                      <p className="text-sm font-bold">New Course Material Uploaded</p>
                      <p className="text-xs text-slate-500">Dr. Sarah Johnson uploaded CSC 401 - Lecture 5.pdf</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">10m ago</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-6">System Health</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium">Storage Usage</span>
                  <span className="text-slate-500">72%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[72%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium">API Response Time</span>
                  <span className="text-slate-500">124ms</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[20%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium">Database Load</span>
                  <span className="text-slate-500">45%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[45%]" />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <Button className="w-full">View System Logs</Button>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

import { Shield } from 'lucide-react';
