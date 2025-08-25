import { StyleSheet, Image } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function Latihan() {
  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>Tab Four</Text>
    //   <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    //   <EditScreenInfo path="app/(tabs)/two.tsx" />
    // </View>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Latihan Kognitif</Text>
        <Text style={styles.desc}>
          Pilih jenis latihan yang ingin Anda lakukan
        </Text>
      </View>
      <View>
        <View>
          <Image source={require("../../assets/images/Sound.png")} />
        </View>
        <View></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  header: {
    gap: 10,
  },
  desc: {
    fontSize: 16,
  },
});
