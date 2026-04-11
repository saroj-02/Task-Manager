import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Loader2, AlertCircle, Filter, Edit2, X, Check, User, AlignLeft, Calendar } from 'lucide-react';

const API_URL = '/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAuthor, setNewTaskAuthor] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [addTaskAsCompleted, setAddTaskAsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingAuthor, setEditingAuthor] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTaskTitle,
          author: newTaskAuthor,
          description: newTaskDescription,
          completed: addTaskAsCompleted
        }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      setNewTaskAuthor('');
      setNewTaskDescription('');
      setAddTaskAsCompleted(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setEditingAuthor(task.author || 'Anonymous');
    setEditingDescription(task.description || '');
  };

  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: editingTitle,
          author: editingAuthor || 'Anonymous',
          description: editingDescription
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderTaskList = (taskList, title) => (
    <div className="task-section">
      <h2 className="section-title">
        {title} <span>({taskList.length})</span>
      </h2>
      {taskList.length === 0 ? (
        <p className="section-empty">No {title.toLowerCase()} tasks found.</p>
      ) : (
        <div className="task-list">
          {taskList.map((task) => (
            <div key={task.id} className="task-item-container">
              <div className={`task-item ${editingId === task.id ? 'editing' : ''}`}>
                <div 
                  className={`task-checkbox ${task.completed ? 'completed' : ''}`}
                  onClick={() => toggleTask(task.id, task.completed)}
                >
                  {task.completed && <Check size={14} color="white" />}
                </div>

                {editingId === task.id ? (
                  <div className="edit-mode-form">
                    <div className="form-group compact">
                      <label className="edit-label">Title</label>
                      <input
                        type="text"
                        className="edit-input-title"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="form-group compact">
                      <label className="edit-label">Author</label>
                      <input
                        type="text"
                        className="edit-input-author"
                        value={editingAuthor}
                        onChange={(e) => setEditingAuthor(e.target.value)}
                      />
                    </div>
                    <div className="form-group compact">
                      <label className="edit-label">Description</label>
                      <textarea
                        className="edit-input-description"
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        rows="2"
                      />
                    </div>
                    <div className="edit-actions">
                      <button className="btn-primary btn-sm" onClick={() => saveEdit(task.id)}>
                        <Check size={16} /> Save Changes
                      </button>
                      <button className="action-btn" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (

                  <>
                    <div className="task-content">
                      <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                        {task.title}
                      </span>
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                      <div className="task-meta">
                        <span className="meta-item">
                          <User size={12} />
                          {task.author || 'Anonymous'}
                        </span>
                        <span className="meta-item">
                          <Calendar size={12} />
                          {formatDate(task.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="task-actions">
                      <button className="action-btn" onClick={() => startEditing(task)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="action-btn delete" onClick={() => deleteTask(task.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );


  return (
    <div className="container">
      <h1>Task Manager</h1>

      <div className="card">
        {error && (
          <div className="error">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'transparent', padding: 0 }}>
              <X size={16} />
            </button>
          </div>
        )}

        <form className="task-form expanded" onSubmit={addTask}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Task Title *"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  placeholder="Author"
                  value={newTaskAuthor}
                  onChange={(e) => setNewTaskAuthor(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="input-with-icon top">
              <AlignLeft size={16} className="input-icon" />
              <textarea
                placeholder="Description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows="2"
              />
            </div>
          </div>
          
          <div className="form-group mb-sm">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={addTaskAsCompleted}
                onChange={(e) => setAddTaskAsCompleted(e.target.checked)}
              />
              <span>Mark as completed immediately</span>
            </label>
          </div>

          <button type="submit" className="btn-primary w-full">
            <Plus size={20} />
            <span>Add Task</span>
          </button>
        </form>

        <div className="divider"></div>

        {loading ? (
          <div className="loading">
            <Loader2 className="animate-spin" size={32} />
            <p>Loading tasks...</p>
          </div>
        ) : (
          <div className="task-sections">
            {renderTaskList(activeTasks, "Active")}
            <div className="section-divider"></div>
            {renderTaskList(completedTasks, "Completed")}
          </div>
        )}
      </div>
      <footer className="footer">
        <div className="signature">Saroj Padhi</div>
        <p>&copy; 2026. All rights reserved.</p>
      </footer>
    </div>
  );
}


export default App;
