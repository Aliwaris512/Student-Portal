import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  BellIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: '03094501187',
      address: '123 University Ave, College Town, ST 12345',
      major: user?.major || '',
      year: user?.year || '',
      emergencyContact: 'Ali waris',
      emergencyPhone: '+1 (555) 987-6543',
      emergencyRelation: 'Parent',
    },
  });

  const tabs = [
    { id: 'personal', name: 'Personal Information', icon: UserIcon },
    { id: 'academic', name: 'Academic Info', icon: AcademicCapIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
  ];

  const onSubmit = (data) => {
    const updatedData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      address: data.address,
      major: data.major,
      year: data.year,
      emergencyContact: data.emergencyContact,
      emergencyPhone: data.emergencyPhone,
      emergencyRelation: data.emergencyRelation,
    };
    
    updateProfile(updatedData);
    setIsEditing(false);
    reset(data);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const academicHistory = [
    {
      semester: 'Fall 2023',
      gpa: '3.8',
      credits: '16',
      status: 'Completed',
    },
    {
      semester: 'Spring 2023',
      gpa: '3.6',
      credits: '15',
      status: 'Completed',
    },
    {
      semester: 'Fall 2022',
      gpa: '3.4',
      credits: '14',
      status: 'Completed',
    },
  ];

  const achievements = [
    {
      title: 'Dean\'s List',
      description: 'Achieved GPA of 3.8 or higher',
      date: 'Fall 2023',
      icon: '🏆',
    },
    {
      title: 'Academic Excellence Award',
      description: 'Outstanding performance in Computer Science',
      date: 'Spring 2023',
      icon: '⭐',
    },
    {
      title: 'Research Grant',
      description: 'Received funding for undergraduate research',
      date: 'Fall 2022',
      icon: '🔬',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and account settings
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              <CogIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSubmit(onSubmit)}
                className="btn-success"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <div className="card">
        <div className="flex items-center space-x-6">
          <img
            src={user?.avatar}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.studentId}</p>
            <p className="text-gray-500">{user?.major} • {user?.year}</p>
            <div className="flex items-center mt-2">
              <span className="badge badge-success">Active Student</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 inline mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Personal Information */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      {...register('firstName', { required: 'First name is required' })}
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-danger-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      {...register('lastName', { required: 'Last name is required' })}
                      disabled={!isEditing}
                      className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-danger-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    {...register('address')}
                    disabled={!isEditing}
                    rows={3}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </form>
            </div>

            {/* Emergency Contact */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    {...register('emergencyContact')}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    {...register('emergencyPhone')}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <input
                    {...register('emergencyRelation')}
                    disabled={!isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'academic' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Academic Information */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Major
                  </label>
                  <input
                    {...register('major')}
                    disabled={isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year
                  </label>
                  <select
                    {...register('year')}
                    disabled={isEditing}
                    className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  >  
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Current Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current GPA:</span>
                      <span className="font-medium">3.8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credits Completed:</span>
                      <span className="font-medium">78</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credits Required:</span>
                      <span className="font-medium">120</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Academic History */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic History</h3>
              <div className="space-y-3">
                {academicHistory.map((semester, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{semester.semester}</div>
                      <div className="text-sm text-gray-500">{semester.credits} credits</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">GPA: {semester.gpa}</div>
                      <div className="text-sm text-success-600">{semester.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Change Password</h4>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="input-field"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="input-field"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="input-field"
                  />
                  <button className="btn-primary">Update Password</button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Login Sessions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Current Session</div>
                      <div className="text-xs text-gray-500">Windows • Chrome • 192.168.1.1</div>
                    </div>
                    <span className="badge badge-success">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Email Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-700">Grade updates</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-700">Assignment deadlines</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-700">Course announcements</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-700">Financial aid updates</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Push Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-700">Urgent announcements</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-700">Daily schedule reminders</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Achievements & Awards</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile; 