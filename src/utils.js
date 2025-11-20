export function formatTime(ms) {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => num.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function toLocalISOString(date) {
  const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(date - offset).toISOString().slice(0, -1);
  return localISOTime.substring(0, 16); // Format: YYYY-MM-DDTHH:MM
}

// Shared Audio instance
let notificationAudio = null;

export function initializeAudioContext() {
  try {
    if (!notificationAudio) {
      notificationAudio = new Audio('/notification.mp3');
      // Preload audio metadata
      notificationAudio.load();
    }
    
    // On user interaction, we can try to play and immediately pause to unlock audio on iOS/some browsers
    // However, full playback is usually allowed if triggered by user interaction.
    // Just creating the Audio object is often enough to prime it for later use.
  } catch (e) {
    console.error('Error initializing audio:', e);
  }
}

export function playNotificationSound() {
  try {
    if (!notificationAudio) {
      notificationAudio = new Audio('/notification.mp3');
    }
    
    // Reset playback position to start
    notificationAudio.currentTime = 0;
    
    const playPromise = notificationAudio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Audio playback failed:', error);
      });
    }
  } catch (e) {
    console.error('Error playing sound:', e);
  }
}

