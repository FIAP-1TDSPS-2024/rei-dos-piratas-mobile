import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addressService,
  EnderecoBackend,
  EnderecoCreateRequest,
} from "../services/addressService";

export const ADDRESSES_QUERY_KEY = ["addresses"] as const;

export interface Address {
  id: number;
  numero: number;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  cidadeId: number;
  estadoNome: string;
  estadoSigla: string;
  estadoId: number;
}

function mapAddress(endereco: EnderecoBackend): Address {
  return {
    id: endereco.id,
    numero: endereco.numero,
    cep: endereco.cep,
    logradouro: endereco.logradouro,
    bairro: endereco.bairro,
    cidade: endereco.cidade,
    cidadeId: endereco.cidade_id,
    estadoNome: endereco.estado_nome,
    estadoSigla: endereco.estado_sigla,
    estadoId: endereco.estado_id,
  };
}

export function useAddressesQuery() {
  return useQuery<Address[]>({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: async () => {
      const enderecos = await addressService.getAddresses();
      return enderecos.map(mapAddress);
    },
  });
}

export function useCreateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation<Address, Error, EnderecoCreateRequest>({
    mutationFn: async (data) => {
      const created = await addressService.createAddress(data);
      return mapAddress(created);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}
