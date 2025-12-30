const STORAGE_KEY = 'timeTrackerTasks';

function loadTasks() {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

let tasks = $state(loadTasks());

export function getTasks() {
  return tasks;
}

export function addTask(task) {
  tasks = [task, ...tasks];
  saveTasks(tasks);
}

export function updateTask(index, updatedTask) {
  tasks = tasks.map((t, i) => i === index ? updatedTask : t);
  saveTasks(tasks);
}

export function deleteTasks(indicesToDelete) {
  tasks = tasks.filter((_, index) => !indicesToDelete.includes(index));
  saveTasks(tasks);
}
