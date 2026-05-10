import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
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
import {
  useUpdateClienteMutation,
  useDeleteClienteMutation,
} from "../hooks/useClienteMutations";

export interface UserProfile {
  id: string;
  userName: string;
  name: string;
  email: string;
  cpf: string;
  birthDate: string;
  gender: string;
  phone?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  loading: boolean;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isUpdatingProfile: boolean;
  isDeletingAccount: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
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
    userName: cliente.user_name,
    name: cliente.nome_completo,
    email: cliente.email,
    cpf: cliente.cpf,
    phone: cliente.celular,
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
  const updateClienteMutation = useUpdateClienteMutation();
  const deleteClienteMutation = useDeleteClienteMutation();
  const queryClient = useQueryClient();

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
      await registerMutation.mutateAsync(data);

      const response = await loginMutation.mutateAsync({
        email: data.email,
        password: data.senha,
      });

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
      queryClient.removeQueries({ queryKey: ["cart"] });
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Erro no logout:", error);
      Alert.alert("Erro", "Erro ao fazer logout.");
    }
  };

  const updateProfile = async (
    profileData: Partial<UserProfile>,
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const merged = { ...user, ...profileData };
      const cliente = await updateClienteMutation.mutateAsync({
        id: Number(merged.id),
        cpf: merged.cpf,
        user_name: merged.userName,
        nome_completo: merged.name,
        email: merged.email,
        celular: merged.phone || "",
        data_nascimento: merged.birthDate,
        sexo: merged.gender,
      });

      const updatedUser = mapClienteToUserProfile(cliente);
      setUser(updatedUser);
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(updatedUser),
      );

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      const message =
        error?.response?.data?.message || "Erro ao atualizar perfil.";
      Alert.alert("Erro", message);
      return false;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      await deleteClienteMutation.mutateAsync();
      await logout();
      Alert.alert("Conta excluída", "Sua conta foi excluída com sucesso.");
      return true;
    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);
      const message =
        error?.response?.data?.message || "Erro ao excluir conta.";
      Alert.alert("Erro", message);
      return false;
    }
  };

  const value: AuthContextType = {
    isLoggedIn,
    user,
    loading,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isUpdatingProfile: updateClienteMutation.isPending,
    isDeletingAccount: deleteClienteMutation.isPending,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
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
