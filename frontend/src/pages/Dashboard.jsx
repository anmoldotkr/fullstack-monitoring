import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import { taskService } from '../services/api';
import '../stylesheets/Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user')) || { fullName: 'User' };

  // Fetch tasks on initial render
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (newTaskData) => {
    try {
      const createdTask = await taskService.createTask(newTaskData);
      setTasks((prev) => [createdTask, ...prev]);
    } catch (err) {
      alert(`Failed to add task: ${err.message}`);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      alert(`Failed to delete task: ${err.message}`);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedTask = await taskService.updateTask(id, { status: newStatus });
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      alert(`Failed to update task: ${err.message}`);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;

  return (
    <div className="dashboard-layout">
      <Navbar user={{ name: currentUser.fullName }} onLogout={onLogout} />

      <main className="dashboard-content">
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

        <TaskForm onAddTask={handleAddTask} />

        <section className="tasks-section">
          <h2>My Tasks</h2>
          {error && <p className="error-message">{error}</p>}
          {loading ? (
            <p>Loading tasks from MySQL database...</p>
          ) : tasks.length === 0 ? (
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