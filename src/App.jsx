import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useTasks } from './hooks/useTasks';
import { useTimer } from './hooks/useTimer';
import { Header } from './components/Header';
import { StartView } from './components/StartView';
import { ActiveView } from './components/ActiveView';
import { HistoryList } from './components/HistoryList';
import { TaskModal } from './components/TaskModal';
import { DeleteModal } from './components/DeleteModal';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const { tasks, addTask, updateTask, deleteTasks } = useTasks();
  const { activeTask, elapsedMs, pomodoroState, startTask, stopTask } = useTimer();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState('start'); // start, manual, edit
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [indicesToDelete, setIndicesToDelete] = useState([]);

  const openTaskModal = (mode, index = null) => {
    setTaskModalMode(mode);
    setEditingTaskIndex(index);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = (data) => {
    if (taskModalMode === 'start') {
      startTask(data.description, data.project, data.mode);
    } else if (taskModalMode === 'manual') {
      addTask({
        taskName: data.description,
        project: data.project,
        startTime: data.startTime,
        endTime: data.endTime,
        durationMs: data.durationMs,
      });
    } else if (taskModalMode === 'edit' && editingTaskIndex !== null) {
      updateTask(editingTaskIndex, {
        taskName: data.description,
        project: data.project,
        startTime: data.startTime,
        endTime: data.endTime,
        durationMs: data.durationMs,
      });
    }
    setIsTaskModalOpen(false);
  };

  const handleStopTask = () => {
    const record = stopTask();
    if (record) {
      addTask(record);
    }
  };

  const handleDeleteRequest = (indices) => {
    setIndicesToDelete(indices);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteTasks(indicesToDelete);
    setIsDeleteModalOpen(false);
    setIndicesToDelete([]);
  };

  const handleEditRequest = (index) => {
    openTaskModal('edit', index);
  };

  return (
    <div className="bg-gray-100 text-gray-900 font-sans min-h-screen flex flex-col items-center py-10 px-4 dark:bg-slate-900 dark:text-white transition-colors duration-300">
      <Header toggleTheme={toggleTheme} isDark={isDark} />
      
      <main className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8 transition-all duration-300 ease-in-out">
        {!activeTask ? (
          <StartView 
            onStartClick={() => openTaskModal('start')} 
            onManualClick={() => openTaskModal('manual')} 
          />
        ) : (
          <ActiveView 
            activeTask={activeTask} 
            elapsedMs={elapsedMs} 
            pomodoroState={pomodoroState} 
            onStop={handleStopTask} 
          />
        )}
      </main>

      <HistoryList 
        tasks={tasks} 
        onRequestDelete={handleDeleteRequest} 
        onEdit={handleEditRequest} 
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        mode={taskModalMode}
        initialData={editingTaskIndex !== null ? tasks[editingTaskIndex] : null}
        tasks={tasks}
        onSubmit={handleTaskSubmit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        count={indicesToDelete.length}
      />
    </div>
  );
}

export default App;
