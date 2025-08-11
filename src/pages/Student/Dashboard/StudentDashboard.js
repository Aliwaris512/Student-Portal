import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BellIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    assignments: [],
    grades: [],
    events: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.sub;
      
      // Fetch data from multiple endpoints
      const [coursesRes, assignmentsRes, eventsRes] = await Promise.allSettled([
        axios.get(`http://localhost:8000/api/v1/student/courses/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`http://localhost:8000/api/v1/student/tasks/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:8000/api/v1/student/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const data = {
        courses: coursesRes.status === 'fulfilled' ? coursesRes.value.data['Your Courses'] || [] : [],
        assignments: assignmentsRes.status === 'fulfilled' ? assignmentsRes.value.data.Tasks || [] : [],
        events: eventsRes.status === 'fulfilled' ? eventsRes.value.data || [] : [],
        grades: [] // Will be populated when a specific course is selected
      };
      
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const gradeChartData = {
    labels: ['A', 'B', 'C', 'D', 'F'],
    datasets: [
      {
        data: [85, 70, 60, 50, 40], // Sample grade distribution
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const attendanceChartData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [85, 10, 5], // Sample attendance data
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const quickActions = [
    {
      title: 'My Courses',
      description: 'View enrolled courses and materials',
      icon: AcademicCapIcon,
      link: '/courses',
      color: 'bg-blue-500',
    },
    {
      title: 'Assignments',
      description: 'View and submit assignments',
      icon: DocumentTextIcon,
      link: '/assignments',
      color: 'bg-green-500',
    },
    {
      title: 'Grades',
      description: 'Check your academic performance',
      icon: ChartBarIcon,
      link: '/grades',
      color: 'bg-purple-500',
    },
    {
      title: 'Schedule',
      description: 'View class schedule and timetable',
      icon: CalendarIcon,
      link: '/schedule',
      color: 'bg-yellow-500',
    },
    {
      title: 'Library',
      description: 'Access library resources',
              icon: BuildingLibraryIcon,
      link: '/library',
      color: 'bg-red-500',
    },
    {
      title: 'Financial',
      description: 'View fees and payments',
      icon: CurrencyDollarIcon,
      link: '/financial',
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
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's your academic overview and important updates.
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
              <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.courses?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.assignments?.pending || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current GPA</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.gpa || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.attendance?.rate || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={gradeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
          <div className="h-64">
            <Doughnut
              data={attendanceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
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
          {dashboardData?.assignments?.upcoming?.length > 0 ? (
            dashboardData.assignments.upcoming.map((assignment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {assignment.status === 'pending' && (
                      <ClockIcon className="h-5 w-5 text-yellow-500" />
                    )}
                    {assignment.status === 'submitted' && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                    {assignment.status === 'overdue' && (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
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

      {/* Recent Grades */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h3>
        <div className="space-y-4">
          {dashboardData?.grades?.recent?.length > 0 ? (
            dashboardData.grades.recent.map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{grade.course}</h4>
                  <p className="text-sm text-gray-600">{grade.assignment}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{grade.score}/{grade.max_points}</p>
                  <p className="text-sm text-gray-600">{grade.percentage}%</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent grades</p>
          )}
        </div>
      </div>

      {/* Course Overview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData?.courses?.map((course, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{course.course_code}</h4>
                <span className="text-sm text-gray-500">{course.credits} credits</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{course.course_name}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Instructor: {course.instructor}</span>
                <span className="text-blue-600 font-medium">{course.grade || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
        <div className="space-y-4">
          {dashboardData?.notifications?.length > 0 ? (
            dashboardData.notifications.map((notification, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <BellIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">
                  {new Date(notification.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent notifications</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 