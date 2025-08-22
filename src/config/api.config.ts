import { Platform } from 'react-native';

// For development, use your local IP address instead of localhost
// To find your IP:
// - Mac/Linux: run 'ifconfig' in terminal
// - Windows: run 'ipconfig' in command prompt
// Replace '10.0.2.2' with your actual local IP address

const DEV_API_URL = Platform.select({
  ios: 'http://localhost:3001',
  android: 'http://10.0.2.2:3001', // Android emulator
  default: 'http://localhost:3001',
});

const PROD_API_URL = 'https://your-production-api.com';

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

export const GOOGLE_MAPS_API_KEY = Platform.select({
  ios: 'YOUR_IOS_GOOGLE_MAPS_API_KEY',
  android: 'YOUR_ANDROID_GOOGLE_MAPS_API_KEY',
  default: '',
});