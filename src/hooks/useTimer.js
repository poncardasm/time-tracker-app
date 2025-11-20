import { useState, useEffect, useRef } from 'react';
import { playNotificationSound, initializeAudioContext } from '../utils';

export function useTimer() {
  const [activeTask, setActiveTask] = useState(null); // { description, project, startTime, mode }
  const [elapsedMs, setElapsedMs] = useState(0);
  
  // Pomodoro State
  const [pomodoroState, setPomodoroState] = useState({
    phase: 'work', // 'work', 'break'
    remaining: 25 * 60 * 1000,
    workDuration: 25 * 60 * 1000,
    breakDuration: 5 * 60 * 1000,
  });

  const intervalRef = useRef(null);

  const notifyUser = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon-192.svg' });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body, icon: '/icon-192.svg' });
        }
      });
    }
  };

  const startTask = (description, project, mode = 'stopwatch') => {
    const now = Date.now();
    setActiveTask({
      description,
      project,
      startTime: now,
      mode,
    });

    if (mode === 'stopwatch') {
      setElapsedMs(0);
    } else {
       // Initialize Pomodoro
       setPomodoroState(prev => ({
         ...prev,
         phase: 'work',
         remaining: prev.workDuration
       }));
       
       if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      
      // Initialize audio context on user interaction (unlock audio)
      initializeAudioContext();
    }
  };

  const stopTask = () => {
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

    setActiveTask(null);
    setElapsedMs(0);
    return taskRecord;
  };

  useEffect(() => {
    if (!activeTask) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
    }

    intervalRef.current = setInterval(() => {
      if (activeTask.mode === 'stopwatch') {
        setElapsedMs(Date.now() - activeTask.startTime);
      } else if (activeTask.mode === 'pomodoro') {
         setPomodoroState(prev => {
             const nextRemaining = prev.remaining - 1000;
             
             if (nextRemaining <= 0) {
                 // Switch phase
                 const nextPhase = prev.phase === 'work' ? 'break' : 'work';
                 const nextDuration = nextPhase === 'work' ? prev.workDuration : prev.breakDuration;
                 
                notifyUser(
                    nextPhase === 'break' ? "Time for a break!" : "Back to work!",
                    nextPhase === 'break' ? "Great work! Take 5 minutes to recharge." : "Break is over. Let's focus!"
                );
                playNotificationSound();

                return {
                    ...prev,
                     phase: nextPhase,
                     remaining: nextDuration
                 };
             }
             
             return { ...prev, remaining: nextRemaining };
         });
      }
    }, 1000);

    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTask]);

  // Prevent accidental tab close when task is active
  useEffect(() => {
    if (!activeTask) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = 'You have an active task timer running. Are you sure you want to leave?';
      return event.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [activeTask]);

  return {
      activeTask,
      elapsedMs,
      pomodoroState,
      startTask,
      stopTask
  };
}

