# Rei dos Piratas - Mobile App 🏴‍☠️

Uma versão mobile da loja de mangás "Rei dos Piratas", agora integrada com backend Java/Spring Boot e persistência real de dados.

## 👥 Integrantes do Grupo – CATECH

-   **RM559622**: Daniel Santana Corrêa Batista
    
-   **RM561144**: Jonas de Jesus Campos de Oliveira
    
-   **RM559336**: Wendell Nascimento Dourado
    

## Link do repositório 
https://github.com/FIAP-1TDSPS-2024/rei-dos-piratas-mobile

----------

## 🎯 Descrição do Problema Escolhido

O mercado de e-commerce de nicho (como venda de mangás) frequentemente sofre com plataformas mobile não otimizadas que falham em garantir a sincronização em tempo real entre o cliente e o servidor. O problema central abordado neste projeto é a **inconsistência de dados do carrinho e falhas de segurança na sessão do usuário**. Em arquiteturas puramente client-side ou com integrações fracas, a falta de uma "fonte única de verdade" (Single Source of Truth) centralizada resulta em perda de itens no carrinho, conflitos de estoque durante o checkout e vulnerabilidades no acesso não autorizado aos dados da conta.

## 💡 Descrição Geral da Solução Proposta

A solução desenvolvida é o aplicativo mobile "Rei dos Piratas", construído com React Native e integrado a uma API RESTful robusta em Java/Spring Boot. A arquitetura foi projetada com foco em **integridade de dados e segurança**:

1.  **Segurança e Autenticação:** Implementação de JWT (JSON Web Token) para garantir que apenas usuários autenticados e autorizados (`ROLE_CARRINHO_MANAGE`) acessem e modifiquem carrinhos, protegendo dados sensíveis.
    
2.  **Sincronização e Estado:** Substituição de dados mockados e estado local frágil pelo **TanStack Query**, que gerencia o cache e mantém o aplicativo sincronizado em tempo real com o banco de dados do servidor.
    
3.  **Tratamento de Edge Cases no Carrinho:** A lógica de negócio foi centralizada no backend. O app apenas orquestra as intenções do usuário (ex: subtrair item). O servidor valida os limites de estoque e executa remoções lógicas ou físicas automáticas caso a quantidade chegue a zero, evitando estados inconsistentes no banco.
    

----------

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
    
-   ✅ **Controle de Quantidade**: Lógica de zeramento inteligente (subtração vira deleção quando a quantidade atinge 0 ou menos).
    
-   ✅ **Feedback Visual**: Alertas de sucesso ao adicionar itens e fallback de imagens (Mascote Pirata).
    

## 🛠️ Tecnologias Utilizadas

-   **React Native / Expo** - Core do desenvolvimento mobile.
    
-   **TanStack Query (React Query)** - Sincronização e cache de dados.
    
-   **Axios** - Cliente HTTP para comunicação com a API.
    
-   **JWT (JSON Web Token)** - Segurança e autenticação.
    
-   **Expo Image** - Carregamento otimizado com suporte a `placeholder`.
    
-   **TypeScript** - Tipagem estática para evitar erros em tempo de execução.
    

## 🏗️ Estrutura do Projeto

Plaintext

```
src/
├── components/         # Componentes visuais (MangaDetail, ShoppingCart, etc)
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
    

## 🛠️ Instruções Básicas para Execução do Projeto

1.  **Instalar dependências:**
    
    Bash
    
    ```
    npm install
    
    ```
    
2.  **Configurar API:** Certifique-se de que o backend Java está rodando. Atualize o `baseURL` no arquivo `src/services/api.ts` para o IP da sua máquina local de desenvolvimento (ex: `http://192.168.1.X:8080`).
    
3.  **Iniciar Projeto:**
    
    Bash
    
    ```
    # Limpando cache para garantir carregamento limpo de assets
    npx expo start -c
    ```


## Vídeo do projeto
https://youtu.be/AJstJzzFkGM
