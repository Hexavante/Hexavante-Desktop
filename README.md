<p align="center">
  <img src="https://img.shields.io/badge/HEXAVANTE-Desktop-0ea5e9?style=for-the-badge&labelColor=0f172a" alt="Hexavante Desktop" />
</p>

<p align="center">
  <strong>Aplicação desktop da plataforma educacional Hexavante.</strong><br/>
  <em>Native desktop client for the Hexavante educational platform.</em>
</p>

<p align="center">
  <a href="#português">🇧🇷 Português</a> · <a href="#english">🇺🇸 English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-33-47848F?logo=electron&logoColor=white" alt="Electron" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-blueviolet" alt="Platform" />
</p>

---

<a id="português"></a>

## Português

### Sobre

O **Hexavante Desktop** é um cliente nativo multiplataforma construído com Electron para a plataforma educacional Hexavante. Ele oferece a experiência completa da plataforma — cursos, simulados gamificados, comunidade, loja virtual e mais — em uma aplicação desktop performática com auto-update, notificações nativas e armazenamento seguro de tokens.

---

### Stack

| Categoria | Tecnologia |
|---|---|
| Shell Desktop | [Electron](https://www.electronjs.org) 33 |
| UI | [React](https://react.dev) 18 + [TypeScript](https://www.typescriptlang.org) 5.7 |
| Build | [electron-vite](https://electron-vite.org) + [Vite](https://vitejs.dev) 5 |
| Estilo | [Tailwind CSS](https://tailwindcss.com) 3.4 + [Radix UI](https://www.radix-ui.com) |
| Estado | [Zustand](https://zustand-demo.pmnd.rs) + [TanStack React Query](https://tanstack.com/query) |
| Formulários | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| HTTP | [Axios](https://axios-http.com) via IPC (main process) |
| Auto-Update | [electron-updater](https://www.electron.build) via GitHub Releases |
| Ícones | [Lucide React](https://lucide.dev) |
| Embalagem | [electron-builder](https://www.electron.build) (NSIS / AppImage) |

---

### Funcionalidades

- **Autenticação** — Login/cadastro com email + senha, OAuth (Google, GitHub), sessão persistente
- **Cursos** — Catálogo, detalhes, módulos, aulas, progresso, favoritos e anotações
- **Simulados** — Listagem, detalhes, tentativas com timer, resultado e histórico
- **Gamificação** — XP, níveis, ligas (Bronze/Prata/Ouro), ranking, conquistas, boosters
- **Loja Virtual** — Itens cosméticos, economia de moedas, inventário, equipar itens
- **Comunidade** — Feed de atividades, discussões, curtidas, reações, comentários
- **Salas ao Vivo** — Salas de aula ao vivo com chat e participação
- **Mensagens** — Direct messages entre usuários
- **Certificados** — Emissão e verificação de certificados de conclusão
- **Notificações** — Centro de notificações com marcar como lido
- **Moderação** — Painel de moderação (ban, mute, advertências)
- **12 Temas Visuais** — Default, Cyberpunk, Hacker, Obsidian, Sunset, Ocean, Sakura, Midnight, Amber, Snow, Daylight, Cream, Pearl
- **Auto-Update** — Verificação e instalação de atualizações via GitHub Releases
- **Notificações Nativas** — Notificações do sistema operacional
- **Segurança** — CSP headers, context isolation, armazenamento seguro de tokens

---

### Pré-requisitos

- **Node.js** 20+ (LTS)
- **npm** 10+

---

### Instalação e Desenvolvimento

```bash
# 1. Clonar o repositório
git clone https://github.com/Hexavante/Hexavante-Desktop.git
cd Hexavante-Desktop

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com a URL da API

# 4. Iniciar em modo desenvolvimento
npm run dev
```

### Scripts Disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build de produção |
| `npm start` | Iniciar app empacotada |
| `npm run lint` | Verificar código com ESLint |
| `npm run typecheck` | Verificar tipos TypeScript |

### Build para Distribuição

```bash
# Build de produção
npm run build

# Empacotar (gera instalador)
npx electron-builder
```

| Plataforma | Formato | Artefato |
|---|---|---|
| Windows | Instalador NSIS (x64) | `Hexavante-Setup-1.0.0-x64.exe` |
| Linux | AppImage (x64) | `Hexavante-1.0.0-x64.AppImage` |

---

### Variáveis de Ambiente

| Variável | Obrigatória | Descrição | Padrão |
|---|---|---|---|
| `VITE_API_URL` | Sim | URL base da API backend | `http://localhost:3045` (dev) / `https://api.hexavante.com.br` (prod) |

---

### Estrutura do Projeto

```
Hexavante-Desktop/
├── electron/                    # Main process (Electron)
│   ├── main/
│   │   ├── index.ts             # Entry point, janela, IPC, updater
│   │   ├── window.ts            # Criação e gerenciamento da janela
│   │   ├── security.ts          # CSP, permissões
│   │   ├── ipc/                 # Handlers IPC (auth, http, updater, storage, etc)
│   │   ├── menus/               # Menu da aplicação
│   │   └── services/            # Logger, secure store, updater, window state
│   └── preload/
│       └── index.ts             # contextBridge (electronAPI)
│
├── src/                         # Renderer process (React)
│   ├── features/                # Módulos de funcionalidades (21 módulos)
│   │   ├── auth/                # Autenticação
│   │   ├── dashboard/           # Painel principal
│   │   ├── cursos/              # Cursos
│   │   ├── simulados/           # Simulados
│   │   ├── comunidade/          # Comunidade
│   │   ├── loja/                # Loja virtual
│   │   ├── inventario/          # Inventário
│   │   ├── live-rooms/          # Salas ao vivo
│   │   ├── ranking/             # Ranking
│   │   ├── certificados/        # Certificados
│   │   ├── perfil/              # Perfil
│   │   ├── configuracoes/       # Configurações
│   │   ├── moderation/          # Moderação
│   │   ├── admin/               # Administração
│   │   └── ...                  # +6 módulos
│   ├── components/              # Componentes compartilhados
│   ├── providers/               # Context providers (Auth, Query, Theme, Toast)
│   ├── routes/                  # Definição de rotas (HashRouter)
│   ├── api/                     # Módulos de API (16 domínios)
│   ├── services/                # Serviços de negócio (14 serviços)
│   ├── http/                    # Camada HTTP (Axios + adapter IPC)
│   ├── adapters/                # Adaptadores (IPC, erro, storage)
│   ├── app/                     # Infraestrutura (stores, hooks, config)
│   ├── domain/                  # Camada de domínio (tipos, schemas, enums)
│   └── styles/                  # CSS global (12 temas)
│
├── public/                      # Assets estáticos (logo)
├── resources/                   # Recursos de build (ícones)
└── out/                         # Build output
```

---

### Arquitetura

```
┌─────────────────────────────┐      ┌──────────────────────────────┐
│   Renderer Process (React)  │      │    Main Process (Electron)   │
│                             │      │                              │
│  Pages → Services → API     │─IPC─→│  HTTP Proxy (fetch Node)     │
│                             │      │  Secure Store (tokens)       │
│  Zustand + React Query      │      │  Auto-Updater                │
│  Tailwind + Radix UI        │      │  Native Dialogs/Shell        │
│  Hash Router (37 rotas)     │      │  Logger                      │
└─────────────────────────────┘      └──────────────────────────────┘
```

---

### Conta de Demonstração

| Perfil | Email | Senha |
|---|---|---|
| Estudante | `aluno@hexavante.com` | `Aluno123!` |
| Instrutor | `instrutor@hexavante.com` | `Instrutor123!` |
| Moderador | `moderador@hexavante.com` | `Moderador123!` |
| Admin | `admin@hexavante.com` | `Admin123!` |

---

### Licença

MIT License · Copyright 2024 Hexavante

---

<a id="english"></a>

## English

### About

**Hexavante Desktop** is a cross-platform native client built with Electron for the Hexavante educational platform. It delivers the full platform experience — courses, gamified practice exams, community, virtual shop, and more — in a performant desktop application with auto-updates, native notifications, and secure token storage.

---

### Stack

| Category | Technology |
|---|---|
| Desktop Shell | [Electron](https://www.electronjs.org) 33 |
| UI | [React](https://react.dev) 18 + [TypeScript](https://www.typescriptlang.org) 5.7 |
| Build | [electron-vite](https://electron-vite.org) + [Vite](https://vitejs.dev) 5 |
| Styling | [Tailwind CSS](https://tailwindcss.com) 3.4 + [Radix UI](https://www.radix-ui.com) |
| State | [Zustand](https://zustand-demo.pmnd.rs) + [TanStack React Query](https://tanstack.com/query) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| HTTP | [Axios](https://axios-http.com) via IPC (main process) |
| Auto-Update | [electron-updater](https://www.electron.build) via GitHub Releases |
| Icons | [Lucide React](https://lucide.dev) |
| Packaging | [electron-builder](https://www.electron.build) (NSIS / AppImage) |

---

### Features

- **Authentication** — Email/password login, OAuth (Google, GitHub), persistent sessions
- **Courses** — Catalog, details, modules, lessons, progress, favorites, and notes
- **Practice Exams** — Listing, details, timed attempts, results, and history
- **Gamification** — XP, levels, leagues (Bronze/Silver/Gold), rankings, achievements, boosters
- **Virtual Shop** — Cosmetic items, coin economy, inventory, equip items
- **Community** — Activity feed, discussions, likes, reactions, comments
- **Live Rooms** — Live classrooms with chat and participation
- **Messaging** — Direct messages between users
- **Certificates** — Issuance and verification of completion certificates
- **Notifications** — Notification center with mark-as-read
- **Moderation** — Moderation panel (ban, mute, warnings)
- **12 Visual Themes** — Default, Cyberpunk, Hacker, Obsidian, Sunset, Ocean, Sakura, Midnight, Amber, Snow, Daylight, Cream, Pearl
- **Auto-Update** — Check and install updates via GitHub Releases
- **Native Notifications** — OS-level notifications
- **Security** — CSP headers, context isolation, secure token storage

---

### Prerequisites

- **Node.js** 20+ (LTS)
- **npm** 10+

---

### Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/Hexavante/Hexavante-Desktop.git
cd Hexavante-Desktop

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your API URL

# 4. Start in development mode
npm run dev
```

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm start` | Start packaged app |
| `npm run lint` | Lint code with ESLint |
| `npm run typecheck` | Type check TypeScript |

### Build for Distribution

```bash
# Production build
npm run build

# Package (generates installer)
npx electron-builder
```

| Platform | Format | Artifact |
|---|---|---|
| Windows | NSIS installer (x64) | `Hexavante-Setup-1.0.0-x64.exe` |
| Linux | AppImage (x64) | `Hexavante-1.0.0-x64.AppImage` |

---

### Environment Variables

| Variable | Required | Description | Default |
|---|---|---|---|
| `VITE_API_URL` | Yes | Backend API base URL | `http://localhost:3045` (dev) / `https://api.hexavante.com.br` (prod) |

---

### License

MIT License · Copyright 2024 Hexavante
