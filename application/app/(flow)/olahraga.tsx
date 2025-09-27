import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Pressable, ScrollView } from "react-native";
import { Text, View } from "@/components/Themed";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  initSpatialAudio,
  playAlert,
  stopAlert,
} from "../lib/spatialAudio";

const API_URL = "http://192.168.1.9:3000/api/latest-analysis";

const isSpeak: 0 | 1 = 1; // 0 = beep only, 1 = speak obstacle
// TODO: change to not constant, but user-selectable in settings

type Obstacle = {
  name: string;
  confidence: number;
  position: {
    angle: number;
    distance: string; // "1", "2", or "3"
    relative_size: string;
  };
};

type AnalysisResult = {
  metadata: {
    filename: string;
    timestamp: string;
  };
  analysis: {
    objects: Obstacle[];
    total_objects: number;
  };
};

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${mm}:${ss}`;
}

async function fetchLatestAnalysis(): Promise<AnalysisResult | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`API Error fetching analysis: ${response.status}`);
      }
      return null;
    }
    const data: AnalysisResult = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.name !== "AbortError") {
      console.error("Failed to fetch analysis:", error.message);
    }
    return null;
  }
}

export default function SesiOlahraga() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string; rute?: string }>();

  const mode = params.mode ?? "Jalan Cepat";
  const rute = params.rute ?? "Rute Taman";
  const router = useRouter();

  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [guidanceEnabled, setGuidanceEnabled] = useState(true);
  const [lastObstacleTime, setLastObstacleTime] = useState(0);
  const [lastAnalysisTimestamp, setLastAnalysisTimestamp] = useState<string | null>(null);

  const distanceRef = useRef(0);
  const [distance, setDistance] = useState(0);
  const isPlayingAlert = useRef(false);

  useEffect(() => {
    initSpatialAudio().catch(console.error);
    return () => {
      stopAlert();
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused) {
        setSeconds((s) => s + 1);
        distanceRef.current += 1.33;
        setDistance(distanceRef.current);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (!guidanceEnabled || paused) {
      stopAlert();
      return;
    }

    const obstacleCheckInterval = setInterval(async () => {
      const currentTime = Date.now();
      if (currentTime - lastObstacleTime < 3000 || isPlayingAlert.current) {
        return;
      }

      const result = await fetchLatestAnalysis();
      if (!result || result.metadata.timestamp === lastAnalysisTimestamp) {
        return;
      }

      setLastAnalysisTimestamp(result.metadata.timestamp);

      const obstacles = result.analysis?.objects;
      if (!obstacles || obstacles.length === 0) {
        return;
      }

      // Pick the closest (smallest distance level)
      const closestObstacle = obstacles.reduce((prev, curr) =>
        parseInt(curr.position.distance) < parseInt(prev.position.distance) ? curr : prev
      );

      const { angle, distance: distanceStr } = closestObstacle.position;
      const distanceLevel = parseInt(distanceStr);

      console.log(
        `Obstacle '${closestObstacle.name}' detected: ${angle.toFixed(0)}° at distance level ${distanceLevel}`
      );

      isPlayingAlert.current = true;
      setLastObstacleTime(currentTime);

      try {
        // ⬇️ CHANGED: use the unified playAlert (mode, angle, distanceLevel, obstacleName?)
        await playAlert(isSpeak, angle, distanceLevel, closestObstacle.name);
        // previously: playObstacleAlert(angle, distanceLevel, 2000);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error playing obstacle alert:", error.message);
        } else {
          console.error("An unknown error occurred while playing obstacle alert");
        }
      } finally {
        setTimeout(() => {
          isPlayingAlert.current = false;
        }, 2000);
      }
    }, 1500);

    return () => clearInterval(obstacleCheckInterval);
  }, [guidanceEnabled, paused, lastObstacleTime, lastAnalysisTimestamp]);

  const durMMSS = formatMMSS(seconds);
  const distanceKm = useMemo(
    () => (distance / 1000).toFixed(1).replace(".", ","),
    [distance]
  );

  const onTogglePause = () => setPaused((p) => !p);

  const onToggleGuidance = () => {
    setGuidanceEnabled((prev) => {
      if (prev) {
        stopAlert();
      }
      return !prev;
    });
  };

  const onFinish = () => {
    stopAlert();
    router.replace({
      pathname: "/olahragaSelesai",
      params: {
        durasi: durMMSS,
        jarakKm: distanceKm,
        status: paused ? "aktif & jeda" : "aktif & stabil",
        panduan: guidanceEnabled ? "ON" : "OFF",
        mode,
        rute,
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{
          paddingTop: insets.top + 170,
          paddingBottom: 28,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Sedang Berolahraga</Text>
          <Text style={styles.timer}>{durMMSS}</Text>
          <Text style={styles.subline}>
            {mode} - {rute}
          </Text>

          <View style={styles.statusRow}>
            <View style={styles.statusCol}>
              <MaterialCommunityIcons name="pulse" size={22} color="#2E3942" />
              <Text style={styles.statusLabel}>
                Status: <Text style={styles.statusOk}>Aktif</Text>
              </Text>
            </View>

            <Pressable style={styles.statusCol} onPress={onToggleGuidance}>
              <Ionicons
                name={guidanceEnabled ? "navigate" : "navigate-outline"}
                size={22}
                color={guidanceEnabled ? "#48814C" : "#2E3942"}
              />
              <Text style={styles.statusLabel}>
                Panduan:{" "}
                <Text
                  style={guidanceEnabled ? styles.statusOk : styles.statusOff}
                >
                  {guidanceEnabled ? "ON" : "OFF"}
                </Text>
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.btn, styles.btnDark]}
            onPress={onTogglePause}
          >
            <View style={styles.btnRow}>
              <MaterialCommunityIcons
                name={paused ? "play" : "pause"}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.btnDarkText}>
                {paused ? "Lanjut" : "Jeda"}
              </Text>
            </View>
          </Pressable>

          <Pressable style={[styles.btn, styles.btnGreen]} onPress={onFinish}>
            <View style={styles.btnRow}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.btnGreenText}>Selesai</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#DADADA",
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontFamily: "PoppinsSemiBold",
    fontWeight: "600",
    fontSize: 20,
    color: "#272829",
    textAlign: "center",
  },
  timer: {
    marginTop: 10,
    fontFamily: "PoppinsSemiBold",
    fontWeight: "600",
    fontSize: 32,
    color: "#000000",
    textAlign: "center",
  },
  subline: {
    fontFamily: "PoppinsMedium",
    marginTop: 4,
    fontSize: 12,
    color: "#535C60",
    textAlign: "center",
  },
  statusRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusCol: { alignItems: "center", flex: 1 },
  statusLabel: { marginTop: 6, fontSize: 12, color: "#000000" },
  statusOk: {
    fontFamily: "PoppinsMedium",
    color: "#48814C",
    fontWeight: "500",
  },
  statusOff: {
    fontFamily: "PoppinsMedium",
    color: "#CC4125",
    fontWeight: "500",
  },
  btn: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "transparent",
  },
  btnDark: { backgroundColor: "#272829" },
  btnDarkText: {
    fontFamily: "PoppinsMedium",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  btnGreen: { backgroundColor: "#48814C" },
  btnGreenText: {
    fontFamily: "PoppinsMedium",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
