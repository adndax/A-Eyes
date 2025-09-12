import { Audio, AVPlaybackStatus } from 'expo-av';
import { Platform } from 'react-native';

let sound: Audio.Sound | null = null;

/** Convert angle (-90 to 90 degrees) to stereo pan (-1 to 1) */
function angleToPan(angleDeg: number): number {
  const clampedAngle = Math.max(-90, Math.min(90, angleDeg));
  return clampedAngle / 90; // -1 (left) to 1 (right)
}

function getBeepParams(distanceLevel: number) {
  switch (distanceLevel) {
    case 1: return { interval: 200, volume: 1.0 };    // Near: fast & loud
    case 2: return { interval: 500, volume: 0.6 };    // Mid: medium
    default: return { interval: 1000, volume: 0.3 };  // Far: slow & quiet
  }
}

/** Initialize audio system - call once at app start */
export async function initSpatialAudio() {
  if (sound) return;
  
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
  });
  
  sound = new Audio.Sound();
  await sound.loadAsync(require('../../assets/audio/beep.mp3'), {
    shouldPlay: false,
    isLooping: false,
  });
}

/** Play spatial beeps for obstacle detection */
export async function playObstacleAlert(angleDeg: number, distanceLevel: number, durationMs: number = 2000) {
  if (!sound) await initSpatialAudio();
  if (!sound) return;
  
  const { interval, volume } = getBeepParams(distanceLevel);
  const pan = angleToPan(angleDeg);
  const endTime = Date.now() + durationMs;
  
  while (Date.now() < endTime) {
    await sound.setPositionAsync(0);
    
    const playbackConfig: any = { volume, shouldPlay: true };
    if (Platform.OS === 'android') {
      playbackConfig.audioPan = pan;
    }
    
    await sound.setStatusAsync(playbackConfig);
    
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}