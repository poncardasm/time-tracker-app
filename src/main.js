/**
 * Minimalist Time Tracker - MVP
 * Handles timer logic, state management, and Local Storage persistence.
 */

import './main.css';

// --- DOM Elements ---
const startView = document.getElementById('start-view');
const activeView = document.getElementById('active-view');
const taskModal = document.getElementById('task-modal');
const taskModalContent = document.getElementById('task-modal-content');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const currentTaskNameEl = document.getElementById('current-task-name');
const timerDisplay = document.getElementById('timer-display');
const historyList = document.getElementById('history-list');
const totalTasksCount = document.getElementById('total-tasks-count');
const manualTimeFields = document.getElementById('manual-time-fields');
const startTimeInput = document.getElementById('start-time-input');
const endTimeInput = document.getElementById('end-time-input');

// Buttons
const btnStartTask = document.getElementById('btn-start-task');
const btnManualEntry = document.getElementById('btn-manual-entry');
const btnEndTask = document.getElementById('btn-end-task');
const themeToggle = document.getElementById('theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const btnDeleteSelected = document.getElementById('btn-delete-selected');
const btnExportCsv = document.getElementById('btn-export-csv');
const selectAllCheckbox = document.getElementById('select-all-checkbox');

// Delete Modal Elements
const deleteModal = document.getElementById('delete-modal');
const deleteModalContent = document.getElementById('delete-modal-content');
const deleteModalText = document.getElementById('delete-modal-text');
const btnCancelDelete = document.getElementById('btn-cancel-delete');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');

// --- State ---
let currentTask = null; // { description, startTime }
let timerInterval = null;
let editingTaskIndex = null; // Index of task being edited, or null
let modalMode = 'start'; // 'start', 'manual', 'edit'
const STORAGE_KEY = 'timeTrackerTasks';

// --- Initialization ---
function init() {
    loadHistory();
    initTheme();

    // Check if there's a task currently running (persisted in session or just memory if we wanted to go that far,
    // but for MVP we'll just start fresh or maybe check if we want to support reload persistence later.
    // For now, simple start.)
}

// --- Event Listeners ---
themeToggle.addEventListener('click', toggleTheme);
btnStartTask.addEventListener('click', () => showModal('start'));
btnManualEntry.addEventListener('click', () => showModal('manual'));
btnCancelModal.addEventListener('click', hideModal);
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = taskInput.value.trim();

    if (!description) return;

    if (modalMode === 'start') {
        startTask(description);
    } else if (modalMode === 'manual') {
        const start = new Date(startTimeInput.value).getTime();
        const end = new Date(endTimeInput.value).getTime();

        if (isNaN(start) || isNaN(end) || start >= end) {
            alert('Please enter valid start and end times (End time must be after start time).');
            return;
        }

        const taskRecord = {
            taskName: description,
            startTime: start,
            endTime: end,
            durationMs: end - start
        };
        saveTask(taskRecord);
        loadHistory();
    } else if (modalMode === 'edit') {
        const start = new Date(startTimeInput.value).getTime();
        const end = new Date(endTimeInput.value).getTime();

        if (isNaN(start) || isNaN(end) || start >= end) {
            alert('Please enter valid start and end times.');
            return;
        }

        updateTask(editingTaskIndex, {
            taskName: description,
            startTime: start,
            endTime: end,
            durationMs: end - start
        });
    }

    hideModal();
    taskInput.value = '';
});

btnEndTask.addEventListener('click', endTask);

btnDeleteSelected.addEventListener('click', showDeleteModal);
btnExportCsv.addEventListener('click', exportToCSV);
selectAllCheckbox.addEventListener('change', toggleSelectAll);

// Delete Modal Listeners
btnCancelDelete.addEventListener('click', hideDeleteModal);
btnConfirmDelete.addEventListener('click', confirmDelete);
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) hideDeleteModal();
});

// Close modal on outside click
taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) {
        hideModal();
    }
});

// --- Core Functions ---

