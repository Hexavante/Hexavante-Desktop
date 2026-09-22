<p align="center">
  <img src="public/brand/hexavante-logo.png" width="120" alt="Hexavante" />
</p>

<h1 align="center">Hexavante Desktop</h1>

<p align="center">
  <strong>Aplicação desktop da plataforma Hexavante (Windows/Linux).</strong><br/>
  <em>Native desktop client: Electron + React + Vite.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HEXAVANTE-Desktop-0ea5e9?style=for-the-badge&labelColor=0f172a" alt="Hexavante Desktop" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-33-47848F?logo=electron&logoColor=white" alt="Electron" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-blueviolet" alt="Platform" />
</p>

<p align="center">
  <a href="#português">🇧🇷 Português</a> · <a href="#english">🇺🇸 English</a> · <a href="docs/visão-geral.md">📚 Docs</a>
</p>

<p align="center">
  <a href="#download">⬇️ Download</a> ·
  <a href="#funcionalidades">✨ Funcionalidades</a> ·
  <a href="#setup">🚀 Setup</a> ·
  <a href="#empacotamento">📦 Empacotamento</a>
</p>

---

<a id="português"></a>

## Português

> Cliente desktop em Electron para estudar com a mesma conta do app web — Windows e Linux, instaladores próprios, sessão compartilhada com a plataforma.

### Índice

- [Download](#download)
- [Funcionalidades](#funcionalidades)
- [Sobre](#sobre)
- [Arquitetura](#arquitetura)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Setup](#setup)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Sessão e API](#sessão-e-api)
- [Empacotamento](#empacotamento)
- [Solução de problemas](#solução-de-problemas)
- [Como contribuir](#como-contribuir)
- [Ecossistema Hexavante](#ecossistema-hexavante)
- [Documentação técnica (`docs/`)](#documentação-técnica-docs)

### Download

> [!NOTE]
> Ainda não há releases publicadas neste repo. Quando disponíveis, os instaladores estarão em [Releases](../../releases).

| Sistema | Formato | Status |
|---|---|---|
| Windows | NSIS (instalador) | em breve |
| Windows | Portable | em breve |
| Linux | AppImage | em breve |
| Linux | deb | em breve |

Versionar `package.json` + tag git por release (ver [Empacotamento](#empacotamento)).

### Funcionalidades

| Recurso | O que é |
|---|---|
| 📚 Estudo offline-friendly | Janela Electron dedicada (processo `main` + renderer React via `electron-vite`) para estudar fora do navegador |
| 👤 Mesma conta | Mesma conta e mesmos dados do app web, mesma sessão da plataforma (`/api/v1/*`) |
| 💻 Instaladores | Windows (NSIS/portable) e Linux (AppImage/deb) gerados com `electron-builder` |
| 🔒 Segurança `contextIsolation` | `contextIsolation` ligado, `nodeIntegration` desligado no renderer — tudo passa pelos adapters/preload |

### Sobre

Cliente desktop em Electron (processo `main` + renderer React via `electron-vite`), com a mesma conta e os mesmos dados do app web.

### Arquitetura

```
Usuário ──▶ Janela Electron ──▶ Renderer React ──IPC──▶ Main ──HTTPS──▶ api.hexavante.com.br
                                   │                                ▲
                                   └──────── fetch direto ──────────┘
```

Segurança: `contextIsolation` ligado, `nodeIntegration` desligado no renderer — tudo passa pelos adapters/preload.

### Estrutura de pastas

```
src/
├── app/           # Composição (rotas/telas)
├── features/      # Funcionalidades por domínio
├── domain/        # Tipos e regras
├── components/    # UI reutilizável
├── hooks/         # Hooks React
├── adapters/      # Pontes renderer↔main (IPC)
├── api/ + http/   # Cliente da API Hexavante
electron/          # Preloads e processo principal
resources/         # Ícones e assets do instalador
electron-builder.yml  # Alvos Windows/Linux
```

### Setup

```bash
npm install   # postinstall: electron-builder install-app-deps
npm run dev   # electron-vite dev (app + renderer com reload)
```

### Variáveis de ambiente

| Variável | Para que |
|---|---|
| `API_URL` | Base da API (`https://api.hexavante.com.br`) |
| `APP_ENV` | `development` / `production` (canal de update e logs) |

Sem segredos commitados; tokens ficam no armazenamento do SO.

### Scripts

| Comando | Para que |
|---|---|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build (main + renderer) |
| `npm start` | Roda o build local (`electron .`) |
| `npm run preview` | Preview do build |
| `npm run typecheck` | Tipos do main e do web (obrigatório) |
| `npm run lint` | ESLint |

### Sessão e API

Mesma sessão da plataforma: login e-mail/senha e OAuth (navegador do sistema + retorno ao app). Mesmos contratos (`/api/v1/*`, `{ data, pagination }`); 401 leva ao login; erros exibidos em pt-BR amigável.

### Empacotamento

`electron-builder` gera instaladores Windows (NSIS/portable) e Linux (AppImage/deb). Versionar `package.json` + tag git por release.

### Solução de problemas

| Sintoma | Causa provável | Ação |
|---|---|---|
| Tela branca | Erro no renderer | DevTools do Electron (`Ctrl+Shift+I`) + console |
| IPC sem resposta | Canal não registrado no preload | Conferir `adapters/` e nomes dos canais |
| Falha no build nativo | Deps de SO faltando | Rodar `postinstall` / `install-app-deps` de novo |
| 401 em tudo | Sessão expirada | Logout + login (limpa secure store) |

### Como contribuir

1. Branch de `main`, commits curtos em português.
2. `typecheck` (node + web) e `lint` verdes.
3. Nunca commitar segredos, binários ou `out/`, `dist/`.

### Ecossistema Hexavante

| Projeto | Repo |
|---|---|
| 🌐 Web | [Hexavante/Hexavante-web](https://github.com/Hexavante/Hexavante-web) |
| 🔌 API | [Hexavante/Hexavante-Api](https://github.com/Hexavante/Hexavante-Api) |
| 📱 Mobile | [Hexavante/Hexavante-Mobile](https://github.com/Hexavante/Hexavante-Mobile) |
| 🏠 Landing | [Hexavante/Hexavante-landing](https://github.com/Hexavante/Hexavante-landing) |

### Documentação técnica (`docs/`)

`visão-geral`, `requisitos-funcionais`, `regras-de-negocio`, `casos-de-uso`, `der-conceitual`, `der-logico`, `glossario`, `stack`, `permissoes`, `instalacao-e-desenvolvimento`, `deploy-producao`, `escopo-mvp`.

---

<a id="english"></a>

## English (summary)

Hexavante desktop client (Electron 33, React 18, Vite, Tailwind). Same API and account as the web app; builds Windows/Linux installers via electron-builder. Dev with `npm run dev`, typecheck both processes, see `docs/` (in Portuguese) for full technical documentation.
