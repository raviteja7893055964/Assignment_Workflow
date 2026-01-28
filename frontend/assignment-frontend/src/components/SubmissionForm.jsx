import React, { useState } from 'react';

export default function SubmissionForm({ onSubmit, initialAnswer = '' }) {
  const [answer, setAnswer] = useState(initialAnswer);
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!answer.trim()) return setErr('Answer cannot be empty');
    onSubmit({ answer });
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      {err && <div className="text-red-600">{err}</div>}
      <textarea value={answer} onChange={e=>setAnswer(e.target.value)} className="w-full p-2 border" rows="6"></textarea>
      <button className="p-2 bg-green-600 text-white">Submit</button>
    </form>
  );
}