function showModal(mode = 'start', index = null) {
    modalMode = mode;
    editingTaskIndex = index;

    // Reset fields
    taskInput.value = '';
    startTimeInput.value = '';
    endTimeInput.value = '';
    manualTimeFields.classList.add('hidden');

    if (mode === 'start') {
        // Default view
    } else if (mode === 'manual') {
        manualTimeFields.classList.remove('hidden');
        // Set default times (e.g., last hour)
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        startTimeInput.value = toLocalISOString(oneHourAgo);
        endTimeInput.value = toLocalISOString(now);
    } else if (mode === 'edit' && index !== null) {
        manualTimeFields.classList.remove('hidden');
        const tasks = getTasks();
        const task = tasks[index];
        if (task) {
            taskInput.value = task.taskName;
            startTimeInput.value = toLocalISOString(new Date(task.startTime));
            endTimeInput.value = toLocalISOString(new Date(task.endTime));
        }
    }

    taskModal.classList.remove('hidden');
    // Small delay to allow display:block to apply before opacity transition
    setTimeout(() => {
        taskModal.classList.remove('opacity-0');
        taskModalContent.classList.remove('scale-95');
        taskModalContent.classList.add('scale-100');
        taskInput.focus();
    }, 10);
}

function hideModal() {
    taskModal.classList.add('opacity-0');
    taskModalContent.classList.remove('scale-100');
    taskModalContent.classList.add('scale-95');
    setTimeout(() => {
        taskModal.classList.add('hidden');
    }, 300);
}

function startTask(description) {
    const now = Date.now();
    currentTask = {
        description,
        startTime: now
    };

    // Update UI
    currentTaskNameEl.textContent = description;
    startView.classList.add('hidden');
    activeView.classList.remove('hidden');

    // Start Timer
    updateTimerDisplay(0);
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - currentTask.startTime;
        updateTimerDisplay(elapsed);
    }, 1000);
}

function endTask() {
    if (!currentTask) return;

    const now = Date.now();
    const duration = now - currentTask.startTime;

    clearInterval(timerInterval);

    // Create Record
    const taskRecord = {
        taskName: currentTask.description,
        startTime: currentTask.startTime,
        endTime: now,
        durationMs: duration
    };

    // Save to Local Storage
    saveTask(taskRecord);

    // Reset State
    currentTask = null;

    // Update UI
    activeView.classList.add('hidden');
    startView.classList.remove('hidden');

    // Refresh History
    loadHistory();
}

function updateTimerDisplay(ms) {
    timerDisplay.textContent = formatTime(ms);
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// --- Persistence ---

function saveTask(record) {
    const tasks = getTasks();
    tasks.unshift(record); // Add to beginning (newest first)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateTask(index, updatedRecord) {
    const tasks = getTasks();
    if (index >= 0 && index < tasks.length) {
        tasks[index] = updatedRecord;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        loadHistory();
    }
}

function getTasks() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function loadHistory() {
    const tasks = getTasks();
    totalTasksCount.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;

    historyList.innerHTML = '';

    if (tasks.length === 0) {
        historyList.innerHTML = `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-500 text-center italic" colspan="6">No tasks recorded yet.</td>
            </tr>
        `;
        selectAllCheckbox.disabled = true;
        selectAllCheckbox.checked = false;
        btnExportCsv.disabled = true;
        updateDeleteButtonState();
        return;
    }
    selectAllCheckbox.disabled = false;
    btnExportCsv.disabled = false;

    tasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0';

        const dateStr = new Date(task.startTime).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric'
        });
        const startTimeStr = new Date(task.startTime).toLocaleTimeString(undefined, {
            hour: '2-digit', minute: '2-digit'
        });
        const endTimeStr = new Date(task.endTime).toLocaleTimeString(undefined, {
            hour: '2-digit', minute: '2-digit'
        });

        row.innerHTML = `
            <td class="px-6 py-4">
                <input type="checkbox" class="task-checkbox rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" data-index="${index}">
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 font-medium">
                <div class="flex items-center justify-between group">
                    <span>${escapeHtml(task.taskName)}</span>
                    <button class="text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 edit-task-btn" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">${dateStr}</td>
            <td class="px-6 py-4 text-sm text-gray-500">${startTimeStr}</td>
            <td class="px-6 py-4 text-sm text-gray-500">${endTimeStr}</td>
            <td class="px-6 py-4 text-sm text-gray-900 font-mono text-right">${formatTime(task.durationMs)}</td>
        `;
        historyList.appendChild(row);
    });

    // Add listeners to new checkboxes
    document.querySelectorAll('.task-checkbox').forEach(cb => {
        cb.addEventListener('change', updateDeleteButtonState);
    });

    // Add listeners to edit buttons
    document.querySelectorAll('.edit-task-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index);
            showModal('edit', index);
        });
    });

    // Reset header checkbox
    selectAllCheckbox.checked = false;
    updateDeleteButtonState();
}

