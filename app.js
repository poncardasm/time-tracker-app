/**
 * Minimalist Time Tracker - MVP
 * Handles timer logic, state management, and Local Storage persistence.
 */

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

// Buttons
const btnStartTask = document.getElementById('btn-start-task');
const btnEndTask = document.getElementById('btn-end-task');
const btnCancelModal = document.getElementById('btn-cancel-modal');

// --- State ---
let currentTask = null; // { description, startTime }
let timerInterval = null;
const STORAGE_KEY = 'timeTrackerTasks';

// --- Initialization ---
function init() {
    loadHistory();

    // Check if there's a task currently running (persisted in session or just memory if we wanted to go that far, 
    // but for MVP we'll just start fresh or maybe check if we want to support reload persistence later.
    // For now, simple start.)
}

// --- Event Listeners ---
btnStartTask.addEventListener('click', showModal);
btnCancelModal.addEventListener('click', hideModal);
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = taskInput.value.trim();
    if (description) {
        startTask(description);
        hideModal();
        taskInput.value = ''; // Reset input
    }
});

btnEndTask.addEventListener('click', endTask);

// Close modal on outside click
taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) {
        hideModal();
    }
});

// --- Core Functions ---

function showModal() {
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
                <td class="px-6 py-4 text-sm text-gray-500 text-center italic" colspan="5">No tasks recorded yet.</td>
            </tr>
        `;
        return;
    }

    tasks.forEach(task => {
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
            <td class="px-6 py-4 text-sm text-gray-900 font-medium">${escapeHtml(task.taskName)}</td>
            <td class="px-6 py-4 text-sm text-gray-500">${dateStr}</td>
            <td class="px-6 py-4 text-sm text-gray-500">${startTimeStr}</td>
            <td class="px-6 py-4 text-sm text-gray-500">${endTimeStr}</td>
            <td class="px-6 py-4 text-sm text-gray-900 font-mono text-right">${formatTime(task.durationMs)}</td>
        `;
        historyList.appendChild(row);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Run Init
init();
