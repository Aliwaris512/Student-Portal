import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  AcademicCapIcon,
  ClockIcon,
  UserIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const Courses = () => {
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('student'); // You may want to get this from context/auth

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (search = '', semester = '', year = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      let url = 'http://localhost:8000/api/v1/courses/';
      let params = {};
      if (search) {
        url = `http://localhost:8000/api/v1/courses/search/${encodeURIComponent(search)}`;
      } else if (semester && year) {
        url = `http://localhost:8000/api/v1/courses/semester/${encodeURIComponent(semester)}/year/${encodeURIComponent(year)}`;
      }
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` },
        params,
      });
      setCourses(Array.isArray(response.data) ? response.data : response.data || []);
    } catch (error) {
      toast.error('Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchCourses(searchTerm);
  };

  const handleSemesterFilter = (semester, year) => {
    fetchCourses('', semester, year);
  };

  // Example: Enroll in a course (student)
  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://localhost:8000/api/v1/courses/${courseId}/enroll`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Enrolled successfully!');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to enroll');
    }
  };

  // Example: Drop a course (student)
  const handleDrop = async (courseId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://localhost:8000/api/v1/courses/${courseId}/drop`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Dropped course successfully!');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to drop course');
    }
  };

  // Example: Delete a course (admin)
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

  const semesters = [
    { id: 'current', name: 'Current Semester' },
    { id: 'previous', name: 'Previous Semester' },
    { id: 'upcoming', name: 'Upcoming Semester' },
  ];

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-success-600 bg-success-50';
    if (grade.startsWith('B')) return 'text-warning-600 bg-warning-50';
    if (grade.startsWith('C')) return 'text-danger-600 bg-danger-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-success-500';
    if (progress >= 80) return 'bg-primary-500';
    if (progress >= 70) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your enrolled courses and access course materials
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary">
            <BookOpenIcon className="h-4 w-4 mr-2" />
            Browse Courses
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="flex gap-2">
          {semesters.map((semester) => (
            <button
              key={semester.id}
              onClick={() => setSelectedSemester(semester.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedSemester === semester.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {semester.name}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {loading ? (
          <div className="text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Loading courses...</h3>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{course.code}</h3>
                  <p className="text-sm text-gray-600">{course.name}</p>
                </div>
                <span className={`badge ${getGradeColor(course.grade)}`}>
                  {course.grade}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="h-4 w-4 mr-2" />
                  {course.instructor}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {course.schedule}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  {course.credits} Credits
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Course Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Course Materials */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Course Materials</h4>
                <div className="space-y-1">
                  {course.materials.slice(0, 2).map((material, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">•</span>
                      <a
                        href={material.url}
                        className="text-primary-600 hover:text-primary-700 truncate"
                      >
                        {material.name}
                      </a>
                    </div>
                  ))}
                  {course.materials.length > 2 && (
                    <div className="text-sm text-gray-500">
                      +{course.materials.length - 2} more materials
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <button className="btn-primary flex-1 text-sm">
                  View Course
                </button>
                <button className="btn-secondary text-sm">
                  Syllabus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Courses; 