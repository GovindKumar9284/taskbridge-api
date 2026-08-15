import React from 'react';
import TaskList from './components/TaskList';

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>TaskBridge</h1>
      <TaskList />
    </div>
  );
}
