<script>
	import { onMount } from 'svelte';
	import { initialize, getUser, isLoading } from '../stores/auth.svelte.js';
	import Login from './Login.svelte';
	import SignUp from './SignUp.svelte';
	import ForgotPassword from './ForgotPassword.svelte';

	const { children } = $props();

	let authView = $state('login'); // 'login', 'signup', 'forgot-password'
	let initialized = $state(false);

	onMount(async () => {
		await initialize();
		initialized = true;
	});

	function handleNavigate(view) {
		authView = view;
	}

	// Reactive getters
	let user = $derived(getUser());
	let loading = $derived(isLoading());
</script>

{#if !initialized || loading}
	<!-- Loading state -->
	<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
		<div class="text-center">
			<svg
				class="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto"
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
			<p class="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
		</div>
	</div>
{:else if !user}
	<!-- Not authenticated - show auth screens -->
	{#if authView === 'login'}
		<Login onNavigate={handleNavigate} />
	{:else if authView === 'signup'}
		<SignUp onNavigate={handleNavigate} />
	{:else if authView === 'forgot-password'}
		<ForgotPassword onNavigate={handleNavigate} />
	{/if}
{:else}
	<!-- Authenticated - render app -->
	{@render children()}
{/if}
