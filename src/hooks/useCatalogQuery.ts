import { useQuery } from "@tanstack/react-query";
import {
  catalogService,
  Produto,
  ProdutoCategoriaEnum,
} from "../services/catalogService";
import { Manga, Category } from "../types";

const mapMangaGenre = (categoria: ProdutoCategoriaEnum): Category => {
  switch (categoria) {
    case "ACAO":
      return "Ação";
    case "AVENTURA":
      return "Aventura";
    case "COMEDIA":
      return "Comédia";
    case "DRAMA":
      return "Drama";
    case "FICCAO_CIENTIFICA":
      return "Ficção Científica";
    case "FANTASIA":
      return "Fantasia";
    case "TERROR":
      return "Terror";
    default:
      return "Aventura"; // Valor padrão caso o backend retorne algo inesperado
  }
};

// TODO: Categoria será mapeada quando o backend retornar esse campo
function mapProdutoToManga(produto: Produto): Manga {
  return {
    id: String(produto.id),
    title: produto.nome,
    author: produto.autor,
    price: produto.preco,
    originalPrice: produto.preco_original,
    description: produto.descricao,
    imageUrl: produto.endereco_imagem,
    genre: mapMangaGenre(produto.categoria as ProdutoCategoriaEnum),
    isNew: produto.condicao === "NOVO",
  };
}

export function useCatalogQuery() {
  return useQuery<Manga[]>({
    queryKey: ["catalog"],
    queryFn: async () => {
      const produtos = await catalogService.getProducts();
      return produtos.map(mapProdutoToManga);
    },
  });
}
