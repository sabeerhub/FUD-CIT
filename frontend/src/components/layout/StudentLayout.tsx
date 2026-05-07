'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, BookOpen, FileText,
  CheckCircle, Bell, MessageSquare,
  User, LogOut, Menu, X
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'STUDENT') {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) return null;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student' },
    { icon: BookOpen, label: 'Courses', path: '/student/courses' },
    { icon: FileText, label: 'Assignments', path: '/student/assignments' },
    { icon: CheckCircle, label: 'Results & CA', path: '/student/results' },
    { icon: Bell, label: 'Announcements', path: '/student/announcements' },
    { icon: MessageSquare, label: 'Messages', path: '/student/messages' },
    { icon: User, label: 'Profile', path: '/student/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col glass dark:glass-dark m-4 rounded-3xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Smart IT Portal
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                "hover:bg-blue-600/10 hover:text-blue-600 group"
              )}
            >
              <item.icon className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
              <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={() => { logout(); router.push('/auth/login'); }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 lg:p-8 overflow-y-auto">
        {/* Top Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-slate-900 dark:text-white">{user.fullName}</p>
              <p className="text-xs text-slate-500">{user.profile?.regNumber}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {user.fullName[0]}
            </div>
          </div>
        </header>

        {children}
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="w-72 h-full bg-white dark:bg-slate-900 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-4">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { router.push(item.path); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-100"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
