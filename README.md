# Time Tracker App

A minimalist Progressive Web App (PWA) for time tracking built with Svelte 5, featuring cloud sync, authentication, and multi-device support.

## Features

- ⏱️ **Real-time Task Tracking**: Live timer with stopwatch and Pomodoro modes
- ☁️ **Cloud Sync**: Automatic synchronization across all your devices via Supabase
- 🔐 **User Authentication**: Secure email/password authentication with authorized access control
- ✍️ **Manual Time Entry**: Add past tasks with custom start/end times
- 📊 **Task History**: View, edit, and delete tracked tasks with project categorization
- 📥 **CSV Export**: Export your time tracking data for analysis
- 🌓 **Dark Mode**: Seamless light/dark theme switching with system preference detection
- 💾 **Offline Support**: Service Worker caching with localStorage fallback
- 🔔 **Notifications**: Browser notifications for Pomodoro timer phase changes
- 📱 **PWA**: Installable on mobile and desktop devices
- 🚀 **Data Migration**: Import existing localStorage data to cloud on first login

## Tech Stack

- **Frontend Framework**: Svelte 5 (with runes)
- **Build Tool**: Vite 6.x
- **Styling**: Tailwind CSS 4.x
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth with Row Level Security (RLS)
- **PWA**: Service Worker with network-first caching strategy
- **Data Persistence**: Supabase cloud database + localStorage cache

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/time-tracker-app.git
   cd time-tracker-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Supabase**:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL script in `supabase/setup.sql` in your Supabase SQL Editor
   - Add authorized emails to the `authorized_emails` table
   - See `supabase/README.md` for detailed setup instructions

4. **Configure environment variables**:
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-publishable-api-key
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
│   ├── App.svelte         # Root Svelte component
│   ├── main.js            # Application entry point
│   ├── main.css           # Tailwind CSS imports and custom styles
│   ├── utils.js           # Utility functions
│   ├── lib/
│   │   └── supabase.js    # Supabase client configuration
│   ├── stores/
│   │   ├── auth.svelte.js    # Authentication state management
│   │   ├── tasks.svelte.js   # Task data and CRUD operations
│   │   ├── timer.svelte.js   # Active timer and Pomodoro logic
│   │   ├── theme.svelte.js   # Dark mode state
│   │   └── toast.svelte.js   # Toast notification system
│   └── components/
│       ├── AuthProvider.svelte    # Authentication wrapper
│       ├── Login.svelte           # Login form
│       ├── SignUp.svelte          # Registration form
│       ├── ForgotPassword.svelte  # Password reset
│       ├── Header.svelte          # App header with user info
│       ├── StartView.svelte       # Start/manual entry buttons
│       ├── ActiveView.svelte      # Active timer display
│       ├── TaskModal.svelte       # Task creation/editing modal
│       ├── DeleteModal.svelte     # Delete confirmation
│       ├── MigrationModal.svelte  # Data migration UI
│       ├── HistoryList.svelte     # Task history table
│       ├── SyncStatus.svelte      # Online/offline indicator
│       ├── LoadingSkeleton.svelte # Loading state UI
│       └── Toast.svelte           # Toast notifications
├── public/
│   ├── sw.js              # Service Worker for PWA
│   ├── manifest.json      # PWA manifest
│   └── *.svg              # App icons
├── supabase/
│   ├── setup.sql          # Database schema and RLS policies
│   └── README.md          # Supabase setup instructions
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── CLAUDE.md              # AI assistant development guide
├── DEPLOYMENT.md          # Production deployment guide
└── package.json           # Dependencies and scripts
```

## Usage

### First Time Setup

1. **Sign Up**: Register with an authorized email address
2. **Sign In**: Login with your credentials
3. **Migrate Data** (optional): Import existing localStorage data if prompted

### Tracking Time

1. **Start Tracking**:
   - Click "Start New Task"
   - Enter task name and optional project
   - Choose timer mode (Stopwatch or Pomodoro)
   - Click "Start Tracking"

2. **Stop Tracking**: Click "Stop Task" when finished

3. **Manual Entry**:
   - Click "Add Manual Entry"
   - Enter task details with custom start/end times
   - Click "Save Entry"

### Managing Tasks

- **Edit Tasks**: Click the edit icon next to any task
- **Delete Tasks**: Select tasks with checkboxes and click "Delete Selected"
- **Export Data**: Click "Export to CSV" to download tracking data
- **View Sync Status**: Check the status indicator in the header (Synced/Syncing/Offline)

### Pomodoro Timer

- 25-minute work sessions followed by 5-minute breaks
- Browser notifications alert you when phases change
- Automatic phase switching with optional notifications

### Dark Mode

Toggle between light and dark themes using the sun/moon icon in the header.

## Data Storage and Sync

- **Primary Storage**: Supabase cloud database (PostgreSQL)
- **Offline Cache**: localStorage for offline access
- **Multi-Device Sync**: Automatic synchronization across all logged-in devices
- **Row Level Security**: Users can only access their own data

## Security

- **Authentication**: Supabase Auth with email/password
- **Authorized Access**: Only pre-approved emails can sign up
- **Row Level Security**: Database policies ensure data isolation
- **Secure API Keys**: Environment variables for Supabase credentials
- **HTTPS**: Required for PWA and Service Worker functionality

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions, including:
- Environment variable configuration
- Deployment to Vercel or Netlify
- Supabase production setup
- Post-deployment verification
- Troubleshooting common issues

## Development Guide

For AI assistants and contributors, see [CLAUDE.md](CLAUDE.md) for:
- Detailed architecture documentation
- Component structure and data flow
- Store patterns and state management
- Common modification scenarios
- Svelte 5 runes usage patterns

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- **GitHub Issues**: Report bugs or request features
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Svelte Docs**: [svelte.dev](https://svelte.dev)

## Acknowledgments

- Built with [Svelte 5](https://svelte.dev)
- Backend powered by [Supabase](https://supabase.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Bundled with [Vite](https://vitejs.dev)
