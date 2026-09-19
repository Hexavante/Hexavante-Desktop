# Instalação e desenvolvimento — Hexavante Desktop

Documento de referência do setup **implementado** neste repositório.

---

## Pré-requisitos

Node.js 22+. Para empacotar Linux/Windows, dependências de SO do `electron-builder`.

## Passo a passo

```bash
git clone https://github.com/Hexavante/Hexavante-Desktop.git
cd Hexavante-Desktop
npm install   # postinstall: electron-builder install-app-deps
npm run dev
```

## Nova feature (checklist)

1. Domínio em `src/features/` (componentes + hooks + tipos).
2. Dados só via `src/api/` (mesmos contratos da API).
3. IPC novo só via `adapters/` com canal nomeado.
4. `npm run typecheck` (node + web) e `lint` verdes.

## Comandos úteis

`npm run dev` · `npm run build` · `npm start` · `npm run preview` · `npm run typecheck` · `npm run lint`.
