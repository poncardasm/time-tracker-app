import React from 'react';

export function StartView({ onStartClick, onManualClick }) {
  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Ready to focus?</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Start tracking your next task.
        </p>
      </div>
      <button
        onClick={onStartClick}
        className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 cursor-pointer"
      >
        Start New Task
      </button>
      <button
        onClick={onManualClick}
        className="w-full mt-3 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-medium transition-colors focus:outline-none focus:underline cursor-pointer"
      >
        Manual Entry
      </button>
    </div>
  );
}

