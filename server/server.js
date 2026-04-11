const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { readTasks, writeTasks } = require('./data/storage');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const router = express.Router();

// GET /api/tasks - Return all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await readTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks - Create a new task
router.post('/tasks', async (req, res) => {
  try {
    const { title, author, description, completed } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const tasks = await readTasks();
    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      author: (author && typeof author === 'string') ? author.trim() : 'Anonymous',
      description: (description && typeof description === 'string') ? description.trim() : '',
      completed: !!completed,
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    await writeTasks(tasks);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});


// PATCH /api/tasks/:id - Update a task status or title
router.patch('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed, author, description } = req.body;

    let tasks = await readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (title !== undefined) tasks[taskIndex].title = title;
    if (author !== undefined) tasks[taskIndex].author = author;
    if (description !== undefined) tasks[taskIndex].description = description;
    if (completed !== undefined) tasks[taskIndex].completed = completed;


    await writeTasks(tasks);
    res.json(tasks[taskIndex]);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let tasks = await readTasks();
    const initialLength = tasks.length;
    tasks = tasks.filter((t) => t.id !== id);

    if (tasks.length === initialLength) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await writeTasks(tasks);
    res.status(204).send();
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Use the router with /api prefix
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
