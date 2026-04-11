const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { readTasks, writeTasks } = require('./data/storage');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// GET /tasks - Return all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await readTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /tasks - Create a new task
app.post('/tasks', async (req, res) => {
  try {
    const { title, author, description } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const tasks = await readTasks();
    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      author: (author && typeof author === 'string') ? author.trim() : 'Anonymous',
      description: (description && typeof description === 'string') ? description.trim() : '',
      completed: !!req.body.completed,
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    await writeTasks(tasks);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});


// PATCH /tasks/:id - Update a task status or title
app.patch('/tasks/:id', async (req, res) => {
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
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', async (req, res) => {
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
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
