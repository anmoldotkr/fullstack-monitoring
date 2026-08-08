// components/StatusBadge.jsx
import React from 'react';
import '../stylesheets/StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'badge-completed';
      case 'in progress':
        return 'badge-in-progress';
      case 'pending':
      default:
        return 'badge-pending';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;