// components/TaskCard.jsx
import React from 'react';
import StatusBadge from './StatusBadge';
import '../stylesheets/TaskCard.css';

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const { id, title, description, priority, dueDate, status } = task;

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
      default:
        return 'priority-low';
    }
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <span className={`priority-tag ${getPriorityClass(priority)}`}>
          {priority} Priority
        </span>
        <StatusBadge status={status} />
      </div>

      <h3 className="task-title">{title}</h3>
      <p className="task-description">{description}</p>

      <div className="task-card-footer">
        <span className="task-due-date">📅 {dueDate}</span>

        <div className="task-actions">
          <select
            value={status}
            onChange={(e) => onStatusChange(id, e.target.value)}
            className="status-select"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button onClick={() => onDelete(id)} className="delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;