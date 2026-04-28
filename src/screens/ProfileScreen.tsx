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

interface ProfileUpdateForm {
  name: string;
  phone?: string;
  address?: string;
}

export default function ProfileScreen() {
  const { user, loading, logout, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [profileForm, setProfileForm] = useState<ProfileUpdateForm>({
    name: "",
    phone: "",
    address: "",
  });

  // Carregar dados do perfil quando usuário estiver logado
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!profileForm.name) {
      Alert.alert("Erro", "O nome é obrigatório!");
      return;
    }

    await updateProfile({
      name: profileForm.name,
      phone: profileForm.phone,
      address: profileForm.address,
    });

    setIsEditing(false);
  };

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

              {isEditing && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleUpdateProfile}
                  >
                    <Ionicons name="save" size={20} color="#ffffff" />
                    <Text style={styles.saveButtonText}>Salvar Alterações</Text>
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
              <Text style={styles.accountInfoTitle}>Informações da Conta</Text>
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    gap: 12,
    marginTop: 10,
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
