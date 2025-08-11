import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  UsersIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      const [statsResponse, activitiesResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/v1/admin/dashboard/stats', { headers }),
        axios.get('http://localhost:8000/api/v1/admin/activity-logs?limit=10', { headers })
      ]);

      setStats(statsResponse.data);
      setRecentActivities(activitiesResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const userChartData = {
    labels: ['Students', 'Teachers', 'Admins'],
    datasets: [
      {
        data: [
          stats?.users?.students || 0,
          stats?.users?.teachers || 0,
          stats?.users?.admins || 0,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const financialChartData = {
    labels: ['Total Fees', 'Total Payments', 'Outstanding'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [
          stats?.financial?.total_fees || 0,
          stats?.financial?.total_payments || 0,
          stats?.financial?.outstanding || 0,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const quickActions = [
    {
      title: 'User Management',
      description: 'Create, edit, and manage users',
      icon: UsersIcon,
      link: '/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Department Management',
      description: 'Manage departments and faculties',
      icon: BuildingOfficeIcon,
      link: '/departments',
      color: 'bg-green-500',
    },
    {
      title: 'Course Management',
      description: 'Create and manage courses',
      icon: AcademicCapIcon,
      link: '/courses',
      color: 'bg-purple-500',
    },
    {
      title: 'Announcements',
      description: 'Post announcements and notifications',
      icon: BellIcon,
      link: '/announcements',
      color: 'bg-yellow-500',
    },
    {
      title: 'System Monitoring',
      description: 'View system logs and analytics',
      icon: ChartBarIcon,
      link: '/monitoring',
      color: 'bg-red-500',
    },
    {
      title: 'Settings',
      description: 'Configure system settings',
      icon: CogIcon,
      link: '/settings',
      color: 'bg-gray-500',
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening in your system.</p>
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
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.users?.total || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">
              +{stats?.users?.recent_logins || 0} recent logins
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.courses?.active || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">
              {stats?.courses?.total || 0} total courses
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.departments?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding Fees</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats?.financial?.outstanding?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={userChartData}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
          <div className="h-64">
            <Bar
              data={financialChartData}
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

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {activity.action && activity.action.includes('create') && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  )}
                  {activity.action && activity.action.includes('update') && (
                    <ClockIcon className="h-5 w-5 text-blue-500" />
                  )}
                  {activity.action && activity.action.includes('delete') && (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  )}
                  {!activity.action && (
                    <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" title="No action info" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user && activity.user.name ? `${activity.user.name} - ${activity.action || 'N/A'}` : activity.action || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">
                  {new Date(activity.created_at).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activities</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 