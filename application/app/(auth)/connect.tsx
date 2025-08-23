import { StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { View } from '@/components/Themed';
import { useRouter } from "expo-router";
import { Link as LinkIcon } from "lucide-react-native";

export default function Connect() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Selamat Datang!</Text>

        <Image
          source={require("../../assets/images/logoo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>Hubungkan Kacamata A-Eyes</Text>
        <Text style={styles.desc}>Pastikan kacamata dalam mode pairing</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(auth)/connect2")}
        >
          <LinkIcon color="white" size={25} style={{ marginRight: 4, marginLeft: 10 }} />
          <Text style={styles.buttonText}>Sambungkan dengan Kacamata A-Eyes</Text>
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
  logo: {
    width: 100,
    height: 100,
    marginVertical: 0,
  },
  title: {
    fontSize: 20,
    fontFamily: "PoppinsBold", 
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "PoppinsSemiBold", 
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    fontFamily: "PoppinsRegular", 
    color: "#707070",
    marginBottom: 10,
  },
  button: {
  flexDirection: "row",
  alignItems: "center",      // vertical center
  justifyContent: "center",  // horizontal center
  backgroundColor: "#272829",
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 8,
  marginTop: 10,
},

buttonText: {
  color: "#fff",
  fontSize: 14,
  fontFamily: "PoppinsMedium",
  flex: 1,                // biar teks ambil ruang tersisa
  textAlign: "center",    // teksnya center
},

});
