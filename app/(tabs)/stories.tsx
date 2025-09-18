import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StoryViewer from '@/components/StoryViewer';

const { width } = Dimensions.get('window');

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasViewed: boolean;
  isOwn?: boolean;
  stories?: StoryContent[];
}

interface StoryContent {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration?: number;
  timestamp: number;
  views?: number;
}

interface Discover {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
}

const MOCK_STORIES: Story[] = [
  { 
    id: '1', 
    username: 'Your Story', 
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', 
    hasViewed: false, 
    isOwn: true,
    stories: []
  },
  { 
    id: '2', 
    username: 'john_doe', 
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', 
    hasViewed: false,
    stories: [
      {
        id: 's1',
        type: 'image',
        url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
        duration: 5000,
        timestamp: Date.now() - 3600000,
        views: 45
      },
      {
        id: 's2',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: 10000,
        timestamp: Date.now() - 1800000,
        views: 32
      }
    ]
  },
  { 
    id: '3', 
    username: 'sarah_wilson', 
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400', 
    hasViewed: true,
    stories: [
      {
        id: 's3',
        type: 'image',
        url: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
        duration: 5000,
        timestamp: Date.now() - 7200000,
        views: 78
      }
    ]
  },
  { 
    id: '4', 
    username: 'mike_chen', 
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400', 
    hasViewed: false,
    stories: [
      {
        id: 's4',
        type: 'image',
        url: 'https://images.pexels.com/photos/386025/pexels-photo-386025.jpeg?auto=compress&cs=tinysrgb&w=400',
        duration: 5000,
        timestamp: Date.now() - 5400000,
        views: 23
      },
      {
        id: 's5',
        type: 'image',
        url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
        duration: 5000,
        timestamp: Date.now() - 2700000,
        views: 56
      }
    ]
  },
  { 
    id: '5', 
    username: 'emma_stone', 
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400', 
    hasViewed: true,
    stories: [
      {
        id: 's6',
        type: 'image',
        url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
        duration: 5000,
        timestamp: Date.now() - 9000000,
        views: 89
      }
    ]
  },
];

const MOCK_DISCOVER: Discover[] = [
  { id: '1', title: 'Weekend Vibes', thumbnail: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400', views: '1.2M' },
  { id: '2', title: 'Food Adventures', thumbnail: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400', views: '890K' },
  { id: '3', title: 'Travel Goals', thumbnail: 'https://images.pexels.com/photos/386025/pexels-photo-386025.jpeg?auto=compress&cs=tinysrgb&w=400', views: '2.1M' },
  { id: '4', title: 'Music Festival', thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400', views: '756K' },
];

export default function StoriesScreen() {
  const [stories, setStories] = useState(MOCK_STORIES);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [currentStoryContent, setCurrentStoryContent] = useState<StoryContent[]>([]);

  const openStoryViewer = (story: Story, index: number) => {
    if (story.stories && story.stories.length > 0) {
      setCurrentStoryContent(story.stories);
      setSelectedStoryIndex(index);
      setShowStoryViewer(true);
      
      // Mark story as viewed
      setStories(prevStories => 
        prevStories.map(s => 
          s.id === story.id ? { ...s, hasViewed: true } : s
        )
      );
    }
  };

  const closeStoryViewer = () => {
    setShowStoryViewer(false);
    setCurrentStoryContent([]);
  };

  const renderStoryItem = (story: Story, index: number) => (
    <TouchableOpacity 
      key={story.id} 
      style={styles.storyItem}
      onPress={() => openStoryViewer(story, index)}
    >
      <LinearGradient
        colors={story.hasViewed ? ['#E0E0E0', '#E0E0E0'] : ['#FFFC00', '#FF69B4', '#7B68EE']}
        style={styles.storyGradient}
      >
        <View style={styles.storyImageContainer}>
          <Image source={{ uri: story.avatar }} style={styles.storyImage} />
          {story.isOwn && (
            <View style={styles.addButton}>
              <Plus size={16} color="#FFFFFF" />
            </View>
          )}
        </View>
      </LinearGradient>
      <Text style={styles.storyUsername} numberOfLines={1}>
        {story.username}
      </Text>
    </TouchableOpacity>
  );

  const renderDiscoverItem = (item: Discover) => (
    <TouchableOpacity key={item.id} style={styles.discoverItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.discoverThumbnail} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.discoverOverlay}
      >
        <View style={styles.discoverInfo}>
          <Text style={styles.discoverTitle}>{item.title}</Text>
          <Text style={styles.discoverViews}>{item.views} views</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (showStoryViewer) {
    return (
      <StoryViewer
        stories={currentStoryContent}
        initialIndex={0}
        onClose={closeStoryViewer}
        onStoryComplete={(storyId) => {
          console.log('Story completed:', storyId);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stories</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stories Section */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
            {stories.map((story, index) => renderStoryItem(story, index))}
          </ScrollView>
        </View>

        {/* Discover Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discover</Text>
          <View style={styles.discoverGrid}>
            {MOCK_DISCOVER.map(renderDiscoverItem)}
          </View>
        </View>

        {/* For You Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>For You</Text>
          <View style={styles.forYouContainer}>
            <TouchableOpacity style={styles.forYouItem}>
              <LinearGradient
                colors={['#FF69B4', '#7B68EE']}
                style={styles.forYouGradient}
              >
                <Text style={styles.forYouText}>Trending Now</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.forYouItem}>
              <LinearGradient
                colors={['#FFFC00', '#FF8C00']}
                style={styles.forYouGradient}
              >
                <Text style={styles.forYouText}>Local Events</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  storiesContainer: {
    paddingHorizontal: 20,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  storyGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 3,
    marginBottom: 8,
  },
  storyImageContainer: {
    width: 66,
    height: 66,
    borderRadius: 33,
    overflow: 'hidden',
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFC00',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  storyUsername: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  discoverGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  discoverItem: {
    width: (width - 48) / 2,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  discoverThumbnail: {
    width: '100%',
    height: '100%',
  },
  discoverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  discoverInfo: {
    padding: 12,
  },
  discoverTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  discoverViews: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  forYouContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  forYouItem: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  forYouGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forYouText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
