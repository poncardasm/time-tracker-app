# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimalist Progressive Web App (PWA) for time tracking. It's a client-side-only application with no backend - all data is stored in browser localStorage. The app supports both real-time task tracking and manual time entry, with dark mode support and CSV export functionality.

## Tech Stack

- **Build Tool**: Vite 6.x (latest stable)
- **Frontend**: Vanilla JavaScript (ES6+ modules), HTML5, CSS3
- **Styling**: Tailwind CSS 3.x (latest stable, PostCSS processed)
- **PWA**: Service Worker with network-first caching strategy
- **Data Persistence**: Browser localStorage

## Architecture

### Core Application Flow

1. **State Management** (src/main.js:45-49): The app maintains minimal global state including `currentTask` (active timer), `timerInterval`, `editingTaskIndex`, and `modalMode`
2. **Data Storage** (src/main.js:275-294): All task records are stored in localStorage under the key 'timeTrackerTasks' as JSON
3. **Timer System** (src/main.js:195-243): Uses `setInterval` for live tracking, calculating elapsed time by comparing current time with `startTime`

### Key Components

- **Modal System**: Tri-modal design supporting 'start', 'manual', and 'edit' modes controlled by `modalMode` state variable (src/main.js:144-183)
- **History Table**: Dynamic rendering from localStorage with inline edit buttons and checkbox selection (src/main.js:296-384)
- **Theme System**: Dark mode with localStorage persistence and system preference detection (src/main.js:547-580)
- **Service Worker** (public/sw.js): Implements network-first strategy with special handling for HTML files (always fetch fresh to ensure updates are visible)

### Data Structure

Task records follow this schema:

```javascript
{
    taskName: string,      // User-provided description
    startTime: number,     // Unix timestamp (ms)
    endTime: number,       // Unix timestamp (ms)
    durationMs: number     // Calculated duration in milliseconds
}
```

## Development Workflow

### Installing Dependencies

First, install the required dependencies:

```bash
npm install
```

### Running the Application

#### Development Mode

Start the Vite development server with hot module replacement:

```bash
npm run dev
```

The app will automatically open at <http://localhost:8000>. Changes to source files will be reflected immediately.

#### Production Build

Build the optimized production bundle:

```bash
npm run build
```

Output will be in the `dist/` directory.

#### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Testing PWA Functionality

1. Serve over HTTPS (required for service workers) or use localhost
2. Open DevTools → Application → Service Workers to monitor SW lifecycle
3. Test offline: DevTools → Network → Set to "Offline" mode

### Service Worker Cache Updates

When modifying src/main.js, src/main.css, or other cached resources:

1. Increment the `CACHE_NAME` version in public/sw.js (currently 'time-tracker-v4')
2. The SW update mechanism in src/main.js:585-619 will automatically reload the page when a new SW is installed

### Project Structure

```
time-tracker-app/
├── index.html              # Main HTML file
├── src/
│   ├── main.js            # Application logic and entry point
│   └── main.css           # Tailwind CSS imports and custom styles
├── public/
│   ├── sw.js              # Service Worker for PWA functionality
│   ├── manifest.json      # PWA manifest
│   ├── icon-192.svg       # App icon (192x192)
│   └── icon-512.svg       # App icon (512x512)
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Dependencies and scripts
```

## Important Implementation Details

### Timer Persistence

The timer does NOT persist across page reloads. If a user refreshes while tracking, the active task is lost. This is an intentional simplification for the MVP.

### Modal Mode System

The task modal serves three purposes controlled by `modalMode`:

- **'start'**: Simple task name input for immediate tracking
- **'manual'**: Task name + start/end datetime inputs for past entries
- **'edit'**: Same as manual but pre-populated with existing task data

The `editingTaskIndex` state variable tracks which task is being edited (null when not editing).

### CSV Export

The export function (src/main.js:425-507) uses the modern File System Access API (`showSaveFilePicker`) when available, with automatic fallback to blob download for unsupported browsers.

### XSS Prevention

User input (task names) is escaped before rendering in the history table using the `escapeHtml` function (src/main.js:509-513) to prevent XSS attacks.

### Checkbox Selection

- Individual checkboxes use `data-index` attributes to map to task array indices
- "Select All" checkbox is disabled when history is empty
- Delete button dynamically shows count of selected items
- Selection state doesn't persist across history reloads

## Common Modification Scenarios

### Adding New Fields to Tasks

1. Update the task record structure in `startTask` and `endTask` functions
2. Modify `loadHistory` to display the new field in the table
3. Update `exportToCSV` to include the new field in CSV output
4. Consider migration strategy for existing localStorage data

### Changing the Caching Strategy

Edit public/sw.js:24-60. Current strategy is network-first with cache fallback. HTML files always bypass cache (public/sw.js:28-40) to ensure updates are immediately visible.

### Working with Tailwind CSS

Tailwind classes are processed at build time by PostCSS. To add custom styles:

1. Add utility classes directly in HTML
2. For custom CSS, add to src/main.css (will be processed by Tailwind)
3. Extend Tailwind theme in tailwind.config.js

Tailwind's dark mode uses the 'class' strategy, toggling the `dark` class on the `<html>` element.

### Adding New UI Modes

Follow the pattern of `modalMode` and `editingTaskIndex` state variables. Update the `showModal` function to handle the new mode.
