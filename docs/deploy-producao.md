# Deploy em produção — Hexavante Desktop

Documento de referência da distribuição **implementada**.

---

## Alvos (`electron-builder.yml`)

Windows (NSIS/portable) e Linux (AppImage/deb), com ícone, nome e versão do `package.json`.

## Passo a passo

```bash
npm run typecheck && npm run lint
npm run build
npm start   # testa o build local com electron .
```

1. Versionar (`package.json` + tag git).
2. Gerar instaladores e testar instalação limpa nos dois SOs.
3. Smoke test: login, catálogo, aula/simulado, logout.
4. Publicar artefatos + notas de versão curtas em português.

## Verificação

Instalação limpa abre, loga, estuda e desloga sem erro no console (`Ctrl+Shift+I`).
