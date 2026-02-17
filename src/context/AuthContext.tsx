import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  favoriteGenre?: string;
  createdAt: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    userData: Omit<UserProfile, "id" | "createdAt"> & { password: string },
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  USER: "@user_profile",
  USERS_DB: "@users_database",
  CURRENT_USER: "@current_user",
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados do usuário ao inicializar
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (userData) {
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

  const getUsersDatabase = async (): Promise<
    Array<UserProfile & { password: string }>
  > => {
    try {
      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error("Erro ao obter banco de usuários:", error);
      return [];
    }
  };

  const saveUsersDatabase = async (
    users: Array<UserProfile & { password: string }>,
  ) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
    } catch (error) {
      console.error("Erro ao salvar banco de usuários:", error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = await getUsersDatabase();
      const foundUser = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setIsLoggedIn(true);
        await AsyncStorage.setItem(
          STORAGE_KEYS.CURRENT_USER,
          JSON.stringify(userWithoutPassword),
        );
        return true;
      } else {
        Alert.alert("Erro", "Email ou senha incorretos!");
        return false;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert("Erro", "Erro ao fazer login. Tente novamente.");
      return false;
    }
  };

  const register = async (
    userData: Omit<UserProfile, "id" | "createdAt"> & { password: string },
  ): Promise<boolean> => {
    try {
      const users = await getUsersDatabase();

      // Verificar se email já existe
      const emailExists = users.some(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase(),
      );
      if (emailExists) {
        Alert.alert("Erro", "Este email já está cadastrado!");
        return false;
      }

      // Criar novo usuário
      const newUser: UserProfile & { password: string } = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        favoriteGenre: userData.favoriteGenre,
        password: userData.password,
        createdAt: new Date().toISOString(),
      };

      // Salvar no banco de usuários
      users.push(newUser);
      await saveUsersDatabase(users);

      // Fazer login automático
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsLoggedIn(true);
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(userWithoutPassword),
      );

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      Alert.alert("Erro", "Erro ao criar conta. Tente novamente.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
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

      // Atualizar usuário atual
      setUser(updatedUser);
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(updatedUser),
      );

      // Atualizar no banco de usuários
      const users = await getUsersDatabase();
      const userIndex = users.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...profileData };
        await saveUsersDatabase(users);
      }

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
