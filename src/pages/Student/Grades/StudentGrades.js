import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCourse && user) {
      fetchGrades(selectedCourse);
    }
  }, [selectedCourse, user]);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.sub;
      
      const response = await axios.get(`http://localhost:8000/api/v1/student/courses/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const coursesData = response.data['Your Courses'] || [];
      setEnrolledCourses(coursesData);
      
      // Auto-select first course if available
      if (coursesData.length > 0) {
        setSelectedCourse(coursesData[0]);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load enrolled courses');
      }
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async (courseName) => {
    try {
      const token = localStorage.getItem('authToken');
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.sub;
      
      const response = await axios.get(`http://localhost:8000/student/grades/${userId}?st_course=${courseName}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      // Backend returns a single grade object for the course
      if (response.data) {
        setGrades([response.data]);
      } else {
        setGrades([]);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
      if (error.response?.status === 404) {
        setGrades([]);
        toast.error(`No grades found for ${courseName}`);
      } else {
        toast.error('Failed to load grades');
        setGrades([]);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Grades</h1>
        <p className="text-gray-600 mt-2">Check your academic performance</p>
      </div>

      {/* Course Selection */}
      {enrolledCourses.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Course:
          </label>
          <select
            id="course-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a course...</option>
            {enrolledCourses.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Grades Display */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses enrolled</h3>
            <p className="mt-1 text-sm text-gray-500">
              You need to enroll in courses to view your grades.
            </p>
          </div>
        ) : !selectedCourse ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Please select a course to view grades.</p>
          </div>
        ) : grades.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No grades available for {selectedCourse}.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Grades for {selectedCourse}</h3>
            
            {grades.map((grade, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Student Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Name:</span> {grade.student_name}</p>
                      <p><span className="font-medium">Course:</span> {grade.course}</p>
                      <p><span className="font-medium">Final Grade:</span> 
                        <span className={`ml-2 px-2 py-1 rounded text-white font-bold ${
                          grade.grade === 'A' ? 'bg-green-500' :
                          grade.grade === 'B' ? 'bg-blue-500' :
                          grade.grade === 'C' ? 'bg-yellow-500' :
                          grade.grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                        }`}>
                          {grade.grade}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Grade Breakdown */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Grade Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Quiz:</span>
                        <span>{grade.quiz}/{grade.total_quizmarks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assignment:</span>
                        <span>{grade.assignment}/{grade.total_assignmentmarks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Midterm:</span>
                        <span>{grade.midterm}/{grade.total_midterm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Final:</span>
                        <span>{grade.finalterm}/{grade.final_total}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>
                          {grade.quiz + grade.assignment + grade.midterm + grade.finalterm}/
                          {grade.total_quizmarks + grade.total_assignmentmarks + grade.total_midterm + grade.final_total}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Percentage:</span>
                        <span>
                          {(((grade.quiz + grade.assignment + grade.midterm + grade.finalterm) / 
                            (grade.total_quizmarks + grade.total_assignmentmarks + grade.total_midterm + grade.final_total)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentGrades;