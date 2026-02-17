import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  CURRENT_USER: "@current_user",
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
  await AsyncStorage.setItem(API_STORAGE_KEYS.AUTH_TOKEN, response.token);
  await AsyncStorage.setItem(
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

  // Carregar dados do usuário ao inicializar
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [userData, token] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER),
        AsyncStorage.getItem(API_STORAGE_KEYS.AUTH_TOKEN),
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
      console.error("Erro no cadastro:", error);
      const message =
        error?.response?.data?.message ||
        "Erro ao criar conta. Tente novamente.";
      Alert.alert("Erro", message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CURRENT_USER,
        API_STORAGE_KEYS.AUTH_TOKEN,
      ]);
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
      await AsyncStorage.setItem(
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
