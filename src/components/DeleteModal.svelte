<script>
  let { isOpen, onClose, onConfirm, count } = $props();

  function handleBackdropClick() {
    onClose();
  }

  function handleModalClick(e) {
    e.stopPropagation();
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
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
      tabindex="-1"
      class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-sm transform transition-transform duration-300 scale-100"
      onclick={handleModalClick}
    >
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 id="delete-modal-title" class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Delete Tasks?
        </h3>
        <p id="delete-modal-description" class="text-gray-500 dark:text-gray-400">
          Are you sure you want to delete {count > 1 ? `these ${count} tasks` : 'this task'}? This action cannot be undone.
        </p>
      </div>
      <div class="flex items-center justify-center space-x-4">
        <button
          type="button"
          onclick={onClose}
          class="px-6 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onclick={onConfirm}
          class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
{/if}
