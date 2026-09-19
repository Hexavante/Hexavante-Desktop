# Sprint 1 — Fundação (Desktop)

## Stack

Electron 33 + React 18 + TypeScript 5.7 + Vite 5 (`electron-vite`) + Tailwind 3.4. Empacotamento com `electron-builder` (Windows/Linux). Processo `main` (`out/main`) + renderer React.

## Estrutura (`src/`)

```
adapters/     # Pontes entre renderer e main (IPC)
api/          # Cliente HTTP da API Hexavante
app/          # Composição da aplicação (rotas/telas)
features/     # Funcionalidades por domínio
domain/       # Tipos e regras de domínio
components/   # UI reutilizável
hooks/        # Hooks React
http/         # Camada de transporte
```

`electron/` (preload/main), `resources/` (ícones/assets), `electron-builder.yml` (alvos).

## Setup

```bash
npm install   # postinstall: electron-builder install-app-deps
npm run dev   # electron-vite dev
```

## Scripts

`dev`, `build` (main+renderer), `start` (`electron .`), `preview`, `typecheck` (node + web separados), `lint`.
