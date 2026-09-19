<p align="center">
  <img src="https://img.shields.io/badge/HEXAVANTE-Desktop-0ea5e9?style=for-the-badge&labelColor=0f172a" alt="Hexavante Desktop" />
</p>

<p align="center">
  <strong>Aplicação desktop da plataforma Hexavante (Windows/Linux).</strong><br/>
  <em>Native desktop client: Electron + React + Vite.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-33-47848F?logo=electron&logoColor=white" alt="Electron" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-blueviolet" alt="Platform" />
</p>

---

## Português

Cliente desktop em Electron (processo `main` + renderer React via `electron-vite`), consumindo a mesma API (`https://api.hexavante.com.br`) e as mesmas regras do app web.

### Estrutura

```
src/            # main (Electron), renderer (React: app, features, components, hooks...)
electron/       # Preloads e configuração do processo principal
resources/      # Ícones e assets do instalador
electron-builder.yml   # Alvos Windows/Linux
```

### Setup

```bash
npm install
npm run dev      # electron-vite dev (app + renderer com reload)
```

### Scripts

| Comando | Para que |
|---|---|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build (main + renderer) |
| `npm start` | Roda o build local (`electron .`) |
| `npm run typecheck` | Tipos do main e do web (`tsconfig.node.json` + `tsconfig.web.json`) |
| `npm run lint` | ESLint |

### Empacotamento

`electron-builder` gera os instaladores Windows/Linux a partir de `electron-builder.yml`. Sessão e API iguais às do web: o usuário loga com a mesma conta.

### Documentação técnica

Guias por sprint em [`docs/sprints/`](docs/sprints/) (fundação → shell → features → build/distribuição).

---

## English (summary)

Hexavante desktop client (Electron 33, React 18, Vite, Tailwind). Same API and account as the web app; builds Windows/Linux installers via electron-builder. Dev with `npm run dev`, typecheck both processes, see `docs/sprints/` for technical guides (in Portuguese).
