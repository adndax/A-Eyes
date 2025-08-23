import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { View } from '@/components/Themed';
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Masuk</Text>
        <Text style={styles.subtitle}>Masuk ke akun A-Eyes Anda</Text>

        <Text style={styles.label}>Nama</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama.."
          placeholderTextColor="#B0B0B0"
        />

        <Text style={styles.label}>Usia</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan usia.."
          placeholderTextColor="#B0B0B0"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(auth)/setting")}
        >
          <Text style={styles.buttonTextActive}>Lanjutkan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonInactive}
          onPress={() => router.back()}
        >
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
    fontSize: 14,
    fontFamily: "PoppinsMedium",
    marginBottom: 6,
    marginTop: 10,
    color: "#272829",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#DADADA",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    color: "#272829",
    marginBottom: 10,
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
    fontSize: 14,
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
    fontSize: 14,
    fontFamily: "PoppinsMedium",
  },
});
