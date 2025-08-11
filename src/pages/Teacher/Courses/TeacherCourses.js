import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UsersIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:8000/api/v1/teacher/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Ensure courses is always an array
      const coursesData = Array.isArray(response.data) ? response.data : [];
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
      setCourses([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8000/api/v1/courses/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Course deleted!');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const handleViewStudents = async (courseId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:8000/api/v1/teacher/courses/${courseId}/students`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setStudents(Array.isArray(response.data) ? response.data : []);
      setSelectedCourse(courseId);
      setShowStudentsModal(true);
    } catch (error) {
      toast.error('Failed to fetch students');
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
          <p className="text-gray-600">Manage your teaching courses and view student enrollments</p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(courses) && courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{course.course_code}</h3>
              <span className="text-sm text-gray-500">{course.semester}</span>
            </div>
            
            <h4 className="text-md font-medium text-gray-800 mb-2">{course.course_name}</h4>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <AcademicCapIcon className="h-4 w-4 mr-2" />
                <span>{course.credit_hrs} Credit Hours</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <UsersIcon className="h-4 w-4 mr-2" />
                <span>{course.current_enrollment}/{course.max_students} Students</span>
              </div>
              
              {course.schedule && (
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>{course.schedule}</span>
                </div>
              )}
              
              {course.room && (
                <div className="text-sm text-gray-600">
                  Room: {course.room}
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Enrollment Rate</span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round((course.current_enrollment / course.max_students) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(course.current_enrollment / course.max_students) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleViewStudents(course.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Students
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Course
              </button>
            </div>
          </div>
        ))}
      </div>

      {(!Array.isArray(courses) || courses.length === 0) && (
        <div className="text-center py-12">
          <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No courses assigned</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't been assigned to any courses yet.
          </p>
        </div>
      )}
      {/* Students Modal */}
      {showStudentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowStudentsModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Enrolled Students</h2>
            {students.length === 0 ? (
              <p className="text-gray-500">No students enrolled in this course.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {students.map((student, idx) => (
                  <li key={student.id || idx} className="py-3 flex items-center space-x-4">
                    {/* Profile Picture */}
                    <img
                      src={student.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || student.email || 'Student')}`}
                      alt="Profile"
                      className="w-12 h-12 rounded-full border object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{student.name || 'N/A'}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-0.5 ml-2">{student.year || 'Year N/A'}</span>
                      </div>
                      <div className="text-sm text-gray-600">{student.email || 'No email'}</div>
                      <div className="text-xs text-gray-500">Roll No: {student.rollNumber || student.id || 'N/A'}</div>
                    </div>
                    {/* Actions */}
                    <div className="flex flex-col space-y-1 items-end">
                      <a
                        href={`mailto:${student.email}`}
                        className="text-blue-600 hover:underline text-xs px-2 py-1 rounded hover:bg-blue-50"
                        title="Email Student"
                      >
                        Email
                      </a>
                      <button
                        onClick={() => window.open(`/profile/${student.id || ''}`, '_blank')}
                        className="text-green-600 hover:underline text-xs px-2 py-1 rounded hover:bg-green-50"
                        title="View Profile"
                      >
                        View Profile
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourses; 