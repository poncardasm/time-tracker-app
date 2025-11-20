# Sharing the Time Tracker App with Friends

This guide explains how to share this time tracking app with friends so they can use it on their local machines with offline functionality and local data storage.

## Option 1: Share the GitHub Repository (Recommended)

If your repository is public or you can give collaborators access:

### For the Recipient

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/time-tracker-app.git
   cd time-tracker-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the app**

   ```bash
   npm run dev
   ```

4. **Access the app**
   - Open browser to `http://localhost:8000`
   - All data will be stored locally in their browser's localStorage
   - Each user has their own independent data

### For Production Use (Optional)

If they want to build and host it themselves:

```bash
npm run build
npm run preview
```

Or serve the `dist/` folder with any web server.

## Option 2: Share a Built Version

If your friends don't have Node.js or prefer not to install dependencies:

### For You (the Sender)

1. **Build the production version**

   ```bash
   npm run build
   ```

2. **Share the `dist/` folder**
   - Zip the `dist/` folder
   - Share via email, cloud storage, or file transfer
   ```bash
   cd dist
   zip -r time-tracker-app.zip .
   ```

### For the Recipient

1. **Extract the files**

   - Unzip the `time-tracker-app.zip` to a folder

2. **Serve with a simple web server**

   Choose one of these methods:

   **Using Python (if installed):**

   ```bash
   cd time-tracker-app
   python -m http.server 8000
   ```

   **Using Node.js (if installed):**

   ```bash
   npx serve .
   ```

   **Using VS Code:**

   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Access the app**
   - Open browser to `http://localhost:8000`

## Option 3: Deploy to a Free Hosting Service

Host the app once and share the URL with multiple friends. Each user will still have their own local data.

### Recommended Free Hosting Platforms

#### Netlify (Easiest)

1. **Deploy from GitHub**

   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Share the URL**
   - You'll get a URL like `https://your-app.netlify.app`
   - Share this with friends
   - Each friend's data stays private in their own browser

#### Vercel

1. **Deploy from GitHub**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Build command: `npm run build`
   - Output directory: `dist`

2. **Share the URL**
   - You'll get a URL like `https://your-app.vercel.app`

#### GitHub Pages

1. **Build and deploy**

   ```bash
   npm run build
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

2. **Enable GitHub Pages**
   - Repository Settings → Pages
   - Source: `gh-pages` branch
   - Share the URL: `https://YOUR_USERNAME.github.io/time-tracker-app/`

## Important Notes About Data Storage

### Privacy & Data Isolation

- **Each user has their own data**: When friends use the app (whether locally or via a hosted URL), their task data is stored only in their browser's localStorage
- **Data never leaves their device**: There's no backend server, so data is completely private and never synced anywhere
- **No data sharing between users**: Even if multiple people use the same hosted URL, they each have separate data

### Data Persistence

- **Data survives browser restarts**: localStorage persists across browser sessions
- **Data is browser-specific**: Data in Chrome won't appear in Firefox (same device)
- **Data is domain-specific**: Localhost data won't appear in the hosted version
- **Clearing browser data will delete tasks**: Users should be aware that clearing site data removes all tasks

### Offline Functionality

The app works offline thanks to the Service Worker:

- First visit requires internet (to load the app)
- After first visit, the app caches itself
- Works completely offline afterward
- Data entry and viewing works without internet
- Only limitation: can't access the app from a new device while offline

## Backup & Data Export

Since data is stored locally, users should regularly:

1. **Export to CSV**

   - Click "Export to CSV" button in the app
   - Saves a CSV file with all task history
   - Can be opened in Excel, Google Sheets, etc.

2. **Manual Backup** (Advanced)
   - Open browser DevTools (F12)
   - Go to Application → Local Storage
   - Find key: `timeTrackerTasks`
   - Copy the JSON value to a text file

## Troubleshooting

### "The app won't load offline"

- Make sure they visited the app at least once while online
- Check if Service Worker is enabled (DevTools → Application → Service Workers)

### "My data disappeared"

- They may have cleared browser data
- Check if they're using a different browser
- Check if they're using http vs https or different domain

### "I can't install dependencies"

- Make sure Node.js is installed: [nodejs.org](https://nodejs.org)
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Recommendations

- **For developers**: Share via GitHub (Option 1)
- **For non-technical users**: Deploy to Netlify/Vercel and share the URL (Option 3)
- **For complete privacy**: Share built version for local hosting (Option 2)

All options ensure data stays local and offline-capable!
