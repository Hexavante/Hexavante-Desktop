# Glossário — Hexavante Desktop

Documento de referência dos termos usados no código.

---

| Termo | Significado |
|-------|-------------|
| Main | Processo Electron (janela, ciclo de vida, nativo) |
| Renderer | React que roda a UI (sem acesso direto ao Node) |
| Preload/adapters | Ponte IPC segura (`contextBridge`) entre main e renderer |
| `out/` | Saída do build (`electron-vite build`), não commitar |
| Secure store | Cofre do SO para o token de sessão |
