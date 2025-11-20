<!-- 3f707981-559f-42d2-a409-a01b8acffb9e 54ab1b0e-9108-497b-8e44-0cc56d22db24 -->
# Create Feature Recommendations Document

I will compile a comprehensive list of recommended features to improve the Time Tracker App, categorized by impact and effort, and save it to `docs/feature-ideas.md`.

## Proposed Content for `docs/feature-ideas.md`

### 1. Core Functionality Enhancements

- **Projects & Tags**: Add a "Project" or "Category" field to tasks for better organization.
- **Billable Rates**: Add an optional hourly rate field to calculate earnings.
- **Pomodoro Mode**: Add a countdown timer option (e.g., 25m work / 5m break).

### 2. Data & Persistence

- **Data Import/Restore**: Allow users to import a backup JSON file (critical since data is local-only).
- **Cloud Sync (Optional)**: Research optional syncing (e.g., via Remotestorage.js or generic WebDAV) for advanced users.

### 3. User Experience (UX)

- **Keyboard Shortcuts**: Add hotkeys (e.g., `Space` to toggle timer, `N` for new task).
- **Browser Tab Timer**: Update the page title with the running time so it's visible in other tabs.
- **Search & Filter**: Add a search bar and date range picker to the history view.

### 4. Visualizations

- **Dashboard**: Add a simple "Stats" view showing:
- Total time today/this week.
- Time distribution by project (if projects are added).
- Activity heat map (GitHub style).

## Implementation Plan

1.  Create a new file `docs/feature-ideas.md`.
2.  Write the detailed feature list with implementation tips for each (e.g., libraries to use, complexity estimates).