// Tasks store - migrated to use Supabase with localStorage cache
import { supabase } from '../lib/supabase.js';
import { getUser } from './auth.svelte.js';

const STORAGE_KEY = 'timeTrackerTasks';
const CACHE_KEY = 'timeTrackerTasksCache';

// State
let tasks = $state([]);
let loading = $state(false);
let error = $state(null);
let initialized = $state(false);

// Initialize tasks from Supabase
export async function initializeTasks() {
	const user = getUser();
	if (!user) {
		tasks = [];
		initialized = true;
		return;
	}

	try {
		loading = true;
		error = null;

		// Fetch tasks from Supabase
		const { data, error: fetchError } = await supabase
			.from('tasks')
			.select('*')
			.eq('user_id', user.id)
			.order('start_time', { ascending: false });

		if (fetchError) throw fetchError;

		// Convert timestamps to numbers for compatibility
		tasks = (data || []).map(task => ({
			id: task.id,
			taskName: task.task_name,
			project: task.project,
			startTime: new Date(task.start_time).getTime(),
			endTime: new Date(task.end_time).getTime(),
			durationMs: task.duration_ms
		}));

		// Cache in localStorage for offline access
		saveToCache(tasks);
		initialized = true;
	} catch (err) {
		console.error('Error initializing tasks:', err);
		error = err.message;

		// Fallback to cached data
		tasks = loadFromCache();
		initialized = true;
	} finally {
		loading = false;
	}
}

// Load from localStorage cache
function loadFromCache() {
	if (typeof window === 'undefined') return [];
	const data = localStorage.getItem(CACHE_KEY);
	return data ? JSON.parse(data) : [];
}

// Save to localStorage cache
function saveToCache(tasksToCache) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(CACHE_KEY, JSON.stringify(tasksToCache));
}

// Legacy localStorage support (for migration)
function loadLegacyTasks() {
	if (typeof window === 'undefined') return [];
	const data = localStorage.getItem(STORAGE_KEY);
	return data ? JSON.parse(data) : [];
}

export function getTasks() {
	return tasks;
}

export function isLoading() {
	return loading;
}

export function getError() {
	return error;
}

export function isInitialized() {
	return initialized;
}

export function clearError() {
	error = null;
}

// Add task to Supabase
export async function addTask(task) {
	const user = getUser();
	if (!user) {
		error = 'User not authenticated';
		return { success: false, error: 'User not authenticated' };
	}

	// Optimistic update
	const tempTask = { ...task, id: `temp-${Date.now()}` };
	tasks = [tempTask, ...tasks];
	saveToCache(tasks);

	try {
		loading = true;
		error = null;

		const { data, error: insertError } = await supabase
			.from('tasks')
			.insert([{
				user_id: user.id,
				task_name: task.taskName,
				project: task.project,
				start_time: new Date(task.startTime).toISOString(),
				end_time: new Date(task.endTime).toISOString(),
				duration_ms: task.durationMs
			}])
			.select()
			.single();

		if (insertError) throw insertError;

		// Replace temp task with real one
		const realTask = {
			id: data.id,
			taskName: data.task_name,
			project: data.project,
			startTime: new Date(data.start_time).getTime(),
			endTime: new Date(data.end_time).getTime(),
			durationMs: data.duration_ms
		};

		tasks = [realTask, ...tasks.filter(t => t.id !== tempTask.id)];
		saveToCache(tasks);

		return { success: true, data: realTask };
	} catch (err) {
		console.error('Error adding task:', err);
		error = err.message;

		// Revert optimistic update
		tasks = tasks.filter(t => t.id !== tempTask.id);
		saveToCache(tasks);

		return { success: false, error: err.message };
	} finally {
		loading = false;
	}
}

// Update task in Supabase
export async function updateTask(index, updatedTask) {
	const user = getUser();
	if (!user) {
		error = 'User not authenticated';
		return { success: false, error: 'User not authenticated' };
	}

	const taskToUpdate = tasks[index];
	if (!taskToUpdate) {
		error = 'Task not found';
		return { success: false, error: 'Task not found' };
	}

	// Optimistic update
	const previousTasks = [...tasks];
	tasks = tasks.map((t, i) => i === index ? { ...updatedTask, id: taskToUpdate.id } : t);
	saveToCache(tasks);

	try {
		loading = true;
		error = null;

		const { data, error: updateError } = await supabase
			.from('tasks')
			.update({
				task_name: updatedTask.taskName,
				project: updatedTask.project,
				start_time: new Date(updatedTask.startTime).toISOString(),
				end_time: new Date(updatedTask.endTime).toISOString(),
				duration_ms: updatedTask.durationMs
			})
			.eq('id', taskToUpdate.id)
			.eq('user_id', user.id)
			.select()
			.single();

		if (updateError) throw updateError;

		// Update with server response
		const realTask = {
			id: data.id,
			taskName: data.task_name,
			project: data.project,
			startTime: new Date(data.start_time).getTime(),
			endTime: new Date(data.end_time).getTime(),
			durationMs: data.duration_ms
		};

		tasks = tasks.map((t, i) => i === index ? realTask : t);
		saveToCache(tasks);

		return { success: true, data: realTask };
	} catch (err) {
		console.error('Error updating task:', err);
		error = err.message;

		// Revert optimistic update
		tasks = previousTasks;
		saveToCache(tasks);

		return { success: false, error: err.message };
	} finally {
		loading = false;
	}
}

