import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface Story {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration?: number;
  timestamp: number;
  views?: number;
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onStoryComplete?: (storyId: string) => void;
}

export default function StoryViewer({
  stories,
  initialIndex,
  onClose,
  onStoryComplete,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStory = stories[currentIndex];
  const storyDuration = currentStory?.duration || 5000; // 5 seconds default

  useEffect(() => {
    if (isVisible && !isPaused && currentStory) {
      startProgress();
    } else {
      stopProgress();
    }

    return () => stopProgress();
  }, [currentIndex, isPaused, isVisible, currentStory]);

  const startProgress = () => {
    progressAnim.setValue(0);
    setProgress(0);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 50; // Update every 50ms
        if (newProgress >= 100) {
          nextStory();
          return 0;
        }
        return newProgress;
      });
    }, 50);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: storyDuration,
      useNativeDriver: false,
    }).start();
  };

  const stopProgress = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    progressAnim.stopAnimation();
  };

  const nextStory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const previousStory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleScreenPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const screenWidth = width;
    
    if (locationX < screenWidth / 3) {
      previousStory();
    } else if (locationX > (screenWidth * 2) / 3) {
      nextStory();
    } else {
      // Center tap - pause/resume
      setIsPaused(!isPaused);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleLongPress = () => {
    setIsPaused(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleLongPressEnd = () => {
    setIsPaused(false);
  };

  if (!currentStory) {
    return null;
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar hidden />
      
      {/* Progress Bars */}
      <View style={styles.progressContainer}>
        {stories.map((_, index) => (
          <View key={index} style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                index < currentIndex && styles.progressComplete,
                index === currentIndex && { width: progressWidth },
              ]}
            />
          </View>
        ))}
      </View>

      {/* Story Content */}
      <TouchableOpacity
        style={styles.storyContainer}
        onPress={handleScreenPress}
        onLongPress={handleLongPress}
        onPressOut={handleLongPressEnd}
        activeOpacity={1}
      >
        {currentStory.type === 'image' ? (
          <Image source={{ uri: currentStory.url }} style={styles.storyImage} />
        ) : (
          <Video
            source={{ uri: currentStory.url }}
            style={styles.storyVideo}
            shouldPlay={!isPaused}
            isLooping={false}
            resizeMode="cover"
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded && status.didJustFinish) {
                nextStory();
              }
            }}
          />
        )}

        {/* Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.3)']}
          style={styles.overlay}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.username}>john_doe</Text>
                <Text style={styles.timestamp}>
                  {new Date(currentStory.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <MoreHorizontal size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Heart size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Send size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Pause Indicator */}
        {isPaused && (
          <View style={styles.pauseIndicator}>
            <Text style={styles.pauseText}>⏸</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 8,
    gap: 4,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressComplete: {
    width: '100%',
  },
  storyContainer: {
    flex: 1,
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyVideo: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFC00',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userDetails: {
    gap: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomActions: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});
