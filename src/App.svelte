<script>
  import { getIsDark, toggleTheme } from './stores/theme.svelte.js';
  import { getTasks, addTask, updateTask, deleteTasks, hasLegacyData, isInitialized } from './stores/tasks.svelte.js';
  import { getActiveTask, getElapsedMs, getPomodoroState, startTask, stopTask } from './stores/timer.svelte.js';
  import { getUser, signOut } from './stores/auth.svelte.js';
  import AuthProvider from './components/AuthProvider.svelte';
  import Header from './components/Header.svelte';
  import StartView from './components/StartView.svelte';
  import ActiveView from './components/ActiveView.svelte';
  import HistoryList from './components/HistoryList.svelte';
  import TaskModal from './components/TaskModal.svelte';
  import DeleteModal from './components/DeleteModal.svelte';
  import MigrationModal from './components/MigrationModal.svelte';
  import Toast from './components/Toast.svelte';

  let isTaskModalOpen = $state(false);
  let taskModalMode = $state('start'); // start, manual, edit
  let editingTaskIndex = $state(null);

  let isDeleteModalOpen = $state(false);
  let indicesToDelete = $state([]);

  let isMigrationModalOpen = $state(false);
  let migrationChecked = $state(false);

  // Check for legacy data after tasks are initialized
  $effect(() => {
    if (isInitialized() && !migrationChecked && getUser()) {
      migrationChecked = true;
      if (hasLegacyData()) {
        isMigrationModalOpen = true;
      }
    }
  });

  function openTaskModal(mode, index = null) {
    taskModalMode = mode;
    editingTaskIndex = index;
    isTaskModalOpen = true;
  }

  async function handleTaskSubmit(data) {
    if (taskModalMode === 'start') {
      startTask(data.description, data.project, data.mode);
    } else if (taskModalMode === 'manual') {
      await addTask({
        taskName: data.description,
        project: data.project,
        startTime: data.startTime,
        endTime: data.endTime,
        durationMs: data.durationMs,
      });
    } else if (taskModalMode === 'edit' && editingTaskIndex !== null) {
      await updateTask(editingTaskIndex, {
        taskName: data.description,
        project: data.project,
        startTime: data.startTime,
        endTime: data.endTime,
        durationMs: data.durationMs,
      });
    }
    isTaskModalOpen = false;
  }

  async function handleStopTask() {
    const record = stopTask();
    if (record) {
      await addTask(record);
    }
  }

  function handleDeleteRequest(indices) {
    indicesToDelete = indices;
    isDeleteModalOpen = true;
  }

  async function handleConfirmDelete() {
    await deleteTasks(indicesToDelete);
    isDeleteModalOpen = false;
    indicesToDelete = [];
  }

  function handleEditRequest(index) {
    openTaskModal('edit', index);
  }

  async function handleSignOut() {
    await signOut();
  }
</script>

<AuthProvider>
  <div class="bg-gray-100 text-gray-900 font-sans min-h-screen flex flex-col items-center py-10 px-4 dark:bg-slate-900 dark:text-white transition-colors duration-300">
    <Header {toggleTheme} isDark={getIsDark()} user={getUser()} onSignOut={handleSignOut} />

    <main class="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8 transition-all duration-300 ease-in-out">
      {#if !getActiveTask()}
        <StartView
          onStartClick={() => openTaskModal('start')}
          onManualClick={() => openTaskModal('manual')}
        />
      {:else}
        <ActiveView
          activeTask={getActiveTask()}
          elapsedMs={getElapsedMs()}
          pomodoroState={getPomodoroState()}
          onStop={handleStopTask}
        />
      {/if}
    </main>

    <HistoryList
      tasks={getTasks()}
      onRequestDelete={handleDeleteRequest}
      onEdit={handleEditRequest}
    />

    <TaskModal
      isOpen={isTaskModalOpen}
      onClose={() => isTaskModalOpen = false}
      mode={taskModalMode}
      initialData={editingTaskIndex !== null ? getTasks()[editingTaskIndex] : null}
      tasks={getTasks()}
      onSubmit={handleTaskSubmit}
    />

    <DeleteModal
      isOpen={isDeleteModalOpen}
      onClose={() => isDeleteModalOpen = false}
      onConfirm={handleConfirmDelete}
      count={indicesToDelete.length}
    />

    <MigrationModal
      isOpen={isMigrationModalOpen}
      onClose={() => isMigrationModalOpen = false}
    />

    <!-- Toast notifications -->
    <Toast />
  </div>
</AuthProvider>
