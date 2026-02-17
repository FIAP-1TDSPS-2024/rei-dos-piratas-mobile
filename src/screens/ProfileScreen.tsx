import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/globalStyles";
import { useAuth } from "../context/AuthContext";

type AuthMode = "login" | "register";

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  address?: string;
  favoriteGenre?: string;
}

interface ProfileUpdateForm {
  name: string;
  phone?: string;
  address?: string;
  favoriteGenre?: string;
}

export default function ProfileScreen() {
  const { isLoggedIn, user, loading, login, register, logout, updateProfile } =
    useAuth();

  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Formulários
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    favoriteGenre: "",
  });

  const [profileForm, setProfileForm] = useState<ProfileUpdateForm>({
    name: "",
    phone: "",
    address: "",
    favoriteGenre: "",
  });

  // Carregar dados do perfil quando usuário estiver logado
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        phone: user.phone || "",
        address: user.address || "",
        favoriteGenre: user.favoriteGenre || "",
      });
    }
  }, [user]);

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    const success = await login(loginForm.email, loginForm.password);
    if (success) {
      setLoginForm({ email: "", password: "" });
    }
  };

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      Alert.alert("Erro", "Preencha os campos obrigatórios!");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    if (registerForm.password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    const success = await register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      phone: registerForm.phone,
      address: registerForm.address,
      favoriteGenre: registerForm.favoriteGenre,
    });

    if (success) {
      setRegisterForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        favoriteGenre: "",
      });
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileForm.name) {
      Alert.alert("Erro", "O nome é obrigatório!");
      return;
    }

    await updateProfile({
      name: profileForm.name,
      phone: profileForm.phone,
      address: profileForm.address,
      favoriteGenre: profileForm.favoriteGenre,
    });

    setIsEditing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Tela para usuário logado
  if (isLoggedIn && user) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header do usuário logado */}
              <View style={styles.header}>
                <View style={styles.avatarContainer}>
                  <Ionicons
                    name="person-circle"
                    size={80}
                    color={colors.primary}
                  />
                  <View style={styles.onlineIndicator} />
                </View>
                <Text style={styles.welcomeText}>Bem-vindo!</Text>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>

              {/* Informações do perfil */}
              <View style={styles.form}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Informações do Perfil</Text>
                  <TouchableOpacity
                    onPress={() => setIsEditing(!isEditing)}
                    style={styles.editButton}
                  >
                    <Ionicons
                      name={isEditing ? "close" : "create"}
                      size={20}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nome Completo *</Text>
                  <TextInput
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                    value={profileForm.name}
                    onChangeText={(value) =>
                      setProfileForm((prev) => ({ ...prev, name: value }))
                    }
                    placeholder="Digite seu nome completo"
                    placeholderTextColor={colors.gray400}
                    editable={isEditing}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={user.email}
                    editable={false}
                    placeholderTextColor={colors.gray400}
                  />
                  <Text style={styles.helpText}>
                    * O email não pode ser alterado
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Telefone</Text>
                  <TextInput
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                    value={profileForm.phone}
                    onChangeText={(value) =>
                      setProfileForm((prev) => ({ ...prev, phone: value }))
                    }
                    placeholder="Digite seu telefone"
                    keyboardType="phone-pad"
                    placeholderTextColor={colors.gray400}
                    editable={isEditing}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Endereço</Text>
                  <TextInput
                    style={[
                      styles.input,
                      styles.textArea,
                      !isEditing && styles.inputDisabled,
                    ]}
                    value={profileForm.address}
                    onChangeText={(value) =>
                      setProfileForm((prev) => ({ ...prev, address: value }))
                    }
                    placeholder="Digite seu endereço completo"
                    multiline
                    numberOfLines={3}
                    placeholderTextColor={colors.gray400}
                    editable={isEditing}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Gênero Favorito</Text>
                  <TextInput
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                    value={profileForm.favoriteGenre}
                    onChangeText={(value) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        favoriteGenre: value,
                      }))
                    }
                    placeholder="Ex: Ação, Romance, Aventura..."
                    placeholderTextColor={colors.gray400}
                    editable={isEditing}
                  />
                </View>

                {isEditing && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleUpdateProfile}
                    >
                      <Ionicons name="save" size={20} color="#ffffff" />
                      <Text style={styles.saveButtonText}>
                        Salvar Alterações
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setIsEditing(false);
                        // Resetar formulário
                        setProfileForm({
                          name: user.name,
                          phone: user.phone || "",
                          address: user.address || "",
                          favoriteGenre: user.favoriteGenre || "",
                        });
                      }}
                    >
                      <Ionicons name="close" size={20} color={colors.gray600} />
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Botão de logout */}
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                  <Ionicons name="log-out" size={20} color={colors.danger} />
                  <Text style={styles.logoutButtonText}>Sair da Conta</Text>
                </TouchableOpacity>
              </View>

              {/* Informações da conta */}
              <View style={styles.accountInfo}>
                <Text style={styles.accountInfoTitle}>
                  Informações da Conta
                </Text>
                <View style={styles.accountInfoItem}>
                  <Ionicons name="calendar" size={16} color={colors.gray500} />
                  <Text style={styles.accountInfoText}>
                    Membro desde{" "}
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Tela de login/cadastro
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.authHeader}>
              <Ionicons
                name="person-circle"
                size={100}
                color={colors.primary}
              />
              <Text style={styles.authTitle}>
                {authMode === "login" ? "Entrar na Conta" : "Criar Conta"}
              </Text>
              <Text style={styles.authSubtitle}>
                {authMode === "login"
                  ? "Acesse sua conta para continuar"
                  : "Crie sua conta para começar"}
              </Text>
            </View>

            {/* Tabs de Login/Cadastro */}
            <View style={styles.authTabs}>
              <TouchableOpacity
                style={[
                  styles.authTab,
                  authMode === "login" && styles.authTabActive,
                ]}
                onPress={() => setAuthMode("login")}
              >
                <Text
                  style={[
                    styles.authTabText,
                    authMode === "login" && styles.authTabTextActive,
                  ]}
                >
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.authTab,
                  authMode === "register" && styles.authTabActive,
                ]}
                onPress={() => setAuthMode("register")}
              >
                <Text
                  style={[
                    styles.authTabText,
                    authMode === "register" && styles.authTabTextActive,
                  ]}
                >
                  Cadastro
                </Text>
              </TouchableOpacity>
            </View>

            {/* Formulário */}
            <View style={styles.form}>
              {authMode === "login" ? (
                <>
                  {/* Login Form */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                      style={styles.input}
                      value={loginForm.email}
                      onChangeText={(value) =>
                        setLoginForm((prev) => ({ ...prev, email: value }))
                      }
                      placeholder="Digite seu email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor={colors.gray400}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Senha *</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        value={loginForm.password}
                        onChangeText={(value) =>
                          setLoginForm((prev) => ({ ...prev, password: value }))
                        }
                        placeholder="Digite sua senha"
                        secureTextEntry={!showPassword}
                        placeholderTextColor={colors.gray400}
                      />
                      <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons
                          name={showPassword ? "eye-off" : "eye"}
                          size={20}
                          color={colors.gray500}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleLogin}
                  >
                    <Text style={styles.primaryButtonText}>Entrar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* Register Form */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome Completo *</Text>
                    <TextInput
                      style={styles.input}
                      value={registerForm.name}
                      onChangeText={(value) =>
                        setRegisterForm((prev) => ({ ...prev, name: value }))
                      }
                      placeholder="Digite seu nome completo"
                      placeholderTextColor={colors.gray400}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                      style={styles.input}
                      value={registerForm.email}
                      onChangeText={(value) =>
                        setRegisterForm((prev) => ({ ...prev, email: value }))
                      }
                      placeholder="Digite seu email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor={colors.gray400}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      Senha * (mínimo 6 caracteres)
                    </Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        value={registerForm.password}
                        onChangeText={(value) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            password: value,
                          }))
                        }
                        placeholder="Digite sua senha"
                        secureTextEntry={!showPassword}
                        placeholderTextColor={colors.gray400}
                      />
                      <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons
                          name={showPassword ? "eye-off" : "eye"}
                          size={20}
                          color={colors.gray500}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirmar Senha *</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        value={registerForm.confirmPassword}
                        onChangeText={(value) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            confirmPassword: value,
                          }))
                        }
                        placeholder="Confirme sua senha"
                        secureTextEntry={!showConfirmPassword}
                        placeholderTextColor={colors.gray400}
                      />
                      <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye-off" : "eye"}
                          size={20}
                          color={colors.gray500}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Telefone</Text>
                    <TextInput
                      style={styles.input}
                      value={registerForm.phone}
                      onChangeText={(value) =>
                        setRegisterForm((prev) => ({ ...prev, phone: value }))
                      }
                      placeholder="Digite seu telefone"
                      keyboardType="phone-pad"
                      placeholderTextColor={colors.gray400}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Endereço</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={registerForm.address}
                      onChangeText={(value) =>
                        setRegisterForm((prev) => ({ ...prev, address: value }))
                      }
                      placeholder="Digite seu endereço completo"
                      multiline
                      numberOfLines={3}
                      placeholderTextColor={colors.gray400}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Gênero Favorito</Text>
                    <TextInput
                      style={styles.input}
                      value={registerForm.favoriteGenre}
                      onChangeText={(value) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          favoriteGenre: value,
                        }))
                      }
                      placeholder="Ex: Ação, Romance, Aventura..."
                      placeholderTextColor={colors.gray400}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleRegister}
                  >
                    <Text style={styles.primaryButtonText}>Criar Conta</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.gray600,
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  welcomeText: {
    fontSize: 16,
    color: colors.gray600,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.gray800,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray500,
  },
  authHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    marginBottom: 20,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.gray800,
    marginTop: 16,
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: colors.gray600,
    textAlign: "center",
  },
  authTabs: {
    flexDirection: "row",
    backgroundColor: colors.gray100,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
  },
  authTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  authTabActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authTabText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray600,
  },
  authTabTextActive: {
    color: colors.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.gray800,
  },
  editButton: {
    padding: 8,
  },
  form: {
    padding: 20,
    backgroundColor: "#ffffff",
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray700,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.gray800,
    backgroundColor: "#ffffff",
  },
  inputDisabled: {
    backgroundColor: colors.gray100,
    color: colors.gray500,
  },
  helpText: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 4,
    fontStyle: "italic",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 50,
    fontSize: 16,
    color: colors.gray800,
    backgroundColor: "#ffffff",
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    gap: 12,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: colors.gray100,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  cancelButtonText: {
    color: colors.gray600,
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: "600",
  },
  accountInfo: {
    backgroundColor: "#ffffff",
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.gray800,
    marginBottom: 12,
  },
  accountInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  accountInfoText: {
    fontSize: 14,
    color: colors.gray600,
  },
});
