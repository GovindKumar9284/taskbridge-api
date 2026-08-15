import taskService from '../src/services/taskService';

test('create and list tasks', () => {
  // ensure clean service (TaskService is a singleton in this scaffold)
  // There is no clear reset method; create tasks and assert they appear
  const t = taskService.createTask('Test Task', 'desc');
  const tasks = taskService.listTasks();
  expect(Array.isArray(tasks)).toBe(true);
  expect(tasks.find((x) => x.id === t.id)).toBeDefined();
});
