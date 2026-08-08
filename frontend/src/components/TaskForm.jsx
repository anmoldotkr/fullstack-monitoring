// components/TaskForm.jsx
import React, { useState } from 'react';
import '../stylesheets/TaskForm.css';

const TaskForm = ({ onAddTask }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) return;

    onAddTask({
      ...taskData,
      id: Date.now(),
      status: 'Pending',
    });

    setTaskData({
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: '',
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>Add New Task</h3>
      <div className="task-form-grid">
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="e.g., Deploy to AWS ECS"
            value={taskData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={taskData.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={taskData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Add details about this task..."
          rows="3"
          value={taskData.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <button type="submit" className="add-task-btn">
        + Create Task
      </button>
    </form>
  );
};

export default TaskForm;