import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { STORAGE_KEYS as API_STORAGE_KEYS } from "../services/api";
import {
  AuthResponse,
  Cliente,
  RegisterRequest,
} from "../services/authService";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../hooks/useAuthMutations";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  birthDate: string;
  gender: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  CURRENT_USER: "current_user", // Removido o '@' que era padrão do AsyncStorage
};

function mapClienteToUserProfile(cliente: Cliente): UserProfile {
  return {
    id: String(cliente.id),
    name: cliente.nome_completo,
    email: cliente.email,
    phone: cliente.celular,
    isActive: cliente.usuario_ativo,
    createdAt: cliente.data_cadastro,
    birthDate: cliente.data_nascimento,
    gender: cliente.sexo,
  };
}

async function persistAuthData(response: AuthResponse) {
  const userProfile = mapClienteToUserProfile(response.cliente);
  // Salvando no SecureStore
  await SecureStore.setItemAsync(API_STORAGE_KEYS.AUTH_TOKEN, response.token);
  await SecureStore.setItemAsync(
    STORAGE_KEYS.CURRENT_USER,
    JSON.stringify(userProfile),
  );
  return userProfile;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Lendo do SecureStore
      const [userData, token] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.CURRENT_USER),
        SecureStore.getItemAsync(API_STORAGE_KEYS.AUTH_TOKEN),
      ]);

      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await loginMutation.mutateAsync({ email, password });
      const userProfile = await persistAuthData(response);
      setUser(userProfile);
      setIsLoggedIn(true);
      return true;
    } catch (error: any) {
      console.error("Erro no login:", error);
      const message =
        error?.response?.data?.message || "Email ou senha incorretos!";
      Alert.alert("Erro", message);
      return false;
    }
  };

  const register = async (data: RegisterRequest): Promise<boolean> => {
    try {
      const response = await registerMutation.mutateAsync(data);
      const userProfile = await persistAuthData(response);
      setUser(userProfile);
      setIsLoggedIn(true);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      return true;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error("Motivo exato da recusa do Java:", JSON.stringify(error.response.data, null, 2));
        const serverMessage = error.response.data.message || error.response.data.error || "Verifique o console para mais detalhes.";
        Alert.alert("Erro de Validação", serverMessage);
      } else {
        console.error("Erro no cadastro:", error.message);
        Alert.alert("Erro", "Falha ao conectar com o servidor.");
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      // SecureStore não tem multiRemove, então deletamos um por um
      await SecureStore.deleteItemAsync(STORAGE_KEYS.CURRENT_USER);
      await SecureStore.deleteItemAsync(API_STORAGE_KEYS.AUTH_TOKEN);
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Erro no logout:", error);
      Alert.alert("Erro", "Erro ao fazer logout.");
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      if (!user) return;

      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      // Atualizando no SecureStore
      await SecureStore.setItemAsync(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(updatedUser),
      );

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Erro ao atualizar perfil.");
    }
  };

  const value: AuthContextType = {
    isLoggedIn,
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}