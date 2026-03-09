/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StudentLogin } from './pages/student/Login';
import { StudentRegister } from './pages/student/Register';
import { StudentDashboard } from './pages/student/Dashboard';
import { StudentProfile } from './pages/student/Profile';
import { StudentCourses } from './pages/student/Courses';
import { StudentAssignments } from './pages/student/Assignments';
import { StudentResults } from './pages/student/Results';
import { StudentAnnouncements } from './pages/student/Announcements';

import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminManageStudents } from './pages/admin/ManageStudents';
import { AdminManageCourses } from './pages/admin/ManageCourses';
import { AdminManageAssignments } from './pages/admin/ManageAssignments';
import { AdminUploadResults } from './pages/admin/UploadResults';
import { AdminAnnouncements } from './pages/admin/Announcements';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/student/login" replace />} />

        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/courses" element={<StudentCourses />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/results" element={<StudentResults />} />
        <Route path="/student/announcements" element={<StudentAnnouncements />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-students" element={<AdminManageStudents />} />
        <Route path="/admin/manage-courses" element={<AdminManageCourses />} />
        <Route path="/admin/manage-assignments" element={<AdminManageAssignments />} />
        <Route path="/admin/upload-results" element={<AdminUploadResults />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
      </Routes>
    </Router>
  );
}
