function getInitialTheme() {
  if (typeof window === 'undefined') return false;
  return (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
}

let isDark = $state(getInitialTheme());

function applyTheme() {
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  }
}

// Apply theme on initial load
if (typeof window !== 'undefined') {
  applyTheme();
}

export function getIsDark() {
  return isDark;
}

export function toggleTheme() {
  isDark = !isDark;
  applyTheme();
}
