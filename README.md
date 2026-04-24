
# Rei dos Piratas - Mobile App 🏴‍☠️

Uma versão mobile da loja de mangás "Rei dos Piratas", agora integrada com backend Java/Spring Boot e persistência real de dados.

## 👥 Integrantes do Grupo – CATECH

-   **RM559622**: Daniel Santana Corrêa Batista
    
-   **RM561144**: Jonas de Jesus Campos de Oliveira
    
-   **RM559336**: Wendell Nascimento Dourado

    
## 🎨 Protótipo e Design

O projeto foi inteiramente baseado no protótipo de alta fidelidade desenvolvido no Figma, adaptando a experiência Web para os padrões de usabilidade Mobile:

-   **Link do Protótipo:** [Design do Figma - Ecommerce](https://www.figma.com/design/pgmGI02zKtZamVgnFrItvq/Ecommerce?node-id=0-1&p=f&t=gk1SJhmGEQxuU8ep-0)

## 🚀 Novidades da Sprint Atual (Integração Total)

Nesta etapa, o projeto deixou de utilizar dados mockados e passou a consumir uma API REST completa, com foco em segurança, integridade de dados e experiência do usuário (UX).

-   **Integração Backend**: Consumo de API Java/Spring Boot com persistência em banco de dados.
    
-   **Gerenciamento de Estado**: Migração para **TanStack Query (React Query)**, garantindo cache inteligente e sincronização em tempo real.
    
-   **Segurança (JWT)**: Autenticação baseada em tokens com permissões de acesso (`ROLE_CARRINHO_MANAGE`).
    
-   **Lógica de Negócio Robusta**: O carrinho agora valida estoque e gerencia quantidades diretamente no servidor.
    

## 📱 Funcionalidades

-   ✅ **Autenticação Real**: Login e persistência de sessão via JWT.
    
-   ✅ **Catálogo Dinâmico**: Listagem e filtros de mangás vindos da API.
    
-   ✅ **Carrinho Persistente**: Itens salvos no banco de dados do usuário, não mais no dispositivo.
    
-   ✅ **Controle de Quantidade**: Lógica de zeramento inteligente (subtração vira deleção quando $qtd \leq 0$).
    
-   ✅ **Feedback Visual**: Alertas de sucesso ao adicionar itens e fallback de imagens (Mascote Pirata).
    

## 🛠️ Tecnologias Utilizadas

-   **React Native / Expo** - Core do desenvolvimento mobile.
    
-   **TanStack Query (React Query)** - Sincronização e cache de dados.
    
-   **Axios** - Cliente HTTP para comunicação com a API.
    
-   **JWT (JSON Web Token)** - Segurança e autenticação.
    
-   **Expo Image** - Carregamento otimizado com suporte a `placeholder`.
    
-   **TypeScript** - Tipagem estática para evitar erros em tempo de execução.
    

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes visuais (MangaDetail, ShoppingCart, etc)
├── context/            # Gerenciamento de contexto (Auth e Cart)
├── hooks/              # Custom Hooks para consumo de API (TanStack Query)
├── services/           # Configuração do Axios e chamadas de endpoints
├── navigation/         # Configuração das rotas (Stack Navigator)
└── styles/             # Estilos globais e tokens de cores

```

## 🔄 Fluxo de Integridade de Dados (Carrinho)

Para garantir a consistência financeira e de estoque, implementamos um fluxo rígido de remoção:

1.  O Mobile envia o ID do produto e a quantidade total a ser removida via `PUT`.
    
2.  O Backend Java recebe o DTO e processa a subtração.
    
3.  Se a quantidade resultante for zero, o sistema executa um `.remove()` (Delete) físico no banco de dados, respeitando as constraints de `@Min(1)`.
    

## 🛠️ Como Executar

1.  **Instalar dependências:**
    
    Bash
    
    ```
    npm install
    
    ```
    
2.  **Configurar API:**
    
    Certifique-se de que o backend Java está rodando e atualize o `baseURL` no arquivo `src/services/api.ts` para o IP da sua máquina.
    
3.  **Iniciar Projeto:**
    
    Bash
    
    ```
    # Limpando cache para garantir carregamento de assets
    npx expo start -c
    ```
