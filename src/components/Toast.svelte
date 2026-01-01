<script>
	import { getToasts, removeToast } from '../stores/toast.svelte.js';

	let toasts = $derived(getToasts());

	function getIcon(type) {
		switch (type) {
			case 'success':
				return `<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`;
			case 'error':
				return `<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`;
			case 'warning':
				return `<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
			default:
				return `<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
		}
	}

	function getColorClasses(type) {
		switch (type) {
			case 'success':
				return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
			case 'error':
				return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
			case 'warning':
				return 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
			default:
				return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
		}
	}
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
	{#each toasts as toast (toast.id)}
		<div
			class="flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in {getColorClasses(toast.type)}"
			role="alert"
		>
			<div class="flex-shrink-0">
				{@html getIcon(toast.type)}
			</div>
			<div class="flex-1 text-sm font-medium">
				{toast.message}
			</div>
			<button
				type="button"
				onclick={() => removeToast(toast.id)}
				class="flex-shrink-0 hover:opacity-70 transition-opacity"
				aria-label="Close"
			>
				<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	{/each}
</div>

<style>
	@keyframes slide-in {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.animate-slide-in {
		animation: slide-in 0.3s ease-out;
	}
</style>
