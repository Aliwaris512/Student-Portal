import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { DocumentTextIcon, CalendarIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.sub;
      
      const response = await axios.get(`http://localhost:8000/api/v1/student/tasks/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      // Backend returns {"Tasks": [task_objects]}
      const tasksData = response.data.Tasks || [];
      
      // Transform backend data to match frontend expectations
      const transformedTasks = tasksData.map(task => ({
        id: task.id,
        title: task.task_name,
        course: task.course_name,
        due_date: task.due_date,
        upload_date: task.upload_date,
        status: new Date(task.due_date) < new Date() ? 'overdue' : 'pending'
      }));
      
      setAssignments(transformedTasks);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      if (error.response?.status === 404) {
        setAssignments([]);
        toast.info('No assignments found');
      } else {
        toast.error('Failed to load assignments');
        setAssignments([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (assignmentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.sub;
      
      await axios.post(`http://localhost:8000/api/v1/student/upload/tasks/${userId}/${assignmentId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Assignment submitted successfully!');
      
      // Update the assignment status locally
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: 'submitted' }
          : assignment
      ));
    } catch (error) {
      console.error('Submit error:', error);
      if (error.response?.status === 400 && error.response.data?.detail?.includes('deadline')) {
        toast.error('Assignment submission is past the deadline');
      } else {
        toast.error('Failed to submit assignment');
      }
    }
  };

  const filteredAssignments = assignments.filter(a => {
    const matchesFilter = filter === 'all' || a.status === filter;
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.course && a.course.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'text-green-600 bg-green-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-600 mt-2">View and submit assignments</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-lg shadow-md">
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {assignments.length === 0 ? 'No assignments found' : 'No assignments match your filters'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {assignments.length === 0 
                ? 'You have no assignments at the moment.' 
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAssignments.map(assignment => (
              <div key={assignment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(assignment.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Course: {assignment.course}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs">Posted: {new Date(assignment.upload_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      getStatusColor(assignment.status)
                    }`}>
                      {assignment.status}
                    </span>
                    {assignment.status === 'pending' && (
                      <button
                        onClick={() => handleSubmit(assignment.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {assignments.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {assignments.filter(a => a.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {assignments.filter(a => a.status === 'submitted').length}
              </div>
              <div className="text-sm text-gray-600">Submitted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {assignments.filter(a => a.status === 'overdue').length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;