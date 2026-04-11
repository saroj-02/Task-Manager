const fs = require('fs').promises;
const path = require('path');

// Vercel has a read-only filesystem except for /tmp
const isVercel = process.env.VERCEL === '1';
const DATA_FILE = isVercel 
  ? path.join('/tmp', 'tasks.json')
  : path.join(__dirname, 'tasks.json');

const readTasks = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If we are on Vercel and the file doesn't exist in /tmp, 
      // we might want to seed it from the local data if it exists there
      if (isVercel) {
        try {
          const localData = await fs.readFile(path.join(__dirname, 'tasks.json'), 'utf8');
          return JSON.parse(localData);
        } catch (localError) {
          return [];
        }
      }
      return [];
    }
    throw error;
  }
};

const writeTasks = async (tasks) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Storage write error:', error);
    throw error;
  }
};

module.exports = { readTasks, writeTasks };
