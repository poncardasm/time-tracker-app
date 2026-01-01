// Authentication store for managing user authentication state
import { supabase } from '../lib/supabase.js';

// Authentication state
let user = $state(null);
let session = $state(null);
let loading = $state(true);
let error = $state(null);

// Initialize auth state from Supabase session
async function initialize() {
	try {
		loading = true;
		error = null;

		// Get current session
		const {
			data: { session: currentSession },
			error: sessionError
		} = await supabase.auth.getSession();

		if (sessionError) throw sessionError;

		session = currentSession;
		user = currentSession?.user ?? null;

		// Listen for auth changes
		supabase.auth.onAuthStateChange((_event, newSession) => {
			session = newSession;
			user = newSession?.user ?? null;
		});
	} catch (err) {
		console.error('Error initializing auth:', err);
		error = err.message;
	} finally {
		loading = false;
	}
}

// Sign up with email and password
async function signUp(email, password) {
	try {
		loading = true;
		error = null;

		// Check if email is authorized
		const { data: authorizedEmails, error: checkError } = await supabase
			.from('authorized_emails')
			.select('email')
			.eq('email', email)
			.single();

		if (checkError || !authorizedEmails) {
			throw new Error('This email is not authorized to access the app');
		}

		// Sign up the user
		const { data, error: signUpError } = await supabase.auth.signUp({
			email,
			password
		});

		if (signUpError) throw signUpError;

		return { data, error: null };
	} catch (err) {
		console.error('Sign up error:', err);
		error = err.message;
		return { data: null, error: err.message };
	} finally {
		loading = false;
	}
}

// Sign in with email and password
async function signIn(email, password) {
	try {
		loading = true;
		error = null;

		const { data, error: signInError } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (signInError) throw signInError;

		return { data, error: null };
	} catch (err) {
		console.error('Sign in error:', err);
		error = err.message;
		return { data: null, error: err.message };
	} finally {
		loading = false;
	}
}

// Sign out
async function signOut() {
	try {
		loading = true;
		error = null;

		const { error: signOutError } = await supabase.auth.signOut();

		if (signOutError) throw signOutError;

		user = null;
		session = null;

		return { error: null };
	} catch (err) {
		console.error('Sign out error:', err);
		error = err.message;
		return { error: err.message };
	} finally {
		loading = false;
	}
}

// Reset password
async function resetPassword(email) {
	try {
		loading = true;
		error = null;

		const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/reset-password`
		});

		if (resetError) throw resetError;

		return { error: null };
	} catch (err) {
		console.error('Password reset error:', err);
		error = err.message;
		return { error: err.message };
	} finally {
		loading = false;
	}
}

// Update password
async function updatePassword(newPassword) {
	try {
		loading = true;
		error = null;

		const { error: updateError } = await supabase.auth.updateUser({
			password: newPassword
		});

		if (updateError) throw updateError;

		return { error: null };
	} catch (err) {
		console.error('Password update error:', err);
		error = err.message;
		return { error: err.message };
	} finally {
		loading = false;
	}
}

// Exported functions and state
export function getUser() {
	return user;
}

export function getSession() {
	return session;
}

export function isLoading() {
	return loading;
}

export function getError() {
	return error;
}

export function clearError() {
	error = null;
}

export {
	initialize,
	signUp,
	signIn,
	signOut,
	resetPassword,
	updatePassword
};
