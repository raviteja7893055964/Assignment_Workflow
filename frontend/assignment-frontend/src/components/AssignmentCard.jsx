import React from 'react';

export default function AssignmentCard({ a, onEdit, onDelete, onChangeStatus, onViewSubs, userRole }) {
  return (
    <div className="border p-4 rounded">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{a.title}</h3>
          <p className="text-sm">{a.description}</p>
          <p className="text-xs text-gray-600">Due: {new Date(a.dueDate).toLocaleString()}</p>
          <p className="text-xs">Status: {a.status}</p>
        </div>
        <div className="space-y-2">
          {userRole === 'teacher' && (
            <>
              {a.status === 'Draft' && <button onClick={()=>onEdit(a) } className="btn mr-4" >Edit  </button>}
              {a.status === 'Draft' && <button onClick={()=>onDelete(a)} className="btn mr-4">Delete  </button>}
              {a.status === 'Draft' && <button onClick={()=>onChangeStatus(a,'Published')} className="btn mr-4">Publish </button>}
              {a.status === 'Published' && <button onClick={()=>onChangeStatus(a,'Completed')} className="btn mr-4">Complete</button>}
              <button onClick={()=>onViewSubs(a)} className="btn">Submissions</button>
            </>
          )}
          {userRole === 'student' && (
            <div>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
