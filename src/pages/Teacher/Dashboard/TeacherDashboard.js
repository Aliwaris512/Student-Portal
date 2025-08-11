import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  AcademicCapIcon,
  UsersIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  BellIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:8000/api/v1/teacher/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const attendanceChartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [
          dashboardData?.attendance?.today || 0,
          (dashboardData?.students?.total || 0) - (dashboardData?.attendance?.today || 0)
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const courseEnrollmentData = {
    labels: dashboardData?.courses?.list?.map(course => course.course_name) || [],
    datasets: [
      {
        label: 'Enrolled Students',
        data: dashboardData?.courses?.list?.map(course => course.enrollment) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const quickActions = [
    {
      title: 'My Courses',
      description: 'View and manage your courses',
      icon: AcademicCapIcon,
      link: '/courses',
      color: 'bg-blue-500',
    },
    {
      title: 'Assignments',
      description: 'Create and grade assignments',
      icon: DocumentTextIcon,
      link: '/assignments',
      color: 'bg-green-500',
    },
    {
      title: 'Grades',
      description: 'Manage student grades',
      icon: ChartBarIcon,
      link: '/grades',
      color: 'bg-purple-500',
    },
    {
      title: 'Attendance',
      description: 'Mark and view attendance',
      icon: ClipboardDocumentListIcon,
      link: '/attendance',
      color: 'bg-yellow-500',
    },
    {
      title: 'Course Materials',
      description: 'Upload and manage materials',
      icon: BookOpenIcon,
      link: '/materials',
      color: 'bg-red-500',
    },
    {
      title: 'Exams',
      description: 'Create and manage exams',
      icon: BellIcon,
      link: '/exams',
      color: 'bg-indigo-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {dashboardData?.teacher?.name}! Here's your teaching overview.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.courses?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.students?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Grading</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.assignments?.pending_grading || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.attendance?.today || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Attendance</h3>
          <div className="h-64">
            <Bar
              data={attendanceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Enrollment</h3>
          <div className="h-64">
            <Bar
              data={courseEnrollmentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center">
                <div className={`p-2 ${action.color} rounded-lg`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assignments</h3>
        <div className="space-y-4">
          {dashboardData?.upcoming_assignments?.length > 0 ? (
            dashboardData.upcoming_assignments.map((assignment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {assignment.status === 'pending' && (
                      <ClockIcon className="h-5 w-5 text-yellow-500" />
                    )}
                    {assignment.status === 'submitted' && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-600">{assignment.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">{assignment.status}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No upcoming assignments</p>
          )}
        </div>
      </div>

      {/* Course Overview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData?.courses?.list?.map((course, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{course.course_code}</h4>
                <span className="text-sm text-gray-500">{course.semester}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{course.course_name}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {course.enrollment}/{course.max_students} students
                </span>
                <span className="text-blue-600 font-medium">
                  {Math.round((course.enrollment / course.max_students) * 100)}% full
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 