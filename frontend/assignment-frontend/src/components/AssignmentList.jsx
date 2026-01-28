import React from 'react';
import AssignmentCard from './AssignmentCard';

export default function AssignmentList({ assignments = [], onEdit, onDelete, onChangeStatus, onViewSubs, userRole }) {
  if (!assignments.length) return <div>No assignments</div>;
  return (
    <div className="space-y-4">
      {assignments.map(a => (
        <AssignmentCard
          key={a._id}
          a={a}
          onEdit={onEdit}
          onDelete={onDelete}
          onChangeStatus={onChangeStatus}
          onViewSubs={onViewSubs}
          userRole={userRole}
        />
      ))}
    </div>
  );
}
