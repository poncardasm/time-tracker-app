<script>
  import { toLocalISOString } from '../utils.js';

  let { isOpen, onClose, mode, initialData, tasks, onSubmit } = $props();

  let description = $state('');
  let project = $state('');
  let showSuggestions = $state(false);
  let timerMode = $state('stopwatch');
  let startTime = $state('');
  let endTime = $state('');

  let suggestedProjects = $derived.by(() => {
    if (!tasks) return [];
    const uniqueProjects = new Set();
    const suggestions = [];
    for (const task of tasks) {
      if (task.project && !uniqueProjects.has(task.project)) {
        uniqueProjects.add(task.project);
        suggestions.push(task.project);
        if (suggestions.length >= 10) break;
      }
    }
    return suggestions;
  });

  let filteredProjects = $derived.by(() => {
    if (!project.trim()) return suggestedProjects;
    return suggestedProjects.filter((p) =>
      p.toLowerCase().includes(project.toLowerCase())
    );
  });

  $effect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        description = initialData.taskName;
        project = initialData.project || '';
        startTime = toLocalISOString(new Date(initialData.startTime));
        endTime = toLocalISOString(new Date(initialData.endTime));
      } else if (mode === 'manual') {
        description = '';
        project = '';
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        startTime = toLocalISOString(oneHourAgo);
        endTime = toLocalISOString(now);
      } else {
        // Start mode
        description = '';
        project = '';
        timerMode = 'stopwatch';
      }
    }
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!description.trim()) return;

    if (mode === 'start') {
      onSubmit({ description, project, mode: timerMode });
    } else {
      // Manual or Edit
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      if (isNaN(start) || isNaN(end) || start >= end) {
        alert(
          'Please enter valid start and end times (End time must be after start time).'
        );
        return;
      }

      onSubmit({
        description,
        project,
        startTime: start,
        endTime: end,
        durationMs: end - start,
      });
    }
  }

  function handleBackdropClick() {
    onClose();
  }

  function handleModalClick(e) {
    e.stopPropagation();
  }

  function selectProject(proj) {
    project = proj;
    showSuggestions = false;
  }

  function handleProjectBlur() {
    setTimeout(() => showSuggestions = false, 200);
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
  <div
    role="presentation"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-300"
    onclick={handleBackdropClick}
  >
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
      class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-100"
      onclick={handleModalClick}
    >
      <h3 id="modal-title" class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        {mode === 'edit' ? 'Edit Task' : 'What are you working on?'}
      </h3>
      <form onsubmit={handleSubmit}>
        {#if mode === 'start'}
          <div class="mb-6">
            <span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timer Mode
            </span>
            <div class="flex space-x-4">
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="timer-mode"
                  value="stopwatch"
                  checked={timerMode === 'stopwatch'}
                  onchange={(e) => timerMode = e.target.value}
                  class="form-radio text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                />
                <span class="ml-2 text-gray-700 dark:text-gray-300">
                  Stopwatch
                </span>
              </label>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="timer-mode"
                  value="pomodoro"
                  checked={timerMode === 'pomodoro'}
                  onchange={(e) => timerMode = e.target.value}
                  class="form-radio text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                />
                <span class="ml-2 text-gray-700 dark:text-gray-300">
                  Pomodoro (25m/5m)
                </span>
              </label>
            </div>
          </div>
        {/if}

        <div class="mb-6">
          <label for="task-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Task Description
          </label>
          <input
            id="task-description"
            type="text"
            bind:value={description}
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            placeholder="e.g., Writing Report"
            required
          />
        </div>
        <div class="mb-6">
          <label for="task-project" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project
            <span class="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div class="relative">
            <input
              id="task-project"
              type="text"
              bind:value={project}
              oninput={() => showSuggestions = true}
              onfocus={() => showSuggestions = true}
              onblur={handleProjectBlur}
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
              placeholder="e.g., Client Work"
            />
            {#if showSuggestions && filteredProjects.length > 0}
              <ul class="absolute z-10 w-full bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                {#each filteredProjects as proj}
                  <li
                    class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer text-gray-800 dark:text-gray-200"
                    onmousedown={(e) => { e.preventDefault(); selectProject(proj); }}
                    role="option"
                    aria-selected="false"
                  >
                    {proj}
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        </div>

        {#if mode === 'manual' || mode === 'edit'}
          <div class="space-y-4 mb-6">
            <div>
              <label for="start-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                id="start-time"
                type="datetime-local"
                bind:value={startTime}
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
              />
            </div>
            <div>
              <label for="end-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <input
                id="end-time"
                type="datetime-local"
                bind:value={endTime}
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
              />
            </div>
          </div>
        {/if}

        <div class="flex items-center justify-end space-x-3">
          <button
            type="button"
            onclick={onClose}
            class="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-md transition-colors cursor-pointer"
          >
            {mode === 'edit' ? 'Save Changes' : 'Start Tracking'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
