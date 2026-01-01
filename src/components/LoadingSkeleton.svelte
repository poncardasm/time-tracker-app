<script>
	const { rows = 5 } = $props();
</script>

<div class="space-y-3 animate-pulse">
	{#each Array(rows) as _, i}
		<div class="bg-gray-200 dark:bg-slate-700 rounded-lg p-4">
			<div class="flex items-center justify-between">
				<div class="flex-1 space-y-2">
					<div class="h-4 bg-gray-300 dark:bg-slate-600 rounded w-3/4"></div>
					<div class="h-3 bg-gray-300 dark:bg-slate-600 rounded w-1/2"></div>
				</div>
				<div class="h-8 w-8 bg-gray-300 dark:bg-slate-600 rounded"></div>
			</div>
		</div>
	{/each}
</div>
