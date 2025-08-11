import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Grades = () => {
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:8000/api/v1/student/grades', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setGrades(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error('Failed to load grades');
        setGrades([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const semesters = [
    { id: 'current', name: 'Current Semester' },
    { id: 'previous', name: 'Previous Semester' },
    { id: 'all', name: 'All Semesters' },
  ];

  const years = ['2024', '2023', '2022', '2021'];

  const gpaHistory = {
    labels: ['Fall 2021', 'Spring 2022', 'Fall 2022', 'Spring 2023', 'Fall 2023', 'Spring 2024'],
    datasets: [
      {
        label: 'Semester GPA',
        data: [3.2, 3.5, 3.4, 3.6, 3.8, 3.8],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Cumulative GPA',
        data: [3.2, 3.35, 3.37, 3.43, 3.5, 3.55],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const gradeDistribution = {
    labels: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'],
    datasets: [
      {
        label: 'Grade Distribution',
        data: [8, 12, 15, 20, 18, 12, 8, 4, 2, 1],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(59, 130, 246)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(245, 158, 11)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(239, 68, 68)',
        ],
      },
    ],
  };

  const calculateOverallGPA = () => {
    const totalPoints = grades.reduce((sum, course) => sum + course.gpa * course.credits, 0);
    const totalCredits = grades.reduce((sum, course) => sum + course.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-success-600 bg-success-50';
    if (grade.startsWith('B')) return 'text-warning-600 bg-warning-50';
    if (grade.startsWith('C')) return 'text-danger-600 bg-danger-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getGradePoint = (grade) => {
    const gradePoints = {
      'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
    };
    return gradePoints[grade] || 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Grades</h1>
          <p className="mt-1 text-sm text-gray-500">
            View your grades, GPA, and academic performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="input-field w-auto"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="input-field w-auto"
          >
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GPA Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Current GPA</h3>
          <p className="text-3xl font-bold text-primary-600">{calculateOverallGPA()}</p>
          <p className="text-sm text-gray-500 mt-1">This semester</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Cumulative GPA</h3>
          <p className="text-3xl font-bold text-success-600">3.55</p>
          <p className="text-sm text-gray-500 mt-1">Overall</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Credits Earned</h3>
          <p className="text-3xl font-bold text-warning-600">
            {grades.reduce((sum, course) => sum + course.credits, 0)}
          </p>
          <p className="text-sm text-gray-500 mt-1">This semester</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">GPA History</h3>
          <div className="h-64">
            <Line
              data={gpaHistory}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 4.0,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Grade Distribution</h3>
          <div className="h-64">
            <Bar
              data={gradeDistribution}
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

      {/* Course Grades */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Course Grades</h3>
        <div className="space-y-6">
          {loading ? (
            <p>Loading grades...</p>
          ) : grades.length === 0 ? (
            <p>No grades found for this semester/year.</p>
          ) : (
            grades.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{course.courseCode}</h4>
                    <p className="text-sm text-gray-600">{course.courseName}</p>
                    <p className="text-xs text-gray-500">{course.instructor}</p>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${getGradeColor(course.finalGrade)}`}>
                      {course.finalGrade}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{course.credits} Credits</p>
                  </div>
                </div>

                {/* Assignment Breakdown */}
                <div className="space-y-2">
                  {course.assignments.map((assignment, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{assignment.name}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">{assignment.weight}%</span>
                        <span className="font-medium">{assignment.grade}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grade Calculation */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">Final Grade:</span>
                    <span className="font-semibold">{course.finalGrade}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">Grade Points:</span>
                    <span className="font-semibold">{getGradePoint(course.finalGrade)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Academic Standing */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Standing</h3>
        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-success-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-success-800">Good Academic Standing</h4>
              <p className="text-sm text-success-700 mt-1">
                Your cumulative GPA of 3.55 meets the minimum requirement for good academic standing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grades; 