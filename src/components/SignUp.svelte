<script>
	import { signUp, getError, clearError } from '../stores/auth.svelte.js';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let localError = $state('');
	let success = $state(false);

	const { onNavigate = () => {} } = $props();

	async function handleSubmit(e) {
		e.preventDefault();
		loading = true;
		localError = '';
		success = false;
		clearError();

		// Validate passwords match
		if (password !== confirmPassword) {
			localError = 'Passwords do not match';
			loading = false;
			return;
		}

		// Validate password length
		if (password.length < 6) {
			localError = 'Password must be at least 6 characters';
			loading = false;
			return;
		}

		const { data, error } = await signUp(email, password);

		if (error) {
			localError = error;
			loading = false;
		} else {
			// Sign up successful
			success = true;
			loading = false;
		}
	}

	function handleSignInClick() {
		onNavigate('login');
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
				Create your account
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
				Start tracking your time across all devices
			</p>
		</div>

		{#if success}
			<div
				class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg"
				role="alert"
			>
				<p class="font-medium">Account created successfully!</p>
				<p class="text-sm mt-1">Please check your email to confirm your account.</p>
				<button
					type="button"
					onclick={handleSignInClick}
					class="mt-3 text-sm font-medium text-green-700 dark:text-green-300 hover:text-green-600 dark:hover:text-green-200 underline"
				>
					Go to sign in
				</button>
			</div>
		{:else}
			<form class="mt-8 space-y-6" onsubmit={handleSubmit}>
				{#if localError}
					<div
						class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg"
						role="alert"
					>
						<p class="text-sm">{localError}</p>
					</div>
				{/if}

				<div class="space-y-4">
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Email address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							bind:value={email}
							disabled={loading}
							class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="new-password"
							required
							bind:value={password}
							disabled={loading}
							class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
							placeholder="••••••••"
						/>
						<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
							At least 6 characters
						</p>
					</div>

					<div>
						<label
							for="confirm-password"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Confirm password
						</label>
						<input
							id="confirm-password"
							name="confirm-password"
							type="password"
							autocomplete="new-password"
							required
							bind:value={confirmPassword}
							disabled={loading}
							class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
							placeholder="••••••••"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={loading}
						class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-400"
					>
						{#if loading}
							<svg
								class="animate-spin h-5 w-5 text-white"
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
						{:else}
							Create account
						{/if}
					</button>
				</div>

				<div class="text-center">
					<button
						type="button"
						onclick={handleSignInClick}
						class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
					>
						Already have an account? Sign in
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
