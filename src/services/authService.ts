import api from "./api";

// --- Request Types ---

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  user_name?: string;
  nome_completo: string;
  email: string;
  senha: string;
  data_nascimento: string;
  sexo: string;
  cpf: string;
  celular: string;
}

// --- Response Types ---

export interface Cliente {
  id: number;
  user_name: string;
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

// --- API Calls ---

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // TODO: Deprecated - Remove user_name from RegisterRequest and backend
    if (!data.user_name) {
      data.user_name = data.email;
    }

    const response = await api.post<AuthResponse>("/auth/cadastro", data);
    return response.data;
  },
};
