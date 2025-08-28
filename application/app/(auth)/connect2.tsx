import { StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { View } from '@/components/Themed';
import { useRouter } from "expo-router";

export default function Connect2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Kacamata Terhubung!</Text>

        <Image
          source={require("../../assets/images/connected.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>
          Perangkat telah tersambung. Saatnya melangkah bebas, tanpa ragu.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(auth)/option")}
        >
          <Text style={styles.buttonText}>Masuk</Text>
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
    width: "90%",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 116,
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "PoppinsSemiBold",
    marginBottom: 12,
    color: "#272829",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: "#272829",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#272829",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
  },
});
