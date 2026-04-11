const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, 'tasks.json');

const readTasks = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const writeTasks = async (tasks) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
};

module.exports = { readTasks, writeTasks };
