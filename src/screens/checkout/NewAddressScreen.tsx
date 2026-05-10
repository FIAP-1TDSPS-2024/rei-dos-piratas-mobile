import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/globalStyles";
import { useCreateAddressMutation } from "../../hooks/useAddressesQuery";

interface FormState {
  numero: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado_nome: string;
  estado_sigla: string;
}

const INITIAL: FormState = {
  numero: "",
  cep: "",
  logradouro: "",
  bairro: "",
  cidade: "",
  estado_nome: "",
  estado_sigla: "",
};

export default function NewAddressScreen({ navigation }: any) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const createAddress = useCreateAddressMutation();

  const setField = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    const numero = Number(form.numero);
    const cep = form.cep.replace(/\D/g, "");

    if (
      !form.logradouro.trim() ||
      !form.bairro.trim() ||
      !form.cidade.trim() ||
      !form.estado_nome.trim() ||
      !form.estado_sigla.trim()
    ) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }
    if (!Number.isFinite(numero) || numero <= 0) {
      Alert.alert("Erro", "Número inválido.");
      return;
    }
    if (cep.length !== 8) {
      Alert.alert("Erro", "CEP deve conter 8 dígitos.");
      return;
    }
    if (form.estado_sigla.trim().length !== 2) {
      Alert.alert("Erro", "Sigla do estado deve ter 2 letras.");
      return;
    }

    createAddress.mutate(
      {
        numero,
        cep,
        logradouro: form.logradouro.trim(),
        bairro: form.bairro.trim(),
        cidade: form.cidade.trim(),
        estado_nome: form.estado_nome.trim(),
        estado_sigla: form.estado_sigla.trim().toUpperCase(),
      },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Endereço cadastrado com sucesso.", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        },
        onError: () => {
          Alert.alert("Erro", "Não foi possível cadastrar o endereço.");
        },
      },
    );
  };

  const isPending = createAddress.isPending;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>CEP *</Text>
          <TextInput
            style={styles.input}
            value={form.cep}
            onChangeText={setField("cep")}
            placeholder="00000000"
            keyboardType="number-pad"
            maxLength={9}
            placeholderTextColor={colors.gray400}
          />

          <Text style={styles.label}>Logradouro *</Text>
          <TextInput
            style={styles.input}
            value={form.logradouro}
            onChangeText={setField("logradouro")}
            placeholder="Rua, avenida..."
            placeholderTextColor={colors.gray400}
          />

          <Text style={styles.label}>Número *</Text>
          <TextInput
            style={styles.input}
            value={form.numero}
            onChangeText={setField("numero")}
            placeholder="Ex.: 1523"
            keyboardType="number-pad"
            placeholderTextColor={colors.gray400}
          />

          <Text style={styles.label}>Bairro *</Text>
          <TextInput
            style={styles.input}
            value={form.bairro}
            onChangeText={setField("bairro")}
            placeholder="Bairro"
            placeholderTextColor={colors.gray400}
          />

          <Text style={styles.label}>Cidade *</Text>
          <TextInput
            style={styles.input}
            value={form.cidade}
            onChangeText={setField("cidade")}
            placeholder="Cidade"
            placeholderTextColor={colors.gray400}
          />

          <Text style={styles.label}>Estado *</Text>
          <TextInput
            style={styles.input}
            value={form.estado_nome}
            onChangeText={setField("estado_nome")}
            placeholder="Ex.: Minas Gerais"
            placeholderTextColor={colors.gray400}
          />

          <Text style={styles.label}>UF *</Text>
          <TextInput
            style={styles.input}
            value={form.estado_sigla}
            onChangeText={setField("estado_sigla")}
            placeholder="Ex.: MG"
            autoCapitalize="characters"
            maxLength={2}
            placeholderTextColor={colors.gray400}
          />

          <TouchableOpacity
            style={[styles.button, isPending && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Ionicons name="save" size={18} color={colors.white} />
                <Text style={styles.buttonText}>Salvar endereço</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  content: { padding: 16, paddingBottom: 32 },
  label: {
    fontSize: 14,
    color: colors.gray700,
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.gray200,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.gray900,
  },
  button: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.white, fontWeight: "600", fontSize: 16 },
});
