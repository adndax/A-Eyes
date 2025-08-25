import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import {
  Volume2,
  Radio,
  Brain,
  Eye,
  Clock,
  Users,
  Dumbbell,
  User,
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function Latihan() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Latihan Kognitif</Text>
        <Text style={styles.desc}>
          Pilih jenis latihan yang ingin Anda lakukan
        </Text>
      </View>

      <View style={styles.exerciseList}>
        <TouchableOpacity
          style={styles.exerciseCard}
          onPress={() => router.push("/(exec)/spatial" as any)}
        >
          <View style={styles.iconContainer}>
            <Volume2 size={24} color="#fff" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Latihan Audio Spasial</Text>
            <Text style={styles.cardDesc}>
              Latih kemampuan mengenali arah suara
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exerciseCard}
          onPress={() => router.push("/(exec)/haptic" as any)}
        >
          <View style={styles.iconContainer}>
            <Radio size={24} color="#fff" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Latihan Getaran</Text>
            <Text style={styles.cardDesc}>
              Latih kepekaan terhadap pola getaran
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exerciseCard}
          onPress={() => router.push("/(exec)/combi" as any)}
        >
          <View style={styles.iconContainer}>
            <Brain size={24} color="#fff" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Latihan Kombinasi</Text>
            <Text style={styles.cardDesc}>
              Gabungan audio spasial dan getaran
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.historyButton}>
        <Eye size={20} color="#fff" style={styles.historyIcon} />
        <Text style={styles.historyText}>Lihat Riwayat Latihan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  desc: {
    fontSize: 16,
    color: "#6b7280",
  },
  exerciseList: {
    flex: 1,
    gap: 16,
  },
  exerciseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4b5563",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  historyButton: {
    backgroundColor: "#374151",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  historyIcon: {
    marginRight: 8,
  },
  historyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
