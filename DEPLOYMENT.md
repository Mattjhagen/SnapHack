# 🚀 SnapHack Deployment Guide

This guide covers deploying SnapHack to various platforms including Render, Vercel, and mobile app stores.

## 📋 Prerequisites

- Node.js 18+ installed
- Expo CLI (`npm install -g @expo/cli`)
- Git repository access
- Platform-specific accounts (Render, Vercel, etc.)

## 🌐 Web Deployment

### Render.com Deployment

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select the SnapHack repository

2. **Configure Service**
   ```
   Name: snaphack
   Environment: Node
   Build Command: npm install
   Start Command: npm run build:web
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   EXPO_PUBLIC_API_URL=https://your-api-url.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Access your deployed app

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure**
   - Set build command: `npm run build:web`
   - Set output directory: `dist`

## 📱 Mobile App Deployment

### iOS App Store

1. **Build for iOS**
   ```bash
   expo build:ios
   ```

2. **Submit to App Store**
   - Use Expo Application Services (EAS)
   - Configure app.json for iOS
   - Submit through App Store Connect

### Google Play Store

1. **Build for Android**
   ```bash
   expo build:android
   ```

2. **Submit to Play Store**
   - Use EAS Build
   - Configure app.json for Android
   - Submit through Google Play Console

## 🔧 Build Commands

### Development
```bash
npm start          # Start development server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run on web browser
```

### Production
```bash
npm run build:web     # Build for web
npm run build:ios     # Build for iOS
npm run build:android # Build for Android
```

## 📦 Environment Configuration

### Required Environment Variables
```bash
# Production
NODE_ENV=production
EXPO_PUBLIC_API_URL=https://api.snaphack.com

# Development
NODE_ENV=development
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Platform-Specific Configs

#### app.json (iOS)
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.snaphack.app",
      "buildNumber": "1.0.0"
    }
  }
}
```

#### app.json (Android)
```json
{
  "expo": {
    "android": {
      "package": "com.snaphack.app",
      "versionCode": 1
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Clear cache: `expo r -c`

2. **Package Version Conflicts**
   - Use `expo install --fix` to resolve
   - Check Expo SDK compatibility
   - Update to latest compatible versions

3. **Deployment Errors**
   - Verify build commands
   - Check environment variables
   - Review platform-specific requirements

### Debug Commands
```bash
expo doctor          # Check for issues
expo install --fix   # Fix package versions
npm run lint         # Check code quality
```

## 📊 Performance Optimization

### Web Optimization
- Enable gzip compression
- Optimize images and assets
- Use CDN for static files
- Implement caching strategies

### Mobile Optimization
- Optimize bundle size
- Use lazy loading
- Implement proper error boundaries
- Test on various devices

## 🔒 Security Considerations

### Production Security
- Use HTTPS everywhere
- Implement proper authentication
- Secure API endpoints
- Regular security updates

### Data Protection
- Encrypt sensitive data
- Use secure storage
- Implement proper session management
- Follow privacy regulations

## 📈 Monitoring & Analytics

### Performance Monitoring
- Set up error tracking (Sentry)
- Monitor app performance
- Track user analytics
- Monitor API response times

### Health Checks
- Implement health check endpoints
- Monitor database connections
- Track system resources
- Set up alerts for issues

## 🚀 Continuous Deployment

### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build:web
      - run: npm run deploy
```

### Automated Testing
- Run tests before deployment
- Check code quality
- Verify build success
- Test on multiple platforms

---

## 📞 Support

For deployment issues:
- Check the [Expo Documentation](https://docs.expo.dev/)
- Review platform-specific guides
- Open an issue in the repository
- Contact the development team

**Happy Deploying! 🚀**
