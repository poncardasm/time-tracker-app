# Time Tracker App

A minimalist Progressive Web App (PWA) for time tracking built with vanilla JavaScript, Vite, and Tailwind CSS.

## Features

- ⏱️ Real-time task tracking with live timer
- ✍️ Manual time entry for past tasks
- 🌓 Dark mode support with system preference detection
- 📊 Task history with edit and delete functionality
- 📥 Export to CSV
- 💾 Offline support with Service Worker
- 📱 PWA installable on mobile and desktop

## Tech Stack

- **Build Tool**: Vite 6.4.1
- **Styling**: Tailwind CSS 3.4.18
- **Frontend**: Vanilla JavaScript (ES6+ modules)
- **PWA**: Service Worker with network-first caching

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will open at <http://localhost:8000>

### Build

Create an optimized production build:

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
time-tracker-app/
├── index.html              # Main HTML file
├── src/
│   ├── main.js            # Application logic and entry point
│   └── main.css           # Tailwind CSS imports and custom styles
├── public/
│   ├── sw.js              # Service Worker for PWA
│   ├── manifest.json      # PWA manifest
│   └── *.svg              # App icons
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## Usage

1. **Start Tracking**: Click "Start New Task", enter a task name, and begin tracking
2. **Stop Tracking**: Click "Stop Tracking" when done
3. **Manual Entry**: Add past time entries with custom start/end times
4. **Edit Tasks**: Hover over tasks in history and click the edit icon
5. **Delete Tasks**: Select tasks and click "Delete Selected"
6. **Export Data**: Click "Export to CSV" to download your tracking data
7. **Dark Mode**: Toggle between light and dark themes using the sun/moon icon

## Data Storage

All data is stored locally in your browser's localStorage. No data is sent to any server.

## License

MIT