// Delete tasks from Supabase
export async function deleteTasks(indicesToDelete) {
	const user = getUser();
	if (!user) {
		error = 'User not authenticated';
		return { success: false, error: 'User not authenticated' };
	}

	const tasksToDelete = indicesToDelete.map(index => tasks[index]).filter(Boolean);
	const idsToDelete = tasksToDelete.map(t => t.id).filter(id => !id.startsWith('temp-'));

	if (idsToDelete.length === 0) {
		error = 'No valid tasks to delete';
		return { success: false, error: 'No valid tasks to delete' };
	}

	// Optimistic update
	const previousTasks = [...tasks];
	tasks = tasks.filter((_, index) => !indicesToDelete.includes(index));
	saveToCache(tasks);

	try {
		loading = true;
		error = null;

		const { error: deleteError } = await supabase
			.from('tasks')
			.delete()
			.in('id', idsToDelete)
			.eq('user_id', user.id);

		if (deleteError) throw deleteError;

		return { success: true };
	} catch (err) {
		console.error('Error deleting tasks:', err);
		error = err.message;

		// Revert optimistic update
		tasks = previousTasks;
		saveToCache(tasks);

		return { success: false, error: err.message };
	} finally {
		loading = false;
	}
}

// Check for legacy localStorage data for migration
export function hasLegacyData() {
	const legacyTasks = loadLegacyTasks();
	return legacyTasks.length > 0;
}

// Get legacy tasks for migration
export function getLegacyTasks() {
	return loadLegacyTasks();
}

// Clear legacy localStorage after successful migration
export function clearLegacyData() {
	if (typeof window !== 'undefined') {
		localStorage.removeItem(STORAGE_KEY);
	}
}

// Migrate legacy localStorage tasks to Supabase
export async function migrateLegacyTasks() {
	const user = getUser();
	if (!user) {
		return { success: false, error: 'User not authenticated' };
	}

	const legacyTasks = loadLegacyTasks();
	if (legacyTasks.length === 0) {
		return { success: false, error: 'No legacy tasks to migrate' };
	}

	// Validate tasks
	const validTasks = legacyTasks.filter(task => {
		return (
			task.taskName &&
			task.startTime &&
			task.endTime &&
			task.durationMs &&
			!isNaN(task.startTime) &&
			!isNaN(task.endTime) &&
			task.durationMs > 0
		);
	});

	if (validTasks.length === 0) {
		return { success: false, error: 'No valid tasks found to migrate' };
	}

	try {
		loading = true;
		error = null;

		// Prepare tasks for bulk insert
		const tasksToInsert = validTasks.map(task => ({
			user_id: user.id,
			task_name: task.taskName,
			project: task.project || null,
			start_time: new Date(task.startTime).toISOString(),
			end_time: new Date(task.endTime).toISOString(),
			duration_ms: task.durationMs
		}));

		// Bulk insert to Supabase
		const { data, error: insertError } = await supabase
			.from('tasks')
			.insert(tasksToInsert)
			.select();

		if (insertError) throw insertError;

		// Convert to client format and update local state
		const migratedTasks = (data || []).map(task => ({
			id: task.id,
			taskName: task.task_name,
			project: task.project,
			startTime: new Date(task.start_time).getTime(),
			endTime: new Date(task.end_time).getTime(),
			durationMs: task.duration_ms
		}));

		// Refresh tasks list
		await initializeTasks();

		// Clear legacy data
		clearLegacyData();

		return {
			success: true,
			migratedCount: migratedTasks.length,
			totalCount: legacyTasks.length,
			invalidCount: legacyTasks.length - validTasks.length
		};
	} catch (err) {
		console.error('Error migrating tasks:', err);
		error = err.message;
		return { success: false, error: err.message };
	} finally {
		loading = false;
	}
}
