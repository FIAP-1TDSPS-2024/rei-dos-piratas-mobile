import React, { useRef, useState } from "react";
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

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  estado?: string;
  erro?: boolean | string;
}

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
};

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
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const lastFetchedCep = useRef<string>("");
  const createAddress = useCreateAddressMutation();

  const setField = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const fetchCep = async (digits: string) => {
    if (lastFetchedCep.current === digits) return;
    lastFetchedCep.current = digits;
    setIsFetchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!response.ok) {
        throw new Error("CEP request failed");
      }
      const data: ViaCepResponse = await response.json();
      if (data.erro) {
        Alert.alert("CEP não encontrado", "Verifique o CEP digitado.");
        return;
      }
      setForm((prev) => ({
        ...prev,
        logradouro: data.logradouro || prev.logradouro,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        estado_nome: data.estado || prev.estado_nome,
        estado_sigla: (data.uf || prev.estado_sigla).toUpperCase(),
      }));
    } catch {
      Alert.alert("Erro", "Não foi possível buscar o CEP.");
    } finally {
      setIsFetchingCep(false);
    }
  };

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    setForm((prev) => ({ ...prev, cep: formatted }));
    const digits = formatted.replace(/\D/g, "");
    if (digits.length === 8) {
      fetchCep(digits);
    } else {
      lastFetchedCep.current = "";
    }
  };

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
          <View style={styles.cepRow}>
            <TextInput
              style={[styles.input, styles.cepInput]}
              value={form.cep}
              onChangeText={handleCepChange}
              placeholder="00000-000"
              keyboardType="number-pad"
              maxLength={9}
              placeholderTextColor={colors.gray400}
            />
            {isFetchingCep && (
              <ActivityIndicator
                style={styles.cepLoader}
                color={colors.primary}
              />
            )}
          </View>

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
  cepRow: { position: "relative", justifyContent: "center" },
  cepInput: { paddingRight: 40 },
  cepLoader: { position: "absolute", right: 12 },
});
