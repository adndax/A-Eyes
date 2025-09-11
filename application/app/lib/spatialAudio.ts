// application/app/lib/spatialAudio.ts
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Platform } from 'react-native';

let loaded = false;
let sound: Audio.Sound | null = null;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// Map angle (-90..90) to stereo pan (-1..1). Negative = left, positive = right.
function angleToPan(angleDeg: number) {
  const a = clamp(angleDeg, -90, 90);
  return a / 90; // -1..1
}

/** Distance → tempo & volume (single audio file) */
function distParams(distanceCm: number) {
  if (distanceCm <= 100) return { intervalMs: 180, volume: 0.95 }; // near: urgent, loud, fast
  if (distanceCm <= 300) return { intervalMs: 400, volume: 0.7 };  // mid
  return { intervalMs: 800, volume: 0.45 };                        // far: calmer
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function loadOneBeep() {
  const s = new Audio.Sound();
  await s.loadAsync(require('../../assets/audio/beep.mp3'), {
    shouldPlay: false,
    isLooping: false,
    volume: 1,
  });
  return s;
}

/** Call once (e.g., in your root screen) */
export async function initSpatialAudio() {
  if (loaded) return;

  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
  });

  sound = await loadOneBeep();
  loaded = true;
}

function jitter(v: number, pct = 0.08) {
  const d = v * pct;
  return v + (Math.random() * 2 - 1) * d;
}

async function playOnce(volume: number, pan: number) {
  if (!sound) return;

  // Stop/rewind just in case
  try { await sound.stopAsync(); } catch {}
  try { await sound.setPositionAsync(0); } catch {}

  // volume works both platforms; audioPan (Expo) is effective on Android
  const baseStatus: any = { volume: clamp(volume, 0, 1), shouldPlay: true };
  if (Platform.OS === 'android') {
    baseStatus.audioPan = clamp(pan, -1, 1);
  }

  await sound.setStatusAsync(baseStatus);

  // wait for completion
  let done = false;
  sound.setOnPlaybackStatusUpdate((st: AVPlaybackStatus) => {
    if ('didJustFinish' in st && st.didJustFinish) done = true;
  });
  while (!done) await sleep(10);
  sound.setOnPlaybackStatusUpdate(null);
}

/**
 * Public: play a burst of spatial beeps based on angle & distance.
 * Uses ONE audio file; adjusts tempo/volume only. Pan is applied when available.
 */
export async function playSpatialBips(angleDeg: number, distanceCm: number, durationMs = 1200) {
  await initSpatialAudio();
  if (!sound) return;

  const { intervalMs, volume } = distParams(distanceCm);
  const pan = angleToPan(angleDeg);
  const stopAt = Date.now() + durationMs;

  while (Date.now() < stopAt) {
    await playOnce(volume, pan);
    await sleep(Math.max(0, jitter(intervalMs)));
  }
}

/** Long-running stream that you can update with new angle/distance */
export function startSpatialStream(initialAngle: number, initialDistance: number) {
  let angle = initialAngle;
  let dist = initialDistance;
  let stopped = false;

  (async function loop() {
    await initSpatialAudio();
    while (!stopped) {
      await playSpatialBips(angle, dist, 900);
      await sleep(120);
    }
  })();

  return {
    update(a: number, d: number) { angle = a; dist = d; },
    stop() { stopped = true; },
  };
}
