# Sprint 5 — Build e Distribuição (Desktop)

## Build

```bash
npm run typecheck   # node + web (obrigatório)
npm run build       # electron-vite build (main + renderer)
npm start           # testa o build local com electron .
```

## Empacotamento (`electron-builder.yml`)

Alvos Windows (NSIS/portable) e Linux (AppImage/deb). Conferir: ícone, nome, versão (`package.json`), arquivos incluídos e URL da API de produção no build.

## Distribuição e verificação

1. Versionar (`package.json` + tag git).
2. Gerar instaladores e testar instalação limpa nos dois SOs.
3. Smoke test: login, catálogo, aula/simulado, logout.
4. Publicar artefatos + notas de versão curtas em português.
