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
// 1. Importando o hook de Tema
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

type AuthMode = "login" | "register";

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  userName: string;
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
  // 2. Extraindo os dados do tema
  const { colors, isDark, toggleTheme } = useTheme();

  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    userName: "",
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
      !registerForm.userName ||
      !registerForm.name ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.cpf ||
      !registerForm.birthDate ||
      !registerForm.gender ||
      !registerForm.phone
    ) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
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
      user_name: registerForm.userName,
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
        userName: "",
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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* StatusBar que ajusta a cor do texto do relógio/bateria */}
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

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
            {/* Header dinâmico */}
            <View style={[styles.authHeader, { backgroundColor: colors.surface }]}>
              {/* Botão de Trocar Tema */}
              <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
                <Ionicons name={isDark ? "sunny" : "moon"} size={24} color={colors.text} />
              </TouchableOpacity>

              <Ionicons name="book" size={80} color={colors.primary} />
              <Text style={[styles.appName, { color: colors.primary }]}>Rei dos Piratas</Text>
              <Text style={[styles.authTitle, { color: colors.text }]}>
                {authMode === "login" ? "Entrar na Conta" : "Criar Conta"}
              </Text>
              <Text style={[styles.authSubtitle, { color: colors.textSecondary }]}>
                {authMode === "login"
                  ? "Acesse sua conta para explorar a loja"
                  : "Crie sua conta para começar a comprar"}
              </Text>
            </View>

            {/* Tabs de Login/Cadastro */}
            <View style={[styles.authTabs, { backgroundColor: isDark ? colors.border : "#f3f4f6" }]}>
              <TouchableOpacity
                style={[
                  styles.authTab,
                  authMode === "login" && [styles.authTabActive, { backgroundColor: colors.surface }],
                ]}
                onPress={() => setAuthMode("login")}
              >
                <Text
                  style={[
                    styles.authTabText,
                    { color: colors.textSecondary },
                    authMode === "login" && [styles.authTabTextActive, { color: colors.primary }],
                  ]}
                >
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.authTab,
                  authMode === "register" && [styles.authTabActive, { backgroundColor: colors.surface }],
                ]}
                onPress={() => setAuthMode("register")}
              >
                <Text
                  style={[
                    styles.authTabText,
                    { color: colors.textSecondary },
                    authMode === "register" && [styles.authTabTextActive, { color: colors.primary }],
                  ]}
                >
                  Cadastro
                </Text>
              </TouchableOpacity>
            </View>

            {/* Formulário */}
            <View style={[styles.form, { backgroundColor: colors.surface }]}>
              {authMode === "login" ? (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Email *</Text>
                    <TextInput
                      style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: isDark ? colors.background : "#ffffff" }]}
                      value={loginForm.email}
                      onChangeText={(value) => setLoginForm((prev) => ({ ...prev, email: value }))}
                      placeholder="Digite seu email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Senha *</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={[styles.passwordInput, { borderColor: colors.border, color: colors.text, backgroundColor: isDark ? colors.background : "#ffffff" }]}
                        value={loginForm.password}
                        onChangeText={(value) => setLoginForm((prev) => ({ ...prev, password: value }))}
                        placeholder="Digite sua senha"
                        secureTextEntry={!showPassword}
                        placeholderTextColor={colors.textSecondary}
                      />
                      <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleLogin}>
                    <Ionicons name="log-in" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryButtonText}>Entrar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Username *</Text>
                    <TextInput
                      style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: isDark ? colors.background : "#ffffff" }]}
                      value={registerForm.userName}
                      onChangeText={(value) => setRegisterForm((prev) => ({ ...prev, userName: value }))}
                      placeholder="Ex: luffy_pirata"
                      autoCapitalize="none"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Nome Completo *</Text>
                    <TextInput
                      style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: isDark ? colors.background : "#ffffff" }]}
                      value={registerForm.name}
                      onChangeText={(value) => setRegisterForm((prev) => ({ ...prev, name: value }))}
                      placeholder="Digite seu nome completo"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Email *</Text>
                    <TextInput
                      style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: isDark ? colors.background : "#ffffff" }]}
                      value={registerForm.email}
                      onChangeText={(value) => setRegisterForm((prev) => ({ ...prev, email: value }))}
                      placeholder="Digite seu email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Senha * (mínimo 6 caracteres)</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={[styles.passwordInput, { borderColor: colors.border, color: colors.text, backgroundColor: isDark ? colors.background : "#ffffff" }]}
                        value={registerForm.password}
                        onChangeText={(value) => setRegisterForm((prev) => ({ ...prev, password: value }))}
                        placeholder="Digite sua senha"
                        secureTextEntry={!showPassword}
                        placeholderTextColor={colors.textSecondary}
                      />
                      <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Confirmar Senha *</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={[styles.passwordInput, { borderColor: colors.border, color: colors.text, backgroundColor: isDark ? colors.background : "#ffffff" }]}
                        value={registerForm.confirmPassword}
                        onChangeText={(value) => setRegisterForm((prev) => ({ ...prev, confirmPassword: value }))}
                        placeholder="Confirme sua senha"
                        secureTextEntry={!showConfirmPassword}
                        placeholderTextColor={colors.textSecondary}
                      />
                      <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>CPF *</Text>
                    <TextInput
                      style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: isDark ? colors.background : "#ffffff" }]}
                      value={registerForm.cpf}
                      onChangeText={(value) => setRegisterForm((prev) => ({ ...prev, cpf: value }))}
                      placeholder="Digite seu CPF (somente números)"
                      keyboardType="numeric"
                      maxLength={11}
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Celular *</Text>
                    <TextInput
                      style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: isDark ? colors.background : "#ffffff" }]}
                      value={registerForm.phone}
                      onChangeText={(value) => setRegisterForm((prev) => ({ ...prev, phone: value }))}
                      placeholder="Digite seu celular"
                      keyboardType="phone-pad"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Data de Nascimento *</Text>
                    <TextInput
                      style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: isDark ? colors.background : "#ffffff" }]}
                      value={registerForm.birthDate}
                      onChangeText={(value) => setRegisterForm((prev) => ({ ...prev, birthDate: value }))}
                      placeholder="AAAA-MM-DD"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Sexo *</Text>
                    <TextInput
                      style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: isDark ? colors.background : "#ffffff" }]}
                      value={registerForm.gender}
                      onChangeText={(value) => setRegisterForm((prev) => ({ ...prev, gender: value }))}
                      placeholder="M ou F"
                      autoCapitalize="characters"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleRegister}>
                    <Ionicons name="person-add" size={20} color="#ffffff" style={{ marginRight: 8 }} />
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
  },
  authHeader: {
    position: "relative", // Necessário para ancorar o themeToggle
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    marginBottom: 20,
  },
  themeToggle: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  authTabs: {
    flexDirection: "row",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authTabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  authTabTextActive: {
    // Cor é injetada no JSX
  },
  form: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 50,
    fontSize: 16,
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: {
    color: "#ffffff", // Sempre branco no botão primário
    fontSize: 18,
    fontWeight: "bold",
  },
});