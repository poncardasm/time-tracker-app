<!-- bab4c59c-61ac-4c73-ab65-70f6a125b18b 8becd25c-f49d-4879-9d72-ad1d76915b00 -->
# Implement Pomodoro Notification & Sound Alert

I will add a sound alert and ensure notifications are triggered when a Pomodoro session (25 minutes) ends.

## Implementation Steps

1.  **Create Feature Branch**: Create and switch to `feature/pomodoro-notification`.
2.  **Add Sound Utility**: 

    -   Modify `src/utils.js` to add a `playNotificationSound()` function.
    -   Use the Web Audio API to generate a pleasant "beep" or "ding" sound (no external files needed).

3.  **Integrate with Timer**:

    -   Modify `src/hooks/useTimer.js` to import `playNotificationSound`.
    -   Call `playNotificationSound()` inside the `useEffect` hook where the Pomodoro timer reaches zero (alongside the existing `notifyUser` call).

4.  **Verify Notification Logic**:

    -   Ensure the existing `notifyUser` function is correctly handling permissions and displaying notifications.

## User Verification

-   Start a Pomodoro timer.
-   Wait for the timer to finish (or temporarily reduce the duration for testing).
-   Verify that a system notification appears and a sound plays.

### To-dos

- [ ] Create and switch to branch feature/pomodoro-notification
- [ ] Implement playNotificationSound in src/utils.js
- [ ] Update src/hooks/useTimer.js to play sound on timer completion