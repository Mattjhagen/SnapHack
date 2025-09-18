import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, UserPlus, Trophy, Star, Bell, Lock, HelpCircle, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileStat {
  label: string;
  value: string;
}

interface SettingItem {
  icon: any;
  title: string;
  subtitle?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
}

const PROFILE_STATS: ProfileStat[] = [
  { label: 'Snap Score', value: '2,847' },
  { label: 'Friends', value: '156' },
  { label: 'Streaks', value: '12' },
];

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const SETTINGS_SECTIONS = [
    {
      title: 'Account',
      items: [
        { icon: UserPlus, title: 'Add Friends', subtitle: 'Find people you know' },
        { icon: Trophy, title: 'My Achievements', subtitle: 'View your snapchat trophies' },
        { icon: Star, title: 'Snapchat+', subtitle: 'Try exclusive features' },
      ]
    },
    {
      title: 'Privacy & Safety',
      items: [
        { 
          icon: Bell, 
          title: 'Notifications', 
          subtitle: 'Manage push notifications',
          hasSwitch: true,
          switchValue: notificationsEnabled
        },
        { 
          icon: Lock, 
          title: 'Privacy Settings', 
          subtitle: 'Control who can contact you'
        },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, title: 'Help Center', subtitle: 'Get help and support' },
        { icon: LogOut, title: 'Log Out', subtitle: 'Sign out of your account' },
      ]
    }
  ];

  const handleSwitchToggle = (settingType: string, value: boolean) => {
    switch (settingType) {
      case 'Notifications':
        setNotificationsEnabled(value);
        break;
      case 'Location':
        setLocationEnabled(value);
        break;
      case 'Dark Mode':
        setDarkModeEnabled(value);
        break;
    }
  };

  const renderSettingItem = (item: SettingItem, sectionTitle: string) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity
        key={item.title}
        style={styles.settingItem}
        onPress={() => {
          if (item.title === 'Log Out') {
            // Handle logout
          }
        }}
      >
        <View style={styles.settingIcon}>
          <IconComponent size={20} color="#FFFFFF" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
        {item.hasSwitch && (
          <Switch
            value={item.switchValue}
            onValueChange={(value) => handleSwitchToggle(item.title, value)}
            trackColor={{ false: '#333333', true: '#FFFC00' }}
            thumbColor={item.switchValue ? '#000000' : '#FFFFFF'}
          />
        )}
        {!item.hasSwitch && (
          <Text style={styles.settingArrow}>›</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <LinearGradient
            colors={['#FFFC00', '#FF69B4', '#7B68EE']}
            style={styles.avatarGradient}
          >
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.avatar}
              />
            </View>
          </LinearGradient>
          
          <Text style={styles.username}>@yourhandle</Text>
          <Text style={styles.displayName}>Your Name</Text>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          {PROFILE_STATS.map((stat, index) => (
            <TouchableOpacity key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={['#FF69B4', '#7B68EE']}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>👻</Text>
              <Text style={styles.quickActionText}>My Bitmoji</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={['#FFFC00', '#FF8C00']}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>🎵</Text>
              <Text style={styles.quickActionText}>My Music</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item) => renderSettingItem(item, section.title))}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Snapchat Clone v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ using Expo</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 112,
    height: 112,
    borderRadius: 56,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFC00',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  editProfileButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  quickActionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  quickAction: {
    flex: 1,
  },
  quickActionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    fontSize: 32,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#111111',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  settingArrow: {
    fontSize: 24,
    color: '#666666',
    fontWeight: '300',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
  },
});
