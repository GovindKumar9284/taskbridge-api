import React from 'react';
import taskService from '../services/taskService';
import { sendNotification } from '../notifications';

export default function TaskItem({ task, onUpdate }) {
  function toggleCompleted() {
    taskService.updateTask(task.id, { completed: !task.completed });
    onUpdate();
    sendNotification(`Task \"${task.title}\" updated`);
  }

  function handleDelete() {
    taskService.deleteTask(task.id);
    onUpdate();
    sendNotification(`Task \"${task.title}\" deleted`);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input type="checkbox" checked={task.completed} onChange={toggleCompleted} />
      <div style={{ marginLeft: 8, flex: 1 }}>
        <div style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</div>
        {task.description ? <div style={{ fontSize: 12, color: '#666' }}>{task.description}</div> : null}
      </div>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
