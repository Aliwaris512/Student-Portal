import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const userRole = localStorage.getItem('userRole') || 'teacher'; // Replace with context if available

const GradeManagement = () => {
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGrade, setNewGrade] = useState({
    student_id: '',
    course_id: '',
    course: '',
    quiz: '',
    total_quizmarks: '',
    assignment: '',
    total_assignmentmarks: '',
    midterm: '',
    total_midterm: '',
    finalterm: '',
    final_total: '',
    grade: '',
    gpa: '',
    semester: '',
    year: ''
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  // Teacher can fetch a student's grades by student ID and course name
  const fetchGrades = async (studentId, courseName) => {
    if (!studentId || !courseName) {
      toast.error('Please enter both student ID and course name.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:8000/api/v1/student/grades/${studentId}?st_course=${encodeURIComponent(courseName)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setGrades(response.data ? [response.data] : []);
    } catch (error) {
      setGrades([]);
      if (error.response?.status === 404) {
        toast.error('No grades found for this student/course.');
      } else {
        toast.error('Failed to load grades');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:8000/api/v1/teacher/courses', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setCourses([]);
    }
  };

  const handleCreate = async () => {
    const courseIdInt = parseInt(newGrade.course_id);
    console.log('course_id value:', newGrade.course_id, 'type:', typeof newGrade.course_id);
    if (
      !newGrade.student_id ||
      !newGrade.course_id ||
      isNaN(courseIdInt) ||
      !newGrade.course
    ) {
      toast.error('Student ID, Course ID, and Course Name are required.');
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        ...newGrade,
        student_id: parseInt(newGrade.student_id),
        course_id: courseIdInt,
        quiz: parseFloat(newGrade.quiz),
        total_quizmarks: parseFloat(newGrade.total_quizmarks),
        assignment: parseFloat(newGrade.assignment),
        total_assignmentmarks: parseFloat(newGrade.total_assignmentmarks),
        midterm: parseFloat(newGrade.midterm),
        total_midterm: parseFloat(newGrade.total_midterm),
        finalterm: parseFloat(newGrade.finalterm),
        final_total: parseFloat(newGrade.final_total),
        gpa: parseFloat(newGrade.gpa)
      };
      console.log('Submitting grade payload:', payload);
      await axios.post(`http://localhost:8000/api/v1/teacher/student/grades/${payload.student_id}`, payload, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Grade created!');
      setNewGrade({
        student_id: '', course_id: '', course: '', quiz: '', total_quizmarks: '', assignment: '', total_assignmentmarks: '', midterm: '', total_midterm: '', finalterm: '', final_total: '', grade: '', gpa: '', semester: '', year: ''
      });
      fetchGrades();
    } catch (error) {
      toast.error('Failed to create grade');
    }
  };

  const handleDelete = async (gradeId) => {
    if (userRole !== 'admin') return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8000/api/v1/teacher/student/grades/${gradeId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Grade deleted!');
      fetchGrades();
    } catch (error) {
      toast.error('Failed to delete grade');
    }
  };

  const filteredGrades = grades.filter(g => {
    const matchesFilter = filter === 'all' || g.course === filter;
    const matchesSearch = g.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.student_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Grade Management</h1>
      <p className="text-gray-600 mt-2">Manage student grades</p>
      {/* Grade Search Form */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Search for Student Grades</h2>
        <form
          className="flex flex-wrap gap-2 mb-4"
          onSubmit={e => {
            e.preventDefault();
            const studentId = e.target.elements.studentId.value;
            const courseName = e.target.elements.courseName.value;
            fetchGrades(studentId, courseName);
          }}
        >
          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="courseName"
            placeholder="Course Name"
            className="p-2 border rounded"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Search</button>
        </form>
        {/* Display grades if found */}
        {loading ? (
          <div>Loading...</div>
        ) : grades.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Grades</h3>
            {grades.map((g, idx) => (
              <div key={idx} className="border p-4 rounded mb-2">
                <div><strong>Student:</strong> {g.student_name || g.student_id}</div>
                <div><strong>Course:</strong> {g.course}</div>
                <div><strong>Quiz:</strong> {g.quiz} / {g.total_quizmarks}</div>
                <div><strong>Assignment:</strong> {g.assignment} / {g.total_assignmentmarks}</div>
                <div><strong>Midterm:</strong> {g.midterm} / {g.total_midterm}</div>
                <div><strong>Final:</strong> {g.finalterm} / {g.final_total}</div>
                <div><strong>Grade:</strong> {g.grade}</div>
                <div><strong>GPA:</strong> {g.gpa}</div>
                <div><strong>Semester:</strong> {g.semester}</div>
                <div><strong>Year:</strong> {g.year}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No grades found. Please search above.</div>
        )}
      </div>
      {/* Existing Create Grade form below */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Create Grade</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <input type="text" placeholder="Student ID" value={newGrade.student_id} onChange={e => setNewGrade({ ...newGrade, student_id: e.target.value })} className="p-2 border rounded" />
          <select value={newGrade.course_id} onChange={e => {
            const selected = courses.find(c => String(c.id) === e.target.value);
            const idInt = selected ? selected.id : '';
            console.log('Dropdown selected course_id:', idInt, 'type:', typeof idInt);
            setNewGrade({ ...newGrade, course_id: idInt, course: selected ? selected.course_name : '' });
          }} className="p-2 border rounded">
            <option value="">Select Course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.course_name} (ID: {c.id})</option>
            ))}
          </select>
          <input type="text" placeholder="Course Name" value={newGrade.course} onChange={e => setNewGrade({ ...newGrade, course: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Quiz" value={newGrade.quiz} onChange={e => setNewGrade({ ...newGrade, quiz: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Total Quizmarks" value={newGrade.total_quizmarks} onChange={e => setNewGrade({ ...newGrade, total_quizmarks: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Assignment" value={newGrade.assignment} onChange={e => setNewGrade({ ...newGrade, assignment: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Total Assignmentmarks" value={newGrade.total_assignmentmarks} onChange={e => setNewGrade({ ...newGrade, total_assignmentmarks: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Midterm" value={newGrade.midterm} onChange={e => setNewGrade({ ...newGrade, midterm: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Total Midterm" value={newGrade.total_midterm} onChange={e => setNewGrade({ ...newGrade, total_midterm: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Finalterm" value={newGrade.finalterm} onChange={e => setNewGrade({ ...newGrade, finalterm: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Final Total" value={newGrade.final_total} onChange={e => setNewGrade({ ...newGrade, final_total: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Grade (A, B, etc.)" value={newGrade.grade} onChange={e => setNewGrade({ ...newGrade, grade: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="GPA" value={newGrade.gpa} onChange={e => setNewGrade({ ...newGrade, gpa: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Semester" value={newGrade.semester} onChange={e => setNewGrade({ ...newGrade, semester: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Year" value={newGrade.year} onChange={e => setNewGrade({ ...newGrade, year: e.target.value })} className="p-2 border rounded" />
        </div>
        <button onClick={handleCreate} className="px-3 py-1 bg-blue-500 text-white rounded">Create</button>
        <h2 className="text-xl font-semibold mt-6 mb-2">Grades</h2>
        <input
          type="text"
          placeholder="Search by course or student..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded"
        />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="ml-2 p-2 border rounded">
          <option value="all">All Courses</option>
          {[...new Set(grades.map(g => g.course))].map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {filteredGrades.map(g => (
              <li key={g.id} className="mb-4 p-4 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{g.course}</div>
                  <div className="text-sm text-gray-500">Student: {g.student_name}</div>
                  <div className="text-xs text-gray-400">Grade: {g.grade} | GPA: {g.gpa}</div>
                  <div className="text-xs text-gray-400">Semester: {g.semester} | Year: {g.year}</div>
                </div>
                {userRole === 'admin' && (
                  <button onClick={() => handleDelete(g.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GradeManagement; 