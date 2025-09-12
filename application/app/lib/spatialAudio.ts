import { Audio, AVPlaybackStatus } from "expo-av";

let sound: Audio.Sound | null = null;
// Mengubah tipe dari NodeJS.Timeout menjadi any agar kompatibel dengan React Native
let alertInterval: any | null = null;

/** Convert angle (-90 to 90 degrees) to stereo pan (-1 to 1) */
function angleToPan(angleDeg: number): number {
  const clampedAngle = Math.max(-90, Math.min(90, angleDeg));
  return clampedAngle / 90; // -1 (left) to 1 (right)
}

function getBeepParams(distanceLevel: number) {
  switch (distanceLevel) {
    case 1:
      return { interval: 250, volume: 1.0 }; // Near: fast & loud
    case 2:
      return { interval: 500, volume: 0.7 }; // Mid: medium
    default:
      return { interval: 1000, volume: 0.4 }; // Far: slow & quiet
  }
}

/** Initialize audio system - call once at app start */
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

/** Function to stop any ongoing alerts immediately */
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
