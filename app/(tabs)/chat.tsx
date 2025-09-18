import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Send } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  isGroup?: boolean;
}

const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Hey! Check this out 📸',
    time: '2m',
    unread: true,
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Can\'t wait for tonight!',
    time: '15m',
    unread: false,
  },
  {
    id: '3',
    name: 'Weekend Squad',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Mike: See you all at 8pm',
    time: '1h',
    unread: true,
    isGroup: true,
  },
  {
    id: '4',
    name: 'Emma Stone',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: '😂😂😂',
    time: '3h',
    unread: false,
  },
  {
    id: '5',
    name: 'Mike Chen',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Thanks for the snap!',
    time: '1d',
    unread: false,
  },
];

export default function ChatScreen() {
  const [chats, setChats] = useState(MOCK_CHATS);
  const [searchText, setSearchText] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderChatItem = (chat: Chat) => (
    <TouchableOpacity
      key={chat.id}
      style={styles.chatItem}
      onPress={() => setSelectedChat(chat)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: chat.avatar }} style={styles.avatar} />
        {chat.unread && <View style={styles.unreadDot} />}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.chatTime}>{chat.time}</Text>
        </View>
        <Text style={[styles.lastMessage, chat.unread && styles.unreadMessage]} numberOfLines={1}>
          {chat.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (selectedChat) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedChat(null)} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedChat.avatar }} style={styles.headerAvatar} />
          <Text style={styles.headerName}>{selectedChat.name}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>📹</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.messagesContainer}>
          <View style={styles.messageGroup}>
            <View style={[styles.message, styles.receivedMessage]}>
              <Text style={styles.messageText}>Hey! How's it going?</Text>
            </View>
            <View style={[styles.message, styles.sentMessage]}>
              <Text style={styles.messageText}>Pretty good! Just took an awesome snap</Text>
            </View>
            <View style={[styles.message, styles.receivedMessage]}>
              <Text style={styles.messageText}>{selectedChat.lastMessage}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.messageInput}>
          <TextInput
            style={styles.textInput}
            placeholder="Send a chat..."
            placeholderTextColor="#666666"
          />
          <TouchableOpacity style={styles.sendButton}>
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
        <TouchableOpacity style={styles.newChatButton}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            placeholderTextColor="#666666"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#FFFC00', '#FF8C00']}
            style={styles.quickActionGradient}
          >
            <Text style={styles.quickActionIcon}>📸</Text>
          </LinearGradient>
          <Text style={styles.quickActionText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#FF69B4', '#7B68EE']}
            style={styles.quickActionGradient}
          >
            <Text style={styles.quickActionIcon}>🎵</Text>
          </LinearGradient>
          <Text style={styles.quickActionText}>Music</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#32CD32', '#00FA9A']}
            style={styles.quickActionGradient}
          >
            <Text style={styles.quickActionIcon}>🎮</Text>
          </LinearGradient>
          <Text style={styles.quickActionText}>Games</Text>
        </TouchableOpacity>
      </View>

      {/* Chats List */}
      <ScrollView style={styles.chatsList} showsVerticalScrollIndicator={false}>
        {filteredChats.map(renderChatItem)}
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
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 20,
  },
  quickAction: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  chatsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFC00',
    borderWidth: 2,
    borderColor: '#000000',
  },
  chatContent: {
    flex: 1,
    gap: 4,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatTime: {
    fontSize: 12,
    color: '#666666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  unreadMessage: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  // Chat Detail Styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    gap: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 18,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageGroup: {
    gap: 8,
  },
  message: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFC00',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1A1A1A',
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFC00',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
