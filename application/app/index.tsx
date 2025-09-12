import { StyleSheet, Image } from 'react-native';
import { View } from '@/components/Themed';
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/connect"); 
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={{ width: 200, height: 149 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