function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
    updateDeleteButtonState();
}

function updateDeleteButtonState() {
    const selectedCount = document.querySelectorAll('.task-checkbox:checked').length;
    btnDeleteSelected.disabled = selectedCount === 0;
    btnDeleteSelected.textContent = selectedCount > 0 ? `Delete Selected (${selectedCount})` : 'Delete Selected';
}

function showDeleteModal() {
    const checkboxes = document.querySelectorAll('.task-checkbox:checked');
    if (checkboxes.length === 0) return;

    deleteModalText.textContent = `Are you sure you want to delete ${checkboxes.length} task${checkboxes.length !== 1 ? 's' : ''}? This action cannot be undone.`;

    deleteModal.classList.remove('hidden');
    setTimeout(() => {
        deleteModal.classList.remove('opacity-0');
        deleteModalContent.classList.remove('scale-95');
        deleteModalContent.classList.add('scale-100');
    }, 10);
}

function hideDeleteModal() {
    deleteModal.classList.add('opacity-0');
    deleteModalContent.classList.remove('scale-100');
    deleteModalContent.classList.add('scale-95');
    setTimeout(() => {
        deleteModal.classList.add('hidden');
    }, 300);
}

function confirmDelete() {
    const checkboxes = document.querySelectorAll('.task-checkbox:checked');
    const indicesToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index)).sort((a, b) => b - a);

    let tasks = getTasks();

    indicesToDelete.forEach(index => {
        tasks.splice(index, 1);
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    hideDeleteModal();
    loadHistory();
}

async function exportToCSV() {
    const tasks = getTasks();

    if (tasks.length === 0) {
        return;
    }

    // CSV Headers
    const headers = ['Task Name', 'Date', 'Start Time', 'End Time', 'Duration'];

    // Convert tasks to CSV rows
    const rows = tasks.map(task => {
        const date = new Date(task.startTime).toLocaleDateString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const startTime = new Date(task.startTime).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const endTime = new Date(task.endTime).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const duration = formatTime(task.durationMs);

        // Escape task name for CSV (handle commas and quotes)
        const escapedTaskName = `"${task.taskName.replace(/"/g, '""')}"`;

        return [escapedTaskName, date, startTime, endTime, duration].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Generate filename with current date
    const now = new Date();
    const filename = `time-tracker-export-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;

    // Try to use the File System Access API (Save As dialog)
    if ('showSaveFilePicker' in window) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: filename,
                types: [{
                    description: 'CSV File',
                    accept: { 'text/csv': ['.csv'] },
                }],
            });
            const writable = await handle.createWritable();
            await writable.write(csvContent);
            await writable.close();
            return; // Success
        } catch (err) {
            // User cancelled or API failed, fall back to download link if it wasn't a cancel
            if (err.name !== 'AbortError') {
                console.error('File Picker failed:', err);
            } else {
                return; // User cancelled, don't fallback
            }
        }
    }

    // Fallback: Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function toLocalISOString(date) {
    const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(date - offset)).toISOString().slice(0, -1);
    return localISOTime.substring(0, 16); // Format: YYYY-MM-DDTHH:MM
}

// --- Theme Management ---

function initTheme() {
    // Check local storage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        updateThemeIcons(true);
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcons(false);
    }
}

function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
        updateThemeIcons(false);
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
        updateThemeIcons(true);
    }
}

function updateThemeIcons(isDark) {
    if (isDark) {
        iconSun.classList.remove('hidden');
        iconMoon.classList.add('hidden');
    } else {
        iconSun.classList.add('hidden');
        iconMoon.classList.remove('hidden');
    }
}

// Run Init
init();

// Register Service Worker for PWA functionality
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
                console.log(
                    "Service Worker registered successfully:",
                    registration.scope
                );

                // Check for updates every time the page loads
                registration.update();

                // Listen for updates
                registration.addEventListener("updatefound", () => {
                    const newWorker = registration.installing;
                    console.log("New service worker found, installing...");

                    newWorker.addEventListener("statechange", () => {
                        if (
                            newWorker.state === "installed" &&
                            navigator.serviceWorker.controller
                        ) {
                            // New service worker is ready, reload to activate it
                            console.log("New service worker installed, reloading...");
                            window.location.reload();
                        }
                    });
                });
            })
            .catch((error) => {
                console.log("Service Worker registration failed:", error);
            });

        // Also check if there's a waiting service worker
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            console.log("Service worker controller changed, reloading...");
            window.location.reload();
        });
    });
}
