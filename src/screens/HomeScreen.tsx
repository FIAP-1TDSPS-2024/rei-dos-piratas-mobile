import React, { useState } from "react";
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
  StatusBar,
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
  birthDate: string;
  gender: string;
  cpf: string;
  phone: string;
}

export default function HomeScreen() {
  const { loading, login, register } = useAuth();

  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: "",
    cpf: "",
    phone: "",
  });

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
    if (
      !registerForm.name ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.cpf ||
      !registerForm.birthDate ||
      !registerForm.gender ||
      !registerForm.phone
    ) {
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
      nome_completo: registerForm.name,
      email: registerForm.email,
      senha: registerForm.password,
      data_nascimento: registerForm.birthDate,
      sexo: registerForm.gender,
      cpf: registerForm.cpf,
      celular: registerForm.phone,
    });

    if (success) {
      setRegisterForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthDate: "",
        gender: "",
        cpf: "",
        phone: "",
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.light} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light} />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.authHeader}>
              <Ionicons name="book" size={80} color={colors.primary} />
              <Text style={styles.appName}>Rei dos Piratas</Text>
              <Text style={styles.authTitle}>
                {authMode === "login" ? "Entrar na Conta" : "Criar Conta"}
              </Text>
              <Text style={styles.authSubtitle}>
                {authMode === "login"
                  ? "Acesse sua conta para explorar a loja"
                  : "Crie sua conta para começar a comprar"}
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
                          setLoginForm((prev) => ({
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

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleLogin}
                  >
                    <Ionicons
                      name="log-in"
                      size={20}
                      color="#ffffff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.primaryButtonText}>Entrar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
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
                    <Text style={styles.label}>CPF *</Text>
                    <TextInput
                      style={styles.input}
                      value={registerForm.cpf}
                      onChangeText={(value) =>
                        setRegisterForm((prev) => ({ ...prev, cpf: value }))
                      }
                      placeholder="Digite seu CPF (somente números)"
                      keyboardType="numeric"
                      maxLength={11}
                      placeholderTextColor={colors.gray400}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Celular *</Text>
                    <TextInput
                      style={styles.input}
                      value={registerForm.phone}
                      onChangeText={(value) =>
                        setRegisterForm((prev) => ({ ...prev, phone: value }))
                      }
                      placeholder="Digite seu celular"
                      keyboardType="phone-pad"
                      placeholderTextColor={colors.gray400}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Data de Nascimento *</Text>
                    <TextInput
                      style={styles.input}
                      value={registerForm.birthDate}
                      onChangeText={(value) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          birthDate: value,
                        }))
                      }
                      placeholder="AAAA-MM-DD"
                      placeholderTextColor={colors.gray400}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Sexo *</Text>
                    <TextInput
                      style={styles.input}
                      value={registerForm.gender}
                      onChangeText={(value) =>
                        setRegisterForm((prev) => ({ ...prev, gender: value }))
                      }
                      placeholder="M ou F"
                      maxLength={1}
                      autoCapitalize="characters"
                      placeholderTextColor={colors.gray400}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleRegister}
                  >
                    <Ionicons
                      name="person-add"
                      size={20}
                      color="#ffffff"
                      style={{ marginRight: 8 }}
                    />
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
  authHeader: {
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#ffffff",
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: "600",
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
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
