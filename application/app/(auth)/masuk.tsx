import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from '@/components/Themed';
import { useRouter } from "expo-router";
import { UsersRound, UserRoundPlus } from "lucide-react-native";

export default function Connect() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Masuk</Text>
        <Text style={styles.subtitle}>Pilih cara akses ke A-Eyes</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(auth)/connect2")}
        >
          <UsersRound color="white" size={22} style={{ marginRight: 10 }} />
          <Text style={styles.buttonTextActive}>Masuk dengan Akun</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonInactive}
          onPress={() => router.push("/(auth)/connect2")}
        >
          <UserRoundPlus color="#272829" size={22} style={{ marginRight: 10 }} />
          <Text style={styles.buttonTextInactive}>Masuk tanpa Akun (Tamu)</Text>
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
    padding: 35,
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: "#DADADA",
  },
  title: {
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
    marginBottom: 4,
    color: "#272829",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "PoppinsMedium",
    marginBottom: 20,
    color: "#707070",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#272829",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
  },
  buttonTextActive: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "PoppinsMedium",
  },

  buttonInactive: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: "#DADADA",
    width: "100%",
  },
  buttonTextInactive: {
    color: "#272829",
    fontSize: 14,
    fontFamily: "PoppinsMedium",
  },
});
