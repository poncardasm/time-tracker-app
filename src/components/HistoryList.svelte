<script>
  import { formatTime } from '../utils.js';

  let { tasks, onRequestDelete, onEdit } = $props();

  let selectedIndices = $state([]);

  // Reset selection when tasks change
  $effect(() => {
    tasks; // Track tasks dependency
    selectedIndices = [];
  });

  function handleSelectAll(e) {
    if (e.target.checked) {
      selectedIndices = tasks.map((_, index) => index);
    } else {
      selectedIndices = [];
    }
  }

  function handleSelectOne(index) {
    if (selectedIndices.includes(index)) {
      selectedIndices = selectedIndices.filter((i) => i !== index);
    } else {
      selectedIndices = [...selectedIndices, index];
    }
  }

  function handleDeleteClick() {
    onRequestDelete(selectedIndices);
  }

  function exportToCSV() {
    if (tasks.length === 0) return;

    const headers = [
      'Task Name',
      'Project',
      'Date',
      'Start Time',
      'End Time',
      'Duration',
    ];
    const rows = tasks.map((task) => {
      const date = new Date(task.startTime).toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const startTime = new Date(task.startTime).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const endTime = new Date(task.endTime).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const duration = formatTime(task.durationMs);

      const escapedTaskName = `"${task.taskName.replace(/"/g, '""')}"`;
      const escapedProject = `"${(task.project || '').replace(/"/g, '""')}"`;

      return [
        escapedTaskName,
        escapedProject,
        date,
        startTime,
        endTime,
        duration,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const now = new Date();
    const filename = `time-tracker-export-${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
</script>

{#if tasks.length === 0}
  <div class="w-full max-w-4xl mt-8 text-center text-gray-500 italic">
    No tasks recorded yet.
  </div>
{:else}
  <section class="w-full max-w-4xl">
    <div class="flex items-center justify-between mb-4 px-2">
      <div class="flex items-center space-x-4">
        <button
          onclick={handleDeleteClick}
          disabled={selectedIndices.length === 0}
          class="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {selectedIndices.length > 0
            ? `Delete Selected (${selectedIndices.length})`
            : 'Delete Selected'}
        </button>
      </div>
      <div class="flex items-center space-x-4">
        <button
          onclick={exportToCSV}
          class="text-sm text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium transition-colors cursor-pointer"
        >
          Export to CSV
        </button>
        <span class="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-cyan-600 dark:bg-cyan-700 border-b border-cyan-700 dark:border-cyan-800">
            <tr>
              <th class="px-6 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedIndices.length === tasks.length && tasks.length > 0}
                  onchange={handleSelectAll}
                  class="rounded border-cyan-300 bg-cyan-100 text-cyan-600 focus:ring-cyan-400 cursor-pointer"
                />
              </th>
              <th class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                Task
              </th>
              <th class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                Project
              </th>
              <th class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                Start
              </th>
              <th class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                End
              </th>
              <th class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-right">
                Duration
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
            {#each tasks as task, index}
              {@const isSelected = selectedIndices.includes(index)}
              {@const dateStr = new Date(task.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              {@const startTimeStr = new Date(task.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              {@const endTimeStr = new Date(task.endTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              <tr class={index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-700'}>
                <td class="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onchange={() => handleSelectOne(index)}
                    class="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                  <div class="flex items-center justify-between group">
                    <span>{task.taskName}</span>
                    <button
                      onclick={() => onEdit(index)}
                      title="Edit task"
                      aria-label="Edit task"
                      class="text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {task.project || '-'}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {dateStr}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {startTimeStr}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {endTimeStr}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-mono text-right">
                  {formatTime(task.durationMs)}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </section>
{/if}
