import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { Image } from "react-native";

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="beranda"
        options={{
          title: 'Beranda',
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require("@/assets/images/beranda.png")}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: color, 
                  opacity: focused ? 1 : 0.6,
                }}
                resizeMode="contain"
              />
            ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="riwayat"
        options={{
          title: 'Riwayat',
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require("@/assets/images/riwayat.png")}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: color, 
                  opacity: focused ? 1 : 0.6,
                }}
                resizeMode="contain"
              />
            ),
        }}
      />
      <Tabs.Screen
        name="komunitas"
        options={{
          title: 'Komunitas',
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require("@/assets/images/komunitas.png")}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: color, 
                  opacity: focused ? 1 : 0.6,
                }}
                resizeMode="contain"
              />
            ),
        }}
      />
      <Tabs.Screen
        name="latihan"
        options={{
          title: 'Latihan',
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require("@/assets/images/latihan.png")}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: color, 
                  opacity: focused ? 1 : 0.6,
                }}
                resizeMode="contain"
              />
            ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require("@/assets/images/profil.png")}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: color, 
                  opacity: focused ? 1 : 0.6,
                }}
                resizeMode="contain"
              />
            ),
        }}
      />
    </Tabs>
  );
}
