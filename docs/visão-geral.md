# Hexavante Desktop — visão geral

Documento de referência da arquitetura **implementada** no repositório.

---

## Descrição

Cliente desktop da plataforma Hexavante para Windows e Linux: Electron 33 + React 18 + Vite, mesma conta e mesmos dados do app web.

**Stack atual:** Electron, React 18, TypeScript 5.7, Vite 5 (`electron-vite`), Tailwind 3.4. Ver [stack.md](stack.md) e [instalacao-e-desenvolvimento.md](instalacao-e-desenvolvimento.md).

---

## Papel no ecossistema

| Papel | Detalhe |
|-------|---------|
| Estudo offline-friendly | Cursos, simulados e progresso fora do navegador |
| Paridade | Mesmos endpoints, regras e conta do web |
| Distribuição | Instaladores Windows/Linux via `electron-builder` |

## Princípios

1. Processo `main` enxuto; UI toda no renderer React.
2. Segurança Electron: `contextIsolation` ligado, sem `nodeIntegration` — IPC via adapters.
3. Dados sempre da API; nada de regra duplicada além de cache/UX.
