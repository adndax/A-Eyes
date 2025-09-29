import { Audio, AVPlaybackStatus } from "expo-av";
import * as Speech from 'expo-speech';

let sound: Audio.Sound | null = null;
// Mengubah tipe dari NodeJS.Timeout menjadi any agar kompatibel dengan React Native
let alertInterval: any | null = null;

/** Convert angle (90 to -90 degrees) to stereo pan (-1 to 1) */
function angleToPan(angleDeg: number): number {
  const clamped = Math.max(-90, Math.min(90, angleDeg));
  return -clamped / 90;
}

function getBeepParams(distanceLevel: number) {
  switch (distanceLevel) {
    case 1:
      return { interval: 200, volume: 1.0 }; // Near: fast & loud
    case 2:
      return { interval: 500, volume: 0.6 }; // Mid: medium
    default:
      return { interval: 1000, volume: 0.3 }; // Far: slow & quiet
  }
}

function angleToDirectionID(angleDeg: number): 'kiri' | 'kanan' | 'depan' {
  if (angleDeg < -15) return 'kanan';
  if (angleDeg > 15) return 'kiri';
  return 'depan';
}

function angleToClockFront(angleDeg: number): 9|10|11|12|1|2|3 {
  const clamped = Math.max(-90, Math.min(90, angleDeg));
  const idx = Math.round((clamped + 90) / 30);
  const map: Array<9|10|11|12|1|2|3> = [3, 2, 1, 12, 11, 10, 9];
  return map[idx];
}


export async function initSpatialAudio() {
  if (sound) return;

  try {
    console.log("Initializing Audio System...");
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false, // Penting agar tidak boros baterai
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    const { sound: newSound } = await Audio.Sound.createAsync(
      require("../../assets/audio/beep.mp3"),
      { shouldPlay: false }
    );
    sound = newSound;
    console.log("Audio System Initialized Successfully.");
  } catch (error) {
    console.error("Failed to initialize spatial audio:", error);
  }
}

/** Play a single beep with specific settings */
async function playBeep(pan: number, volume: number) {
  if (!sound) return;
  try {
    // Menggunakan setStatusAsync untuk mengatur semua properti secara atomik
    await sound.setStatusAsync({
      shouldPlay: true,
      positionMillis: 0, // Putar ulang dari awal
      volume: volume,
      pan: pan, // Mengatur stereo pan di sini
    } as any); // Menambahkan 'as any' untuk melewati pemeriksaan tipe TypeScript
  } catch (error) {
    console.error("Error playing beep:", error);
  }
}

/** Play spatial beeps for obstacle detection */
export function playObstacleAlert(
  angleDeg: number,
  distanceLevel: number,
  durationMs: number = 2000
) {
  if (!sound) {
    console.warn("Sound not initialized. Call initSpatialAudio first.");
    return;
  }

  // Hentikan interval peringatan sebelumnya jika masih berjalan
  if (alertInterval) {
    clearInterval(alertInterval);
  }

  const { interval, volume } = getBeepParams(distanceLevel);
  const pan = angleToPan(angleDeg);

  // Putar beep pertama kali secara langsung
  playBeep(pan, volume);

  // Atur interval untuk beep berikutnya
  alertInterval = setInterval(() => {
    playBeep(pan, volume);
  }, interval);

  // Atur timer untuk menghentikan interval setelah durasi selesai
  setTimeout(() => {
    if (alertInterval) {
      clearInterval(alertInterval);
      alertInterval = null;
    }
  }, durationMs - 50); // Hentikan sedikit lebih awal
}

export async function stopObstacleAlert() {
  if (alertInterval) {
    clearInterval(alertInterval);
    alertInterval = null;
  }
  if (sound) {
    try {
      await sound.stopAsync();
    } catch (error) {
      console.error("Error stopping sound:", error);
    }
  }
}

export function stopSpeechAlert() {
  try {
    Speech.stop();
  } catch (e) {
    console.error("Error stopping speech:", e);
  }
}

export async function stopAlert() {
  await stopObstacleAlert();
  stopSpeechAlert();
}

/** Speech alert: "Terdapat {rintangan} di {kiri/kanan/depan}, arah jam {x}." */
export function speakObstacleAlert(angleDeg: number, obstacleName = 'rintangan') {
  try { Speech.stop(); } catch {}
  const dir = angleToDirectionID(angleDeg);
  const jam = angleToClockFront(angleDeg);
  const kalimat =
    dir === 'depan'
      ? `Terdapat ${obstacleName} di depan, arah jam ${jam}.`
      : `Terdapat ${obstacleName} di ${dir}, arah jam ${jam}.`;
  Speech.speak(kalimat, { language: 'id-ID', rate: 1.0, pitch: 1.0 });
}

/**
 * Main chooser:
 * mode = 0 → beep
 * mode = 1 → speech
 */
export async function playAlert(
  mode: 0 | 1,
  angleDeg: number,
  distanceLevel: number,
  obstacleName?: string
) {
  if (mode === 0) {
    // optional: stop any ongoing speech before beep
    stopSpeechAlert();
    playObstacleAlert(angleDeg, distanceLevel);
  } else {
    // optional: stop any ongoing beep before speech
    await stopObstacleAlert();
    speakObstacleAlert(angleDeg, obstacleName ?? 'rintangan');
  }
}