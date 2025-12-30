let activeTask = $state(null); // { description, project, startTime, mode }
let elapsedMs = $state(0);
let pomodoroState = $state({
  phase: 'work', // 'work', 'break'
  remaining: 25 * 60 * 1000,
  workDuration: 25 * 60 * 1000,
  breakDuration: 5 * 60 * 1000,
});

let intervalId = null;

function notifyUser(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/icon-192.svg' });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body, icon: '/icon-192.svg' });
      }
    });
  }
}

function startTimer() {
  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(() => {
    if (!activeTask) return;

    if (activeTask.mode === 'stopwatch') {
      elapsedMs = Date.now() - activeTask.startTime;
    } else if (activeTask.mode === 'pomodoro') {
      const nextRemaining = pomodoroState.remaining - 1000;

      if (nextRemaining <= 0) {
        // Switch phase
        const nextPhase = pomodoroState.phase === 'work' ? 'break' : 'work';
        const nextDuration = nextPhase === 'work' ? pomodoroState.workDuration : pomodoroState.breakDuration;

        notifyUser(
          nextPhase === 'break' ? "Time for a break!" : "Back to work!",
          nextPhase === 'break' ? "Great work! Take 5 minutes to recharge." : "Break is over. Let's focus!"
        );

        pomodoroState = {
          ...pomodoroState,
          phase: nextPhase,
          remaining: nextDuration
        };
      } else {
        pomodoroState = { ...pomodoroState, remaining: nextRemaining };
      }
    }
  }, 1000);
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

// Prevent accidental tab close when task is active
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', (event) => {
    if (activeTask) {
      event.preventDefault();
      event.returnValue = 'You have an active task timer running. Are you sure you want to leave?';
      return event.returnValue;
    }
  });
}

export function getActiveTask() {
  return activeTask;
}

export function getElapsedMs() {
  return elapsedMs;
}

export function getPomodoroState() {
  return pomodoroState;
}

export function startTask(description, project, mode = 'stopwatch') {
  const now = Date.now();
  activeTask = {
    description,
    project,
    startTime: now,
    mode,
  };

  if (mode === 'stopwatch') {
    elapsedMs = 0;
  } else {
    // Initialize Pomodoro
    pomodoroState = {
      ...pomodoroState,
      phase: 'work',
      remaining: pomodoroState.workDuration
    };

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  startTimer();
}

export function stopTask() {
  if (!activeTask) return null;

  const now = Date.now();
  const duration = now - activeTask.startTime;

  const taskRecord = {
    taskName: activeTask.description,
    project: activeTask.project,
    startTime: activeTask.startTime,
    endTime: now,
    durationMs: duration,
  };

  activeTask = null;
  elapsedMs = 0;
  stopTimer();

  return taskRecord;
}
