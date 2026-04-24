import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  AUTH_TOKEN: "@auth_token",
};

// ESCOLHA APENAS UM BASE_URL E DEIXE OS OUTROS COMENTADOS:

// 1. Para testar no EMULADOR ANDROID (O 10.0.2.2 é o "localhost" que o emulador enxerga)
// const CURRENT_BASE_URL = "http://10.0.2.2:8080";

// 2. Para testar no CELULAR FÍSICO (Troque pelo IP IPv4 do seu PC na rede Wi-Fi)

const CURRENT_BASE_URL = "http://192.168.0.216:8080";

// 3. Para PRODUÇÃO / APRESENTAÇÃO (Azure)
//const CURRENT_BASE_URL = "https://api-rdp-rm561144.azurewebsites.net";

const api = axios.create({
  baseURL: CURRENT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

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

export { api };
