// pages/Dashboard.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import '../stylesheets/Dashboard.css';

const Dashboard = ({onLogout}) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Configure AWS VPC Peering',
      description: 'Set up cross-account routing tables and auto-approve rules.',
      priority: 'High',
      dueDate: '2026-08-15',
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'Optimize Docker Build Pipeline',
      description: 'Cache layer dependencies in CodeBuild to reduce latency.',
      priority: 'Medium',
      dueDate: '2026-08-18',
      status: 'Pending',
    },
    {
      id: 3,
      title: 'Database Schema Migration',
      description: 'Run SQL dump verification scripts on staging instance.',
      priority: 'Low',
      dueDate: '2026-08-10',
      status: 'Completed',
    },
  ]);

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;

  return (
    <div className="dashboard-layout">
      <Navbar user={{ name: 'Anmol Kumar' }} onLogout={(onLogout) => alert('Logged out!')} />

      <main className="dashboard-content">
        {/* Stats Section */}
        <section className="stats-grid">
          <div className="stat-card">
            <h4>Total Tasks</h4>
            <p className="stat-number">{totalTasks}</p>
          </div>
          <div className="stat-card">
            <h4>In Progress</h4>
            <p className="stat-number">{inProgressTasks}</p>
          </div>
          <div className="stat-card">
            <h4>Completed</h4>
            <p className="stat-number">{completedTasks}</p>
          </div>
        </section>

        {/* Create Task Section */}
        <TaskForm onAddTask={handleAddTask} />

        {/* Task Cards Grid */}
        <section className="tasks-section">
          <h2>My Tasks</h2>
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks available. Add a new task above!</p>
          ) : (
            <div className="task-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;