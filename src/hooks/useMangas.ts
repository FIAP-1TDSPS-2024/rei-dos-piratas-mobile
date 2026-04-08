import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../services/catalogService";

export function useMangas(page = 0, size = 20) {
  return useQuery({
    queryKey: ["mangas", page, size],
    queryFn: () => catalogService.getProducts(page, size),
    // Opcional: mantém os dados antigos na tela enquanto carrega a próxima página
    placeholderData: (previousData) => previousData,
  });
}