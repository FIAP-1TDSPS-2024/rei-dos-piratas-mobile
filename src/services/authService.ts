import { api } from "./api";

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  user_name: string;
  nome_completo: string;
  email: string;
  senha: string;
  data_nascimento: string;
  sexo: string;
  cpf: string;
  celular: string;
}

export interface Cliente {
  id: number;
  nome_completo: string;
  email: string;
  celular: string;
  usuario_ativo: boolean;
  data_cadastro: string;
  data_nascimento: string;
  sexo: string;
}

export interface AuthResponse {
  token: string;
  cliente: Cliente;
  roles: string[];
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/cadastro", data);
    return response.data;
  },
};