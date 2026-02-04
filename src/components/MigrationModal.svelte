<script>
	import { migrateLegacyTasks, getLegacyTasks, clearLegacyData } from '../stores/tasks.svelte.js';

	const { isOpen, onClose } = $props();

	let migrating = $state(false);
	let success = $state(false);
	let error = $state('');
	let result = $state(null);

	const legacyTasks = getLegacyTasks();
	const taskCount = legacyTasks.length;

	async function handleMigrate() {
		migrating = true;
		error = '';

		const migrationResult = await migrateLegacyTasks();

		if (migrationResult.success) {
			success = true;
			result = migrationResult;
		} else {
			error = migrationResult.error || 'Migration failed';
		}

		migrating = false;
	}

	function handleSkip() {
		// Mark migration as declined by clearing legacy data
		clearLegacyData();
		onClose();
	}

	function handleClose() {
		if (success) {
			onClose();
		}
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="migration-modal-title"
	>
		<div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
			{#if !success}
				<!-- Migration prompt -->
				<div class="flex items-start gap-3 mb-4">
					<div class="flex-shrink-0">
						<svg
							class="h-8 w-8 text-blue-600 dark:text-blue-400"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							/>
						</svg>
					</div>
					<div class="flex-1">
						<h3
							id="migration-modal-title"
							class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
						>
							Import Your Tasks
						</h3>
						<p class="text-gray-600 dark:text-gray-300 text-sm">
							We found <strong>{taskCount}</strong>
							{taskCount === 1 ? 'task' : 'tasks'} in your browser. Would you like to import
							{taskCount === 1 ? 'it' : 'them'} to your account?
						</p>
						{#if error}
							<div class="mt-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg text-sm">
								{error}
							</div>
						{/if}
					</div>
				</div>

				<div class="flex gap-3 mt-6">
					<button
						type="button"
						onclick={handleSkip}
						disabled={migrating}
						class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Skip
					</button>
					<button
						type="button"
						onclick={handleMigrate}
						disabled={migrating}
						class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{#if migrating}
							<svg
								class="animate-spin h-4 w-4 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Importing...
						{:else}
							Import Tasks
						{/if}
					</button>
				</div>
			{:else}
				<!-- Success message -->
				<div class="text-center">
					<div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
						<svg
							class="h-6 w-6 text-green-600 dark:text-green-400"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
						Import Complete!
					</h3>
					<p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
						Successfully imported <strong>{result.migratedCount}</strong> {result.migratedCount === 1 ? 'task' : 'tasks'}.
						{#if result.invalidCount > 0}
							<br />
							<span class="text-yellow-600 dark:text-yellow-400">
								{result.invalidCount} invalid {result.invalidCount === 1 ? 'task was' : 'tasks were'} skipped.
							</span>
						{/if}
					</p>
					<button
						type="button"
						onclick={handleClose}
						class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
					>
						Continue
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
