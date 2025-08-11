import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for charts
  const gradeData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Average Grade',
        data: [85, 88, 92, 87, 90, 94],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const attendanceData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [85, 10, 5],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const stats = [
    {
      name: 'Current GPA',
      value: '3.8',
      change: '+0.2',
      changeType: 'positive',
      icon: ChartBarIcon,
    },
    {
      name: 'Courses Enrolled',
      value: '6',
      change: '2',
      changeType: 'neutral',
      icon: AcademicCapIcon,
    },
    {
      name: 'Assignments Due',
      value: '3',
      change: 'This week',
      changeType: 'warning',
      icon: DocumentTextIcon,
    },
    {
      name: 'Attendance Rate',
      value: '95%',
      change: '+2%',
      changeType: 'positive',
      icon: ClockIcon,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'assignment',
      title: 'Programming Assignment 3 submitted',
      time: '2 hours ago',
      status: 'completed',
    },
    {
      id: 2,
      type: 'grade',
      title: 'New grade posted for Data Structures',
      time: '1 day ago',
      status: 'completed',
    },
    {
      id: 3,
      type: 'course',
      title: 'New course material available',
      time: '2 days ago',
      status: 'pending',
    },
    {
      id: 4,
      type: 'announcement',
      title: 'Mid-term exam schedule announced',
      time: '3 days ago',
      status: 'info',
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Database Design Project',
      course: 'CS 301',
      dueDate: '2024-02-15',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Research Paper Draft',
      course: 'ENG 201',
      dueDate: '2024-02-18',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Lab Report',
      course: 'PHY 101',
      dueDate: '2024-02-20',
      priority: 'low',
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-warning-500" />;
      case 'info':
        return <ExclamationTriangleIcon className="h-5 w-5 text-primary-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-danger-600 bg-danger-50';
      case 'medium':
        return 'text-warning-600 bg-warning-50';
      case 'low':
        return 'text-success-600 bg-success-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-primary-100 mt-1">
          Here's what's happening with your academic journey today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-primary-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive'
                          ? 'text-success-600'
                          : stat.changeType === 'negative'
                          ? 'text-danger-600'
                          : stat.changeType === 'warning'
                          ? 'text-warning-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Grade Progress Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Grade Progress</h3>
          <div className="h-64">
            <Line
              data={gradeData}
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
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Attendance Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Overview</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-48 h-48">
              <Doughnut
                data={attendanceData}
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
      </div>

      {/* Recent Activities and Deadlines */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {deadline.title}
                  </p>
                  <p className="text-sm text-gray-500">{deadline.course}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                      deadline.priority
                    )}`}
                  >
                    {deadline.priority}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(deadline.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 