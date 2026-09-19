# Sprint 2 — Shell Electron (Desktop)

## Processo principal (`electron/` + `out/main`)

Janela principal (tamanho, ícone, menu), ciclo de vida do app (ready/activate/window-all-closed) e políticas de segurança (`contextIsolation`, preload restrito — nunca `nodeIntegration: true` no renderer).

## Preload e IPC (`adapters/`)

Contrato explícito entre main e renderer: canais nomeados, validação de payload e `contextBridge` mínimo. Regra: renderer nunca acessa Node/Electron direto — tudo passa pelos adapters.

## Configuração (`electron-builder.yml`, `resources/`)

`appId`, nome, ícones por plataforma e arquivos incluídos no pacote. Segredos e URLs de ambiente por canal (dev/prod) sem commitar valores reais.
