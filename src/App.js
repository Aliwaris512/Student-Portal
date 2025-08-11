import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Profile from './pages/Profile/Profile';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Admin Components
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement/UserManagement';
import DepartmentManagement from './pages/Admin/DepartmentManagement/DepartmentManagement';
import CourseManagement from './pages/Admin/CourseManagement/CourseManagement';
import AnnouncementManagement from './pages/Admin/AnnouncementManagement/AnnouncementManagement';
import SystemMonitoring from './pages/Admin/SystemMonitoring/SystemMonitoring';

// Teacher Components
import TeacherDashboard from './pages/Teacher/Dashboard/TeacherDashboard';
import TeacherCourses from './pages/Teacher/Courses/TeacherCourses';
import AssignmentManagement from './pages/Teacher/AssignmentManagement/AssignmentManagement';
import GradeManagement from './pages/Teacher/GradeManagement/GradeManagement';
import AttendanceManagement from './pages/Teacher/AttendanceManagement/AttendanceManagement';
import CourseMaterials from './pages/Teacher/CourseMaterials/CourseMaterials';
import ExamManagement from './pages/Teacher/ExamManagement/ExamManagement';

// Student Components
import StudentDashboard from './pages/Student/Dashboard/StudentDashboard';
import StudentCourses from './pages/Student/Courses/StudentCourses';
import StudentAssignments from './pages/Student/Assignments/StudentAssignments';
import StudentGrades from './pages/Student/Grades/StudentGrades';
import StudentSchedule from './pages/Student/Schedule/StudentSchedule';
import StudentLibrary from './pages/Student/Library/StudentLibrary';
import Financial from './pages/Student/Financial/Financial';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  
  const getRoleBasedRoutes = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'admin':
        return (
          <>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="announcements" element={<AnnouncementManagement />} />
            <Route path="monitoring" element={<SystemMonitoring />} />
            <Route path="profile" element={<Profile />} />
          </>
        );
      
      case 'teacher':
        return (
          <>
            <Route index element={<TeacherDashboard />} />
            <Route path="courses" element={<TeacherCourses />} />
            <Route path="assignments" element={<AssignmentManagement />} />
            <Route path="grades" element={<GradeManagement />} />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="materials" element={<CourseMaterials />} />
            <Route path="exams" element={<ExamManagement />} />
            <Route path="profile" element={<Profile />} />
          </>
        );
      
      case 'student':
      default:
        return (
          <>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="grades" element={<StudentGrades />} />
            <Route path="schedule" element={<StudentSchedule />} />
            <Route path="library" element={<StudentLibrary />} />
            <Route path="financial" element={<Financial />} />
            <Route path="profile" element={<Profile />} />
          </>
        );
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
            <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {getRoleBasedRoutes()}
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App; 