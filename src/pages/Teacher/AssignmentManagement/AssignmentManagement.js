import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAssignment, setNewAssignment] = useState({ title: '', course_id: '', due_date: '', max_points: 100, weight: 10 });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:8000/api/v1/teacher/student/tasks', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setAssignments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('Session expired or unauthorized. Please log in as a teacher.');
        localStorage.removeItem('authToken');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        toast.error('Failed to load assignments');
      }
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('http://localhost:8000/api/v1/teacher/student/tasks/', newAssignment, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Assignment created!');
      setNewAssignment({ title: '', course_id: '', due_date: '', max_points: 100, weight: 10 });
      fetchAssignments();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('Session expired or unauthorized. Please log in as a teacher.');
        localStorage.removeItem('authToken');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        toast.error('Failed to create assignment');
      }
    }
  };

  const handleDelete = async (assignmentId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8000/api/v1/teacher/student/tasks/${assignmentId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Assignment deleted!');
      fetchAssignments();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('Session expired or unauthorized. Please log in as a teacher.');
        localStorage.removeItem('authToken');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        toast.error('Failed to delete assignment');
      }
    }
  };

  const handleGrade = async (assignmentId, grade) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://localhost:8000/api/v1/teacher/student/tasks/${assignmentId}/grade?grade=${grade}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Assignment graded!');
      fetchAssignments();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('Session expired or unauthorized. Please log in as a teacher.');
        localStorage.removeItem('authToken');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        toast.error('Failed to grade assignment');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Assignment Management</h1>
      <p className="text-gray-600 mt-2">Create and grade assignments</p>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Create Assignment</h2>
        <input type="text" placeholder="Title" value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} className="mr-2 p-2 border rounded" />
        <input type="text" placeholder="Course ID" value={newAssignment.course_id} onChange={e => setNewAssignment({ ...newAssignment, course_id: e.target.value })} className="mr-2 p-2 border rounded" />
        <input type="date" placeholder="Due Date" value={newAssignment.due_date} onChange={e => setNewAssignment({ ...newAssignment, due_date: e.target.value })} className="mr-2 p-2 border rounded" />
        <button onClick={handleCreate} className="px-3 py-1 bg-blue-500 text-white rounded">Create</button>
        <h2 className="text-xl font-semibold mt-6 mb-2">Assignments</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {assignments.map(a => (
              <li key={a.id} className="mb-4 p-4 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-sm text-gray-500">Course ID: {a.course_id}</div>
                  <div className="text-xs text-gray-400">Due: {a.due_date}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(a.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  <input type="number" placeholder="Grade" min="0" max="100" className="p-1 border rounded" id={`grade-input-${a.id}`} />
                  <button onClick={() => handleGrade(a.id, document.getElementById(`grade-input-${a.id}`).value)} className="px-3 py-1 bg-green-500 text-white rounded">Grade</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AssignmentManagement; 