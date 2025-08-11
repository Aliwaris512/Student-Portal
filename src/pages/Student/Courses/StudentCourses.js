import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AcademicCapIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';

const StudentCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAvailable, setShowAvailable] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
      fetchAvailableCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('authToken');
            
      // Extract user ID from JWT token payload
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.sub;
      
      const response = await axios.get(`http://localhost:8000/api/v1/student/courses/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Backend returns {"Your Courses": [course_names]}
      const coursesData = response.data['Your Courses'] || [];
      setEnrolledCourses(coursesData);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load enrolled courses');
      }
      setEnrolledCourses([]);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:8000/api/v1/student/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Backend returns {"Available Courses": [course_objects]}
      const coursesData = response.data['Available Courses'] || [];
      setAvailableCourses(coursesData);
    } catch (error) {
      console.error('Error fetching available courses:', error);
      toast.error('Failed to load available courses');
      setAvailableCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseName) => {
    try {
      const token = localStorage.getItem('authToken');
            
      // Extract userEmail from JWT token
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userEmail = tokenPayload.email;
      await axios.post(`http://localhost:8000/api/v1/student/courses/${courseName}/${userEmail}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Enrolled successfully!');
      fetchEnrolledCourses();
      fetchAvailableCourses();
    } catch (error) {
      console.error('Enrollment error:', error);
      if (error.response?.status === 302) {
        toast.error('You are already enrolled in this course');
      } else {
        toast.error('Failed to enroll');
      }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600">View your enrolled courses and access course materials</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setShowAvailable(false)}
          className={`px-4 py-2 rounded-md font-medium ${
            !showAvailable
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          My Courses ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setShowAvailable(true)}
          className={`px-4 py-2 rounded-md font-medium ${
            showAvailable
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Available Courses ({availableCourses.length})
        </button>
      </div>

      {/* Enrolled Courses */}
      {!showAvailable && (
        <div>
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((courseName, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{courseName}</h3>
                    <span className="text-sm text-green-600 font-medium">Enrolled</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      <span>Course: {courseName}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors">
                      View Materials
                    </button>
                    <button className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors">
                      Assignments
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses enrolled</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't enrolled in any courses yet. Check available courses to enroll.
              </p>
              <button
                onClick={() => setShowAvailable(true)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Browse Available Courses
              </button>
            </div>
          )}
        </div>
      )}

      {/* Available Courses */}
      {showAvailable && (
        <div>
          {availableCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => {
                const isEnrolled = enrolledCourses.includes(course.course_name);
                return (
                  <div key={course.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{course.course_name}</h3>
                      {isEnrolled && (
                        <span className="text-sm text-green-600 font-medium">Enrolled</span>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <AcademicCapIcon className="h-4 w-4 mr-2" />
                        <span>Course ID: {course.id}</span>
                      </div>
                      
                      {course.description && (
                        <div className="text-sm text-gray-600">
                          <p>{course.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {isEnrolled ? (
                        <button 
                          disabled
                          className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                        >
                          Already Enrolled
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course.course_name)}
                          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Enroll Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses available</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no courses available for enrollment at the moment.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;