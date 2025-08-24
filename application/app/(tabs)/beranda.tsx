import { Pressable, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';

const name = "Elios";

export default function Beranda() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        style={{ paddingHorizontal: 20, paddingTop: 16 }}
      >
        {/* Header */}
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: '600', color: '#272829' }}>
            Selamat Datang, {name}!
          </Text>
          <Text style={{ marginTop: 4, fontSize: 14, color: '#272829' }}>
            Pilih aktivitas yang ingin Anda lakukan
          </Text>
        </View>

        <Pressable
          style={{
            marginTop: 20,
            width: '100%',
            borderRadius: 8,
            backgroundColor: '#48814C',
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}
          onPress={() => {}}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontWeight: '500',
                marginLeft: 8,
                fontSize: 16,
              }}
            >
              Kacamata Terhubung
            </Text>
          </View>
        </Pressable>

        <Text
          style={{
            marginTop: 32,
            marginBottom: 12,
            fontSize: 16,
            fontWeight: '600',
            color: '#374151',
          }}
        >
          Menu Utama
        </Text>

        <MenuCard
          icon={<MaterialCommunityIcons name="book-open-variant" size={60} color="#4B5563"/>
          }
          title="Panduan Awal"
          subtitle="Pelajari cara menggunakan A-Eyes"
          onPress={() => {}}
        />

        <MenuCard
          style={{ marginTop: 16 }}
          icon={<FontAwesome5 name="running" size={60} color="#4B5563" />}
          title="Mulai Olahraga"
          subtitle="Olahraga secara mandiri dengan panduan AI"
          onPress={() => {}}
        />
      </ScrollView>
    </View>
  );
}

type MenuCardProps = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  style?: object;
};

function MenuCard({ title, subtitle, icon, onPress, style }: MenuCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          borderRadius: 16,
          borderWidth: 1.5,
          borderColor: '#DADADA',
          backgroundColor: 'white',
          padding: 24,
        },
        style,
      ]}
      android_ripple={{ color: '#white' }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ marginBottom: 12 }}>{icon}</View>
        <Text style={{ fontSize: 16, fontWeight: '600', lineHeight:24, color: '#000000' }}>
          {title}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontWeight: '500',
            lineHeight: 24,
            color: '#535C60',
          }}
        >
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}