import React from 'react';

export function Header({ toggleTheme, isDark }) {
  return (
    <header className="mb-10 text-center relative w-full max-w-md">
      <button
        onClick={toggleTheme}
        className="absolute right-0 top-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-gray-300 cursor-pointer z-10"
        aria-label="Toggle Dark Mode"
      >
        {isDark ? (
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
      <h1 className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 tracking-tight">
        Time Tracker
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        Focus on your work, we'll track the time.
      </p>
    </header>
  );
}

