import { StyleSheet, Image, Text } from "react-native";
import { View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)"); 
    }, 3000); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Selamat Datang, Elios!</Text>

        <Image
          source={require("../../assets/images/welcome.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>
          A-Eyes siap mendampingimu hari ini. Ayo bergerak mandiri, aman, dan percaya diri!
        </Text>
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
    height: 150,
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
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
});
