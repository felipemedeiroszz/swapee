# Swepee - Monorepo

Swepee é uma plataforma de troca de produtos baseada em localização, similar ao Tinder mas para itens. O projeto está estruturado como um monorepo com três aplicações principais.

## 📁 Estrutura do Projeto

```
swepee/
├── web/                    # Frontend Web (React + Vite + TypeScript)
├── backend/                # API Backend (NestJS + TypeScript)
├── app/                    # Mobile App (React Native + Expo)
├── package.json           # Configuração do workspace
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js >= 18.0.0
- npm ou yarn
- Expo CLI (para o app mobile)

### Instalação
```bash
# Instalar dependências de todos os projetos
npm run install:all

# Ou instalar individualmente
npm install                    # Workspace raiz
cd web && npm install          # Frontend web
cd backend && npm install      # Backend API
cd app && npm install          # Mobile app
```

### Desenvolvimento
```bash
# Executar todos os serviços simultaneamente
npm run dev

# Ou executar individualmente
npm run web:dev              # Frontend web (http://localhost:5173)
npm run backend:dev          # Backend API (http://localhost:3000)
npm run app:start            # Mobile app (Expo DevTools)
```

## 📱 Aplicações

### Web (`/web`)
- **Framework**: React 18 + Vite + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Features**: Interface web responsiva para desktop/tablet

### Backend (`/backend`)
- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL com Prisma ORM
- **Auth**: JWT + Passport
- **Features**: API RESTful, WebSockets, Upload de arquivos

### App (`/app`)
- **Framework**: React Native + Expo
- **Navigation**: React Navigation
- **State**: Zustand / Context API
- **Features**: Swipe cards, Chat real-time, Geolocalização

## 🛠 Scripts Disponíveis

### Web
- `npm run web:dev` - Servidor de desenvolvimento
- `npm run web:build` - Build para produção
- `npm run web:preview` - Preview do build

### Backend
- `npm run backend:dev` - Servidor de desenvolvimento
- `npm run backend:build` - Build para produção
- `npm run backend:start` - Iniciar servidor
- `npm run backend:test` - Executar testes

### App
- `npm run app:start` - Iniciar Expo DevTools
- `npm run app:android` - Executar no Android
- `npm run app:ios` - Executar no iOS
- `npm run app:web` - Executar na web

### Utilitários
- `npm run clean` - Limpar node_modules de todos os projetos
- `npm run lint:all` - Executar linting em todos os projetos
- `npm run test:all` - Executar todos os testes

## 📋 Roadmap de Desenvolvimento

### Backend (NestJS)
- [ ] Setup core (Database, Auth, Validation, Swagger)
- [ ] Módulos base (Users, Auth, Products, Categories, Trades, Chat, Notifications)
- [ ] Features core (Autenticação, CRUD usuários, upload imagens, sistema de troca)
- [ ] Database layer (Prisma, migrations, seeds, relacionamentos)
- [ ] Real-time features (WebSockets para chat e notificações)

### Mobile App (React Native)
- [ ] Setup base (Navegação, state management, theming)
- [ ] Telas principais (Login, Registro, Home swipe, Perfil, Chat, Configurações)
- [ ] Features nativas (Câmera, galeria, geolocalização, push notifications)
- [ ] Core features (Sistema de swipe, match system, chat tempo real)
- [ ] API integration (Client HTTP, interceptors, error handling, cache)

## 🔧 Tecnologias

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: NestJS, TypeScript, Prisma, PostgreSQL
- **Mobile**: React Native, Expo, TypeScript
- **DevOps**: Concurrently, ESLint, Prettier

## 📝 Próximos Passos

1. Configurar database e autenticação no backend
2. Criar módulos base da API
3. Implementar telas principais do app mobile
4. Integrar backend com frontend
5. Implementar features de tempo real
6. Testes e deploy

---

**Equipe Swepee** 🚀
