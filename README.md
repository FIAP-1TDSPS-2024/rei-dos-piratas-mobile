# Rei dos Piratas - Mobile App

Uma versão mobile da loja de mangás "Rei dos Piratas" desenvolvida com React Native e Expo.

## 👥 Integrantes do Grupo – CATECH

- **RM559622**: Daniel Santana Corrêa Batista
- **RM561144**: Jonas de Jesus Campos de Oliveira
- **RM559336**: Wendell Nascimento Dourado

## Protótipo

[Design do Figma](https://www.figma.com/design/pgmGI02zKtZamVgnFrItvq/Ecommerce?node-id=0-1&p=f&t=gk1SJhmGEQxuU8ep-0)

## Repositórios

#### Sprint 1

```
https://github.com/FIAP-MOBILE-2025-Agosto/sc-1-catech
```

#### Sprint 2

```
https://github.com/FIAP-MOBILE-2025-Agosto/2tdsps-challenge-sprint-2-catech-sprint-2
```

## Mocks

- [Catálogo](./src/utils/mockData.ts)
- [Login/Cadastro utilizando Async Storage](./src/context/AuthContext.tsx)
- [Carrinho utilizando Async Storage](./src/context/CartContext.tsx)

## 🚀 Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento e build
- **TypeScript** - Para tipagem estática
- **Expo Image** - Para carregamento otimizado de imagens
- **Expo Vector Icons** - Para ícones
- **React Navigation** - Para navegação (preparado para futuras implementações)

## 📱 Funcionalidades

- ✅ Listagem de mangás com imagens
- ✅ Filtros por categoria
- ✅ Detalhes do produto
- ✅ Carrinho de compras
- ✅ Adicionar/remover itens do carrinho
- ✅ Controle de quantidade
- ✅ Cálculo de total
- ✅ Interface responsiva
- ✅ Design moderno e intuitivo

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── CategoryFilter.tsx
│   ├── Header.tsx
│   ├── MangaCard.tsx
│   ├── MangaDetail.tsx
│   ├── MangaGrid.tsx
│   └── ShoppingCart.tsx
├── styles/             # Estilos globais
│   └── globalStyles.ts
├── types/              # Definições de tipos
│   └── index.ts
└── utils/              # Utilitários e dados mock
    └── mockData.ts
```

## 🛠️ Como Executar

1. **Instalar as dependências:**

   ```bash
   npm install
   ```

2. **Executar o projeto:**

   ```bash
   # Para iOS
   npm run ios

   # Para Android
   npm run android

   # Para Web
   npm run web

   # Para todos (abre o Expo DevTools)
   npm start
   ```

3. **Para testar em dispositivo físico:**
   - Instale o app Expo Go no seu celular
   - Escaneie o QR Code que aparece no terminal/browser

## 📦 Scripts Disponíveis

- `npm start` - Inicia o servidor Expo
- `npm run android` - Executa no emulador Android
- `npm run ios` - Executa no simulador iOS
- `npm run web` - Executa no navegador web

## 🎨 Design

O app segue um design moderno com:

- Paleta de cores consistente
- Interface intuitiva e responsiva
- Animações suaves
- Componentes reutilizáveis
- Suporte a diferentes tamanhos de tela

## 🔄 Conversão do Projeto Web

Este projeto foi convertido de uma versão web React/Vite para React Native + Expo, mantendo:

- ✅ Toda a funcionalidade original
- ✅ Layout adaptado para mobile
- ✅ Componentes otimizados para performance
- ✅ Estrutura de dados consistente
- ✅ Experiência de usuário fluida

## 📱 Compatibilidade

- **iOS**: 13.0+
- **Android**: API 21+ (Android 5.0)
- **Web**: Todos os navegadores modernos

## 🚀 Próximos Passos

- [ ] Integração com API real
- [ ] Sistema de autenticação
- [ ] Sistema de Pagamento
