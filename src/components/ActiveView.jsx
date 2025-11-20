import React from 'react';
import { formatTime } from '../utils';

export function ActiveView({ activeTask, elapsedMs, pomodoroState, onStop }) {
  const { description, mode } = activeTask;
  
  const displayTime = mode === 'pomodoro' ? pomodoroState.remaining : elapsedMs;
  
  return (
    <div className="text-center">
      <div className="mb-2">
        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium tracking-wide uppercase">
          Now Tracking
        </span>
      </div>
      
      {mode === 'pomodoro' && (
         <div className="mb-4">
           {pomodoroState.phase === 'work' ? (
             <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-xs font-bold uppercase tracking-wider">
               Focus Time
             </span>
           ) : (
             <span className="inline-block px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-bold uppercase tracking-wider">
               Break Phase
             </span>
           )}
         </div>
      )}

      <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-6 break-words">
        {description}
      </h3>

      <div id="timer-display" className="text-6xl font-mono font-bold text-gray-900 dark:text-white mb-8 tracking-wider">
        {formatTime(displayTime)}
      </div>

      <button
        onClick={onStop}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
      >
        Stop Tracking
      </button>
    </div>
  );
}

