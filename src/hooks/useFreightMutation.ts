import { useMutation } from "@tanstack/react-query";
import {
  freightService,
  FreteOption,
  FreteRequest,
} from "../services/freightService";

export function useCalculateFreightMutation() {
  return useMutation<FreteOption[], Error, FreteRequest>({
    mutationFn: (data) => freightService.calculateFreight(data),
  });
}
