# Stack técnica — Hexavante Desktop

Documento de referência da arquitetura **implementada** no repositório.

---

## Visão geral

| Camada | Tecnologia | Versão (referência) |
|--------|------------|---------------------|
| Shell | Electron | 33.x |
| UI | React | 18.x |
| Linguagem | TypeScript | 5.7 |
| Build | Vite (`electron-vite`) | 5.x |
| Estilo | Tailwind CSS | 3.4 |
| Empacotamento | electron-builder | Windows/Linux |
| Dados | API Hexavante (`/api/v1/*`) | Mesmos contratos do web |

---

## Arquitetura em camadas

```
┌─────────────────────────────────────────┐
│  Renderer (React + hooks + features)    │
└──────────────────┬──────────────────────┘
                   │ IPC (adapters/preload)
┌──────────────────▼──────────────────────┐
│  Main (janela, ciclo de vida, nativo)   │
└──────────────────┬──────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────┐
│        api.hexavante.com.br             │
└─────────────────────────────────────────┘
```

### Responsabilidades por pasta

| Pasta | Responsabilidade |
|-------|------------------|
| `src/app/` | Composição (rotas/telas) |
| `src/features/` | Funcionalidades por domínio |
| `src/domain/` | Tipos e regras |
| `src/api/` + `src/http/` | Cliente da API |
| `src/adapters/` | Pontes renderer↔main |
| `electron/` | Preloads e processo principal |
