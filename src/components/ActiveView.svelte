<script>
  import { formatTime } from '../utils.js';

  let { activeTask, elapsedMs, pomodoroState, onStop } = $props();

  let displayTime = $derived(activeTask.mode === 'pomodoro' ? pomodoroState.remaining : elapsedMs);
</script>

<div class="text-center">
  <div class="mb-2">
    <span class="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium tracking-wide uppercase">
      Now Tracking
    </span>
  </div>

  {#if activeTask.mode === 'pomodoro'}
    <div class="mb-4">
      {#if pomodoroState.phase === 'work'}
        <span class="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-xs font-bold uppercase tracking-wider">
          Focus Time
        </span>
      {:else}
        <span class="inline-block px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-bold uppercase tracking-wider">
          Break Phase
        </span>
      {/if}
    </div>
  {/if}

  <h3 class="text-xl font-medium text-gray-800 dark:text-white mb-6 break-words">
    {activeTask.description}
  </h3>

  <div id="timer-display" class="text-6xl font-mono font-bold text-gray-900 dark:text-white mb-8 tracking-wider">
    {formatTime(displayTime)}
  </div>

  <button
    onclick={onStop}
    class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
  >
    Stop Tracking
  </button>
</div>
