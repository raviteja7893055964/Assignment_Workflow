import React, { useState } from 'react';

export default function AssignmentForm({ initial = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [dueDate, setDueDate] = useState(initial.dueDate ? new Date(initial.dueDate).toISOString().slice(0,16) : '');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setErr('');
    if (!title || !dueDate) return setErr('Title and due date required');
    const payload = { title, description, dueDate: new Date(dueDate).toISOString() };
    onSave(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      {err && <div className="text-red-600">{err}</div>}
      <input className="w-full p-2 border" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
      <textarea className="w-full p-2 border" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description"></textarea>
      <input type="datetime-local" className="w-full p-2 border" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
      <div className="flex gap-2">
        <button className="p-2 bg-blue-600 text-white">Save</button>
        <button type="button" onClick={onCancel} className="p-2 border">Cancel</button>
      </div>
    </form>
  );
}
