import { Tabs } from 'expo-router';
import { Camera, MessageCircle, Users, User } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#FFFC00',
        tabBarInactiveTintColor: '#666666',
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="stories"
        options={{
          title: 'Stories',
          tabBarIcon: ({ size, color }) => (
            <View style={[styles.iconContainer, { borderColor: color }]}>
              <Users size={size - 4} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ size, color }) => (
            <View style={[styles.cameraIconContainer, { backgroundColor: color }]}>
              <Camera size={size + 4} color="#000000" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ size, color }) => (
            <View style={[styles.iconContainer, { borderColor: color }]}>
              <MessageCircle size={size - 4} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <View style={[styles.iconContainer, { borderColor: color }]}>
              <User size={size - 4} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
