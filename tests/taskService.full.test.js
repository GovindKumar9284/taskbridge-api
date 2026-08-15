import taskService from '../src/services/taskService';
import Task from '../src/models/taskModel';

beforeEach(() => {
  // Clear the in-memory task store for isolation between tests
  if (taskService && taskService._tasks && typeof taskService._tasks.clear === 'function') {
    taskService._tasks.clear();
  }
});

test('createTask creates a Task instance with expected properties and is listed', () => {
  const t = taskService.createTask('Test Task', 'desc');
  expect(t).toBeInstanceOf(Task);
  expect(t.title).toBe('Test Task');
  expect(t.description).toBe('desc');
  expect(t.completed).toBe(false);

  const tasks = taskService.listTasks();
  expect(Array.isArray(tasks)).toBe(true);
  expect(tasks.length).toBe(1);
  expect(tasks[0].id).toBe(t.id);
});

test('markCompleted toggles completed and toJSON returns plain object', () => {
  const t = taskService.createTask('Another Task');
  expect(t.completed).toBe(false);
  t.markCompleted();
  expect(t.completed).toBe(true);

  const json = t.toJSON();
  expect(json).toEqual({
    id: t.id,
    title: t.title,
    description: t.description,
    completed: t.completed,
  });
});

test('getTask returns null for unknown id', () => {
  expect(taskService.getTask('non-existent-id')).toBeNull();
});

test('updateTask updates fields and returns the updated task', () => {
  const t = taskService.createTask('Updatable', 'old');
  const updated = taskService.updateTask(t.id, { title: 'Updated', description: 'new', completed: true });
  expect(updated).not.toBeNull();
  expect(updated.id).toBe(t.id);
  expect(updated.title).toBe('Updated');
  expect(updated.description).toBe('new');
  expect(updated.completed).toBe(true);
});

test('updateTask returns null when task not found', () => {
  const res = taskService.updateTask('no-id', { title: 'x' });
  expect(res).toBeNull();
});

test('deleteTask removes task and returns boolean result', () => {
  const t = taskService.createTask('ToDelete');
  expect(taskService.getTask(t.id)).not.toBeNull();
  const del = taskService.deleteTask(t.id);
  expect(del).toBe(true);
  expect(taskService.getTask(t.id)).toBeNull();
  // deleting again should return false
  expect(taskService.deleteTask(t.id)).toBe(false);
});
