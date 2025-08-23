import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { View } from '@/components/Themed';
import { useRouter } from "expo-router";
import { Headphones } from "lucide-react-native";

export default function Setting() {
  const router = useRouter();
  const [speed, setSpeed] = useState(0.8); 
  const [intensity, setIntensity] = useState(0.6); 
  const [voice, setVoice] = useState("female");

  const getSpeedLabel = (val: number) => {
    if (val < 0.4) return "Sangat Lambat";
    if (val < 0.7) return "Lambat";
    if (val < 0.9) return "Normal";
    return "Cepat";
  };

  const getIntensityLabel = (val: number) => {
    if (val < 0.4) return "Rendah";
    if (val < 0.7) return "Sedang";
    return "Tinggi";
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Pengaturan Suara</Text>
        <Text style={styles.subtitle}>
          Atur preferensi suara yang Anda inginkan
        </Text>

        {/* Kecepatan Bicara */}
        <Text style={styles.label}>Kecepatan Bicara</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={speed}
          minimumTrackTintColor="#272829"
          maximumTrackTintColor="#E5E5E5"
          thumbTintColor="#272829"
          onValueChange={setSpeed}
        />
        <Text style={styles.infoText}>
          {Math.round(speed * 100)}% - {getSpeedLabel(speed)}
        </Text>

        {/* Pilih suara */}
        <View style={styles.voiceRow}>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              voice === "female" && styles.voiceButtonActive,
            ]}
            onPress={() => setVoice("female")}
          >
            <Text
              style={[
                styles.voiceText,
                voice === "female" && styles.voiceTextActive,
              ]}
            >
              Suara Perempuan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              voice === "male" && styles.voiceButtonActive,
            ]}
            onPress={() => setVoice("male")}
          >
            <Text
              style={[
                styles.voiceText,
                voice === "male" && styles.voiceTextActive,
              ]}
            >
              Suara Laki-laki
            </Text>
          </TouchableOpacity>
        </View>

        {/* Intensitas Getaran */}
        <Text style={styles.label}>Intensitas Getaran</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={intensity}
          minimumTrackTintColor="#272829"
          maximumTrackTintColor="#E5E5E5"
          thumbTintColor="#272829"
          onValueChange={setIntensity}
        />
        <Text style={styles.infoText}>
          {Math.round(intensity * 100)}% - {getIntensityLabel(intensity)}
        </Text>

        <View style={styles.iconContainer}>
          <Headphones size={30} color="#272829" />
        </View>

        {/* Tombol */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(auth)/welcome")}
        >
          <Text style={styles.buttonTextActive}>Lanjutkan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonInactive} onPress={() => router.back()}>
          <Text style={styles.buttonTextInactive}>Kembali</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    borderRadius: 15,
    padding: 30,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#DADADA",
  },
  title: {
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
    textAlign: "center",
    color: "#272829",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "PoppinsMedium",
    textAlign: "center",
    marginBottom: 20,
    color: "#707070",
  },
  label: {
    fontSize: 12,
    fontFamily: "PoppinsSemiBold",
    marginBottom: 6,
    marginTop: 10,
    color: "#272829",
  },
  infoText: {
    fontSize: 12,
    fontFamily: "PoppinsMedium",
    color: "#707070",
    marginBottom: 10,
  },
  voiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  voiceButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#DADADA",
    alignItems: "center",
    marginHorizontal: 4,
  },
  voiceButtonActive: {
    backgroundColor: "#272829",
    borderColor: "#272829",
  },
  voiceText: {
    fontSize: 12,
    fontFamily: "PoppinsMedium",
    color: "#272829",
  },
  voiceTextActive: {
    color: "#fff",
  },
  iconContainer: {
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#DADADA",
    borderRadius: 50,
    width: 60,
    height: 60,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#272829",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonTextActive: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PoppinsMedium",
  },
  buttonInactive: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#DADADA",
  },
  buttonTextInactive: {
    color: "#272829",
    fontSize: 16,
    fontFamily: "PoppinsMedium",
  },
});
