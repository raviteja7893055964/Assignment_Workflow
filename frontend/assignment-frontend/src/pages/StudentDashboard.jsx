import React, { useContext, useEffect, useState } from 'react';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext';
import AssignmentList from '../components/AssignmentList';
import SubmissionForm from '../components/SubmissionForm';

export default function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [mySubmissions, setMySubmissions] = useState({});

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/assignments');
      setAssignments(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchMySubs = async () => {
    try {
   
    } catch (err) { console.error(err); }
  };

  useEffect(()=>{ fetchAssignments(); }, []);

  const openSubmit = (a) => setSelected(a);

  const submitAnswer = async ({ answer }) => {
    try {
      await api.post('/api/submissions', { assignmentId: selected._id, answer });
      alert('Submitted');
      setSelected(null);
      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Student Dashboard</h1>
        <div>
          <span className="mr-4">Hi, {user.name}</span>
          <button onClick={logout} className="p-2 border bg-blue-600 text-white">Logout</button>
        </div>
      </header>

      {loading ? <div>Loading...</div> : (
        <div className="space-y-4">
          {assignments.map(a => (
            <div key={a._id} className="border p-4 rounded">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="text-sm">{a.description}</p>
                  <p className="text-xs text-gray-600">Due: {new Date(a.dueDate).toLocaleString()}</p>
                </div>
                <div>
                  <button onClick={()=>openSubmit(a)} className="p-2 bg-green-600 text-white">Submit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-semibold">Submit for: {selected.title}</h3>
          <SubmissionForm onSubmit={submitAnswer} />
          <div className="mt-2">
            <button onClick={()=>setSelected(null)} className="mt-2 p-2 border">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
