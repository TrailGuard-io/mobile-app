# Mobile App (React Native + TypeScript)

## Description

TrailGuard Mobile App is a React Native application built with Expo, TypeScript, and React Navigation. It provides a mobile interface for the TrailGuard rescue management system, featuring emergency panic button functionality, location services, and map integration for hikers and outdoor enthusiasts.

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (version 6 or higher)
- [TrailGuard Backend](https://github.com/your-repo/trailguard-backend) running locally
- **For iOS development**: macOS with Xcode installed
- **For Android development**: Android Studio with Android SDK

## Installation

1. **Clone the repository** (if not already done):

   ```bash
   git clone <repository-url>
   cd TrailGuard/mobile-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp env.example .env
   ```

   Edit the `.env` file with your configuration:

   ```env
   # API Configuration
   API_URL="http://localhost:3001"

   # Environment
   NODE_ENV=development
   ```

4. **Ensure the backend is running**:
   Make sure the TrailGuard backend is running on the port specified in your `API_URL` (default: `http://localhost:3001`).

## Running the Application

### Development Mode

#### Start Expo Development Server

```bash
npm start
```

This will start the Expo development server and open the Expo DevTools in your browser.

#### Run on iOS Simulator

```bash
npm run ios
```

**Requirements:**

- macOS
- Xcode installed
- iOS Simulator available

#### Run on Android Emulator

```bash
npm run android
```

**Requirements:**

- Android Studio installed
- Android SDK configured
- Android Virtual Device (AVD) created

#### Run on Physical Device

1. Install the **Expo Go** app on your device:

   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code displayed in the terminal or Expo DevTools with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## Features

### Emergency Panic Button

- One-tap emergency alert system
- Automatic location detection
- Immediate rescue request dispatch

### Location Services

- GPS location tracking
- Real-time position updates
- Location history for rescue teams

### Map Integration

- Interactive maps with current location
- Trail and terrain visualization
- Emergency contact points

### Offline Capability

- Basic functionality without internet connection
- Cached map data
- Emergency alerts queued for when connection is restored

## Project Structure

```
mobile-app/
├── App.tsx              # Main application component
├── package.json         # Dependencies and scripts
├── env.example          # Environment variables template
├── .env                 # Environment variables (create from example)
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Key Technologies

- **React Native 0.73** - Cross-platform mobile development
- **Expo 50** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **React Navigation 4** - Navigation between screens
- **React Native Maps** - Map integration
- **Expo Location** - Location services and GPS

## Development

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Follow React Native conventions

### Adding New Screens

1. Create a new component in the appropriate directory
2. Add navigation configuration
3. Update the navigation stack

### Adding New Features

1. Install necessary dependencies
2. Follow Expo's documentation for native features
3. Test on both iOS and Android

### State Management

- Use React hooks for local state
- Consider Context API for global state
- Follow React Native best practices

## Testing

### iOS Testing

- Use iOS Simulator for development
- Test on physical iOS devices for production
- Ensure compatibility with different iOS versions

### Android Testing

- Use Android Emulator for development
- Test on physical Android devices for production
- Test on different screen sizes and Android versions

### Device Testing Checklist

- [ ] Emergency button functionality
- [ ] Location services
- [ ] Map rendering
- [ ] Network connectivity
- [ ] Offline mode
- [ ] App performance
- [ ] Battery usage

## API Integration

The mobile app communicates with the TrailGuard backend API. Make sure the backend is running and the `API_URL` is correctly configured.

### API Endpoints Used

- Authentication: `/auth/login`, `/auth/register`
- Rescues: `/rescues` (POST for creating rescue requests)
- Location: GPS coordinates sent with rescue requests

## Troubleshooting

### Common Issues

1. **Expo CLI not found**: Install Expo CLI globally:

   ```bash
   npm install -g @expo/cli
   ```

2. **Metro bundler issues**: Clear cache and restart:

   ```bash
   npx expo start --clear
   ```

3. **iOS Simulator not working**: Ensure Xcode is properly installed and iOS Simulator is available.

4. **Android Emulator not working**: Check Android Studio installation and AVD configuration.

5. **Location services not working**: Ensure location permissions are granted in device settings.

6. **Backend connection error**: Verify the backend is running and the API URL is correct in `.env`.

### Development Tips

- Use Expo DevTools for debugging
- Enable remote debugging for better error messages
- Test on physical devices for accurate location services
- Monitor network requests in the browser developer tools
- Use React Native Debugger for advanced debugging

## Building for Production

### Expo Build (EAS Build)

1. Install EAS CLI:

   ```bash
   npm install -g @expo/eas-cli
   ```

2. Configure EAS:

   ```bash
   eas build:configure
   ```

3. Build for platforms:
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

### Local Build

1. Eject from Expo (if needed):

   ```bash
   npx expo eject
   ```

2. Follow React Native CLI build instructions for iOS and Android.

## Deployment

### App Store (iOS)

1. Build the app using EAS Build or Xcode
2. Submit to App Store Connect
3. Follow Apple's review process

### Google Play Store (Android)

1. Build the app using EAS Build or Android Studio
2. Create a signed APK/AAB
3. Submit to Google Play Console

## Contributing

1. Follow the existing code style and patterns
2. Test your changes on both iOS and Android
3. Update documentation as needed
4. Create a pull request with a clear description of changes
5. Ensure all TypeScript types are properly defined
6. Test location services and emergency functionality thoroughly

## Security Considerations

- Implement proper authentication for API calls
- Secure location data transmission
- Handle sensitive user information appropriately
- Follow mobile app security best practices
- Implement proper error handling for network failures
