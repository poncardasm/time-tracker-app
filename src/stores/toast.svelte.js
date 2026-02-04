// Toast notification store
let toasts = $state([]);

let nextId = 0;

export function showToast(message, type = 'info', duration = 5000) {
	const id = nextId++;
	const toast = {
		id,
		message,
		type, // 'success', 'error', 'warning', 'info'
		duration
	};

	toasts = [...toasts, toast];

	if (duration > 0) {
		setTimeout(() => {
			removeToast(id);
		}, duration);
	}

	return id;
}

export function removeToast(id) {
	toasts = toasts.filter(t => t.id !== id);
}

export function getToasts() {
	return toasts;
}

// Convenience functions
export function showSuccess(message, duration = 3000) {
	return showToast(message, 'success', duration);
}

export function showError(message, duration = 5000) {
	return showToast(message, 'error', duration);
}

export function showWarning(message, duration = 4000) {
	return showToast(message, 'warning', duration);
}

export function showInfo(message, duration = 3000) {
	return showToast(message, 'info', duration);
}
