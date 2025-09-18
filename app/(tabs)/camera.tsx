import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, Animated, Dimensions, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { RotateCcw, Circle, Image as ImageIcon, Video, Square, Play, Pause } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Video as ExpoVideo } from 'expo-av';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('normal');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [zoom, setZoom] = useState(0);
  
  const cameraRef = useRef<CameraView>(null);
  const videoRef = useRef<ExpoVideo>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need your permission to access the camera to take photos and videos
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    // Request media library permissions
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need access to your media library to save photos and videos.');
      }
    })();
  }, []);

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function toggleFlash() {
    setFlashMode(current => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        // Animate capture button
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo?.uri) {
          setCapturedMedia(photo.uri);
          setMediaType('photo');
          
          // Save to media library
          await MediaLibrary.saveToLibraryAsync(photo.uri);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  }

  async function startRecording() {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        setRecordingDuration(0);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        const video = await cameraRef.current.recordAsync({
          quality: '720p',
          maxDuration: 60, // 60 seconds max
        });
        
        if (video?.uri) {
          setCapturedMedia(video.uri);
          setMediaType('video');
          
          // Save to media library
          await MediaLibrary.saveToLibraryAsync(video.uri);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to record video');
      } finally {
        setIsRecording(false);
        setRecordingDuration(0);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
      }
    }
  }

  async function stopRecording() {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }

  async function pickFromGallery() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setCapturedMedia(asset.uri);
        setMediaType(asset.type === 'video' ? 'video' : 'photo');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick media from gallery');
    }
  }

  function dismissCapturedMedia() {
    setCapturedMedia(null);
    setMediaType(null);
  }

  function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Show captured media preview
  if (capturedMedia && mediaType) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          {mediaType === 'photo' ? (
            <Image source={{ uri: capturedMedia }} style={styles.previewImage} />
          ) : (
            <ExpoVideo
              ref={videoRef}
              source={{ uri: capturedMedia }}
              style={styles.previewVideo}
              shouldPlay
              isLooping
              resizeMode="cover"
            />
          )}
          
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.3)']}
            style={styles.previewOverlay}
          >
            <View style={styles.previewTopControls}>
              <TouchableOpacity style={styles.previewButton} onPress={dismissCapturedMedia}>
                <Text style={styles.previewButtonText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.previewButton}>
                <Text style={styles.previewButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.previewBottomControls}>
              <TouchableOpacity style={styles.previewButton}>
                <Text style={styles.previewButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.previewButton}>
                <Text style={styles.previewButtonText}>Story</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        ref={cameraRef}
        flash={flashMode}
        zoom={zoom}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.3)']}
          style={styles.overlay}
        >
          {/* Top Controls */}
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.topButton}>
              <Text style={styles.topButtonText}>Stories</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.topButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Text style={styles.topButtonText}>Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
              <Text style={styles.flashButtonText}>
                {flashMode === 'off' ? '⚡' : flashMode === 'on' ? '⚡' : '⚡'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recording Timer */}
          {isRecording && (
            <View style={styles.recordingTimer}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>{formatDuration(recordingDuration)}</Text>
            </View>
          )}

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
              <ImageIcon size={32} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[styles.captureButton, isRecording && styles.captureButtonRecording]}
                onPress={isRecording ? stopRecording : takePicture}
                onLongPress={startRecording}
                delayLongPress={200}
              >
                {isRecording ? (
                  <Square size={32} color="#FFFFFF" />
                ) : (
                  <Circle size={72} color="#FFFFFF" fill="#FFFFFF" />
                )}
              </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <RotateCcw size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContent: {
    padding: 20,
    alignItems: 'center',
    maxWidth: 300,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#FFFC00',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  topButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  topButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  captureButtonRecording: {
    backgroundColor: '#FF0000',
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  recordingTimer: {
    position: 'absolute',
    top: 100,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
    marginRight: 8,
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Preview styles
  previewContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewVideo: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  previewTopControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  previewBottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  previewButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  previewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
