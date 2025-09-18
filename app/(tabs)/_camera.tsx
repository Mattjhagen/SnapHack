import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { RotateCcw, Circle, Image as ImageIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);

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

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        Alert.alert('Photo taken!', `Photo saved: ${photo?.uri}`);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.3)']}
          style={styles.overlay}
        >
          {/* Top Controls */}
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.topButton}>
              <Text style={styles.topButtonText}>Stories</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.topButton}>
              <Text style={styles.topButtonText}>Filters</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.galleryButton}>
              <ImageIcon size={32} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.captureButton, isRecording && styles.captureButtonRecording]}
              onPress={takePicture}
            >
              <Circle size={72} color="#FFFFFF" fill="#FFFFFF" />
            </TouchableOpacity>
            
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
});
