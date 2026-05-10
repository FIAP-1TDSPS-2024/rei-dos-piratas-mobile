import api from "./api";
import { Cliente } from "./authService";

// --- Request Types ---

export interface UpdateClienteRequest {
  id: number;
  cpf: string;
  user_name: string;
  nome_completo: string;
  email: string;
  celular: string;
  data_nascimento: string;
  sexo: string;
}

// --- API Calls ---

export const clienteService = {
  update: async (data: UpdateClienteRequest): Promise<Cliente> => {
    const response = await api.put<Cliente>("/clientes", data);
    return response.data;
  },

  delete: async (): Promise<void> => {
    await api.delete<void>("/clientes");
  },
};
