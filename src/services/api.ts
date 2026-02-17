import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const STORAGE_KEYS = {
  AUTH_TOKEN: "@auth_token",
};

const getBaseURL = () => {
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const host = debuggerHost?.split(":")[0];

  if (host) {
    return `http://${host}:8080`;
  }

  // Fallback for web or production
  return "http://localhost:8080";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach JWT token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export { STORAGE_KEYS };
export default api;
