export const STORAGE_KEYS = {
    HAS_ONBOARDED: '@MediAssist:hasOnboarded',
    TOKEN: '@MediAssist:token',
    USER: '@MediAssist:user',
};

// ------------------------------------------------------------------
// IMPORTANT: Update this IP address to your computer's local IP
// if you are running on a physical device (e.g., 'http://192.168.1.5:5000/api')
// ------------------------------------------------------------------
// For Android Emulator, use 'http://10.0.2.2:5000/api'
// For iOS Simulator, use 'http://localhost:5000/api'
// ------------------------------------------------------------------

import { Platform } from 'react-native';

const PORT = 5001;
const DEV_MACHINE_IP = '11.6.1.209';

export const API_BASE_URL = Platform.select({
    ios: `http://localhost:${PORT}`,
    // android: `http://10.0.2.2:${PORT}`, // Default for emulator
    android: `http://${DEV_MACHINE_IP}:${PORT}`, // Use local IP for physical device
}); 