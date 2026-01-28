import React, { useContext, useEffect, useState } from 'react';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext';
import AssignmentList from '../components/AssignmentList';
import AssignmentForm from '../components/AssignmentForm';

export default function TeacherDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [submissions, setSubmissions] = useState(null);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit: 20 });
      if (filter) q.append('status', filter);
      const res = await api.get('/api/assignments?' + q.toString());
      setAssignments(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchAssignments(); }, [filter, page]);

  const create = async (payload) => {
    try {
      await api.post('/api/assignments', payload);
      setShowCreate(false);
      fetchAssignments();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const edit = (a) => setEditing(a);

  const saveEdit = async (payload) => {
    try {
      await api.put(`/api/assignments/${editing._id}`, payload);
      setEditing(null);
      fetchAssignments();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const del = async (a) => {
    if (!confirm('Delete assignment?')) return;
    await api.delete(`/api/assignments/${a._id}`);
    fetchAssignments();
  };

  const changeStatus = async (a, status) => {
    try {
      await api.put(`/api/assignments/${a._id}/status`, { status });
      fetchAssignments();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const viewSubs = async (a) => {
    try {
      const res = await api.get(`/api/submissions/${a._id}`);
      setSubmissions({ assignment: a, items: res.data });
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Teacher Dashboard</h1>
        <div>
          <span className="mr-4">Hi, {user.name}</span>
          <button onClick={logout} className="p-2 border bg-blue-600 text-white">Logout</button>
        </div>
      </header>

      <div className="mb-4">
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="p-2 border mr-2">
          <option value="">All</option>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Completed">Completed</option>
        </select>
        <button onClick={()=>setShowCreate(true)} className="p-2 bg-blue-600 text-white">New Assignment</button>
      </div>

      {showCreate && (
        <div className="mb-4 p-4 border rounded">
          <AssignmentForm onSave={create} onCancel={()=>setShowCreate(false)} />
        </div>
      )}

      {editing && (
        <div className="mb-4 p-4 border rounded">
          <h3 className="font-semibold mb-2">Edit Assignment</h3>
          <AssignmentForm initial={editing} onSave={saveEdit} onCancel={()=>setEditing(null)} />
        </div>
      )}

      {loading ? <div>Loading...</div> : (
        <AssignmentList
          assignments={assignments}
          onEdit={edit}
          onDelete={del}
          onChangeStatus={changeStatus}
          onViewSubs={viewSubs}
          userRole="teacher"
        />
      )}

      {submissions && (
        <div className="mt-6 border p-4 rounded">
          <h3 className="font-semibold">Submissions for: {submissions.assignment.title}</h3>
          <ul className="mt-2 space-y-2">
            {submissions.items.map(s => (
              <li key={s._id} className="p-2 border rounded">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{s.studentId?.name} ({s.studentId?.email})</div>
                    <div className="text-sm">{new Date(s.submittedAt).toLocaleString()}</div>
                    <div className="mt-2">{s.answer}</div>
                  </div>
                  <div>
                    {s.reviewed ? <span className="text-green-600">Reviewed</span> : (
                      <button onClick={async ()=>{ await api.put(`/api/submissions/${s._id}/review`); viewSubs(submissions.assignment);}} className="p-2 border">Mark Reviewed</button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
