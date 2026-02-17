import { useMutation } from "@tanstack/react-query";
import {
  authService,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../services/authService";

export function useLoginMutation() {
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (data) => authService.login(data),
  });
}

export function useRegisterMutation() {
  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (data) => authService.register(data),
  });
}
