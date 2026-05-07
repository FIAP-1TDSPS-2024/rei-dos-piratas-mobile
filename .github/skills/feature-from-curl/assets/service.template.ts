import api from "./api";

// --- Request Types ---

export interface __ActionRequest {
  // Mirror backend field names exactly (snake_case / PT-BR if that's what backend uses).
}

// --- Response Types ---

export interface __ActionResponse {
  // Mirror the response sample the user provided. Do not invent fields.
}

// --- API Calls ---

export const __domainService = {
  __action: async (data: __ActionRequest): Promise<__ActionResponse> => {
    const response = await api.post<__ActionResponse>("/__path", data);
    return response.data;
  },
};
