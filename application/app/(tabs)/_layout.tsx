import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Text } from 'react-native';
import { Image } from "react-native";

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function CustomTabBarItem({ 
  source, 
  label, 
  focused, 
  colorScheme 
}: {
  source: any;
  label: string;
  focused: boolean;
  colorScheme: 'light' | 'dark';
}) {
  return (
    <View
      style={{
        backgroundColor: focused ? '#272829' : 'transparent',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 60,
      }}
    >
      <Image
        source={source}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? '#fff' : '#445867',
          marginBottom: 4,
        }}
        resizeMode="contain"
      />
      <Text
        style={{
          fontSize: 10,
          fontWeight: '500',
          color: focused ? '#fff' : '#445867',
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

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
        tabBarInactiveTintColor: '#445867',
        headerShown: false,
        tabBarShowLabel: false, 
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 12,
          height: 70,
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarItem
              source={require("@/assets/images/beranda.png")}
              label="Beranda"
              focused={focused}
              colorScheme={colorScheme ?? 'light'}
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
            <CustomTabBarItem
              source={require("@/assets/images/riwayat.png")}
              label="Riwayat"
              focused={focused}
              colorScheme={colorScheme ?? 'light'}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="komunitas"
        options={{
          title: 'Komunitas',
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarItem
              source={require("@/assets/images/komunitas.png")}
              label="Komunitas"
              focused={focused}
              colorScheme={colorScheme ?? 'light'}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="latihan"
        options={{
          title: 'Latihan',
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarItem
              source={require("@/assets/images/latihan.png")}
              label="Latihan"
              focused={focused}
              colorScheme={colorScheme ?? 'light'}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarItem
              source={require("@/assets/images/profil.png")}
              label="Profil"
              focused={focused}
              colorScheme={colorScheme ?? 'light'}
            />
          ),
        }}
      />
    </Tabs>
  );
}