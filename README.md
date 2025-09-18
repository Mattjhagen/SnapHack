# SnapHack - The Ultimate Snapchat Clone

A fully functional Snapchat clone built with React Native and Expo, featuring all the core functionality of the original app with a modern, polished interface.

## 🚀 Features

### 📸 Camera & Media
- **Advanced Camera Interface**: Full-screen camera with tap-to-capture and hold-to-record
- **Video Recording**: High-quality video recording with duration limits
- **Photo/Video Gallery**: Access to device media library
- **Flash Control**: Toggle flash modes (off, on, auto)
- **Camera Flip**: Switch between front and rear cameras
- **Media Preview**: Full-screen preview with edit and share options
- **Haptic Feedback**: Tactile feedback for all interactions

### 📖 Stories
- **Story Viewer**: Full-screen story viewing with tap-to-advance
- **Progress Indicators**: Visual progress bars for story duration
- **Auto-advance**: Stories automatically advance after viewing
- **Pause/Resume**: Long-press to pause, tap to resume
- **Story Management**: Mark stories as viewed, track viewing status
- **Rich Media Support**: Both image and video stories

### 💬 Chat & Messaging
- **Real-time Chat**: Persistent messaging with SQLite storage
- **Snap Sending**: Send photos and videos as snaps
- **Snap Viewer**: Full-screen snap viewing with timer
- **Message Types**: Text, image, and video messages
- **Chat Persistence**: Messages saved locally with timestamps
- **Unread Indicators**: Visual indicators for unread messages
- **Media Integration**: Send photos from gallery

### 👤 User Authentication
- **Secure Registration**: Username, email, and password registration
- **Login System**: Secure authentication with local storage
- **Profile Management**: User profiles with avatars and stats
- **Snap Score**: Gamified scoring system
- **User Stats**: Friends count, streaks, and activity tracking
- **Secure Storage**: Encrypted token storage

### 🎨 UI/UX Features
- **Snapchat-style Design**: Authentic color scheme and typography
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Toast Notifications**: Contextual feedback messages
- **Loading States**: Beautiful loading spinners and states
- **Haptic Feedback**: Tactile responses throughout the app
- **Dark Theme**: Consistent dark theme throughout
- **Responsive Design**: Optimized for various screen sizes

## 🛠️ Technical Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and toolchain
- **TypeScript**: Type-safe development
- **SQLite**: Local data persistence
- **Expo Camera**: Camera functionality
- **Expo AV**: Video playback and recording
- **Expo Media Library**: Media access and storage
- **Expo Secure Store**: Secure token storage
- **Expo Haptics**: Tactile feedback
- **React Navigation**: Navigation system
- **Expo Linear Gradient**: Beautiful gradients

## 📱 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SnapHack
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## 🏗️ Project Structure

```
SnapHack/
├── app/                    # App screens and routing
│   ├── auth/              # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   └── register.tsx   # Registration screen
│   ├── (tabs)/            # Main app tabs
│   │   ├── camera.tsx     # Camera screen
│   │   ├── stories.tsx    # Stories screen
│   │   ├── chat.tsx       # Chat screen
│   │   └── profile.tsx    # Profile screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── StoryViewer.tsx    # Story viewing component
│   ├── SnapViewer.tsx     # Snap viewing component
│   ├── SplashScreen.tsx   # App splash screen
│   ├── LoadingSpinner.tsx # Loading animations
│   └── Toast.tsx          # Notification toasts
├── contexts/              # React contexts
│   ├── AuthContext.tsx    # Authentication state
│   └── ToastContext.tsx   # Toast notifications
├── services/              # Business logic
│   ├── AuthService.ts     # Authentication service
│   └── ChatService.ts     # Chat and messaging service
├── hooks/                 # Custom hooks
│   └── useFrameworkReady.ts
└── assets/                # Static assets
```

## 🔧 Configuration

### App Configuration
The app is configured in `app.json` with:
- App name and slug
- Required permissions (camera, microphone, storage, location)
- Expo plugins for native functionality
- Platform-specific settings

### Database Schema
The app uses SQLite for local storage with tables for:
- **Users**: User profiles and authentication
- **Chats**: Chat conversations
- **Messages**: Individual messages and snaps
- **Snaps**: Snap-specific data with viewing status

## 🎯 Key Features Implementation

### Camera System
- Uses Expo Camera for native camera access
- Implements tap-to-capture and hold-to-record gestures
- Supports both photo and video capture
- Includes flash control and camera switching
- Saves media to device gallery

### Story System
- Full-screen story viewer with progress indicators
- Tap-to-advance and long-press-to-pause functionality
- Automatic story progression with timers
- Support for both image and video stories
- Story viewing status tracking

### Chat System
- Real-time messaging with local persistence
- Snap sending and receiving
- Message threading and timestamps
- Unread message indicators
- Media message support

### Authentication
- Secure user registration and login
- Local token storage with SecureStore
- User profile management
- Snap score and statistics tracking

## 🚀 Future Enhancements

- **Real-time Sync**: Backend integration for real-time messaging
- **Push Notifications**: Notifications for new messages and snaps
- **Friend System**: Add friends and manage connections
- **Snap Map**: Location-based features and map integration
- **Filters & Lenses**: AR filters and face effects
- **Group Chats**: Multi-user chat functionality
- **Story Creation**: Advanced story editing tools
- **Cloud Storage**: Media storage and sync

## 📄 License

This project is for educational purposes only. Snapchat is a trademark of Snap Inc.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions, please open an issue in the repository.

---

**Note**: This is a clone/demo project created for educational purposes. It is not affiliated with or endorsed by Snap Inc.
