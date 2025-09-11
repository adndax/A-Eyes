import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { initSpatialAudio, playSpatialBips } from './lib/spatialAudio';

export default function BeepTest() {
  const [backendUrl, setBackendUrl] = useState('http://YOUR_BACKEND_IP:5000');
  const [angle, setAngle] = useState('0');       // degrees: -90..90 (− left, + right)
  const [distance, setDistance] = useState('300'); // cm
  const [running, setRunning] = useState(false);
  const timer = useRef<NodeJS.Timer | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    initSpatialAudio();
    return () => stopPolling();
  }, []);

  async function pollOnce() {
    try {
      const r = await fetch(`${backendUrl}/latest`);
      if (r.status === 204) return; // nothing yet
      const j = await r.json();
      setAngle(String(j.angle_deg ?? 0));
      setDistance(String(j.distance_cm ?? 300));

      if (!busy.current) {
        busy.current = true;
        await playSpatialBips(Number(j.angle_deg ?? 0), Number(j.distance_cm ?? 300), 800);
        busy.current = false;
      }
    } catch {
    }
  }

  function startPolling() {
    if (running) return;
    setRunning(true);
    timer.current = setInterval(pollOnce, 1000);
  }

  function stopPolling() {
    setRunning(false);
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }

  async function playFromInputs() {
    await playSpatialBips(Number(angle), Number(distance), 800);
  }

  return (
    <SafeAreaView style={styles.wrap}>
      <Text style={styles.h1}>A-Eyes Spatial Beep Test</Text>

      <View style={styles.block}>
        <Text>Backend URL</Text>
        <TextInput
          style={styles.input}
          value={backendUrl}
          onChangeText={setBackendUrl}
          autoCapitalize="none"
        />
        <View style={styles.row}>
          <Button title={running ? 'Polling…' : 'Start Polling'} onPress={startPolling} disabled={running} />
          <Button title="Stop" onPress={stopPolling} />
        </View>
      </View>

      <View style={styles.block}>
        <Text>Manual Test</Text>
        <Text>Angle (°) −90..90</Text>
        <TextInput style={styles.input} value={angle} onChangeText={setAngle} keyboardType="numeric" />
        <Text>Distance (cm)</Text>
        <TextInput style={styles.input} value={distance} onChangeText={setDistance} keyboardType="numeric" />
        <View style={styles.row}>
          <Button title="Near" onPress={() => setDistance('80')} />
          <Button title="Mid" onPress={() => setDistance('200')} />
          <Button title="Far" onPress={() => setDistance('500')} />
        </View>
        <Button title="Play From Inputs" onPress={playFromInputs} />
      </View>

      <Text style={{ marginTop: 12 }}>
        Tip: use headphones. Negative angle = left, positive = right. Closer = faster & louder.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16, gap: 12 },
  h1: { fontSize: 18, fontWeight: '600' },
  block: { gap: 8, marginTop: 6 },
  row: { flexDirection: 'row', gap: 10, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 },
});

// import { StyleSheet, Image } from 'react-native';
// import { View } from '@/components/Themed';
// import { useRouter } from "expo-router";
// import { useEffect } from "react";

// export default function SplashScreen() {
//   const router = useRouter();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       router.replace("/(auth)/connect"); 
//     }, 2000); 

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require("../assets/images/logo.png")}
//         style={{ width: 200, height: 149 }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
