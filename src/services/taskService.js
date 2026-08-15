// In-memory task service
import { v4 as uuidv4 } from 'uuid';
import Task from '../models/taskModel';

class TaskService {
  constructor() {
    this._tasks = new Map();
  }

  createTask(title, description = '') {
    const id = uuidv4();
    const task = new Task({ id, title, description, completed: false });
    this._tasks.set(id, task);
    return task;
  }

  getTask(id) {
    return this._tasks.get(id) || null;
  }

  listTasks() {
    return Array.from(this._tasks.values());
  }

  updateTask(id, updates = {}) {
    const task = this._tasks.get(id);
    if (!task) return null;
    Object.assign(task, updates);
    return task;
  }

  deleteTask(id) {
    return this._tasks.delete(id);
  }
}

export default new TaskService();
