# TrailGuard Mobile App

A React Native mobile application for emergency rescue coordination and location sharing.

## Features

- User authentication (login/register)
- Request rescue with GPS location
- View all rescue requests on a map
- Track your rescue history
- Multi-language support (English/Spanish)
- Real-time location sharing

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint:
   - Open `src/config/api.config.ts`
   - Replace the API URL with your backend server address
   - For local development, use your computer's IP address instead of localhost

3. Configure Google Maps (for map functionality):
   - Get API keys from [Google Cloud Console](https://console.cloud.google.com/)
   - Update `app.json` with your API keys:
     - iOS: `expo.ios.config.googleMapsApiKey`
     - Android: `expo.android.config.googleMaps.apiKey`

### Running the App

```bash
# Start the development server
npx expo start

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

## Project Structure

```
src/
├── components/      # Reusable components
├── config/         # Configuration files
├── locales/        # Translation files
├── navigation/     # Navigation setup
├── screens/        # App screens
├── services/       # API and external services
├── store/          # State management (Zustand)
└── types/          # TypeScript type definitions
```

## Important Notes

1. **Location Permissions**: The app requires location permissions to function properly. Make sure to grant these when prompted.

2. **Backend Connection**: Ensure your backend server is running and accessible from your device/emulator.

3. **API Configuration**: 
   - For iOS Simulator: Can use `localhost`
   - For Android Emulator: Use `10.0.2.2` instead of `localhost`
   - For physical devices: Use your computer's actual IP address

## Troubleshooting

- **Network Request Failed**: Check that your backend is running and the API URL is correct
- **Location not working**: Ensure location permissions are granted in device settings
- **Map not displaying**: Verify Google Maps API keys are correctly configured

## Technologies Used

- React Native with Expo
- TypeScript
- React Navigation 6
- Zustand (State Management)
- i18next (Internationalization)
- React Native Maps
- Expo Location