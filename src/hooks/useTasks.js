import { useState, useEffect } from 'react';

const STORAGE_KEY = 'timeTrackerTasks';

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const updateTask = (index, updatedTask) => {
    setTasks((prev) => {
      const newTasks = [...prev];
      newTasks[index] = updatedTask;
      return newTasks;
    });
  };

  const deleteTasks = (indicesToDelete) => {
    setTasks((prev) => {
      const newTasks = prev.filter((_, index) => !indicesToDelete.includes(index));
      return newTasks;
    });
  };

  return { tasks, addTask, updateTask, deleteTasks };
}

