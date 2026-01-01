<script>
	import { isLoading as isTasksLoading } from '../stores/tasks.svelte.js';
	import { onMount } from 'svelte';

	let isOnline = $state(true);
	let isSyncing = $derived(isTasksLoading());

	onMount(() => {
		// Check initial status
		isOnline = navigator.onLine;

		// Listen for network status changes
		const handleOnline = () => {
			isOnline = true;
		};

		const handleOffline = () => {
			isOnline = false;
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	});
</script>

{#if !isOnline}
	<!-- Offline indicator -->
	<div class="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium">
		<svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
		</svg>
		Offline
	</div>
{:else if isSyncing}
	<!-- Syncing indicator -->
	<div class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
		<svg class="h-3 w-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
		Syncing
	</div>
{:else}
	<!-- Online indicator -->
	<div class="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
		<div class="h-2 w-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
		Synced
	</div>
{/if}
