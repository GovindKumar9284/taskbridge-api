import React from 'react';
import taskService from '../services/taskService';
import TaskItem from './TaskItem';

export default function TaskList() {
  const [tasks, setTasks] = React.useState(taskService.listTasks());
  const [title, setTitle] = React.useState('');

  function handleAdd() {
    if (!title.trim()) return;
    const t = taskService.createTask(title.trim());
    setTasks(taskService.listTasks());
    setTitle('');
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
        />
        <button onClick={handleAdd} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>
      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {tasks.map((t) => (
          <li key={t.id} style={{ marginBottom: 8 }}>
            <TaskItem task={t} onUpdate={() => setTasks(taskService.listTasks())} />
          </li>
        ))}
      </ul>
    </div>
  );
}
